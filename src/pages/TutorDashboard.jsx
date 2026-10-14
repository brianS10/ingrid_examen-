/**
 * Panel de Control del Tutor (Brian):
 * Vista exclusiva cuando inicia sesión el administrador/tutor.
 * - Resumen rápido de cómo va Ingrid (temas listos, quizzes hechos, tareas entregadas).
 * - Banco de Tareas y Retos ECOEMS listos para asignar con 1 solo clic.
 * - Bandeja para revisar tareas entregadas con fotos de su libreta y dejarle calificación/comentarios.
 * - Selector rápido para cambiar el tema sugerido del día.
 */
import { useMemo, useState } from 'react'
import {
  Award, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock,
  ExternalLink, Eye, FileText, Image as ImageIcon, MessageSquare,
  Plus, Send, Sparkles, Star, UserCheck, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP, ALL_TOPICS } from '../data/subjects'
import { TASK_CATALOG } from '../data/taskCatalog'
import { globalProgress, subjectProgress, masteryBySubject } from '../lib/progress'
import { daysFromNow, daysUntil, formatDate } from '../lib/date'
import { Modal } from '../components/ui/Modal'
import { SubjectIcon } from '../components/ui/Icon'
import { ProgressBar } from '../components/ui/Progress'

export default function TutorDashboard() {
  const { state, actions, toast, navigate } = useApp()
  const [activeTab, setActiveTab] = useState('catalogo') // 'catalogo' | 'asignadas' | 'progreso'

  // Modal para asignar tarea del catálogo
  const [selectedCatalogTask, setSelectedCatalogTask] = useState(null)
  const [customDays, setCustomDays] = useState(3)
  const [customPoints, setCustomPoints] = useState(25)

  // Modal para revisar entrega
  const [reviewingTask, setReviewingTask] = useState(null)
  const [reviewGrade, setReviewGrade] = useState(10)
  const [reviewComment, setReviewComment] = useState('')

  // Modal de imagen ampliada de la libreta
  const [previewImage, setPreviewImage] = useState(null)

  const global = useMemo(() => globalProgress(state), [state])
  const weakSubjects = useMemo(() => masteryBySubject(state).slice(0, 3), [state])
  const pendingReviews = state.tasks.filter((t) => t.status === 'entregada')
  const assignedTasks = state.tasks

  // Asignar tarea desde el catálogo
  const handleAssignFromCatalog = () => {
    if (!selectedCatalogTask) return

    actions.addTask({
      title: selectedCatalogTask.title,
      description: selectedCatalogTask.description,
      subjectId: selectedCatalogTask.subjectId,
      type: selectedCatalogTask.type,
      points: Number(customPoints),
      dueDate: daysFromNow(Number(customDays)),
    })

    setSelectedCatalogTask(null)
    toast({
      tone: 'success',
      title: '¡Tarea asignada a Ingrid!',
      description: `Fecha de entrega: en ${customDays} días. Ya le aparece en su lista.`,
    })
  }

  // Guardar calificación
  const handleSaveReview = () => {
    if (!reviewingTask) return

    actions.updateTask(reviewingTask.id, {
      status: 'revisada',
      review: {
        grade: Number(reviewGrade),
        feedback: reviewComment,
      },
    })

    setReviewingTask(null)
    toast({
      tone: 'success',
      title: 'Tarea calificada',
      description: `Ingrid verá su calificación de ${reviewGrade}/10 y tus comentarios.`,
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ───────── 1. ENCABEZADO DEL TUTOR ───────── */}
      <div className="card p-6 bg-linear-to-r from-iris-600/15 via-ink-850 to-mint-500/10 border-iris-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="chip border-iris-400/30 bg-iris-500/20 text-iris-300 font-bold text-[11px]">
              Panel de Asesoría ECOEMS / COMIPEMS
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              Monitoreo de {state.profile.student}
            </h1>
            <p className="text-xs text-ink-300">
              Aquí puedes asignarle tareas con 1 clic de nuestro catálogo, revisar fotos de su libreta y ver en qué materias va floja.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('catalogo')}
              className={`btn text-xs font-bold ${activeTab === 'catalogo' ? 'btn-primary' : 'btn-ghost'}`}
            >
              + Asignar Tarea Lista
            </button>
          </div>
        </div>

        {/* Resumen de salud académica */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/8 text-center">
          <div className="bg-ink-950/40 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">Temas listos</p>
            <p className="text-xl font-extrabold text-mint-400 mt-0.5">{global.dominado} / {global.total}</p>
          </div>
          <div className="bg-ink-950/40 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">Por revisar</p>
            <p className={`text-xl font-extrabold mt-0.5 ${pendingReviews.length ? 'text-amber-400' : 'text-white'}`}>
              {pendingReviews.length} entregas
            </p>
          </div>
          <div className="bg-ink-950/40 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">Quizzes hechos</p>
            <p className="text-xl font-extrabold text-iris-300 mt-0.5">{state.history.length}</p>
          </div>
          <div className="bg-ink-950/40 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">Días seguidos</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{state.streak.count} días</p>
          </div>
        </div>
      </div>

      {/* ───────── 2. BANDEJA DE ENTREGAS PENDIENTES DE REVISIÓN ───────── */}
      {pendingReviews.length > 0 && (
        <section className="card p-5 border-amber-400/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <FileText size={16} /> {state.profile.student} ha entregado {pendingReviews.length} tarea(s) para calificar:
            </h2>
          </div>

          <div className="space-y-2">
            {pendingReviews.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/8 bg-ink-950/60"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-bold text-white truncate">{task.title}</p>
                  <p className="text-xs text-ink-300">
                    Materia: {SUBJECT_MAP[task.subjectId]?.name || 'General'}
                    {task.evidence?.photo && ' • Contiene foto de libreta 📸'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReviewingTask(task)
                    setReviewGrade(10)
                    setReviewComment('')
                  }}
                  className="btn btn-mint text-xs font-bold px-4 py-2"
                >
                  Revisar y Calificar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── 3. PESTAÑAS: CATÁLOGO vs TAREAS ASIGNADAS ───────── */}
      <div className="flex gap-2 border-b border-white/8 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalogo')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'catalogo'
              ? 'bg-iris-500 text-white'
              : 'text-ink-300 hover:text-white hover:bg-white/5'
          }`}
        >
          📚 Banco de Tareas ECOEMS (Listas para Asignar)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('asignadas')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'asignadas'
              ? 'bg-iris-500 text-white'
              : 'text-ink-300 hover:text-white hover:bg-white/5'
          }`}
        >
          📋 Tareas Asignadas a Ingrid ({assignedTasks.length})
        </button>
      </div>

      {/* ───────── PESTAÑA A: CATÁLOGO DE TAREAS LISTAS ───────── */}
      {activeTab === 'catalogo' && (
        <section className="space-y-3 animate-fade-up">
          <p className="text-xs text-ink-300">
            Selecciona una actividad prediseñada según el tema que quieras que refuerce Ingrid esta semana.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {TASK_CATALOG.map((cat) => {
              const subject = SUBJECT_MAP[cat.subjectId]
              const alreadyAssigned = state.tasks.some((t) => t.title === cat.title)

              return (
                <div
                  key={cat.id}
                  className="card p-4 flex flex-col justify-between space-y-3 border border-white/8 hover:border-white/20 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: subject?.color }}>
                        {subject?.name}
                      </span>
                      <span className="chip border-white/10 bg-white/5 text-[10px] text-ink-200">
                        {cat.ecoemsKey}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-ink-300 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/6 text-xs">
                    <span className="text-ink-300">
                      Sugerido: <strong className="text-white">{cat.days} días</strong> (+{cat.points} pts)
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCatalogTask(cat)
                        setCustomDays(cat.days)
                        setCustomPoints(cat.points)
                      }}
                      className="btn btn-mint text-xs px-3.5 py-1.5 font-bold"
                    >
                      {alreadyAssigned ? 'Asignar de nuevo' : 'Asignar a Ingrid'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ───────── PESTAÑA B: TAREAS ASIGNADAS ───────── */}
      {activeTab === 'asignadas' && (
        <section className="space-y-3 animate-fade-up">
          {assignedTasks.map((t) => {
            const days = daysUntil(t.dueDate)
            const subject = SUBJECT_MAP[t.subjectId]
            return (
              <div
                key={t.id}
                className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/8"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: subject?.color }}>
                      {subject?.name || 'General'}
                    </span>
                    <span
                      className={`chip text-[10px] ${
                        t.status === 'revisada'
                          ? 'border-mint-400/30 bg-mint-400/10 text-mint-300'
                          : t.status === 'entregada'
                          ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                          : 'border-white/10 bg-white/5 text-ink-300'
                      }`}
                    >
                      {t.status === 'revisada' ? `Calificada (${t.review?.grade}/10)` : t.status === 'entregada' ? 'Entregada por Ingrid' : 'Pendiente'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate">{t.title}</h3>
                  <p className="text-xs text-ink-300 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0">
                  {t.status === 'entregada' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewingTask(t)
                        setReviewGrade(10)
                        setReviewComment('')
                      }}
                      className="btn btn-mint text-xs px-3 py-1.5 font-bold"
                    >
                      Calificar
                    </button>
                  )}
                  {t.status === 'revisada' && (
                    <button
                      type="button"
                      onClick={() => setReviewingTask(t)}
                      className="btn btn-ghost text-xs px-3 py-1.5 font-bold text-ink-200"
                    >
                      Ver entrega
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Eliminar esta tarea?')) actions.deleteTask(t.id)
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* ───────────────── MODAL: CONFIRMAR ASIGNACIÓN DESDE CATÁLOGO ───────────────── */}
      <Modal
        open={!!selectedCatalogTask}
        onClose={() => setSelectedCatalogTask(null)}
        title="Asignar actividad a Ingrid"
        subtitle={selectedCatalogTask?.title}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setSelectedCatalogTask(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-mint font-bold"
              onClick={handleAssignFromCatalog}
            >
              Confirmar y Asignar
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="card bg-ink-950/60 p-4 border border-white/8 space-y-1">
            <p className="font-bold text-white">Instrucciones que verá Ingrid:</p>
            <p className="text-ink-200">{selectedCatalogTask?.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Días para entregar</label>
              <input
                type="number"
                min={1}
                max={15}
                className="input"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
              />
              <span className="text-[11px] text-ink-400 mt-1 block">
                Fecha límite: {formatDate(daysFromNow(Number(customDays)))}
              </span>
            </div>

            <div>
              <label className="label">Puntos que suma</label>
              <input
                type="number"
                min={10}
                max={50}
                step={5}
                className="input"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ───────────────── MODAL: REVISAR ENTREGA & FOTO DE LIBRETA ───────────────── */}
      <Modal
        open={!!reviewingTask}
        onClose={() => setReviewingTask(null)}
        title="Revisar entrega de Ingrid"
        subtitle={reviewingTask?.title}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setReviewingTask(null)}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-mint font-bold"
              onClick={handleSaveReview}
            >
              Guardar Nota y Comentarios
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Evidencia escrita */}
          <div className="card bg-ink-950/60 p-4 border border-white/8 space-y-1.5">
            <p className="font-bold text-mint-300">Notas de Ingrid:</p>
            <p className="text-white italic">
              {reviewingTask?.evidence?.notes || 'Sin notas escritas.'}
            </p>
          </div>

          {/* Foto de la libreta adjuntada por Ingrid */}
          {reviewingTask?.evidence?.photo ? (
            <div className="space-y-2">
              <label className="label flex items-center gap-1.5">
                <ImageIcon size={14} className="text-mint-400" /> Foto de su libreta adjunta:
              </label>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                   onClick={() => setPreviewImage(reviewingTask.evidence.photo)}>
                <img
                  src={reviewingTask.evidence.photo}
                  alt="Libreta de Ingrid"
                  className="w-full max-h-64 object-cover hover:scale-102 transition duration-200"
                />
                <span className="absolute bottom-2 right-2 chip bg-ink-950/80 text-white text-[11px]">
                  🔍 Clic para ampliar foto
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-400 italic">
              Ingrid no adjuntó foto de libreta en esta entrega.
            </p>
          )}

          {/* Calificación y Comentarios del Tutor */}
          <div className="pt-2 border-t border-white/8 space-y-3">
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
              <label className="label">Tus comentarios para ella</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Ej. ¡Excelente procedimiento en el problema 4! Revisa bien el signo en el 2..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Visor de foto a pantalla completa */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Evidencia ampliada" className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  )
}
