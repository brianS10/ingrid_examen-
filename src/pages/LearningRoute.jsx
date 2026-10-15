/**
 * Ruta de Aprendizaje y Estudio de Temas:
 * - Flujo pedagógico claro: LEER PRIMERO, LUEGO EVALUAR CON QUIZ.
 * - Modo Lista: Cada tema muestra botón para "📖 Leer explicación" y botón "⚡ Hacer Quiz" si ya lo dominan.
 * - Modo Lectura: Vista completa y cómoda (sin drawers apretados) con fórmulas KaTeX, consejos del tutor,
 *   checklist de subtemas, notas personales y botón final: "⚡ ¡Hacer Quiz de este tema ahora!".
 */
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight,
  Circle, Clock, Edit3, Lightbulb, NotebookPen, Pencil, Play,
  RotateCcw, Sparkles, Trophy, X, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP, TOPIC_STATUS } from '../data/subjects'
import { getSubjectTopics, getTopic, subjectProgress } from '../lib/progress'
import { ProgressBar } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'
import { RichText } from '../components/ui/RichText'

export default function LearningRoute() {
  const { state, actions, route, navigate, isTutor, toast } = useApp()
  const initialSubject = route.params.subject || 'matematicas'
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject)
  const [activeTopicId, setActiveTopicId] = useState(route.params.topic || null)

  // Sincronizar parámetros de ruta
  useEffect(() => {
    if (route.params.subject) setSelectedSubjectId(route.params.subject)
    if (route.params.topic) setActiveTopicId(route.params.topic)
  }, [route.params.subject, route.params.topic])

  const currentSubject = SUBJECT_MAP[selectedSubjectId] || SUBJECTS[0]
  const topics = useMemo(() => {
    return getSubjectTopics(state, currentSubject.id)
  }, [state, currentSubject.id])

  const progress = useMemo(() => {
    return subjectProgress(state, currentSubject.id)
  }, [state, currentSubject.id])

  // Tema activo actualmente abierto para lectura
  const activeTopic = activeTopicId ? getTopic(state, activeTopicId) : null

  // Estado para notas personales y edición de consejos del tutor
  const [personalNotes, setPersonalNotes] = useState(activeTopic?.notes ?? '')
  const [isEditingTip, setIsEditingTip] = useState(false)
  const [tipDraft, setTipDraft] = useState(activeTopic?.tip ?? '')

  useEffect(() => {
    if (activeTopic) {
      setPersonalNotes(activeTopic.notes ?? '')
      setTipDraft(activeTopic.tip ?? '')
      setIsEditingTip(false)
    }
  }, [activeTopicId])

  // Autoguardado de notas personales
  useEffect(() => {
    if (!activeTopic || personalNotes === activeTopic.notes) return
    const timer = setTimeout(() => {
      actions.updateTopic(activeTopic.id, { notes: personalNotes })
    }, 600)
    return () => clearTimeout(timer)
  }, [personalNotes, activeTopic, actions])

  // Calcular tema anterior y siguiente en la materia
  const { prevTopic, nextTopic } = useMemo(() => {
    if (!activeTopic) return { prevTopic: null, nextTopic: null }
    const index = topics.findIndex((t) => t.id === activeTopic.id)
    return {
      prevTopic: index > 0 ? topics[index - 1] : null,
      nextTopic: index >= 0 && index < topics.length - 1 ? topics[index + 1] : null,
    }
  }, [topics, activeTopic])

  /* ─────────────────────────────────────────────────────────────
     VISTA 1: LECTURA Y ESTUDIO COMPLETO DE UN TEMA (LECCIÓN)
  ───────────────────────────────────────────────────────────── */
  if (activeTopic) {
    const isMastered = activeTopic.status === 'dominado'
    const doneSubs = activeTopic.subtopics.filter((s) => s.done).length

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
        {/* Barra de navegación superior de la lección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTopicId(null)
              navigate('ruta', { subject: currentSubject.id })
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver a temas de {currentSubject.name}
          </button>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Toggle de estado rápido */}
            <button
              type="button"
              onClick={() => {
                const next = isMastered ? 'pendiente' : 'dominado'
                actions.setTopicStatus(activeTopic.id, next)
                toast({
                  tone: next === 'dominado' ? 'success' : 'info',
                  title: next === 'dominado' ? '¡Tema dominado! 🌟' : 'Marcado para repasar',
                })
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                isMastered
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isMastered ? '✓ Tema Dominado' : 'Marcar como Dominado'}
            </button>

            {/* Botón directo a Quiz */}
            <button
              type="button"
              onClick={() =>
                navigate('simulador', {
                  topic: activeTopic.id,
                  subject: currentSubject.id,
                  auto: 'true',
                })
              }
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-1.5 text-xs shadow-md shadow-amber-400/20 transition cursor-pointer"
            >
              <Zap size={14} fill="currentColor" /> Hacer Quiz de este tema
            </button>
          </div>
        </div>

        {/* Encabezado del tema */}
        <div
          className="card p-6 sm:p-8 space-y-3 border"
          style={{
            borderColor: `${currentSubject.color}40`,
            backgroundImage: `linear-gradient(135deg, ${currentSubject.color}15, transparent 65%)`,
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="rounded-lg px-2.5 py-0.5 text-xs font-black"
              style={{ background: `${currentSubject.color}25`, color: currentSubject.color }}
            >
              {currentSubject.name}
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Clock size={13} className="text-mint-400" /> ~{activeTopic.minutes} min de lectura y práctica
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              • {doneSubs} de {activeTopic.subtopics.length} partes dominadas
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {activeTopic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Lee con atención la explicación, repasa las fórmulas y conceptos clave, y al terminar pon a prueba tus conocimientos con el quiz.
          </p>
        </div>

        {/* Contenido Explicado del Tema (Texto enriquecido + Fórmulas KaTeX) */}
        <section className="card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-mint-400" /> Explicación Detallada del Tema
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Guía ECOEMS / COMIPEMS</span>
          </div>

          <div className="pt-2 text-slate-200">
            <RichText text={activeTopic.summary} />
          </div>
        </section>

        {/* Consejo del Tutor (Brian) */}
        <section className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 sm:p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Lightbulb size={17} className="text-amber-400" /> Consejo de {state.profile.tutor} para el examen:
            </h3>
            {isTutor && !isEditingTip && (
              <button
                type="button"
                onClick={() => setIsEditingTip(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white"
              >
                <Pencil size={12} /> Editar consejo
              </button>
            )}
          </div>

          {isEditingTip ? (
            <div className="space-y-2">
              <textarea
                rows={3}
                className="w-full rounded-xl border border-indigo-500/40 bg-slate-950 p-3 text-xs text-white focus:outline-none"
                value={tipDraft}
                onChange={(e) => setTipDraft(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTip(false)}
                  className="rounded-lg px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    actions.updateTopic(activeTopic.id, { tip: tipDraft })
                    setIsEditingTip(false)
                    toast({ tone: 'success', title: 'Consejo actualizado para Ingrid' })
                  }}
                  className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              “{activeTopic.tip || 'Repasa con calma los conceptos y haz notas en tu libreta.'}”
            </p>
          )}
        </section>

        {/* Checklist de lo que debes entender (Subtemas) */}
        <section className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={16} className="text-mint-400" /> Puntos clave que debes dominar de este tema:
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Haz clic en cada parte conforme sientas que ya la entendiste para medir tu avance.
              </p>
            </div>
            <span className="text-xs font-black text-emerald-400 shrink-0">
              {doneSubs} de {activeTopic.subtopics.length}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {activeTopic.subtopics.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => actions.toggleSubtopic(activeTopic.id, sub.id, !sub.done)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
                  sub.done
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    sub.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {sub.done ? '✓' : '○'}
                </span>
                <span className={`text-xs sm:text-sm font-medium ${sub.done ? 'line-through text-slate-400' : 'text-white'}`}>
                  {sub.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Mis notas y dudas personales */}
        <section className="card p-5 space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <NotebookPen size={15} className="text-indigo-400" /> Tus apuntes personales de este tema (se guardan solos):
          </label>
          <textarea
            rows={3}
            placeholder="Apunta aquí dudas que tengas para preguntarle a Brian, ejemplos o trucos que te sirvan..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
          />
        </section>

        {/* ───────── BANNER DE EVALUACIÓN FINAL: ¿YA LEÍSTE? HAZ EL QUIZ ───────── */}
        <section className="card p-6 sm:p-8 border-mint-400/40 bg-gradient-to-r from-mint-500/15 via-slate-900 to-indigo-500/15 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-400/20 px-3 py-1 text-xs font-bold text-mint-300">
                <Sparkles size={13} /> Siguiente paso
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                ¿Terminaste de leer y estudiar la explicación?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Es momento de poner a prueba lo que acabas de aprender con un quiz rápido de reactivos tipo examen sobre este tema.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  navigate('simulador', {
                    topic: activeTopic.id,
                    subject: currentSubject.id,
                    auto: 'true',
                  })
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/20 transition cursor-pointer"
              >
                <Zap size={16} fill="currentColor" /> ¡Hacer Quiz de este tema ahora!
              </button>

              <button
                type="button"
                onClick={() => {
                  actions.setTopicStatus(activeTopic.id, isMastered ? 'pendiente' : 'dominado')
                  toast({
                    tone: !isMastered ? 'success' : 'info',
                    title: !isMastered ? '¡Tema marcado como Dominado! 🌟' : 'Tema marcado para repasar',
                  })
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer text-center"
              >
                {isMastered ? '✓ Dominado' : 'Marcar como aprendido'}
              </button>
            </div>
          </div>
        </section>

        {/* Navegación entre temas de la materia (Anterior / Siguiente) */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8 text-xs">
          {prevTopic ? (
            <button
              type="button"
              onClick={() => setActiveTopicId(prevTopic.id)}
              className="flex items-center gap-1.5 font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Anterior: {prevTopic.title}
            </button>
          ) : <div />}

          {nextTopic ? (
            <button
              type="button"
              onClick={() => setActiveTopicId(nextTopic.id)}
              className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              Siguiente: {nextTopic.title} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTopicId(null)
                navigate('ruta', { subject: currentSubject.id })
              }}
              className="font-bold text-mint-400 hover:text-mint-300 cursor-pointer"
            >
              ¡Has visto todos los temas de {currentSubject.name}!
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────────────────
     VISTA 2: LISTA DE MATERIAS Y TEMAS (SELECCIÓN)
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Selector amigable de las 8 materias */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map((s) => {
          const active = s.id === currentSubject.id
          const p = subjectProgress(state, s.id)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedSubjectId(s.id)
                setActiveTopicId(null)
                navigate('ruta', { subject: s.id })
              }}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition cursor-pointer ${
                active
                  ? 'border-mint-400 bg-mint-400/15 text-white shadow-lg shadow-mint-500/10'
                  : 'border-white/6 bg-ink-950/40 text-ink-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <SubjectIcon subjectId={s.id} size="sm" />
              <div className="text-left">
                <p className="text-xs font-bold leading-tight truncate">{s.name}</p>
                <p className="text-[10px] font-semibold tabular-nums text-mint-400">{p.pct}% completado</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 2. Banner de la materia activa */}
      <div
        className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border"
        style={{
          borderColor: `${currentSubject.color}40`,
          backgroundImage: `linear-gradient(135deg, ${currentSubject.color}15, transparent 60%)`,
        }}
      >
        <div className="flex items-center gap-3.5">
          <SubjectIcon subjectId={currentSubject.id} size="lg" />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentSubject.name}
            </h1>
            <p className="text-xs text-ink-200 mt-0.5">
              {currentSubject.description}
            </p>
          </div>
        </div>

        <div className="text-right sm:min-w-40 space-y-1">
          <p className="text-xs font-bold text-white">
            {progress.dominado} de {progress.total} temas dominados
          </p>
          <ProgressBar value={progress.pct} color={currentSubject.color} height={7} />
        </div>
      </div>

      {/* 3. Lista de temas en tarjetas limpias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Temas de {currentSubject.name}:
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Elige un tema para leer la explicación o ponte a prueba directo
          </span>
        </div>

        {topics.map((topic, index) => {
          const isMastered = topic.status === 'dominado'
          const doneSubs = topic.subtopics.filter((s) => s.done).length

          return (
            <div
              key={topic.id}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition border ${
                isMastered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold ${
                    isMastered ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isMastered ? <CheckCircle2 size={16} /> : index + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      onClick={() => setActiveTopicId(topic.id)}
                      className="font-bold text-sm sm:text-base text-white hover:text-emerald-300 cursor-pointer transition truncate"
                    >
                      {topic.title}
                    </h3>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold border ${
                        isMastered
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-700 bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {isMastered ? '✓ Dominado' : 'Por repasar'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-mint-400" /> ~{topic.minutes} min
                    </span>
                    <span>•</span>
                    <span>{doneSubs} de {topic.subtopics.length} partes dominadas</span>
                  </div>

                  {topic.tip && (
                    <p className="text-xs text-indigo-300 line-clamp-1 italic">
                      💡 Consejo: {topic.tip}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción claros: LEER primero o HACER QUIZ */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-slate-800 sm:border-t-0 justify-end flex-wrap">
                {/* 1. Botón para leer la explicación */}
                <button
                  type="button"
                  onClick={() => setActiveTopicId(topic.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 text-xs transition cursor-pointer border border-slate-700"
                >
                  <BookOpen size={14} className="text-mint-400" /> Leer explicación
                </button>

                {/* 2. Botón directo de Quiz por si ya lo leyeron */}
                <button
                  type="button"
                  onClick={() =>
                    navigate('simulador', {
                      topic: topic.id,
                      subject: currentSubject.id,
                      auto: 'true',
                    })
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 text-xs transition cursor-pointer shadow-sm"
                  title="Poner a prueba lo que sabes de este tema"
                >
                  <Zap size={14} fill="currentColor" /> Hacer Quiz
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
