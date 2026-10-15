/**
 * Panel de Estadísticas y Analítica:
 * - Gráfica de Radar y Barras para ver el dominio por materia.
 * - Historial y evolución de cuestionarios realizados.
 * - Vitrina de todos los Logros y Medallas obtenidas.
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
      name: `Q${idx + 1}`,
      fullName: h.name,
      date: formatDate(h.date),
      aciertos: h.correct,
      total: h.total,
      porcentaje: pct(h.correct, h.total),
    }))
  }, [state.history])

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700">
          <Award size={13} /> Diagnóstico de Progreso
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Estadísticas y Medallas de Estudio
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Monitorea tu nivel de preparación general, tus materias más fuertes y las que conviene repasar más.
        </p>
      </div>

      {/* ───────────────── TARJETAS DE PUNTOS CLAVE ───────────────── */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-emerald-200 bg-linear-to-b from-emerald-50/70 to-white p-5 shadow-xs">
          <p className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
            <TrendingUp size={15} /> Mayor avance
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">{strongSubjects[0]?.name || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">
            {strongSubjects[0]?.mastery}% de dominio general
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-linear-to-b from-amber-50/70 to-white p-5 shadow-xs">
          <p className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider">
            <AlertTriangle size={15} /> Área de refuerzo
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">{weakSubjects[0]?.name || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">
            {weakSubjects[0]?.mastery}% de dominio (priorizar clase)
          </p>
        </div>

        <div className="rounded-3xl border border-indigo-200 bg-linear-to-b from-indigo-50/70 to-white p-5 shadow-xs">
          <p className="flex items-center gap-2 text-xs font-black text-indigo-700 uppercase tracking-wider">
            <Target size={15} /> Meta ECOEMS
          </p>
          <p className="mt-2 text-xl font-black text-slate-900 tabular-nums">
            {state.profile.goalScore} / 128
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Aciertos objetivo ({state.profile.targetSchool})
          </p>
        </div>

        <div className="rounded-3xl border border-purple-200 bg-linear-to-b from-purple-50/70 to-white p-5 shadow-xs">
          <p className="flex items-center gap-2 text-xs font-black text-purple-700 uppercase tracking-wider">
            <Sparkles size={15} /> Medallas ganadas
          </p>
          <p className="mt-2 text-xl font-black text-slate-900 tabular-nums">
            {badges.filter((b) => b.unlocked).length} de {badges.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((badges.filter((b) => b.unlocked).length / badges.length) * 100)}% desbloqueadas
          </p>
        </div>
      </div>

      {/* ───────────────── GRÁFICAS PRINCIPALES ───────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfica Radar de Dominio por Materia */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between" aria-label="Radar de Dominio">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Radar de Dominio por Materia</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Promedio entre clases dominadas y precisión en quizzes.
                </p>
              </div>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar
                    name="Dominio (%)"
                    dataKey="dominio"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-600" /> Nivel de dominio actual (%)
            </span>
          </div>
        </section>

        {/* Evolución de Quizzes y Simulacros */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between" aria-label="Evolución de Simulacros">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Historial de Precisión (%)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Porcentaje de aciertos en cada quiz realizado.
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-indigo-700 text-xs font-bold">
                Meta: {Math.round((state.profile.goalScore / 128) * 100)}%
              </span>
            </div>

            {historyData.length === 0 ? (
              <div className="h-72 w-full mt-4 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-3">
                  <ChartIcon size={24} />
                </div>
                <p className="text-sm font-bold text-slate-900">Aún no hay quizzes realizados</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Al completar tus primeros quizzes en el Salón de Clases, aquí verás la gráfica con tu avance.
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload
                          return (
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl text-xs space-y-0.5">
                              <p className="font-bold text-slate-900">{d.fullName}</p>
                              <p className="text-slate-500">{d.date}</p>
                              <p className="mt-1 font-bold text-indigo-600">
                                {d.aciertos} de {d.total} aciertos ({d.porcentaje}%)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="porcentaje" fill="#4f46e5" radius={[8, 8, 0, 0]} />
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
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4" aria-label="Desglose de materias">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">Desglose y Dominio por Materia</h3>
          <p className="text-xs text-slate-500">Revisa qué materias ya tienes bien preparadas y cuáles necesitan más atención.</p>
        </div>

        <div className="space-y-3">
          {masteryList.map((m) => {
            const isWeak = m.mastery < 60
            return (
              <div
                key={m.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <SubjectIcon subjectId={m.id} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                      {isWeak && (
                        <span className="rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 border border-rose-200">
                          Refuerzo recomendado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>Clases dominadas: {m.topics}%</span>
                      <span>•</span>
                      <span>Aciertos en quizzes: {m.accuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-44">
                  <div className="flex-1">
                    <ProgressBar value={m.mastery} color={m.color} height={7} />
                  </div>
                  <span className="font-display font-black text-sm text-slate-800 w-10 text-right tabular-nums">
                    {m.mastery}%
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('ruta', { subject: m.id })}
                    className="btn btn-ghost px-3 py-1.5 text-xs font-bold"
                  >
                    Ver clases
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ───────────────── VITRINA COMPLETA DE LOGROS ───────────────── */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4" aria-label="Vitrina de Logros">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">Insignias y Medallas Desbloqueadas</h3>
            <p className="text-xs text-slate-500">
              Recompensas que celebran tu constancia, tus clases leídas y tus quizzes aprobados.
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-black text-indigo-700">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Ganadas
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
