/**
 * Ruta de Aprendizaje y Módulos de Estudio:
 * Desglose por materia, timeline interactivo de temas, checklist de subtemas,
 * filtrado por estado (Pendiente, En repaso, Dominado) y apertura del TopicDrawer.
 */
import { useMemo, useState } from 'react'
import {
  BookOpen, CheckCircle2, ChevronRight, Clock, Filter, Layers, ListFilter,
  Pin, Sparkles, Search
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP, TOPIC_STATUS } from '../data/subjects'
import { getSubjectTopics, subjectProgress } from '../lib/progress'
import { PageHeader } from '../components/ui/Feedback'
import { ProgressBar } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'
import { StatusBadge, StatusSelector } from '../components/ui/Status'
import { TopicDrawer } from '../components/learning/TopicDrawer'

export default function LearningRoute() {
  const { state, actions, route, navigate, isTutor, toast } = useApp()
  const initialSubject = route.params.subject || 'matematicas'
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject)
  const [activeTopicId, setActiveTopicId] = useState(route.params.topic || null)
  const [statusFilter, setStatusFilter] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  const currentSubject = SUBJECT_MAP[selectedSubjectId] || SUBJECTS[0]
  const topics = useMemo(() => {
    return getSubjectTopics(state, currentSubject.id)
  }, [state, currentSubject.id])

  const progress = useMemo(() => {
    return subjectProgress(state, currentSubject.id)
  }, [state, currentSubject.id])

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesFilter = statusFilter === 'todos' || t.status === statusFilter
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtopics.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }, [topics, statusFilter, searchQuery])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Temario Oficial COMIPEMS"
        title="Ruta de Aprendizaje"
        description="Explora cada materia tema por tema. Marca tu nivel de dominio, consulta apuntes con fórmulas y revisa los consejos de tu tutor."
      />

      {/* Selector horizontal de materias */}
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2">
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
              className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                active
                  ? 'border-white/20 bg-ink-850 shadow-xl shadow-iris-600/10'
                  : 'border-white/5 bg-ink-900/50 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <SubjectIcon subjectId={s.id} size="sm" />
              <div>
                <p className={`text-sm font-bold ${active ? 'text-white' : 'text-ink-200'}`}>
                  {s.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: s.color }}>
                    {p.pct}%
                  </span>
                  <span className="text-[11px] text-ink-300">
                    {p.dominado}/{p.total} dominados
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Banner de la materia seleccionada */}
      <section
        className="card relative overflow-hidden p-6"
        style={{
          backgroundImage: `radial-gradient(40rem 20rem at 100% 0%, ${currentSubject.color}25, transparent 70%)`
        }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <SubjectIcon subjectId={currentSubject.id} size="lg" />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: currentSubject.color }}>
                {currentSubject.examQuestions} reactivos en el examen
              </p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{currentSubject.name}</h2>
              <p className="mt-1 text-sm text-ink-300 max-w-xl">{currentSubject.description}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-ink-950/50 p-4 sm:min-w-64">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-300">
              <span>Avance de la materia</span>
              <span className="text-sm font-bold text-white tabular-nums">{progress.pct}%</span>
            </div>
            <ProgressBar value={progress.pct} color={currentSubject.color} className="mt-2" height={8} />
            <div className="mt-3 flex items-center justify-between text-xs text-ink-300">
              <span>{progress.dominado} dominados</span>
              <span>{progress.repaso} en repaso</span>
              <span>{progress.pendiente} pendientes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de filtros y búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar tema o subtema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtros de estado */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-300 flex items-center gap-1">
            <Filter size={13} /> Estado:
          </span>
          {['todos', 'pendiente', 'repaso', 'dominado'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`chip cursor-pointer capitalize transition-all ${
                statusFilter === st
                  ? 'border-mint-400 bg-mint-400/20 text-mint-300 font-bold'
                  : 'border-white/10 bg-white/5 text-ink-300 hover:text-white'
              }`}
            >
              {st === 'todos' ? 'Todos' : TOPIC_STATUS[st]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de temas interactivos estilo Timeline */}
      <div className="relative space-y-4 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5 md:before:left-8">
        {filteredTopics.map((topic, index) => {
          const isToday = state.todayTopicId === topic.id
          const doneSub = topic.subtopics.filter((s) => s.done).length

          return (
            <div
              key={topic.id}
              className={`card card-hover relative flex flex-col gap-4 p-5 transition-all md:flex-row md:items-center md:justify-between ${
                isToday ? 'border-iris-400/50 bg-iris-500/10' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Indicador numérico circular del timeline */}
                <div
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold font-display text-sm"
                  style={{
                    background:
                      topic.status === 'dominado'
                        ? '#34d9a5'
                        : topic.status === 'repaso'
                        ? '#fbbf24'
                        : 'rgb(255 255 255 / 0.08)',
                    color: topic.status === 'pendiente' ? '#b9c2e6' : '#060a1a'
                  }}
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white sm:text-lg">
                      {topic.title}
                    </h3>
                    {isToday && (
                      <span className="chip border-iris-400/40 bg-iris-500/20 text-iris-300 text-[10px]">
                        <Pin size={10} /> Tema de hoy
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-300">
                    <StatusBadge status={topic.status} />
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {topic.minutes} min aprox
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> {doneSub}/{topic.subtopics.length} subtemas
                    </span>
                  </div>

                  {topic.tip && (
                    <p className="mt-2 line-clamp-1 text-xs text-iris-200">
                      <strong className="text-iris-300">Consejo:</strong> {topic.tip}
                    </p>
                  )}
                </div>
              </div>

              {/* Acciones y selector de estado rápido */}
              <div className="flex flex-wrap items-center gap-3 justify-end pt-3 border-t border-white/5 md:border-t-0 md:pt-0">
                <StatusSelector
                  size="sm"
                  value={topic.status}
                  idPrefix={`list-status-${topic.id}`}
                  onChange={(newStatus) => {
                    actions.setTopicStatus(topic.id, newStatus)
                    toast({
                      tone: newStatus === 'dominado' ? 'success' : 'info',
                      title: `Estado de tema actualizado: ${TOPIC_STATUS[newStatus].label}`,
                      description: topic.title,
                      duration: 2500
                    })
                  }}
                />

                <button
                  type="button"
                  onClick={() => setActiveTopicId(topic.id)}
                  className="btn btn-ghost px-3 py-1.5 text-xs font-semibold gap-1.5"
                >
                  <BookOpen size={14} /> Ver Apuntes <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {filteredTopics.length === 0 && (
          <div className="p-12 text-center card">
            <p className="text-ink-200 font-bold">No se encontraron temas con los filtros actuales.</p>
            <p className="text-xs text-ink-300 mt-1">Prueba cambiando el estado o el término de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Drawer modal de detalle del tema */}
      {activeTopicId && (
        <TopicDrawer
          topicId={activeTopicId}
          onClose={() => setActiveTopicId(null)}
        />
      )}
    </div>
  )
}
