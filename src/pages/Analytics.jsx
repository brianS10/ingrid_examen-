/**
 * Panel de Estadísticas y Analítica:
 * - Gráfica de Radar y Barras con Recharts para ver el dominio por materia (identificar puntos débiles).
 * - Historial y evolución de simulacros realizados (ej. 78 -> 86 -> 95 de 128 aciertos).
 * - Vitrina completa de todos los Logros y Medallas obtenidas o en progreso.
 */
import { useMemo } from 'react'
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from 'recharts'
import {
  AlertTriangle, Award, CheckCircle2, Flame, LineChart as ChartIcon,
  Sparkles, Target, TrendingUp, Trophy
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { masteryBySubject, simulacros, pct } from '../lib/progress'
import { formatDate } from '../lib/date'
import { PageHeader } from '../components/ui/Feedback'
import { ProgressBar } from '../components/ui/Progress'
import { BadgeCard } from '../components/BadgeCard'
import { SubjectIcon } from '../components/ui/Icon'

export default function Analytics() {
  const { state, badges, navigate } = useApp()

  const masteryList = useMemo(() => masteryBySubject(state), [state])
  const weakSubjects = useMemo(() => masteryList.slice(0, 3), [masteryList])
  const strongSubjects = useMemo(() => [...masteryList].reverse().slice(0, 3), [masteryList])

  // Datos para la gráfica de Radar (materias y nivel de dominio)
  const radarData = useMemo(() => {
    return masteryList.map((m) => ({
      subject: m.short,
      fullName: m.name,
      dominio: m.mastery,
      temas: m.topics,
      aciertos: m.accuracy,
    }))
  }, [masteryList])

  // Datos para la gráfica de evolución de simulacros
  const historyData = useMemo(() => {
    return state.history.map((h, idx) => ({
      name: `S${idx + 1}`,
      fullName: h.name,
      date: formatDate(h.date),
      aciertos: h.correct,
      total: h.total,
      porcentaje: pct(h.correct, h.total),
    }))
  }, [state.history])

  const sims = simulacros(state.history)
  const lastSim = sims.at(-1)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analítica de Rendimiento"
        title="Estadísticas y Progreso"
        description="Analiza tu nivel de preparación global, fortalezas y puntos débiles que requieren más tutoría antes del COMIPEMS."
      />

      {/* ───────────────── TARJETAS DE PUNTOS CLAVE ───────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 border-mint-400/20 bg-linear-to-b from-mint-400/10 to-transparent">
          <p className="flex items-center gap-2 text-xs font-bold text-mint-400 uppercase tracking-wider">
            <TrendingUp size={15} /> Mejor avance
          </p>
          <p className="mt-2 text-xl font-black text-white">{strongSubjects[0]?.name || '—'}</p>
          <p className="text-xs text-ink-300 mt-1">
            {strongSubjects[0]?.mastery}% de dominio general
          </p>
        </div>

        <div className="card p-5 border-amber-400/20 bg-linear-to-b from-amber-400/10 to-transparent">
          <p className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <AlertTriangle size={15} /> Área de atención
          </p>
          <p className="mt-2 text-xl font-black text-white">{weakSubjects[0]?.name || '—'}</p>
          <p className="text-xs text-ink-300 mt-1">
            {weakSubjects[0]?.mastery}% de dominio (priorizar tutoría)
          </p>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Target size={15} /> Meta ECOEMS / COMIPEMS
          </p>
          <p className="mt-2 text-xl font-black text-white tabular-nums">
            {state.profile.goalScore} / 128
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Meta de aciertos ({state.profile.targetSchool})
          </p>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Sparkles size={15} /> Medallas ganadas
          </p>
          <p className="mt-2 text-xl font-black text-white tabular-nums">
            {badges.filter((b) => b.unlocked).length} de {badges.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round((badges.filter((b) => b.unlocked).length / badges.length) * 100)}% de insignias
          </p>
        </div>
      </div>

      {/* ───────────────── GRÁFICAS PRINCIPALES ───────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfica Radar de Dominio por Materia */}
        <section className="card p-6 flex flex-col justify-between" aria-label="Radar de Dominio">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-title">Radar de Dominio por Materia</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Promedio ponderado entre temas completados y precisión en simulacros.
                </p>
              </div>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#b9c2e6', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#8d9acb', fontSize: 10 }}
                  />
                  <Radar
                    name="Dominio (%)"
                    dataKey="dominio"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-400" /> Nivel de dominio actual (%)
            </span>
          </div>
        </section>

        {/* Evolución de Simulacros (Línea de Aciertos) */}
        <section className="card p-6 flex flex-col justify-between" aria-label="Evolución de Simulacros">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-title">Evolución de Rendimiento (%)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Historial de precisión en cada cuestionario y simulacro realizado.
                </p>
              </div>
              <span className="chip border-indigo-400/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold">
                Meta: {Math.round((state.profile.goalScore / 128) * 100)}% ({state.profile.goalScore} aciertos)
              </span>
            </div>

            {historyData.length === 0 ? (
              <div className="h-72 w-full mt-4 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 mb-3">
                  <ChartIcon size={24} />
                </div>
                <p className="text-sm font-bold text-white">Sin cuestionarios realizados todavía</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Al completar tus primeros quizzes en la pestaña Practicar, aquí verás la gráfica con tu evolución de aciertos.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('simulador')}
                  className="btn btn-mint text-xs font-bold px-4 py-2 mt-4"
                >
                  ⚡ Hacer mi primer quiz
                </button>
              </div>
            ) : (
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#8d9acb', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#8d9acb', fontSize: 11 }} unit="%" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload
                          return (
                            <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl text-xs">
                              <p className="font-bold text-white">{d.fullName}</p>
                              <p className="text-slate-400">{d.date}</p>
                              <p className="mt-1 font-bold text-emerald-400">
                                {d.aciertos} de {d.total} aciertos ({d.porcentaje}%)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="porcentaje" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-2">
            La constancia es la clave: cada prueba identifica lagunas para reforzar.
          </p>
        </section>
      </div>

      {/* ───────────────── DIAGNÓSTICO DETALLADO POR MATERIA ───────────────── */}
      <section className="card p-6" aria-label="Desglose de materias">
        <h3 className="section-title mb-4">Desglose y Puntos Débiles por Materia</h3>
        <div className="space-y-3">
          {masteryList.map((m) => {
            const isWeak = m.mastery < 60
            return (
              <div
                key={m.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/6 bg-ink-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <SubjectIcon subjectId={m.id} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{m.name}</p>
                      {isWeak && (
                        <span className="chip border-rose-400/40 bg-rose-500/15 text-rose-300 text-[10px]">
                          Refuerzo prioritario
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-300 mt-0.5">
                      <span>Temas estudiados: {m.topics}%</span>
                      <span>Aciertos en simulacros: {m.accuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-44">
                  <div className="flex-1">
                    <ProgressBar value={m.mastery} color={m.color} height={7} />
                  </div>
                  <span className="font-display font-extrabold text-sm text-white w-10 text-right tabular-nums">
                    {m.mastery}%
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('ruta', { subject: m.id })}
                    className="btn btn-ghost px-2.5 py-1 text-xs"
                  >
                    Estudiar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ───────────────── VITRINA COMPLETA DE LOGROS ───────────────── */}
      <section className="card p-6" aria-label="Vitrina de Logros">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Insignias y Logros Desbloqueables</h3>
            <p className="text-xs text-ink-300 mt-1">
              Pequeñas victorias que celebran tu constancia, estudio y simulacros.
            </p>
          </div>
          <span className="chip border-mint-400/30 bg-mint-400/10 text-mint-300 font-bold">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Desbloqueados
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </section>
    </div>
  )
}
