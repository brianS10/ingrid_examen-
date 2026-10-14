/**
 * Simulador de Exámenes y Quizzes Tipo COMIPEMS:
 * - Selección de modo: Quiz rápido (10 preguntas mixtas), Simulacro temático por materia o Simulacro completo (128 preguntas).
 * - Cronómetro por sesión configurable.
 * - Modo de retroalimentación: inmediata o al finalizar.
 * - Interfaz de examen estilizada con navegación entre reactivos.
 * - Pantalla de resultados: puntaje, porcentaje, tiempo, desglose por materia y explicación detallada con fórmulas KaTeX.
 */
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  AlertCircle, ArrowLeft, ArrowRight, Award, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Flame, HelpCircle, Layers, Play, RefreshCw, RotateCcw, Shuffle, Sparkles, Timer, Trophy, XCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { QUESTIONS, OPTION_LETTERS } from '../data/questions'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { formatClock, formatDuration, daysFromNow } from '../lib/date'
import { PageHeader } from '../components/ui/Feedback'
import { ProgressBar } from '../components/ui/Progress'
import { RichText } from '../components/ui/RichText'
import { SubjectIcon } from '../components/ui/Icon'

export default function Simulator() {
  const { state, actions, route, toast, navigate } = useApp()
  const [mode, setMode] = useState('config') // 'config' | 'running' | 'results'

  // Configuración de la sesión
  const [selectedSubject, setSelectedSubject] = useState(route.params.subject || 'todos')
  const [questionCount, setQuestionCount] = useState(10)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15) // 0 = sin límite
  const [feedbackMode, setFeedbackMode] = useState(state.quizDefaults.feedback || 'inmediata') // 'inmediata' | 'final'

  // Estado del examen en curso
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: selectedOptionIndex }
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef(null)

  // Iniciar examen
  const startQuiz = () => {
    let pool = QUESTIONS
    if (selectedSubject !== 'todos') {
      pool = QUESTIONS.filter((q) => q.subjectId === selectedSubject)
    }

    if (pool.length === 0) {
      toast({ tone: 'warning', title: 'Sin preguntas disponibles para esta materia' })
      return
    }

    // Mezclar y tomar la cantidad elegida
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length))

    setActiveQuestions(selected)
    setCurrentIndex(0)
    setAnswers({})
    setElapsedSeconds(0)
    setSecondsLeft(timeLimitMinutes > 0 ? timeLimitMinutes * 60 : null)
    setMode('running')
  }

  // Manejo del temporizador
  useEffect(() => {
    if (mode !== 'running') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
      setSecondsLeft((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          clearInterval(timerRef.current)
          finishQuiz(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [mode, activeQuestions, answers])

  // Finalizar examen y registrar intento
  const finishQuiz = (timeExpired = false) => {
    if (timerRef.current) clearInterval(timerRef.current)

    let correctCount = 0
    const bySubject = {}

    activeQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.answer
      if (isCorrect) correctCount++

      if (!bySubject[q.subjectId]) {
        bySubject[q.subjectId] = { correct: 0, total: 0 }
      }
      bySubject[q.subjectId].total += 1
      if (isCorrect) bySubject[q.subjectId].correct += 1
    })

    const attempt = {
      id: `quiz-${Date.now()}`,
      type: activeQuestions.length > 30 ? 'simulacro' : 'quiz',
      name:
        selectedSubject === 'todos'
          ? `Quiz mixto (${activeQuestions.length} preguntas)`
          : `Quiz ${SUBJECT_MAP[selectedSubject]?.name || ''}`,
      date: daysFromNow(0),
      correct: correctCount,
      total: activeQuestions.length,
      durationSec: elapsedSeconds,
      bySubject,
    }

    actions.addAttempt(attempt)
    setMode('results')

    if (timeExpired) {
      toast({ tone: 'warning', title: '¡Tiempo agotado!', description: 'Se guardó tu simulacro con las respuestas registradas.' })
    } else {
      const scorePct = Math.round((correctCount / activeQuestions.length) * 100)
      toast({
        tone: scorePct >= 70 ? 'success' : 'info',
        title: `¡Simulacro terminado! ${correctCount}/${activeQuestions.length} aciertos (${scorePct}%)`,
      })
    }
  }

  // Cálculos de resultados
  const currentQ = activeQuestions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const progressPct = activeQuestions.length ? (answeredCount / activeQuestions.length) * 100 : 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Entrenamiento cronometrado"
        title="Simulador de Exámenes"
        description="Practica con preguntas tipo COMIPEMS bajo condiciones reales: cronómetro, retroalimentación detallada y análisis de respuestas."
      />

      {/* ───────────────── PANTALLA 1: CONFIGURACIÓN ───────────────── */}
      {mode === 'config' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card space-y-6 p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-mint-400" /> Configurar sesión de práctica
            </h2>

            {/* Selector de Materia */}
            <div>
              <label className="label">Materia</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setSelectedSubject('todos')}
                  className={`flex cursor-pointer items-center gap-2 rounded-2xl border p-3 text-left transition-all ${
                    selectedSubject === 'todos'
                      ? 'border-mint-400 bg-mint-400/15 text-white font-bold'
                      : 'border-white/8 bg-ink-950/40 text-ink-300 hover:text-white'
                  }`}
                >
                  <Shuffle size={16} className="text-mint-400" />
                  <span className="text-xs">Todas (Mixto)</span>
                </button>
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSubject(s.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-2xl border p-3 text-left transition-all ${
                      selectedSubject === s.id
                        ? 'border-white/20 bg-ink-850 text-white font-bold'
                        : 'border-white/8 bg-ink-950/40 text-ink-300 hover:text-white'
                    }`}
                  >
                    <SubjectIcon subjectId={s.id} size="sm" />
                    <span className="text-xs truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Número de preguntas */}
            <div>
              <label className="label">Número de reactivos</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 25].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`btn ${
                      questionCount === cnt ? 'btn-mint' : 'btn-ghost'
                    }`}
                  >
                    {cnt} preguntas
                  </button>
                ))}
              </div>
            </div>

            {/* Límite de tiempo */}
            <div>
              <label className="label">Límite de tiempo</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Sin límite', value: 0 },
                  { label: '10 min', value: 10 },
                  { label: '15 min', value: 15 },
                  { label: '30 min', value: 30 },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeLimitMinutes(t.value)}
                    className={`btn ${
                      timeLimitMinutes === t.value ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modo de retroalimentación */}
            <div>
              <label className="label">Modo de retroalimentación</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackMode('inmediata')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    feedbackMode === 'inmediata'
                      ? 'border-iris-400 bg-iris-500/15 text-white'
                      : 'border-white/8 bg-ink-950/40 text-ink-300'
                  }`}
                >
                  <p className="font-bold text-sm text-white">Inmediata</p>
                  <p className="text-xs mt-1 text-ink-300">
                    Muestra la respuesta correcta y la explicación apenas respondes cada reactivo. Ideal para aprender.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackMode('final')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    feedbackMode === 'final'
                      ? 'border-iris-400 bg-iris-500/15 text-white'
                      : 'border-white/8 bg-ink-950/40 text-ink-300'
                  }`}
                >
                  <p className="font-bold text-sm text-white">Al finalizar</p>
                  <p className="text-xs mt-1 text-ink-300">
                    Modo examen real. Respondes sin interrupciones y revisas todos los resultados al terminar.
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={startQuiz}
                className="btn btn-primary w-full sm:w-auto text-base px-8 py-3.5 shadow-xl shadow-iris-600/30"
              >
                <Play size={18} /> Iniciar Simulacro
              </button>
            </div>
          </div>

          {/* Tips y guía de examen */}
          <div className="space-y-6">
            <div className="card p-6 border-iris-500/20 bg-linear-to-b from-iris-500/10 to-transparent">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-iris-400" /> Formato oficial COMIPEMS
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-ink-200">
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1 rounded-full bg-mint-400 shrink-0" />
                  <span><strong>128 reactivos</strong> en total de opción múltiple (A, B, C, D).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1 rounded-full bg-mint-400 shrink-0" />
                  <span><strong>3 horas</strong> de duración máxima (~1.4 minutos por reactivo).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1 rounded-full bg-mint-400 shrink-0" />
                  <span><strong>No hay penalización</strong> por respuestas incorrectas: ¡nunca dejes una en blanco!</span>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-mint-400">
                Estrategia recomendada
              </h3>
              <p className="mt-2 text-xs text-ink-300 leading-relaxed">
                Empieza siempre por tus materias más fuertes (como Español o Historia) para asegurar puntos rápido y ganar confianza para Matemáticas y Física.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── PANTALLA 2: EXAMEN EN CURSO ───────────────── */}
      {mode === 'running' && currentQ && (
        <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
          {/* Barra superior de progreso y cronómetro */}
          <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <SubjectIcon subjectId={currentQ.subjectId} size="sm" />
              <div>
                <p className="text-xs font-semibold text-ink-300">
                  Reactivo {currentIndex + 1} de {activeQuestions.length}
                </p>
                <p className="text-sm font-bold text-white">
                  {SUBJECT_MAP[currentQ.subjectId]?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 font-mono text-sm font-bold tabular-nums ${
                  secondsLeft !== null && secondsLeft < 120
                    ? 'border-rose-400 bg-rose-500/20 text-rose-300 animate-pulse'
                    : 'border-white/10 bg-ink-950/60 text-white'
                }`}
              >
                <Clock size={16} className="text-mint-400" />
                <span>
                  {secondsLeft !== null ? formatClock(secondsLeft) : formatClock(elapsedSeconds)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas salir del simulacro?')) {
                    finishQuiz(false)
                  }
                }}
                className="btn btn-ghost text-xs px-3 py-1.5 text-rose-300 hover:bg-rose-500/20"
              >
                Terminar
              </button>
            </div>
          </div>

          <ProgressBar value={((currentIndex + 1) / activeQuestions.length) * 100} height={6} />

          {/* Tarjeta del reactivo */}
          <div className="card p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip border-iris-400/30 bg-iris-500/10 text-iris-300 text-xs">
                  Pregunta {currentIndex + 1}
                </span>
                <span className="text-xs font-semibold text-ink-300">
                  Dificultad: {['Fácil', 'Media', 'Avanzada'][currentQ.difficulty - 1]}
                </span>
              </div>

              <div className="text-lg md:text-xl font-bold text-white leading-relaxed">
                <RichText text={currentQ.question} />
              </div>
            </div>

            {/* Opciones A, B, C, D */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx
                const hasAnswered = answers[currentQ.id] !== undefined
                const isCorrect = idx === currentQ.answer
                const showInstantFeedback = feedbackMode === 'inmediata' && hasAnswered

                let optStyle = 'border-white/8 bg-ink-950/40 text-ink-100 hover:border-white/20 hover:bg-white/5'

                if (showInstantFeedback) {
                  if (isCorrect) {
                    optStyle = 'border-mint-400 bg-mint-400/20 text-white font-bold shadow-lg shadow-mint-500/10'
                  } else if (isSelected) {
                    optStyle = 'border-rose-400 bg-rose-500/20 text-white'
                  }
                } else if (isSelected) {
                  optStyle = 'border-iris-400 bg-iris-500/20 text-white font-bold shadow-lg shadow-iris-600/20'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={feedbackMode === 'inmediata' && hasAnswered}
                    onClick={() => setAnswers({ ...answers, [currentQ.id]: idx })}
                    className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all ${optStyle}`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display font-extrabold text-sm ${
                        isSelected || (showInstantFeedback && isCorrect)
                          ? 'bg-white text-ink-950'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {OPTION_LETTERS[idx]}
                    </span>
                    <div className="flex-1 text-sm md:text-base">
                      <RichText text={opt} inline />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explicación inmediata si está habilitada */}
            {feedbackMode === 'inmediata' && answers[currentQ.id] !== undefined && (
              <div
                className={`animate-fade-up rounded-2xl border p-5 ${
                  answers[currentQ.id] === currentQ.answer
                    ? 'border-mint-400/30 bg-mint-400/10'
                    : 'border-rose-400/30 bg-rose-500/10'
                }`}
              >
                <p className="flex items-center gap-2 font-bold text-sm">
                  {answers[currentQ.id] === currentQ.answer ? (
                    <span className="text-mint-400 flex items-center gap-1.5">
                      <CheckCircle2 size={18} /> ¡Correcto!
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <XCircle size={18} /> Respuesta incorrecta. La opción correcta es la {OPTION_LETTERS[currentQ.answer]}.
                    </span>
                  )}
                </p>
                <div className="mt-3 text-xs md:text-sm text-ink-100">
                  <RichText text={currentQ.explanation} />
                </div>
              </div>
            )}

            {/* Navegación anterior / siguiente */}
            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
                className="btn btn-ghost px-4 py-2 text-xs"
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              {currentIndex === activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => finishQuiz(false)}
                  className="btn btn-mint px-6 py-2.5 text-xs font-bold"
                >
                  Finalizar examen <CheckCircle2 size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((c) => Math.min(activeQuestions.length - 1, c + 1))}
                  className="btn btn-primary px-5 py-2 text-xs font-bold"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Navegador de miniaturas de preguntas */}
          <div className="card p-4">
            <p className="label mb-3">Revisión de reactivos</p>
            <div className="flex flex-wrap gap-2">
              {activeQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'border-2 border-mint-400 bg-white/10 text-white'
                        : isAnswered
                        ? 'bg-mint-400/25 text-mint-300'
                        : 'bg-white/5 text-ink-300 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── PANTALLA 3: RESULTADOS ───────────────── */}
      {mode === 'results' && (
        <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
          <div className="card p-6 md:p-8 text-center space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint-400/15 text-mint-400">
              <Trophy size={40} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              ¡Simulacro completado!
            </h2>
            <p className="text-ink-300 text-sm max-w-md mx-auto">
              Excelente esfuerzo. Revisa el análisis de aciertos por materia y las explicaciones para reforzar los temas donde tuviste dudas.
            </p>

            {/* Métricas clave */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 max-w-2xl mx-auto">
              <div className="card p-4 bg-ink-950/60">
                <p className="label">Aciertos</p>
                <p className="text-2xl font-black text-mint-400 tabular-nums">
                  {activeQuestions.filter((q) => answers[q.id] === q.answer).length} / {activeQuestions.length}
                </p>
              </div>
              <div className="card p-4 bg-ink-950/60">
                <p className="label">Porcentaje</p>
                <p className="text-2xl font-black text-white tabular-nums">
                  {Math.round(
                    (activeQuestions.filter((q) => answers[q.id] === q.answer).length /
                      activeQuestions.length) *
                      100
                  )}%
                </p>
              </div>
              <div className="card p-4 bg-ink-950/60">
                <p className="label">Tiempo total</p>
                <p className="text-2xl font-black text-iris-300 tabular-nums">
                  {formatDuration(elapsedSeconds)}
                </p>
              </div>
              <div className="card p-4 bg-ink-950/60">
                <p className="label">Promedio / reactivo</p>
                <p className="text-2xl font-black text-amber-300 tabular-nums">
                  {activeQuestions.length ? Math.round(elapsedSeconds / activeQuestions.length) : 0}s
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMode('config')}
                className="btn btn-mint px-6 py-2.5 font-bold"
              >
                <RotateCcw size={16} /> Hacer otro quiz
              </button>
              <button
                type="button"
                onClick={() => navigate('estadisticas')}
                className="btn btn-ghost px-6 py-2.5"
              >
                Ver en Estadísticas <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Desglose detallado de reactivos y retroalimentación */}
          <div className="card p-6 space-y-6">
            <h3 className="section-title">Revisión de respuestas</h3>
            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const userChoice = answers[q.id]
                const isCorrect = userChoice === q.answer

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-5 ${
                      isCorrect ? 'border-mint-400/20 bg-mint-400/5' : 'border-rose-400/25 bg-rose-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                            isCorrect ? 'bg-mint-400 text-ink-950' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-ink-300">
                          {SUBJECT_MAP[q.subjectId]?.name}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${isCorrect ? 'text-mint-400' : 'text-rose-400'}`}>
                        {isCorrect ? 'Acertada (+1)' : 'Incorrecta (0)'}
                      </span>
                    </div>

                    <div className="mt-3 font-semibold text-white text-sm">
                      <RichText text={q.question} />
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isUserAnswer = userChoice === optIdx
                        const isCorrectOption = optIdx === q.answer

                        let badgeColor = 'bg-white/5 text-ink-300 border-white/5'
                        if (isCorrectOption) {
                          badgeColor = 'bg-mint-400/20 text-mint-300 border-mint-400/40 font-bold'
                        } else if (isUserAnswer) {
                          badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-400/40 font-bold'
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 ${badgeColor}`}
                          >
                            <span className="font-bold">{OPTION_LETTERS[optIdx]})</span>
                            <div className="flex-1">
                              <RichText text={opt} inline />
                            </div>
                            {isCorrectOption && <CheckCircle2 size={14} className="text-mint-400" />}
                            {isUserAnswer && !isCorrectOption && <XCircle size={14} className="text-rose-400" />}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-3 rounded-xl bg-ink-950/60 p-3 text-xs text-ink-200">
                      <strong className="text-white">Explicación: </strong>
                      <RichText text={q.explanation} inline />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
