/**
 * Zona de Tareas y Libreta para Estudiante (Ingrid) y Tutor (Brian):
 * - Estudiante (Ingrid): ve claramente sus tareas asignadas con fecha límite, y al hacer clic en "📸 Entregar libreta",
 *   puede adjuntar fotos de su cuaderno (con la cámara del celular o archivo) y dejar notas de dudas.
 * - Tutor (Brian): puede abrir el Banco de Tareas ECOEMS con 1 clic para asignarlas, revisar las fotos de libreta entregadas
 *   y ponerle calificación de 1 a 10 con comentarios de retroalimentación.
 * - REGLA OBLIGATORIA: El indicador de dificultad (fácil/medio/difícil) es EXCLUSIVO para Brian; Ingrid NUNCA lo ve.
 */
import { useMemo, useState } from 'react'
import {
  Award, CalendarDays, Camera, CheckCircle2, ChevronRight, Clock,
  Eye, FileText, Image as ImageIcon, Plus, Send, Sparkles, Star,
  Trash2, Trophy, UploadCloud, X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { TASK_CATALOG, DIFFICULTY_CONFIG } from '../data/taskCatalog'
import { daysFromNow, daysUntil, formatDate, toDateKey } from '../lib/date'
import { Modal } from '../components/ui/Modal'
import { SubjectIcon } from '../components/ui/Icon'

export default function Tasks() {
  const { state, actions, isTutor, toast } = useApp()
  const [activeFilter, setActiveFilter] = useState('todas') // 'todas' | 'pendientes' | 'entregadas' | 'revisadas'

  // Modal de entrega para Ingrid
  const [submitTask, setSubmitTask] = useState(null)
  const [evidenceNotes, setEvidenceNotes] = useState('')
  const [evidencePhoto, setEvidencePhoto] = useState(null)

  // Modal de calificación para Brian (Tutor)
  const [reviewTask, setReviewTask] = useState(null)
  const [reviewGrade, setReviewGrade] = useState(10)
  const [reviewFeedback, setReviewFeedback] = useState('')

  // Modal de catálogo de tareas para Brian (Tutor)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [catalogSubjectFilter, setCatalogSubjectFilter] = useState('todas')
  const [catalogDifficultyFilter, setCatalogDifficultyFilter] = useState('todas') // 'todas' | 'facil' | 'medio' | 'dificil'
  const [selectedCatalogTask, setSelectedCatalogTask] = useState(null)
  const [customDays, setCustomDays] = useState(3)
  const [customPoints, setCustomPoints] = useState(25)

  // Modal para crear tarea personalizada (Brian)
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSub, setNewSub] = useState('matematicas')
  const [newDiff, setNewDiff] = useState('medio')
  const [newDays, setNewDays] = useState(3)
  const [newPoints, setNewPoints] = useState(25)

  // Visor de foto de libreta en pantalla completa
  const [previewPhoto, setPreviewPhoto] = useState(null)

  const tasks = state.tasks

  // Conteo de tareas
  const counts = useMemo(() => {
    return {
      todas: tasks.length,
      pendientes: tasks.filter((t) => t.status === 'pendiente').length,
      entregadas: tasks.filter((t) => t.status === 'entregada').length,
      revisadas: tasks.filter((t) => t.status === 'revisada').length,
    }
  }, [tasks])

  // Tareas filtradas
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'pendientes') return tasks.filter((t) => t.status === 'pendiente')
    if (activeFilter === 'entregadas') return tasks.filter((t) => t.status === 'entregada')
    if (activeFilter === 'revisadas') return tasks.filter((t) => t.status === 'revisada')
    return tasks
  }, [tasks, activeFilter])

  // Catálogo de tareas filtrado (por materia y dificultad, solo tutor)
  const filteredCatalog = useMemo(() => {
    return TASK_CATALOG.filter((t) => {
      const matchSubject = catalogSubjectFilter === 'todas' || t.subjectId === catalogSubjectFilter
      const matchDiff = catalogDifficultyFilter === 'todas' || t.difficulty === catalogDifficultyFilter
      return matchSubject && matchDiff
    })
  }, [catalogSubjectFilter, catalogDifficultyFilter])

  // 1. Abrir entrega de Ingrid
  const handleOpenSubmit = (task) => {
    setSubmitTask(task)
    setEvidenceNotes(task.evidence?.notes || '')
    setEvidencePhoto(task.evidence?.photo || null)
  }

  // Leer foto de libreta de Ingrid
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ tone: 'warning', title: 'La foto es muy pesada. Elige una de menos de 5MB.' })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setEvidencePhoto(event.target.result)
      toast({ tone: 'success', title: '¡Foto de libreta adjuntada! 📸' })
    }
    reader.readAsDataURL(file)
  }

  // Guardar entrega de Ingrid
  const handleSaveSubmit = () => {
    if (!evidenceNotes.trim() && !evidencePhoto) {
      toast({ tone: 'warning', title: 'Escribe una nota o adjunta la foto de tu libreta.' })
      return
    }

    actions.updateTask(
      submitTask.id,
      {
        status: 'entregada',
        evidence: {
          notes: evidenceNotes,
          photo: evidencePhoto,
          submittedAt: toDateKey(),
        },
      },
      true // Suma racha
    )

    setSubmitTask(null)
    toast({
      tone: 'success',
      title: '¡Tarea entregada! 🎉',
      description: `${state.profile.tutor} ya puede revisar tu libreta y dejarte comentarios.`,
    })
  }

  // 2. Abrir calificación de Brian
  const handleOpenReview = (task) => {
    setReviewTask(task)
    setReviewGrade(task.review?.grade ?? 10)
    setReviewFeedback(task.review?.feedback ?? '')
  }

  // Guardar calificación de Brian
  const handleSaveReview = () => {
    if (!reviewTask) return

    actions.updateTask(reviewTask.id, {
      status: 'revisada',
      review: {
        grade: Number(reviewGrade),
        feedback: reviewFeedback,
        reviewedAt: toDateKey(),
      },
    })

    setReviewTask(null)
    toast({
      tone: 'success',
      title: 'Tarea calificada',
      description: `Ingrid verá su calificación de ${reviewGrade}/10.`,
    })
  }

  // 3. Asignar tarea desde el catálogo para Brian
  const handleAssignCatalogTask = () => {
    if (!selectedCatalogTask) return

    actions.addTask({
      title: selectedCatalogTask.title,
      description: selectedCatalogTask.description,
      subjectId: selectedCatalogTask.subjectId,
      difficulty: selectedCatalogTask.difficulty, // Solo visible para el tutor
      type: selectedCatalogTask.type,
      points: Number(customPoints),
      dueDate: daysFromNow(Number(customDays)),
    })

    setSelectedCatalogTask(null)
    setIsCatalogOpen(false)
    toast({
      tone: 'success',
      title: '¡Tarea asignada con éxito! 🚀',
      description: `Asignaste "${selectedCatalogTask.title}" a Ingrid.`,
    })
  }

  // 4. Crear tarea personalizada desde cero para Brian
  const handleCreateCustomTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      toast({ tone: 'warning', title: 'Escribe un título para la tarea' })
      return
    }

    actions.addTask({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Resolver los ejercicios en tu libreta y adjuntar foto.',
      subjectId: newSub,
      difficulty: newDiff,
      type: 'ejercicios',
      points: Number(newPoints),
      dueDate: daysFromNow(Number(newDays)),
    })

    setNewTitle('')
    setNewDesc('')
    setIsCustomOpen(false)
    toast({
      tone: 'success',
      title: 'Tarea creada',
      description: 'Quedó asignada en la libreta de Ingrid.',
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      {/* ───────── ENCABEZADO Y BOTONES DE ACCIÓN ───────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-black text-indigo-700">
            <CheckCircle2 size={13} /> {isTutor ? 'Supervisión de Tareas' : 'Mis Tareas y Cuaderno'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {isTutor ? 'Tareas y Calificaciones de Ingrid' : 'Mis Tareas de Estudio'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isTutor
              ? 'Asigna actividades del banco ECOEMS, revisa las fotos de libreta que sube Ingrid y asígnale calificación.'
              : `Aquí tienes las tareas asignadas por ${state.profile.tutor}. Sube una foto de tu cuaderno para que te las califique.`}
          </p>
        </div>

        {/* Botones de acción exclusiva para Brian */}
        {isTutor && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCustomOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs shrink-0"
            >
              <FileText size={15} /> Redactar libre
            </button>

            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-200 transition cursor-pointer shrink-0"
            >
              <Plus size={16} /> + Banco ECOEMS ({TASK_CATALOG.length})
            </button>
          </div>
        )}
      </div>

      {/* ───────── FILTROS DE TAREAS ───────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter('todas')}
          className={`rounded-2xl px-4 py-2 font-bold transition cursor-pointer border ${
            activeFilter === 'todas'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          Todas ({counts.todas})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('pendientes')}
          className={`rounded-2xl px-4 py-2 font-bold transition cursor-pointer border ${
            activeFilter === 'pendientes'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          {isTutor ? 'Pendientes de Ingrid' : 'Por hacer'} ({counts.pendientes})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('entregadas')}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 font-bold transition cursor-pointer border ${
            activeFilter === 'entregadas'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
              : counts.entregadas > 0
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          <span>Por calificar</span>
          {counts.entregadas > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-slate-950">
              {counts.entregadas}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('revisadas')}
          className={`rounded-2xl px-4 py-2 font-bold transition cursor-pointer border ${
            activeFilter === 'revisadas'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          Revisadas ({counts.revisadas})
        </button>
      </div>

      {/* ───────── LISTA DE TAREAS ───────── */}
      <div className="space-y-3.5">
        {filteredTasks.map((task) => {
          const days = daysUntil(task.dueDate)
          const isPending = task.status === 'pendiente'
          const isSubmitted = task.status === 'entregada'
          const isReviewed = task.status === 'revisada'
          const subject = SUBJECT_MAP[task.subjectId]

          return (
            <div
              key={task.id}
              className={`rounded-3xl p-5 sm:p-6 space-y-4 border transition-all shadow-xs ${
                isReviewed
                  ? 'border-emerald-200 bg-emerald-50/25'
                  : isSubmitted
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Encabezado de la tarjeta */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black" style={{ color: subject?.color || '#4f46e5' }}>
                      {subject?.name || 'General ECOEMS'}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-black border ${
                        isReviewed
                          ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                          : isSubmitted
                          ? 'border-amber-300 bg-amber-100 text-amber-900'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isReviewed
                        ? `✓ Calificada (${task.review?.grade}/10 ⭐)`
                        : isSubmitted
                        ? 'Entregada • Esperando revisión'
                        : 'Por hacer'}
                    </span>

                    {/* Indicador de dificultad: SOLO VISIBLE PARA BRIAN (TUTOR) */}
                    {isTutor && task.difficulty && DIFFICULTY_CONFIG[task.difficulty] && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${DIFFICULTY_CONFIG[task.difficulty].badge}`}
                        title="Nivel de dificultad (Solo visible para ti como tutor)"
                      >
                        Nivel: {DIFFICULTY_CONFIG[task.difficulty].label}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {task.description}
                  </p>
                </div>

                {/* Botón para borrar tarea (solo Brian/Tutor) */}
                {isTutor && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
                        actions.deleteTask(task.id)
                        toast({ tone: 'info', title: 'Tarea eliminada' })
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-xl hover:bg-rose-50 cursor-pointer"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Evidencia entregada por Ingrid (notas + foto de libreta) */}
              {task.evidence && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Evidencia entregada por Ingrid:</span>
                  </p>

                  {task.evidence.notes && (
                    <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      “{task.evidence.notes}”
                    </p>
                  )}

                  {task.evidence.photo && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={task.evidence.photo}
                        alt="Miniatura libreta"
                        className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 transition"
                        onClick={() => setPreviewPhoto(task.evidence.photo)}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewPhoto(task.evidence.photo)}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        <ImageIcon size={15} /> Ver foto de libreta en pantalla completa 🔍
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Comentarios y calificación del Tutor */}
              {task.review && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Star size={15} fill="currentColor" className="text-amber-500" />
                      Calificación de {state.profile.tutor}:
                    </p>
                    <span className="rounded-xl bg-white px-3 py-1 font-black text-emerald-700 text-sm border border-emerald-200 shadow-xs">
                      {task.review.grade} / 10 ⭐
                    </span>
                  </div>
                  {task.review.feedback && (
                    <p className="text-slate-700 mt-1 leading-relaxed">
                      <strong className="text-slate-900">Mensaje de Brian:</strong> {task.review.feedback}
                    </p>
                  )}
                </div>
              )}

              {/* Pie de tarea con acciones */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className={`font-semibold ${days <= 1 && isPending ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                  {isReviewed
                    ? 'Completada y revisada'
                    : days < 0
                    ? `Venció hace ${-days} días`
                    : days === 0
                    ? '¡Vence hoy!'
                    : `Entrega antes del ${formatDate(task.dueDate)}`}
                </span>

                <div className="flex items-center gap-2">
                  {/* Acciones para Brian (Tutor) */}
                  {isTutor && (
                    <>
                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(task)}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 transition cursor-pointer text-xs shadow-xs"
                        >
                          <Star size={14} fill="currentColor" /> Revisar libreta y calificar
                        </button>
                      )}
                      {isReviewed && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(task)}
                          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 transition cursor-pointer text-xs"
                        >
                          Modificar calificación
                        </button>
                      )}
                    </>
                  )}

                  {/* Acciones para Ingrid (Estudiante) */}
                  {!isTutor && (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmit(task)}
                      className={`flex items-center gap-1.5 rounded-2xl px-5 py-2.5 font-black text-xs transition cursor-pointer shadow-xs ${
                        isReviewed
                          ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          : isSubmitted
                          ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      }`}
                    >
                      <Camera size={15} />
                      {isReviewed ? 'Ver mi entrega' : isSubmitted ? 'Editar foto de libreta' : '📸 Entregar foto de mi libreta'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredTasks.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-2 shadow-xs">
            <p className="font-bold text-slate-900 text-base">No hay tareas en esta sección.</p>
            <p className="text-xs text-slate-500">
              {isTutor
                ? 'Puedes asignarle una tarea prediseñada a Ingrid usando el botón de arriba.'
                : '¡Vas al día con tus actividades! Tómate un descanso o haz un quiz.'}
            </p>
          </div>
        )}
      </div>

      {/* ───────────────── MODAL: INGRID SUBE FOTO DE LIBRETA ───────────────── */}
      <Modal
        open={Boolean(submitTask)}
        onClose={() => setSubmitTask(null)}
        title="Entregar foto de tu libreta"
        subtitle={submitTask?.title}
        footer={
          <>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={() => setSubmitTask(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-black text-white cursor-pointer shadow-md shadow-emerald-200"
              onClick={handleSaveSubmit}
            >
              <Send size={14} /> Enviar foto a {state.profile.tutor}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Subir foto desde cámara de celular o PC */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block">
              Foto de tu libreta con los ejercicios resueltos:
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:border-indigo-400 transition">
              {evidencePhoto ? (
                <div className="space-y-3 w-full text-center">
                  <img
                    src={evidencePhoto}
                    alt="Foto de libreta"
                    className="max-h-52 rounded-xl mx-auto object-cover border border-slate-200 shadow-md cursor-pointer"
                    onClick={() => setPreviewPhoto(evidencePhoto)}
                  />
                  <div className="flex justify-center gap-2">
                    <label className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs">
                      Tomar otra foto
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEvidencePhoto(null)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      Quitar foto
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer py-5 w-full text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      Toma una foto de tu cuaderno o elígela de tu galería
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      (PNG o JPG, máximo 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Notas de dudas o comentarios */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 block">
              Comentarios o dudas que tuviste (opcional):
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
              rows={3}
              placeholder="Ej. Terminé los 15 ejercicios. El 4 me costó un poco de trabajo..."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* ───────────────── MODAL: BRIAN CALIFICA Y REVISA LIBRETA ───────────────── */}
      <Modal
        open={Boolean(reviewTask)}
        onClose={() => setReviewTask(null)}
        title="Revisión de Libreta"
        subtitle={reviewTask?.title}
        footer={
          <>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={() => setReviewTask(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-black text-white cursor-pointer shadow-md shadow-indigo-200"
              onClick={handleSaveReview}
            >
              Guardar Calificación
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Instrucciones originales de la tarea */}
          {reviewTask?.description && (
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Instrucciones que le diste a Ingrid:</p>
              <p className="text-slate-800 text-xs leading-relaxed">{reviewTask.description}</p>
            </div>
          )}

          {/* Muestra foto de libreta si existe */}
          {reviewTask?.evidence?.photo && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 block">Foto de la libreta enviada por Ingrid:</label>
              <div className="text-center rounded-2xl bg-slate-50 p-2.5 border border-slate-200">
                <img
                  src={reviewTask.evidence.photo}
                  alt="Libreta de Ingrid"
                  className="max-h-60 mx-auto rounded-xl object-contain cursor-pointer hover:opacity-95 transition"
                  onClick={() => setPreviewPhoto(reviewTask.evidence.photo)}
                />
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(reviewTask.evidence.photo)}
                  className="text-xs text-indigo-600 font-bold hover:underline mt-2 inline-block cursor-pointer"
                >
                  Ver en pantalla completa 🔍
                </button>
              </div>
            </div>
          )}

          {reviewTask?.evidence?.notes && (
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Nota de Ingrid:</p>
              <p className="text-slate-800 italic">“{reviewTask.evidence.notes}”</p>
            </div>
          )}

          {/* Calificación de 1 a 10 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900">Calificación:</label>
              <span className="rounded-xl bg-indigo-100 px-3 py-1 text-sm font-black text-indigo-700 border border-indigo-200">
                {reviewGrade} / 10 ⭐
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="10"
              step="1"
              value={reviewGrade}
              onChange={(e) => setReviewGrade(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Comentarios de retroalimentación */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 block">
              Mensaje o consejos de mejora para Ingrid:
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
              rows={3}
              placeholder="Ej. ¡Excelente letra y orden! Recuerda cuidar los signos en el ejercicio 3."
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* ───────────────── MODAL: CATÁLOGO DE TAREAS ECOEMS (BRIAN) ───────────────── */}
      <Modal
        open={isCatalogOpen}
        onClose={() => {
          setIsCatalogOpen(false)
          setSelectedCatalogTask(null)
        }}
        title="Catálogo de Tareas ECOEMS / COMIPEMS"
        subtitle="Selecciona una tarea ya preparada para asignarla a Ingrid en 1 clic"
      >
        <div className="space-y-4">
          {/* Selector de materias para filtrar el catálogo */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setCatalogSubjectFilter('todas')}
              className={`rounded-xl px-3 py-1.5 font-bold transition cursor-pointer shrink-0 ${
                catalogSubjectFilter === 'todas'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCatalogSubjectFilter(s.id)}
                className={`rounded-xl px-3 py-1.5 font-bold transition cursor-pointer shrink-0 ${
                  catalogSubjectFilter === s.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Filtro por nivel de dificultad (Solo visible para el tutor Brian) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] text-slate-500 font-bold">Nivel (solo tú lo ves):</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'todas', label: 'Todos los niveles' },
                { id: 'facil', label: 'Fácil' },
                { id: 'medio', label: 'Medio' },
                { id: 'dificil', label: 'Difícil' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setCatalogDifficultyFilter(d.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    catalogDifficultyFilter === d.id
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de tareas prediseñadas */}
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {filteredCatalog.map((task) => {
              const subject = SUBJECT_MAP[task.subjectId]
              const isSelected = selectedCatalogTask?.id === task.id

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedCatalogTask(task)
                    setCustomDays(task.days || 3)
                    setCustomPoints(task.points || 25)
                  }}
                  className={`rounded-2xl p-3.5 border transition cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold" style={{ color: subject?.color || '#4f46e5' }}>
                        {subject?.name} • {task.ecoemsKey}
                      </span>
                      {/* Indicador de dificultad (SOLO visible para ti) */}
                      {task.difficulty && DIFFICULTY_CONFIG[task.difficulty] && (
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${DIFFICULTY_CONFIG[task.difficulty].badge}`}>
                          {DIFFICULTY_CONFIG[task.difficulty].label}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-700 font-bold shrink-0">
                      +{task.points} pts
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Panel de confirmación y ajuste de días */}
          {selectedCatalogTask && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Tarea seleccionada:</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-indigo-700 font-semibold">{selectedCatalogTask.title}</p>
                    {selectedCatalogTask.difficulty && DIFFICULTY_CONFIG[selectedCatalogTask.difficulty] && (
                      <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold border ${DIFFICULTY_CONFIG[selectedCatalogTask.difficulty].badge}`}>
                        {DIFFICULTY_CONFIG[selectedCatalogTask.difficulty].label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-600 font-semibold">Días:</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-14 rounded-xl border border-slate-300 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAssignCatalogTask}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-200 transition cursor-pointer"
              >
                ✓ Asignar esta tarea a Ingrid ahora
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* ───────────────── MODAL: CREAR TAREA PERSONALIZADA (BRIAN) ───────────────── */}
      <Modal
        open={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        title="Redactar Tarea Personalizada"
        subtitle="Asigna una actividad libre a Ingrid con fecha de entrega y puntos"
      >
        <form onSubmit={handleCreateCustomTask} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="label">Título de la actividad *</label>
            <input
              type="text"
              required
              placeholder="Ej. Resolver ejercicios 1 al 10 de la guía impresa"
              className="input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Materia</label>
              <select
                className="input"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                Nivel <span className="text-amber-600 font-normal lowercase">(solo tú lo ves)</span>
              </label>
              <select
                className="input"
                value={newDiff}
                onChange={(e) => setNewDiff(e.target.value)}
              >
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Instrucciones</label>
            <textarea
              rows={3}
              placeholder="Ej. Realizar en libreta a mano con procedimiento claro y subir foto de la página."
              className="input"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Días de plazo</label>
              <input
                type="number"
                min="1"
                max="14"
                className="input text-center font-bold"
                value={newDays}
                onChange={(e) => setNewDays(e.target.value)}
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Vence el {formatDate(daysFromNow(Number(newDays)))}
              </span>
            </div>

            <div>
              <label className="label">Puntos</label>
              <input
                type="number"
                min="10"
                max="50"
                step="5"
                className="input text-center font-bold"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="btn btn-ghost px-4 py-2 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 text-xs font-black shadow-md cursor-pointer"
            >
              ✓ Asignar Tarea
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────── VISOR DE FOTO EN PANTALLA COMPLETA ───────────────── */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setPreviewPhoto(null)}
        >
          <img
            src={previewPhoto}
            alt="Foto ampliada de libreta"
            className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl border border-white/20"
          />
        </div>
      )}
    </div>
  )
}
