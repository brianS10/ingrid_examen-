/**
 * Salón Principal (Dashboard) para la Estudiante (Ingrid):
 * Diseño ultra luminoso, amigable, claro y motivador.
 * 1. Bienvenida afectuosa + Clase recomendada para hoy.
 * 2. Acceso directo a las 8 materias con porcentaje de avance claro.
 * 3. Herramientas rápidas: Tarjetas de memoria y Acordeón.
 * 4. Tareas pendientes de su tutor Brian con estado claro.
 */
import { useMemo } from 'react'
import {
  ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronRight,
  Clock, Flame, Layers, Play, Quote, Sparkles, Star, Trophy, Zap
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
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      {/* ───────── 1. TARJETA PRINCIPAL: LA MISIÓN DE HOY ───────── */}
      <section
        className="rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm bg-linear-to-br from-indigo-50/70 via-white to-emerald-50/50"
        aria-label="Misión de hoy"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/90 border border-indigo-200/60 px-3 py-1 text-xs font-black text-indigo-800">
              <Sparkles size={13} className="text-indigo-600" />
              {isTutor ? `Plan para ${name}` : 'Tu clase para hoy'}
            </span>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {isTutor ? (
                <>Plan de estudio de <span className="text-indigo-600">{name}</span></>
              ) : (
                <>¡Hola {name}! ¿Lista para tu clase de hoy?</>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tema recomendado: <strong className="text-slate-900">{todayTopic.title}</strong> en{' '}
              <span className="font-bold" style={{ color: todaySubject.color }}>{todaySubject.name}</span>.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-indigo-600" /> ~{todayTopic.minutes} min
              </span>
              <span>•</span>
              <span>{todayTopic.subtopics.length} partes fáciles</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('ruta', { subject: todayTopic.subjectId, topic: todayTopic.id })}
              className="btn btn-primary px-6 py-3.5 text-xs sm:text-sm font-black shadow-md shadow-indigo-200 gap-2 text-center cursor-pointer"
            >
              <BookOpen size={17} /> {isTutor ? 'Ver clase de hoy' : '🎓 Entrar a la clase de hoy'}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('simulador', {
                  topic: todayTopic.id,
                  subject: todayTopic.subjectId,
                  auto: 'true',
                })
              }
              className="btn btn-ghost px-4 py-2.5 text-xs font-bold text-amber-800 border-amber-300 bg-amber-50/70 hover:bg-amber-100 transition cursor-pointer"
            >
              <Zap size={14} className="text-amber-600 fill-amber-500" /> ⚡ Hacer Quiz directo
            </button>
          </div>
        </div>

        {/* Barra de progreso global del temario */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600">Avance de la guía ECOEMS / COMIPEMS</span>
            <span className="text-emerald-700 font-black">
              {global.dominado} de {global.total} temas dominados ({global.pct}%)
            </span>
          </div>
          <ProgressBar value={global.pct} height={8} />
        </div>
      </section>

      {/* ───────── BOTONES DE ACCESO RÁPIDO PARA APRENDER MÁS ───────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('tarjetas')}
          className="rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50/70 to-purple-50/50 p-4 text-left flex items-center justify-between shadow-xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-display text-sm font-black text-slate-900 group-hover:text-indigo-600 transition">
                Tarjetas de Memoria
              </h3>
              <p className="text-xs text-slate-500">
                Repasa rápido fórmulas, fechas y conceptos volteando tarjetas.
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition" />
        </button>

        <button
          type="button"
          onClick={() => navigate('simulador')}
          className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50/70 to-teal-50/50 p-4 text-left flex items-center justify-between shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-display text-sm font-black text-slate-900 group-hover:text-emerald-700 transition">
                Simulador de Quizzes
              </h3>
              <p className="text-xs text-slate-500">
                Ponte a prueba con reactivos reales y simula el examen ECOEMS.
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-700 transition" />
        </button>
      </section>

      {/* ───────── 2. TUS 8 MATERIAS (LIMPIAS Y VIBRANTES) ───────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" /> Tus Materias del Examen
            </h2>
            <p className="text-xs text-slate-500">Haz clic en cualquier materia para abrir sus clases paso a paso.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('ruta')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
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
                className="rounded-3xl border border-slate-200/90 bg-white p-4.5 text-left flex flex-col justify-between space-y-3 cursor-pointer group shadow-xs hover:shadow-md hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <SubjectIcon subjectId={s.id} size="sm" />
                  <span className="text-xs font-black tabular-nums" style={{ color: s.color }}>
                    {p.pct}%
                  </span>
                </div>

                <div>
                  <p className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {p.dominado} de {p.total} temas
                  </p>
                </div>

                <ProgressBar value={p.pct} color={s.color} height={6} glow={false} />
              </button>
            )
          })}
        </div>
      </section>

      {/* ───────── NOTIFICACIÓN DE TAREA REVISADA POR BRIAN ───────── */}
      {!isTutor && reviewedTasks.length > 0 && (
        <section
          onClick={() => navigate('tareas')}
          className="rounded-3xl border border-emerald-300 bg-emerald-50/80 p-5 hover:bg-emerald-100/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white font-black shadow-md shadow-emerald-200">
              <Star size={20} fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> ¡{state.profile.tutor} revisó tu libreta!
              </p>
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {reviewedTasks[0].title}
              </h3>
              {reviewedTasks[0].review?.feedback && (
                <p className="text-xs text-slate-600 italic truncate mt-0.5">
                  “{reviewedTasks[0].review.feedback}”
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <span className="rounded-xl bg-white px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200 shadow-xs">
              Nota: {reviewedTasks[0].review?.grade}/10 ⭐
            </span>
            <span className="text-xs font-bold text-emerald-800 flex items-center">
              Ver revisión <ChevronRight size={14} />
            </span>
          </div>
        </section>
      )}

      {/* ───────── 3. TAREAS Y RETOS ASIGNADOS ───────── */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <Trophy size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {isTutor ? 'Tareas que le has asignado' : `Tareas que te dejó ${state.profile.tutor}`}
              </h2>
              <p className="text-xs text-slate-500">
                {isTutor ? 'Monitorea las entregas de Ingrid' : 'Sube foto de tu libreta al terminar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('tareas')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Ver libreta <ChevronRight size={14} />
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
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 hover:bg-white hover:border-slate-300 hover:shadow-xs cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {SUBJECT_MAP[task.subjectId]?.name || 'General'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full shrink-0 ml-2">
                    {days <= 1 ? '¡Por vencer!' : `En ${days} días`}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-500">
            ¡No hay tareas pendientes! Disfruta tu día o haz un repaso en tus clases. 🌟
          </div>
        )}
      </section>

      {/* Frase motivacional discreta */}
      <div className="text-center py-2 text-xs text-slate-500 italic">
        “{quote.text}” — <span className="font-bold text-slate-700">{quote.author}</span>
      </div>
    </div>
  )
}
