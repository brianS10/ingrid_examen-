/**
 * Simulador de Quizzes ECOEMS:
 * Interfaz de preguntas limpia, tipografía grande, amigable, clara y de alto contraste.
 * Funciona tanto para quizzes directos de un tema como para quizzes rápidos y simulacro general.
 */
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  AlertCircle, ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, ChevronRight,
  Clock, Play, RotateCcw, Sparkles, Trophy, XCircle, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { QUESTIONS, OPTION_LETTERS } from '../data/questions'
import { SUBJECTS, SUBJECT_MAP, TOPIC_MAP } from '../data/subjects'
import { formatClock, formatDuration, daysFromNow } from '../lib/date'
import { ProgressBar } from '../components/ui/Progress'
import { RichText } from '../components/ui/RichText'
import { SubjectIcon } from '../components/ui/Icon'

export default function Simulator() {
  const { state, actions, route, toast, navigate } = useApp()
  const [mode, setMode] = useState('config') // 'config' | 'running' | 'results'

  // Contexto de tema (si el quiz fue disparado desde un tema específico)
  const [topicContext, setTopicContext] = useState(null) // { topicId, subjectId, topicTitle }

  // Configuración simplificada
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qId]: optionIndex }
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const timerRef = useRef(null)

  // Iniciar Quiz de un tema específico
  const handleStartTopicQuiz = (topicId, subjectId) => {
    const topic = TOPIC_MAP[topicId]
    const subject = SUBJECT_MAP[subjectId] || SUBJECTS[0]

    // 1. Preguntas de este tema exacto
    const directQuestions = QUESTIONS.filter((q) => q.topicId === topicId)
    // 2. Preguntas de la misma materia para tener un quiz de 5 a 8 reactivos
    const otherQuestions = QUESTIONS.filter(
      (q) => q.subjectId === subject.id && q.topicId !== topicId
    ).sort(() => 0.5 - Math.random())

    const combined = [...directQuestions, ...otherQuestions].slice(0, Math.min(8, Math.max(5, directQuestions.length)))
    const finalSelected = combined.length > 0 ? combined : QUESTIONS.slice(0, 5)

    setTopicContext({
      topicId,
      subjectId: subject.id,
      topicTitle: topic?.title || 'Tema de estudio',
    })
    setActiveQuestions(finalSelected)
    setCurrentIndex(0)
    setAnswers({})
    setElapsedSeconds(0)
    setShowReview(false)
    setMode('running')
  }

  // Iniciar Quiz directo general o por materia
  const handleStartQuickQuiz = (subjectId = 'todos') => {
    setTopicContext(null)
    let pool = QUESTIONS
    if (subjectId !== 'todos') {
      pool = QUESTIONS.filter((q) => q.subjectId === subjectId)
    }

    if (pool.length === 0) {
      toast({ tone: 'warning', title: 'No hay preguntas para esta materia todavía.' })
      return
    }

    // Tomar 10 preguntas aleatorias (o las que haya)
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(10, shuffled.length))

    setActiveQuestions(selected)
    setCurrentIndex(0)
    setAnswers({})
    setElapsedSeconds(0)
    setShowReview(false)
    setMode('running')
  }

  // Sincronizar parámetros de ruta para inicio automático
  useEffect(() => {
    if (route.params.topic) {
      handleStartTopicQuiz(route.params.topic, route.params.subject)
    } else if (route.params.subject && route.params.auto === 'true') {
      handleStartQuickQuiz(route.params.subject)
    }
  }, [route.params.topic, route.params.subject, route.params.auto])

  // Cronómetro suave
  useEffect(() => {
    if (mode === 'running') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [mode])

  // Finalizar Quiz y guardar intento en historial
  const handleFinishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current)

    let correctCount = 0
    const bySubject = {}

    activeQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.answer
      if (isCorrect) correctCount++

      if (!bySubject[q.subjectId]) {
        bySubject[q.subjectId] = { correct: 0, total: 0 }
      }
      bySubject[q.subjectId].total++
      if (isCorrect) bySubject[q.subjectId].correct++
    })

    const attempt = {
      id: `quiz-${Date.now()}`,
      type: 'quiz',
      name: topicContext
        ? `Quiz: ${topicContext.topicTitle} (${activeQuestions.length} reactivos)`
        : `Quiz de práctica (${activeQuestions.length} reactivos)`,
      date: daysFromNow(0),
      correct: correctCount,
      total: activeQuestions.length,
      durationSec: elapsedSeconds,
      bySubject,
    }

    actions.addAttempt(attempt)
    setMode('results')

    const scorePct = Math.round((correctCount / activeQuestions.length) * 100)
    toast({
      tone: scorePct >= 70 ? 'success' : 'info',
      title: `¡Terminaste! Obtuviste ${correctCount} de ${activeQuestions.length} aciertos 🎉`,
    })
  }

  const currentQ = activeQuestions[currentIndex]
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined
  const hasAnsweredCurrent = currentAnswer !== undefined

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ───────────────── 1. PANTALLA PRINCIPAL: 2 OPCIONES FÁCILES ───────────────── */}
      {mode === 'config' && (
        <div className="space-y-6 animate-fade-up">
          <div className="text-center space-y-1.5 py-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700">
              <Zap size={13} fill="currentColor" /> Evaluación Continua
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
              Simulador de Quizzes ECOEMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Ponte a prueba con reactivos reales de examen. Es la forma más rápida y entretenida de afianzar lo aprendido.
            </p>
          </div>

          {/* Banner sugerido: Leer primero */}
          <div
            onClick={() => navigate('ruta')}
            className="rounded-3xl border border-indigo-200 bg-linear-to-r from-indigo-50/70 via-white to-purple-50/40 p-4.5 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-300 hover:shadow-xs transition"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shrink-0 shadow-md shadow-indigo-200">
                <BookOpen size={18} />
              </span>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900">¿Prefieres leer la clase antes de hacer el quiz?</p>
                <p className="text-xs text-slate-500">Entra a las clases explicadas paso a paso con ejemplos y tips de examen.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 shrink-0">
              Ir a Clases <ChevronRight size={14} />
            </span>
          </div>

          {/* Opción 1: Test Rápido de 10 preguntas */}
          <div
            onClick={() => handleStartQuickQuiz('todos')}
            className="rounded-3xl border border-emerald-300 bg-linear-to-r from-emerald-50/60 via-white to-indigo-50/40 p-6 sm:p-8 cursor-pointer transition shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white font-black shadow-lg shadow-emerald-200">
                <Zap size={24} fill="currentColor" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-black text-slate-900">Quiz Rápido Express</h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800 text-[10px] font-black border border-emerald-200">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  10 preguntas variadas de todas las materias. Te toma menos de 10 minutos.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-mint px-5 py-2.5 font-black text-xs shrink-0 pointer-events-none shadow-md shadow-emerald-200"
            >
              Comenzar ya <ArrowRight size={14} />
            </button>
          </div>

          {/* Opción 2: Practicar por Materia */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">O elige practicar una sola materia:</h2>
              <p className="text-xs text-slate-500">Responde preguntas de la materia que acabas de estudiar.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStartQuickQuiz(s.id)}
                  className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 text-left hover:border-indigo-300 hover:bg-white hover:shadow-xs transition cursor-pointer"
                >
                  <SubjectIcon subjectId={s.id} size="sm" />
                  <span className="text-xs font-bold text-slate-800 truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── 2. PREGUNTA EN CURSO (LIMPIA, CLARA) ───────────────── */}
      {mode === 'running' && currentQ && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          {/* Encabezado con número de pregunta y cronómetro */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-xs font-black">
                Pregunta {currentIndex + 1} de {activeQuestions.length}
              </span>
              {topicContext ? (
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  🎯 Quiz de: {topicContext.topicTitle} ({SUBJECT_MAP[topicContext.subjectId]?.name})
                </span>
              ) : (
                <span className="text-xs font-bold" style={{ color: SUBJECT_MAP[currentQ.subjectId]?.color }}>
                  {SUBJECT_MAP[currentQ.subjectId]?.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
              <Clock size={14} className="text-indigo-600" />
              <span>{formatClock(elapsedSeconds)}</span>
            </div>
          </div>

          <ProgressBar value={((currentIndex + 1) / activeQuestions.length) * 100} height={6} />

          {/* Pregunta con texto claro */}
          <div className="text-base sm:text-lg font-black text-slate-900 leading-relaxed pt-1">
            <RichText text={currentQ.question} />
          </div>

          {/* Opciones con letras grandes A, B, C, D */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx
              const isCorrect = idx === currentQ.answer

              let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'

              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                } else if (isSelected) {
                  btnStyle = 'border-rose-300 bg-rose-50 text-rose-950 font-bold'
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnsweredCurrent}
                  onClick={() => setAnswers({ ...answers, [currentQ.id]: idx })}
                  className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${btnStyle}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display font-black text-xs ${
                      isSelected || (hasAnsweredCurrent && isCorrect)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm font-semibold">
                    <RichText text={opt} inline />
                  </div>
                  {hasAnsweredCurrent && isCorrect && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
                  {hasAnsweredCurrent && isSelected && !isCorrect && <XCircle size={20} className="text-rose-500 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Explicación amigable inmediata */}
          {hasAnsweredCurrent && (
            <div
              className={`rounded-2xl border p-4.5 animate-fade-up text-xs sm:text-sm ${
                currentAnswer === currentQ.answer
                  ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
                  : 'border-rose-200 bg-rose-50/80 text-rose-950'
              }`}
            >
              <p className="font-bold mb-1 flex items-center gap-1.5">
                {currentAnswer === currentQ.answer ? '🎉 ¡Muy bien, respuesta correcta!' : '💡 Aprende de este reactivo:'}
              </p>
              <div className="text-slate-800 leading-relaxed">
                <RichText text={currentQ.explanation} />
              </div>
            </div>
          )}

          {/* Botón Siguiente / Terminar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Quieres salir de la práctica?')) setMode('config')
              }}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Salir
            </button>

            {hasAnsweredCurrent && (
              currentIndex === activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  className="btn btn-mint px-6 py-2.5 text-xs font-black shadow-md cursor-pointer"
                >
                  Ver mis resultados <Trophy size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((c) => c + 1)}
                  className="btn btn-primary px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Siguiente pregunta <ChevronRight size={14} />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ───────────────── 3. RESULTADOS CELEBRATORIOS ───────────────── */}
      {mode === 'results' && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-md shadow-emerald-200">
              <Trophy size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-2xl font-black text-slate-900">¡Gran trabajo!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                {topicContext ? (
                  <>Has completado el quiz de repaso de <strong className="text-indigo-600">{topicContext.topicTitle}</strong>.</>
                ) : (
                  <>Cada quiz que realizas te acerca a tu lugar en la preparatoria deseada.</>
                )}
              </p>
            </div>

            {/* Puntaje destacado */}
            {(() => {
              const correct = activeQuestions.filter((q) => answers[q.id] === q.answer).length
              const total = activeQuestions.length
              const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0
              return (
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 max-w-sm mx-auto space-y-2">
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider">Aciertos logrados</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="font-display text-4xl font-black text-emerald-600 tabular-nums">
                      {correct} / {total}
                    </p>
                    <span className="rounded-xl bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800 border border-emerald-200">
                      {scorePct}%
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {scorePct >= 80 ? '🌟 ¡Excelente dominio de los temas!' : scorePct >= 60 ? '💪 ¡Buen trabajo! Con práctica lograrás el 100%.' : '💡 Buen intento. Revisa la explicación de cada pregunta abajo.'}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                    Tiempo invertido: {formatDuration(elapsedSeconds)}
                  </p>
                </div>
              )
            })()}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {topicContext && (
                <button
                  type="button"
                  onClick={() =>
                    navigate('ruta', {
                      subject: topicContext.subjectId,
                      topic: topicContext.topicId,
                    })
                  }
                  className="btn btn-primary px-5 py-2.5 font-black text-xs shadow-md cursor-pointer"
                >
                  <BookOpen size={14} /> Volver a leer la clase
                </button>
              )}

              {topicContext && (
                <button
                  type="button"
                  onClick={() => {
                    actions.setTopicStatus(topicContext.topicId, 'dominado')
                    toast({ tone: 'success', title: '¡Clase marcada como Dominada! 🌟' })
                  }}
                  className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                >
                  ✓ Marcar como Dominada
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (topicContext) {
                    handleStartTopicQuiz(topicContext.topicId, topicContext.subjectId)
                  } else {
                    setMode('config')
                  }
                }}
                className="btn btn-ghost px-5 py-2.5 font-bold text-xs cursor-pointer"
              >
                <RotateCcw size={14} /> Repetir Quiz
              </button>

              <button
                type="button"
                onClick={() => navigate('inicio')}
                className="btn btn-ghost px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Volver a Mi Salón
              </button>

              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
              >
                {showReview ? 'Ocultar revisión' : '🔍 Revisar reactivo por reactivo'}
              </button>
            </div>
          </div>

          {/* Desglose detallado de reactivos */}
          {showReview && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 text-left">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-center sm:text-left">
                Revisión reactivo por reactivo:
              </h3>

              <div className="space-y-3">
                {activeQuestions.map((q, idx) => {
                  const studentAns = answers[q.id]
                  const isCorrect = studentAns === q.answer
                  const subject = SUBJECT_MAP[q.subjectId]

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4.5 space-y-2.5 transition ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black ${
                              isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold" style={{ color: subject?.color || '#4f46e5' }}>
                            {subject?.name}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black border ${
                            isCorrect
                              ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                              : 'border-rose-200 bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? '✓ Correcta' : '✕ Incorrecta'}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        <RichText text={q.question} />
                      </div>

                      {/* Comparación de respuestas */}
                      <div className="space-y-1 text-xs">
                        {!isCorrect && (
                          <p className="text-rose-700 font-semibold">
                            <strong>Tu respuesta:</strong> {studentAns !== undefined ? `${OPTION_LETTERS[studentAns]}) ${q.options[studentAns]}` : 'Sin responder'}
                          </p>
                        )}
                        <p className="text-emerald-800 font-semibold">
                          <strong>Respuesta correcta:</strong> {OPTION_LETTERS[q.answer]}) {q.options[q.answer]}
                        </p>
                      </div>

                      {/* Explicación */}
                      {q.explanation && (
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5">Explicación:</strong>
                          <RichText text={q.explanation} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
