/**
 * Dashboard "Mi Día" rediseñado: ultra amigable, limpio y enfocado.
 * Cero abrumación:
 * 1. Saludo cálido y claro: "¿Qué hacemos hoy?".
 * 2. Un botón GRANDE y único para empezar a estudiar el tema sugerido.
 * 3. Selector visual de las 8 materias con barras de avance simples.
 * 4. Tareas pendientes de su tutor en formato checklist directo.
 */
import { useMemo } from 'react'
import {
  ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronRight,
  Clock, Flame, Play, Quote, Sparkles, Star, Trophy, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { QUOTES } from '../data/mockData'
import { globalProgress, subjectProgress, suggestedTopic } from '../lib/progress'
import { dayOfYear, formatDate, daysUntil } from '../lib/date'
import { ProgressBar } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'

export default function Dashboard() {
  const { state, navigate, isTutor } = useApp()
  const global = useMemo(() => globalProgress(state), [state])
  const todayTopic = useMemo(() => suggestedTopic(state), [state])
  const todaySubject = SUBJECT_MAP[todayTopic?.subjectId] || SUBJECTS[0]
  const quote = QUOTES[dayOfYear() % QUOTES.length]
  const name = state.profile.student

  const pendingTasks = state.tasks.filter((t) => t.status === 'pendiente')
  const reviewedTasks = state.tasks.filter((t) => t.status === 'revisada')

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ───────── 1. TARJETA PRINCIPAL: LA MISIÓN DE HOY ───────── */}
      <section
        className="card relative overflow-hidden p-6 sm:p-8 border-mint-400/30 shadow-2xl bg-linear-to-br from-mint-500/10 via-ink-850 to-iris-500/10 animate-fade-up"
        aria-label="Misión de hoy"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-400/20 px-3 py-1 text-xs font-bold text-mint-300">
              <Sparkles size={13} /> {isTutor ? `Plan para ${name}` : 'Tu meta para hoy'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {isTutor ? (
                <>Supervisando el estudio de <span className="text-gradient">{name}</span></>
              ) : (
                <>¡Hola {name}! ¿Lista para aprender algo nuevo?</>
              )}
            </h1>

            <p className="text-sm text-ink-200 leading-relaxed">
              Tema recomendado para hoy: <strong className="text-white">{todayTopic.title}</strong> en <span style={{ color: todaySubject.color }}>{todaySubject.name}</span>.
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs text-ink-300">
              <span className="flex items-center gap-1 font-medium">
                <Clock size={13} className="text-mint-400" /> ~{todayTopic.minutes} min
              </span>
              <span>•</span>
              <span>{todayTopic.subtopics.length} partes fáciles</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('ruta', { subject: todayTopic.subjectId, topic: todayTopic.id })}
              className="btn btn-mint px-6 py-3.5 text-sm font-extrabold shadow-xl shadow-mint-500/20 gap-2 text-center"
            >
              <Play size={16} fill="currentColor" /> {isTutor ? 'Ver tema de hoy' : '¡Empezar a estudiar!'}
            </button>

            <button
              type="button"
              onClick={() => navigate('simulador')}
              className="btn btn-ghost px-4 py-2.5 text-xs font-bold text-ink-100 hover:text-white"
            >
              <Zap size={14} className="text-amber-400" /> Hacer un test rápido (10 min)
            </button>
          </div>
        </div>

        {/* Barra de progreso global del temario */}
        <div className="mt-6 pt-5 border-t border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Avance de la guía ECOEMS / COMIPEMS</span>
            <span className="text-emerald-400 font-extrabold">{global.dominado} de {global.total} temas completados ({global.pct}%)</span>
          </div>
          <ProgressBar value={global.pct} height={8} />
        </div>
      </section>

      {/* ───────── 2. TUS 8 MATERIAS (LIMPIAS Y FÁCILES DE CLICAR) ───────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-iris-400" /> Tus Materias
            </h2>
            <p className="text-xs text-ink-300">Elige una materia para ver sus temas explicados de forma sencilla.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('ruta')}
            className="text-xs font-bold text-mint-400 hover:text-mint-300 flex items-center gap-1"
          >
            Ver todas <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUBJECTS.map((s) => {
            const p = subjectProgress(state, s.id)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => navigate('ruta', { subject: s.id })}
                className="card card-hover p-4 text-left flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <SubjectIcon subjectId={s.id} size="sm" />
                  <span className="text-xs font-black tabular-nums" style={{ color: s.color }}>
                    {p.pct}%
                  </span>
                </div>

                <div>
                  <p className="font-bold text-sm text-white truncate group-hover:text-mint-300 transition">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-ink-300 mt-0.5">
                    {p.dominado} de {p.total} temas
                  </p>
                </div>

                <ProgressBar value={p.pct} color={s.color} height={5} glow={false} />
              </button>
            )
          })}
        </div>
      </section>

      {/* ───────── NOTIFICACIÓN DE TAREA REVISADA POR BRIAN ───────── */}
      {!isTutor && reviewedTasks.length > 0 && (
        <section
          onClick={() => navigate('tareas')}
          className="card p-4.5 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Star size={18} fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> ¡{state.profile.tutor} revisó tu tarea!
              </p>
              <h3 className="text-sm font-bold text-white truncate">
                {reviewedTasks[0].title}
              </h3>
              {reviewedTasks[0].review?.feedback && (
                <p className="text-xs text-slate-300 italic truncate mt-0.5">
                  “{reviewedTasks[0].review.feedback}”
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-end">
            <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300 border border-emerald-500/30">
              Nota: {reviewedTasks[0].review?.grade}/10
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              Ver libreta <ChevronRight size={14} />
            </span>
          </div>
        </section>
      )}

      {/* ───────── 3. TAREAS Y RETOS PENDIENTES ───────── */}
      <section className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-iris-500/20 text-iris-300">
              <Trophy size={15} />
            </div>
            <h2 className="text-base font-bold text-white">
              {isTutor ? 'Tareas asignadas' : `Tareas que te dejó ${state.profile.tutor}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('tareas')}
            className="text-xs font-bold text-mint-400 hover:text-mint-300 flex items-center gap-1"
          >
            Ver lista completa <ChevronRight size={14} />
          </button>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="space-y-2 pt-1">
            {pendingTasks.slice(0, 3).map((task) => {
              const days = daysUntil(task.dueDate)
              return (
                <div
                  key={task.id}
                  onClick={() => navigate('tareas')}
                  className="flex items-center justify-between rounded-2xl border border-white/6 bg-ink-950/40 p-3 hover:border-white/15 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-mint-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-ink-300">
                        {SUBJECT_MAP[task.subjectId]?.name || 'General'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-amber-300 shrink-0 ml-2">
                    {days <= 1 ? '¡Por vencer!' : `En ${days} días`}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-ink-300 py-3 text-center">
            ¡No tienes tareas pendientes! Tómate un descanso o haz un test rápido. 🌟
          </p>
        )}
      </section>

      {/* Frase motivacional discreta */}
      <div className="text-center py-2 text-xs text-ink-300 italic">
        “{quote.text}” — <span className="text-ink-200">{quote.author}</span>
      </div>
    </div>
  )
}
