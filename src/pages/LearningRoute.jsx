/**
 * Ruta de Materias simplificada y visualmente amigable:
 * - Selección limpia de materia mediante tarjetas o pestañas superiores.
 * - Lista de temas en tarjetas claras con estado visible ("Por repasar" / "¡Dominado!").
 * - Botón destacado "Ver explicación y apuntes".
 * - Sin botones técnicos ni menús confusos.
 */
import { useMemo, useState } from 'react'
import {
  BookOpen, CheckCircle2, ChevronRight, Circle, Clock, Flame,
  HelpCircle, Lightbulb, Play, Search, Sparkles
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP, TOPIC_STATUS } from '../data/subjects'
import { getSubjectTopics, subjectProgress } from '../lib/progress'
import { ProgressBar } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'
import { TopicDrawer } from '../components/learning/TopicDrawer'

export default function LearningRoute() {
  const { state, actions, route, navigate, toast } = useApp()
  const initialSubject = route.params.subject || 'matematicas'
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject)
  const [activeTopicId, setActiveTopicId] = useState(route.params.topic || null)

  const currentSubject = SUBJECT_MAP[selectedSubjectId] || SUBJECTS[0]
  const topics = useMemo(() => {
    return getSubjectTopics(state, currentSubject.id)
  }, [state, currentSubject.id])

  const progress = useMemo(() => {
    return subjectProgress(state, currentSubject.id)
  }, [state, currentSubject.id])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Selector amigable de las materias */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map((s) => {
          const active = s.id === currentSubject.id
          const p = subjectProgress(state, s.id)
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubjectId(s.id)
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
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-300 px-1">
          Temas a estudiar en esta materia:
        </h2>

        {topics.map((topic, index) => {
          const isMastered = topic.status === 'dominado'
          const doneSubs = topic.subtopics.filter((s) => s.done).length

          return (
            <div
              key={topic.id}
              className={`card card-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition border ${
                isMastered ? 'border-mint-400/30 bg-mint-400/5' : 'border-white/8 bg-ink-950/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold ${
                    isMastered ? 'bg-mint-400 text-ink-950' : 'bg-white/10 text-white'
                  }`}
                >
                  {isMastered ? <CheckCircle2 size={16} /> : index + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">
                    {topic.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-ink-300">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-mint-400" /> ~{topic.minutes} min
                    </span>
                    <span>•</span>
                    <span>{doneSubs} de {topic.subtopics.length} partes vistas</span>
                  </div>

                  {topic.tip && (
                    <p className="text-xs text-iris-300 line-clamp-1 italic">
                      💡 Consejo de Brian: {topic.tip}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción claros */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-white/6 sm:border-t-0 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const next = isMastered ? 'pendiente' : 'dominado'
                    actions.setTopicStatus(topic.id, next)
                    toast({
                      tone: next === 'dominado' ? 'success' : 'info',
                      title: next === 'dominado' ? '¡Tema dominado! 🌟' : 'Marcado para repasar',
                      description: topic.title,
                    })
                  }}
                  className={`btn text-xs px-3 py-2 font-bold ${
                    isMastered
                      ? 'btn-ghost text-mint-300 border-mint-400/30 hover:bg-mint-400/10'
                      : 'btn-ghost text-ink-300 hover:text-white'
                  }`}
                >
                  {isMastered ? '✓ Dominado' : 'Marcar como aprendido'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTopicId(topic.id)}
                  className="btn btn-primary px-4 py-2 text-xs font-extrabold gap-1"
                >
                  <BookOpen size={13} /> Estudiar tema <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Drawer de apuntes detallados */}
      {activeTopicId && (
        <TopicDrawer
          topicId={activeTopicId}
          onClose={() => setActiveTopicId(null)}
        />
      )}
    </div>
  )
}
