/**
 * Zona de Tareas y Retos Semanales:
 * - Lista de tareas/retos prácticos asignados por el tutor.
 * - Filtros por estado: Pendientes, Entregadas, Revisadas y Retos.
 * - Modal para que el estudiante registre evidencia (notas, enlace, autoevaluación 1-5).
 * - Vista de tutor: crear nuevas tareas/retos y calificar/dar retroalimentación a entregas.
 */
import { useMemo, useState } from 'react'
import {
  Award, CalendarDays, CheckCircle2, Clock, ExternalLink, FileEdit, Filter,
  MessageSquare, Plus, Send, Star, Trash2, Trophy, UploadCloud, X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { daysFromNow, daysUntil, formatDate, toDateKey } from '../lib/date'
import { PageHeader } from '../components/ui/Feedback'
import { Modal } from '../components/ui/Modal'
import { SubjectIcon } from '../components/ui/Icon'

export default function Tasks() {
  const { state, actions, isTutor, toast } = useApp()
  const [filter, setFilter] = useState('todas') // 'todas' | 'pendiente' | 'entregada' | 'revisada' | 'retos'
  const [activeTask, setActiveTask] = useState(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)

  // Formulario de entrega (Estudiante)
  const [evidenceNotes, setEvidenceNotes] = useState('')
  const [evidenceLink, setEvidenceLink] = useState('')
  const [selfRating, setSelfRating] = useState(5)

  // Formulario de revisión (Tutor)
  const [reviewGrade, setReviewGrade] = useState(10)
  const [reviewFeedback, setReviewFeedback] = useState('')

  // Formulario de nueva tarea (Tutor)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskSubject, setNewTaskSubject] = useState('matematicas')
  const [newTaskType, setNewTaskType] = useState('tarea') // 'tarea' | 'reto'
  const [newTaskPoints, setNewTaskPoints] = useState(25)
  const [newTaskDays, setNewTaskDays] = useState(3)

  const filteredTasks = useMemo(() => {
    return state.tasks.filter((t) => {
      if (filter === 'retos') return t.type === 'reto'
      if (filter !== 'todas') return t.status === filter
      return true
    })
  }, [state.tasks, filter])

  // Abrir modal de entrega
  const handleOpenSubmit = (task) => {
    setActiveTask(task)
    setEvidenceNotes(task.evidence?.notes || '')
    setEvidenceLink(task.evidence?.link || '')
    setSelfRating(task.evidence?.selfRating || 5)
    setIsSubmitModalOpen(true)
  }

  // Guardar entrega
  const handleSaveSubmit = () => {
    if (!evidenceNotes.trim()) {
      toast({ tone: 'warning', title: 'Agrega una breve nota de tu entrega' })
      return
    }

    actions.updateTask(
      activeTask.id,
      {
        status: 'entregada',
        evidence: {
          notes: evidenceNotes,
          link: evidenceLink,
          submittedAt: toDateKey(),
          selfRating,
        },
      },
      true // cuenta para streak
    )

    setIsSubmitModalOpen(false)
    toast({
      tone: 'success',
      title: '¡Evidencia enviada! 🎉',
      description: `Tu tutor revisará tu entrega de "${activeTask.title}".`,
    })
  }

  // Abrir modal de revisión (Tutor)
  const handleOpenReview = (task) => {
    setActiveTask(task)
    setReviewGrade(task.review?.grade || 10)
    setReviewFeedback(task.review?.feedback || '')
    setIsReviewModalOpen(true)
  }

  // Guardar calificación del tutor
  const handleSaveReview = () => {
    actions.updateTask(activeTask.id, {
      status: 'revisada',
      review: {
        grade: Number(reviewGrade),
        feedback: reviewFeedback,
      },
    })
    setIsReviewModalOpen(false)
    toast({
      tone: 'success',
      title: 'Tarea calificada',
      description: `Nota asignada: ${reviewGrade}/10`,
    })
  }

  // Crear nueva tarea (Tutor)
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast({ tone: 'warning', title: 'El título es obligatorio' })
      return
    }

    actions.addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      subjectId: newTaskSubject,
      type: newTaskType,
      points: Number(newTaskPoints),
      dueDate: daysFromNow(Number(newTaskDays)),
    })

    setIsNewTaskModalOpen(false)
    setNewTaskTitle('')
    setNewTaskDesc('')
    toast({
      tone: 'success',
      title: 'Tarea asignada exitosamente',
      description: `Fecha límite: en ${newTaskDays} días`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tutoría y Compromisos"
        title="Zona de Tareas y Retos"
        description="Actividades prácticas diseñadas para afianzar conocimientos clave antes del examen COMIPEMS."
        actions={
          isTutor && (
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(true)}
              className="btn btn-mint text-sm font-bold"
            >
              <Plus size={16} /> Asignar nueva tarea
            </button>
          )
        }
      />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-300 flex items-center gap-1">
          <Filter size={13} /> Filtrar:
        </span>
        {[
          { id: 'todas', label: 'Todas' },
          { id: 'pendiente', label: 'Pendientes' },
          { id: 'entregada', label: 'Entregadas' },
          { id: 'revisada', label: 'Revisadas' },
          { id: 'retos', label: 'Solo Retos' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`chip cursor-pointer transition-all ${
              filter === f.id
                ? 'border-mint-400 bg-mint-400/20 text-mint-300 font-bold'
                : 'border-white/10 bg-white/5 text-ink-300 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de tareas */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredTasks.map((task) => {
          const days = daysUntil(task.dueDate)
          const isPending = task.status === 'pendiente'
          const isSubmitted = task.status === 'entregada'
          const isReviewed = task.status === 'revisada'
          const subject = SUBJECT_MAP[task.subjectId]

          return (
            <div
              key={task.id}
              className={`card card-hover flex flex-col justify-between p-5 space-y-4 border ${
                task.type === 'reto'
                  ? 'border-amber-400/30 bg-linear-to-br from-amber-400/5 to-ink-850/80'
                  : 'border-white/8'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <SubjectIcon subjectId={task.subjectId} size="sm" />
                    <div>
                      <span className="text-xs font-semibold text-ink-300">
                        {subject ? subject.name : 'General'}
                      </span>
                      <h3 className="font-bold text-white text-base leading-snug">
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.type === 'reto' && (
                      <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-300 text-[11px] font-bold">
                        <Trophy size={11} /> Reto (+{task.points} pts)
                      </span>
                    )}
                    {isReviewed && (
                      <span className="chip border-mint-400/30 bg-mint-400/15 text-mint-400 text-[11px]">
                        Revisada ({task.review?.grade}/10)
                      </span>
                    )}
                    {isSubmitted && (
                      <span className="chip border-iris-400/30 bg-iris-500/15 text-iris-300 text-[11px]">
                        Entregada
                      </span>
                    )}
                    {isPending && (
                      <span className="chip border-white/10 bg-white/5 text-ink-300 text-[11px]">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs md:text-sm text-ink-200 leading-relaxed">
                  {task.description}
                </p>

                {/* Evidencia registrada */}
                {task.evidence && (
                  <div className="mt-3 rounded-2xl border border-white/5 bg-ink-950/40 p-3 space-y-1 text-xs">
                    <p className="font-semibold text-iris-300 flex items-center gap-1">
                      <FileEdit size={12} /> Evidencia entregada:
                    </p>
                    <p className="text-ink-200 italic">“{task.evidence.notes}”</p>
                    {task.evidence.link && (
                      <a
                        href={task.evidence.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-mint-400 hover:underline pt-1"
                      >
                        <ExternalLink size={11} /> Ver enlace adjunto
                      </a>
                    )}
                  </div>
                )}

                {/* Calificación / Retroalimentación del Tutor */}
                {task.review && (
                  <div className="mt-3 rounded-2xl border border-mint-400/20 bg-mint-400/5 p-3 space-y-1 text-xs">
                    <p className="font-bold text-mint-400 flex items-center gap-1">
                      <Award size={13} /> Calificación: {task.review.grade} / 10
                    </p>
                    {task.review.feedback && (
                      <p className="text-ink-200">
                        <strong>Comentarios de {state.profile.tutor}:</strong> {task.review.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Pie con fecha límite y botones de acción */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs">
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    days < 0
                      ? 'text-rose-400'
                      : days <= 1
                      ? 'text-amber-400'
                      : 'text-ink-300'
                  }`}
                >
                  <CalendarDays size={13} />
                  {days < 0
                    ? `Venció hace ${-days} d`
                    : days === 0
                    ? 'Vence hoy'
                    : `Vence ${formatDate(task.dueDate)}`}
                </span>

                <div className="flex items-center gap-2">
                  {isTutor ? (
                    <>
                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(task)}
                          className="btn btn-mint px-3 py-1 text-xs"
                        >
                          Calificar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta tarea?')) {
                            actions.deleteTask(task.id)
                          }
                        }}
                        className="btn btn-ghost px-2 py-1 text-rose-300 hover:bg-rose-500/20"
                        title="Eliminar tarea"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmit(task)}
                      className={`btn text-xs px-3 py-1.5 font-bold ${
                        isReviewed
                          ? 'btn-ghost'
                          : isSubmitted
                          ? 'btn-ghost border-iris-400/30 text-iris-300'
                          : 'btn-primary'
                      }`}
                    >
                      <UploadCloud size={14} />
                      {isReviewed ? 'Ver evidencia' : isSubmitted ? 'Editar entrega' : 'Entregar evidencia'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredTasks.length === 0 && (
          <div className="card p-12 text-center sm:col-span-2">
            <Trophy size={36} className="mx-auto text-mint-400 opacity-60 mb-2" />
            <p className="font-bold text-white">No hay tareas o retos en esta categoría.</p>
            <p className="text-xs text-ink-300 mt-1">¡Buen trabajo al día con tus actividades!</p>
          </div>
        )}
      </div>

      {/* ──────────────── MODAL DE ENTREGA (ESTUDIANTE) ──────────────── */}
      <Modal
        open={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Entregar evidencia de tarea"
        subtitle={activeTask?.title}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-mint font-bold"
              onClick={handleSaveSubmit}
            >
              <Send size={15} /> Confirmar entrega
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Notas de tu entrega / procedimiento</label>
            <textarea
              className="input leading-relaxed"
              rows={4}
              placeholder="Explica cómo resolviste los problemas o los hallazgos principales..."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Enlace a fotos / documento de Drive (opcional)</label>
            <input
              type="url"
              className="input"
              placeholder="https://drive.google.com/..."
              value={evidenceLink}
              onChange={(e) => setEvidenceLink(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Autoevaluación: ¿Qué tan segura te sentiste? (1 a 5 estrellas)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelfRating(star)}
                  className={`p-2 rounded-xl transition ${
                    star <= selfRating ? 'text-amber-400 bg-amber-400/10' : 'text-ink-400 bg-white/5'
                  }`}
                >
                  <Star size={20} fill={star <= selfRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ──────────────── MODAL DE REVISIÓN (TUTOR) ──────────────── */}
      <Modal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Calificar y retroalimentar"
        subtitle={activeTask?.title}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-mint font-bold"
              onClick={handleSaveReview}
            >
              Guardar calificación
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-ink-950/50 p-4 space-y-2 text-xs">
            <p className="font-bold text-iris-300">Evidencia de {state.profile.student}:</p>
            <p className="text-white italic">“{activeTask?.evidence?.notes}”</p>
            {activeTask?.evidence?.link && (
              <a
                href={activeTask.evidence.link}
                target="_blank"
                rel="noreferrer"
                className="text-mint-400 flex items-center gap-1 hover:underline pt-1"
              >
                <ExternalLink size={12} /> Abrir enlace adjunto
              </a>
            )}
          </div>

          <div>
            <label className="label">Calificación (0 a 10)</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              className="input w-32"
              value={reviewGrade}
              onChange={(e) => setReviewGrade(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Consejos / Retroalimentación para {state.profile.student}</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Ej. ¡Excelente esfuerzo! Ojo con la ley de signos en el ejercicio 3..."
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* ──────────────── MODAL DE CREACIÓN DE TAREA (TUTOR) ──────────────── */}
      <Modal
        open={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Asignar nueva tarea o reto"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-mint font-bold"
              onClick={handleCreateTask}
            >
              Asignar actividad
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Título de la actividad</label>
            <input
              type="text"
              className="input"
              placeholder="Ej. 10 problemas de despeje de fórmulas"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Instrucciones detalladas</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Detalla qué debe hacer, en qué cuaderno o qué páginas..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Materia</label>
              <select
                className="input"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
              >
                <option value="general">General / Mixto</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tipo de actividad</label>
              <select
                className="input"
                value={newTaskType}
                onChange={(e) => setNewTaskType(e.target.value)}
              >
                <option value="tarea">Tarea normal</option>
                <option value="reto">Reto especial (+ puntos)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Días para entregar</label>
              <input
                type="number"
                min={1}
                max={30}
                className="input"
                value={newTaskDays}
                onChange={(e) => setNewTaskDays(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Puntos otorgados</label>
              <input
                type="number"
                min={5}
                max={100}
                step={5}
                className="input"
                value={newTaskPoints}
                onChange={(e) => setNewTaskPoints(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
