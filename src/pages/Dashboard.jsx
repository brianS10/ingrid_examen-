/**
 * Dashboard principal (vista estudiante / tutor):
 * progreso global, contador, frase del día, tema de hoy, avance por materia, tareas y logros.
 */
import { useMemo } from 'react'
import {
  ArrowRight, BookMarked, CalendarDays, CheckCircle2, ChevronRight, Clock, ClipboardList, Quote, RefreshCw, Sparkles, Target, Timer, Trophy,
} from 'lucide-react'
import heroImg from '../assets/hero-rocket.jpg'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP, ALL_TOPICS } from '../data/subjects'
import { QUOTES } from '../data/mockData'
import { globalProgress, subjectProgress, suggestedTopic, simulacros, pct } from '../lib/progress'
import { dayOfYear, daysUntil, formatDate, greeting } from '../lib/date'
import { Countdown } from '../components/dashboard/Countdown'
import { ProgressBar, ProgressRing } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'
import { StatusBadge } from '../components/ui/Status'
import { BadgeCard } from '../components/BadgeCard'

function Kpi({ icon: Ico, label, value, hint, color }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-ink-950/40 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-ink-300">
        <Ico size={14} style={{ color }} /> {label}
      </div>
      <p className="mt-1 font-display text-xl font-extrabold text-white tabular-nums">{value}</p>
      {hint && <p className="text-[11px] font-semibold" style={{ color }}>{hint}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { state, actions, navigate, badges, isTutor, toast } = useApp()
  const global = useMemo(() => globalProgress(state), [state])
  const today = useMemo(() => suggestedTopic(state), [state])
  const quote = QUOTES[dayOfYear() % QUOTES.length]
  const sims = simulacros(state.history)
  const last = sims.at(-1)
  const prev = sims.at(-2)
  const pendingTasks = state.tasks
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const unlocked = badges.filter((b) => b.unlocked).length
  const nextBadges = [...badges].sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || b.current / b.target - a.current / a.target).slice(0, 4)
  const todaySubject = SUBJECT_MAP[today.subjectId]
  const subDone = today.subtopics.filter((s) => s.done).length
  const name = state.profile.student

  return (
    <div className="space-y-6">
      {/* ───────── Hero + contador ───────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card relative overflow-hidden p-6 xl:col-span-2 animate-fade-up" aria-labelledby="hero-title">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-12 hidden h-[125%] animate-float object-contain opacity-90 [mask-image:radial-gradient(closest-side,black_60%,transparent)] sm:block"
          />
          <div className="relative max-w-xl sm:pr-40 lg:pr-56 xl:pr-44 2xl:pr-0">
            <p className="text-xs font-bold tracking-[0.18em] text-mint-400 uppercase">
              {isTutor ? `Panel de tutoría · ${name}` : 'Tu misión de hoy'}
            </p>
            <h1 id="hero-title" className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {isTutor ? (
                <>Así va <span className="text-gradient">{name}</span></>
              ) : (
                <>{greeting()}, <span className="text-gradient">{name}</span> 👋</>
              )}
            </h1>
            <p className="mt-2 text-ink-300">
              {global.pct < 50
                ? 'Cada tema que avanzas suma. Vamos paso a paso hacia tu lugar en la prepa.'
                : '¡Vas excelente! Mantén el ritmo y convierte los repasos en temas dominados.'}
            </p>

            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={global.pct} size={96} stroke={9} color="#6ef0c3">
                <span className="font-display text-2xl font-extrabold text-white">{global.pct}%</span>
                <span className="text-[10px] font-bold text-ink-300 uppercase">Ruta</span>
              </ProgressRing>
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-mint-500" /> {global.dominado} dominados</p>
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> {global.repaso} en repaso</p>
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-ink-300" /> {global.pendiente} pendientes</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Kpi icon={Target} label="Último simulacro" value={last ? `${last.correct}/${last.total}` : '—'} hint={last && prev ? `${last.correct - prev.correct >= 0 ? '+' : ''}${last.correct - prev.correct} vs anterior` : null} color="#6ef0c3" />
              <Kpi icon={Trophy} label="Meta" value={`${state.profile.goalScore}/128`} hint={last ? `Faltan ${Math.max(0, state.profile.goalScore - last.correct)}` : null} color="#fbbf24" />
              <Kpi icon={ClipboardList} label="Tareas" value={pendingTasks.length} hint="pendientes" color="#f472b6" />
              <Kpi icon={Sparkles} label="Logros" value={`${unlocked}/${badges.length}`} hint="desbloqueados" color="#c4b5fd" />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6 animate-fade-up [animation-delay:80ms]">
          <Countdown />
          {/* Frase del día */}
          <section className="card relative flex-1 overflow-hidden bg-linear-to-br from-mint-500/12 to-ink-850/70" aria-label="Frase del día">
            <Quote size={56} className="absolute -top-2 -right-2 text-mint-400/15" />
            <p className="text-xs font-bold tracking-widest text-mint-400 uppercase">Frase del día</p>
            <blockquote className="mt-2 font-display text-lg leading-snug font-semibold text-white">“{quote.text}”</blockquote>
            <p className="mt-2 text-sm text-ink-300">— {quote.author}</p>
          </section>
        </div>
      </div>

      {/* ───────── Tema de hoy + próximas tareas ───────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        <section
          className="card relative overflow-hidden lg:col-span-3 animate-fade-up [animation-delay:120ms]"
          aria-labelledby="today-title"
          style={{ backgroundImage: `radial-gradient(30rem 16rem at 100% 0%, ${todaySubject.color}22, transparent 70%)` }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: todaySubject.color }}>
              <BookMarked size={14} /> Tema de hoy {state.todayTopicId ? '· elegido por tu tutor' : '· sugerido'}
            </p>
            {isTutor && (
              <select
                id="today-topic-select"
                className="input w-auto max-w-[55%] py-1.5 text-xs"
                value={state.todayTopicId ?? ''}
                onChange={(e) => {
                  actions.setTodayTopic(e.target.value || null)
                  toast({ tone: 'success', title: 'Tema de hoy actualizado' })
                }}
                aria-label="Elegir tema de hoy"
              >
                <option value="">Automático (punto más débil)</option>
                {SUBJECTS.map((s) => (
                  <optgroup key={s.id} label={s.name}>
                    {ALL_TOPICS.filter((t) => t.subjectId === s.id).map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4 flex items-start gap-4">
            <SubjectIcon subjectId={today.subjectId} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-300">{todaySubject.name}</p>
              <h2 id="today-title" className="text-xl font-bold sm:text-2xl">{today.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={today.status} />
                <span className="chip border-white/10 bg-white/5 text-ink-200"><Clock size={12} /> {today.minutes} min</span>
                <span className="chip border-white/10 bg-white/5 text-ink-200"><CheckCircle2 size={12} /> {subDone}/{today.subtopics.length} subtemas</span>
              </div>
            </div>
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {today.subtopics.map((s) => (
              <li key={s.id} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${s.done ? 'border-mint-400/20 bg-mint-400/5 text-ink-200' : 'border-white/8 bg-ink-950/30 text-ink-100'}`}>
                <CheckCircle2 size={15} className={s.done ? 'text-mint-400' : 'text-ink-500'} />
                <span className={s.done ? 'line-through decoration-ink-500' : ''}>{s.title}</span>
              </li>
            ))}
          </ul>

          {today.tip && (
            <p className="mt-4 rounded-2xl border border-iris-400/20 bg-iris-500/8 px-4 py-3 text-sm text-ink-100">
              <span className="font-bold text-iris-300">Consejo del profe: </span>
              {today.tip}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" id="study-today" className="btn btn-primary" onClick={() => navigate('ruta', { subject: today.subjectId, topic: today.id })}>
              Estudiar ahora <ArrowRight size={16} />
            </button>
            <button type="button" id="practice-today" className="btn btn-ghost" onClick={() => navigate('simulador', { subject: today.subjectId })}>
              <Timer size={16} /> Practicar {todaySubject.short}
            </button>
          </div>
        </section>

        <section className="card lg:col-span-2 animate-fade-up [animation-delay:160ms]" aria-labelledby="tasks-title">
          <div className="flex items-center justify-between">
            <h2 id="tasks-title" className="section-title">Próximas tareas</h2>
            <button type="button" className="flex cursor-pointer items-center text-xs font-semibold text-mint-400 hover:text-mint-300" onClick={() => navigate('tareas')}>
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <ul className="mt-4 space-y-2.5">
            {pendingTasks.slice(0, 4).map((t) => {
              const d = daysUntil(t.dueDate)
              return (
                <li key={t.id}>
                  <button type="button" onClick={() => navigate('tareas')} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/6 bg-ink-950/30 p-3 text-left transition hover:border-white/15 hover:bg-white/4">
                    <SubjectIcon subjectId={t.subjectId} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{t.title}</p>
                      <p className={`flex items-center gap-1 text-xs ${d < 0 ? 'text-rose-300' : d <= 2 ? 'text-amber-300' : 'text-ink-300'}`}>
                        <CalendarDays size={12} />
                        {d < 0 ? `Venció hace ${-d} d` : d === 0 ? 'Vence hoy' : d === 1 ? 'Vence mañana' : `Vence ${formatDate(t.dueDate)}`}
                      </p>
                    </div>
                    {t.type === 'reto' && <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-300">Reto</span>}
                  </button>
                </li>
              )
            })}
            {!pendingTasks.length && <p className="py-6 text-center text-sm text-ink-300">¡Sin pendientes! 🎉</p>}
          </ul>
        </section>
      </div>

      {/* ───────── Progreso por materia ───────── */}
      <section aria-labelledby="subjects-title" className="animate-fade-up [animation-delay:200ms]">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="subjects-title" className="section-title text-xl">Progreso por materia</h2>
            <p className="text-sm text-ink-300">Toca una materia para ver su ruta de temas.</p>
          </div>
          {last && (
            <p className="hidden items-center gap-1.5 text-xs text-ink-300 sm:flex">
              <RefreshCw size={12} /> Aciertos del último simulacro ({formatDate(last.date)})
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUBJECTS.map((s) => {
            const p = subjectProgress(state, s.id)
            const simScore = last?.bySubject?.[s.id]
            return (
              <button
                key={s.id}
                id={`subject-card-${s.id}`}
                type="button"
                onClick={() => navigate('ruta', { subject: s.id })}
                className="card card-hover group cursor-pointer p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <SubjectIcon subjectId={s.id} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{s.name}</p>
                    <p className="text-xs text-ink-300">{p.dominado}/{p.total} temas dominados</p>
                  </div>
                  <span className="font-display text-xl font-extrabold tabular-nums" style={{ color: s.color }}>{p.pct}%</span>
                </div>
                <ProgressBar value={p.pct} color={s.color} className="mt-4" label={`Progreso de ${s.name}`} />
                <div className="mt-3 flex items-center justify-between text-xs text-ink-300">
                  <span>{p.subDone}/{p.subTotal} subtemas</span>
                  {simScore && (
                    <span className={pct(simScore.correct, simScore.total) < 60 ? 'font-semibold text-rose-300' : 'text-ink-200'}>
                      Simulacro: {simScore.correct}/{simScore.total}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ───────── Logros ───────── */}
      <section className="card animate-fade-up [animation-delay:240ms]" aria-labelledby="badges-title">
        <div className="flex items-center justify-between">
          <h2 id="badges-title" className="section-title">Logros</h2>
          <button type="button" className="flex cursor-pointer items-center text-xs font-semibold text-mint-400 hover:text-mint-300" onClick={() => navigate('estadisticas')}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {nextBadges.map((b) => <BadgeCard key={b.id} badge={b} compact />)}
        </div>
      </section>
    </div>
  )
}
