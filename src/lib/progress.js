/**
 * Selectores y cálculos derivados del estado (progreso, dominio, logros).
 * Todas las funciones son puras: reciben el estado y devuelven datos.
 */
import { SUBJECTS, SUBJECT_MAP, TOPIC_MAP, TOPIC_STATUS, ALL_TOPICS } from '../data/subjects'

/* ───────────────────────────── Temas ───────────────────────────── */

/** Combina el tema base (mock) con las modificaciones guardadas por el usuario. */
export function getTopic(state, topicId) {
  const base = TOPIC_MAP[topicId]
  if (!base) return null
  const o = state.topics[topicId] ?? {}
  return {
    ...base,
    status: o.status ?? base.status,
    tip: o.tip ?? base.tip,
    summary: o.summary ?? base.summary,
    notes: o.notes ?? '',
    subtopics: base.subtopics.map((s) => ({ ...s, done: o.subDone?.[s.id] ?? s.done })),
  }
}

export function getSubjectTopics(state, subjectId) {
  return SUBJECT_MAP[subjectId].topics.map((t) => getTopic(state, t.id))
}

/* ─────────────────────────── Progreso ──────────────────────────── */

/** Progreso de una materia según el estado de sus temas (Dominado=1, Repaso=0.5). */
export function subjectProgress(state, subjectId) {
  const topics = getSubjectTopics(state, subjectId)
  const counts = { pendiente: 0, repaso: 0, dominado: 0 }
  let score = 0
  let subDone = 0
  let subTotal = 0
  topics.forEach((t) => {
    counts[t.status] += 1
    score += TOPIC_STATUS[t.status].weight
    subTotal += t.subtopics.length
    subDone += t.subtopics.filter((s) => s.done).length
  })
  return {
    pct: Math.round((score / topics.length) * 100),
    total: topics.length,
    subDone,
    subTotal,
    ...counts,
  }
}

/** Progreso global de la ruta de aprendizaje. */
export function globalProgress(state) {
  const all = ALL_TOPICS.map((t) => getTopic(state, t.id))
  const counts = { pendiente: 0, repaso: 0, dominado: 0 }
  let score = 0
  all.forEach((t) => {
    counts[t.status] += 1
    score += TOPIC_STATUS[t.status].weight
  })
  return { pct: Math.round((score / all.length) * 100), total: all.length, ...counts }
}

/* ──────────────────────── Simulacros / Quizzes ─────────────────── */

/** Porcentaje de aciertos por materia acumulado de todo el historial. */
export function accuracyBySubject(history) {
  const acc = Object.fromEntries(SUBJECTS.map((s) => [s.id, { correct: 0, total: 0 }]))
  history.forEach((h) => {
    Object.entries(h.bySubject ?? {}).forEach(([id, v]) => {
      if (!acc[id]) return
      acc[id].correct += v.correct
      acc[id].total += v.total
    })
  })
  return Object.fromEntries(
    Object.entries(acc).map(([id, v]) => [id, v.total ? Math.round((v.correct / v.total) * 100) : null]),
  )
}

/**
 * Dominio por materia = promedio entre avance de temas y aciertos en simulacros.
 * Devuelve la lista ordenada de menor a mayor dominio (puntos débiles primero).
 */
export function masteryBySubject(state) {
  const acc = accuracyBySubject(state.history)
  return SUBJECTS.map((s) => {
    const topics = subjectProgress(state, s.id).pct
    const accuracy = acc[s.id]
    const mastery = accuracy == null ? topics : Math.round(topics * 0.5 + accuracy * 0.5)
    return { id: s.id, name: s.name, short: s.short, color: s.color, topics, accuracy: accuracy ?? 0, mastery }
  }).sort((a, b) => a.mastery - b.mastery)
}

export function simulacros(history) {
  return history.filter((h) => h.type === 'simulacro')
}

export function pct(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0
}

/* ─────────────────────────── Tema de hoy ───────────────────────── */

/**
 * Elige el "Tema de hoy": el fijado por el tutor o, si no hay,
 * el primer tema "En repaso" / "Pendiente" de la materia más débil.
 */
export function suggestedTopic(state) {
  if (state.todayTopicId && TOPIC_MAP[state.todayTopicId]) return getTopic(state, state.todayTopicId)
  const weak = masteryBySubject(state)
  for (const status of ['repaso', 'pendiente']) {
    for (const s of weak) {
      const t = getSubjectTopics(state, s.id).find((x) => x.status === status)
      if (t) return t
    }
  }
  return getTopic(state, ALL_TOPICS[0].id)
}

/* ─────────────────────────── Logros (badges) ───────────────────── */

export const BADGES = [
  {
    id: 'first-step',
    title: 'Primer paso',
    description: 'Domina tu primer tema.',
    icon: 'Footprints',
    color: '#6ef0c3',
    progress: (s, d) => [d.global.dominado, 1],
  },
  {
    id: 'explorer',
    title: 'Exploradora',
    description: 'Avanza al menos un tema en cada materia.',
    icon: 'Compass',
    color: '#22d3ee',
    progress: (s) => [
      SUBJECTS.filter((sub) => getSubjectTopics(s, sub.id).some((t) => t.status !== 'pendiente')).length,
      SUBJECTS.length,
    ],
  },
  {
    id: 'first-sim',
    title: 'A prueba',
    description: 'Completa tu primer quiz o simulacro.',
    icon: 'ClipboardCheck',
    color: '#5ab4ff',
    progress: (s) => [s.history.length, 1],
  },
  {
    id: 'rising',
    title: 'En ascenso',
    description: 'Mejora tu puntaje respecto al simulacro anterior.',
    icon: 'TrendingUp',
    color: '#34d9a5',
    progress: (s) => {
      const sims = simulacros(s.history)
      if (sims.length < 2) return [0, 1]
      const [a, b] = sims.slice(-2)
      return [pct(b.correct, b.total) > pct(a.correct, a.total) ? 1 : 0, 1]
    },
  },
  {
    id: 'ten-mastered',
    title: 'Decena dominada',
    description: 'Marca 10 temas como dominados.',
    icon: 'Trophy',
    color: '#fbbf24',
    progress: (s, d) => [d.global.dominado, 10],
  },
  {
    id: 'brilliant',
    title: 'Mente brillante',
    description: 'Obtén 90% o más en un quiz.',
    icon: 'Sparkles',
    color: '#c4b5fd',
    progress: (s) => [Math.max(0, ...s.history.map((h) => pct(h.correct, h.total))), 90],
  },
  {
    id: 'streak-7',
    title: 'Racha de fuego',
    description: 'Estudia 7 días seguidos.',
    icon: 'Flame',
    color: '#fb923c',
    progress: (s) => [s.streak.count, 7],
  },
  {
    id: 'tasks-5',
    title: 'Cumplida',
    description: 'Entrega 5 tareas o retos.',
    icon: 'CheckCheck',
    color: '#f472b6',
    progress: (s) => [s.tasks.filter((t) => t.status !== 'pendiente').length, 5],
  },
  {
    id: 'math-50',
    title: 'Matemática en ascenso',
    description: 'Llega al 50% de avance en Matemáticas.',
    icon: 'Sigma',
    color: '#5ab4ff',
    progress: (s) => [subjectProgress(s, 'matematicas').pct, 50],
  },
  {
    id: 'sim-100',
    title: 'Club de los 100',
    description: 'Logra 100 aciertos o más (78%) en un simulacro completo.',
    icon: 'Crown',
    color: '#e879f9',
    progress: (s) => [Math.max(0, ...simulacros(s.history).map((h) => pct(h.correct, h.total))), 78],
  },
]

/** Calcula el estado de cada logro (desbloqueado + progreso). */
export function computeBadges(state) {
  const derived = { global: globalProgress(state) }
  return BADGES.map((b) => {
    const [current, target] = b.progress(state, derived)
    return { ...b, current: Math.min(current, target), target, unlocked: current >= target }
  })
}
