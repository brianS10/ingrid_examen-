/**
 * Simulador de Práctica simplificado:
 * Cero menús complejos con 20 botones.
 * 2 Opciones directas:
 *  1. ⚡ Quiz Rápido Express (10 preguntas de todo un poco - 1 clic).
 *  2. 📚 Practicar una Materia en específico.
 * Interfaz de preguntas limpia, tipografía grande, amigable y con respuestas fáciles de seleccionar.
 */
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  AlertCircle, ArrowLeft, ArrowRight, Award, CheckCircle2, ChevronRight,
  Clock, Play, RotateCcw, Sparkles, Trophy, XCircle, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { QUESTIONS, OPTION_LETTERS } from '../data/questions'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { formatClock, formatDuration, daysFromNow } from '../lib/date'
import { ProgressBar } from '../components/ui/Progress'
import { RichText } from '../components/ui/RichText'
import { SubjectIcon } from '../components/ui/Icon'

export default function Simulator() {
  const { state, actions, route, toast, navigate } = useApp()
  const [mode, setMode] = useState('config') // 'config' | 'running' | 'results'

  // Configuración simplificada
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qId]: optionIndex }
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const timerRef = useRef(null)

  // Iniciar Quiz directo
  const handleStartQuickQuiz = (subjectId = 'todos') => {
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

  // Cronómetro suave
  useEffect(() => {
    if (mode !== 'running') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [mode])

  // Finalizar
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
      bySubject[q.subjectId].total += 1
      if (isCorrect) bySubject[q.subjectId].correct += 1
    })

    const attempt = {
      id: `quiz-${Date.now()}`,
      type: 'quiz',
      name: `Quiz de práctica (${activeQuestions.length} reactivos)`,
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Zona de Práctica</h1>
            <p className="text-sm text-ink-300">
              Ponte a prueba con preguntas tipo examen. Es la forma más rápida de aprender.
            </p>
          </div>

          {/* Opción 1: Test Rápido de 10 preguntas */}
          <div
            onClick={() => handleStartQuickQuiz('todos')}
            className="card card-hover p-6 sm:p-8 border-mint-400/40 bg-linear-to-r from-mint-500/10 via-ink-850 to-iris-500/10 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-400 text-ink-950 font-black shadow-lg shadow-mint-500/20">
                <Zap size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Quiz Rápido Express</h2>
                  <span className="chip border-mint-400/30 bg-mint-400/20 text-mint-300 text-[10px] font-extrabold">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-200">
                  10 preguntas variadas de todas las materias. Te toma menos de 10 minutos.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-mint px-5 py-2.5 font-bold text-xs shrink-0 pointer-events-none"
            >
              Comenzar ya <ArrowRight size={14} />
            </button>
          </div>

          {/* Opción 2: Practicar por Materia */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">O elige practicar una sola materia:</h2>
              <p className="text-xs text-ink-300">Responde preguntas de la materia que acabas de estudiar.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStartQuickQuiz(s.id)}
                  className="flex items-center gap-2 rounded-2xl border border-white/8 bg-ink-950/40 p-3 text-left hover:border-white/20 hover:bg-white/5 transition cursor-pointer"
                >
                  <SubjectIcon subjectId={s.id} size="sm" />
                  <span className="text-xs font-bold text-white truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── 2. PREGUNTA EN CURSO (LIMPIA, CLARA) ───────────────── */}
      {mode === 'running' && currentQ && (
        <div className="card p-6 sm:p-8 space-y-6 animate-fade-up">
          {/* Encabezado con número de pregunta y cronómetro */}
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div className="flex items-center gap-2">
              <span className="chip border-white/10 bg-white/5 text-ink-200 text-xs font-bold">
                Pregunta {currentIndex + 1} de {activeQuestions.length}
              </span>
              <span className="text-xs font-semibold" style={{ color: SUBJECT_MAP[currentQ.subjectId]?.color }}>
                {SUBJECT_MAP[currentQ.subjectId]?.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink-300">
              <Clock size={14} className="text-mint-400" />
              <span>{formatClock(elapsedSeconds)}</span>
            </div>
          </div>

          <ProgressBar value={((currentIndex + 1) / activeQuestions.length) * 100} height={6} />

          {/* Pregunta con texto claro */}
          <div className="text-base sm:text-lg font-bold text-white leading-relaxed pt-1">
            <RichText text={currentQ.question} />
          </div>

          {/* Opciones con letras grandes A, B, C, D */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx
              const isCorrect = idx === currentQ.answer

              let btnStyle = 'border-white/8 bg-ink-950/40 text-ink-100 hover:border-white/20 hover:bg-white/5'

              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  btnStyle = 'border-mint-400 bg-mint-400/20 text-white font-bold'
                } else if (isSelected) {
                  btnStyle = 'border-rose-400 bg-rose-500/20 text-white'
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
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display font-extrabold text-xs ${
                      isSelected || (hasAnsweredCurrent && isCorrect)
                        ? 'bg-white text-ink-950'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <div className="flex-1 text-sm font-medium">
                    <RichText text={opt} inline />
                  </div>
                  {hasAnsweredCurrent && isCorrect && <CheckCircle2 size={18} className="text-mint-400 shrink-0" />}
                  {hasAnsweredCurrent && isSelected && !isCorrect && <XCircle size={18} className="text-rose-400 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Explicación amigable inmediata */}
          {hasAnsweredCurrent && (
            <div
              className={`rounded-2xl border p-4 animate-fade-up text-xs sm:text-sm ${
                currentAnswer === currentQ.answer
                  ? 'border-mint-400/30 bg-mint-400/10 text-mint-200'
                  : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
              }`}
            >
              <p className="font-bold mb-1 flex items-center gap-1.5">
                {currentAnswer === currentQ.answer ? '🎉 ¡Muy bien, respuesta correcta!' : '💡 Aprende de este error:'}
              </p>
              <div className="text-ink-100">
                <RichText text={currentQ.explanation} />
              </div>
            </div>
          )}

          {/* Botón Siguiente / Terminar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/8">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Quieres salir de la práctica?')) setMode('config')
              }}
              className="text-xs text-ink-400 hover:text-rose-300"
            >
              Salir
            </button>

            {hasAnsweredCurrent && (
              currentIndex === activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  className="btn btn-mint px-6 py-2.5 text-xs font-extrabold"
                >
                  Ver mis resultados <Trophy size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((c) => c + 1)}
                  className="btn btn-primary px-5 py-2 text-xs font-bold"
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
        <div className="card p-6 sm:p-8 space-y-6 animate-fade-up">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 shadow-xl">
              <Trophy size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">¡Gran trabajo!</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Cada quiz que haces te acerca más a tu objetivo en el examen <strong className="text-emerald-400">ECOEMS / COMIPEMS</strong>.
              </p>
            </div>

            {/* Puntaje destacado */}
            {(() => {
              const correct = activeQuestions.filter((q) => answers[q.id] === q.answer).length
              const total = activeQuestions.length
              const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0
              return (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 max-w-sm mx-auto space-y-2">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Aciertos logrados</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-4xl font-black text-emerald-400 tabular-nums">
                      {correct} / {total}
                    </p>
                    <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-sm font-black text-emerald-300 border border-emerald-500/30">
                      {scorePct}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    {scorePct >= 80 ? '🌟 ¡Excelente dominio de los temas!' : scorePct >= 60 ? '💪 ¡Buen trabajo! Con práctica dominarás el 100%.' : '💡 Buen intento. Revisa la explicación de cada pregunta abajo.'}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    Tiempo invertido: {formatDuration(elapsedSeconds)}
                  </p>
                </div>
              )
            })()}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('config')}
                className="btn btn-mint px-6 py-2.5 font-bold text-xs"
              >
                <RotateCcw size={14} /> Practicar de nuevo
              </button>
              <button
                type="button"
                onClick={() => navigate('inicio')}
                className="btn btn-ghost px-5 py-2.5 text-xs font-bold"
              >
                Volver a Mi Día
              </button>
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
              >
                {showReview ? 'Ocultar revisión' : '🔍 Revisar reactivos y respuestas'}
              </button>
            </div>
          </div>

          {/* Desglose detallado de reactivos para estudiar */}
          {showReview && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center sm:text-left">
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
                          ? 'border-emerald-500/25 bg-slate-950/60'
                          : 'border-rose-500/30 bg-rose-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold" style={{ color: subject?.color || '#38bdf8' }}>
                            {subject?.name}
                          </span>
                        </div>

                        <span
                          className={`chip text-[10px] font-bold ${
                            isCorrect
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                          }`}
                        >
                          {isCorrect ? '✓ Correcta' : '✕ Incorrecta'}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-white">
                        <RichText text={q.question} />
                      </div>

                      {/* Comparación de respuestas */}
                      <div className="space-y-1 text-xs">
                        {!isCorrect && (
                          <p className="text-rose-300">
                            <strong>Tu respuesta:</strong> {studentAns !== undefined ? `${OPTION_LETTERS[studentAns]}) ${q.options[studentAns]}` : 'Sin responder'}
                          </p>
                        )}
                        <p className="text-emerald-300">
                          <strong>Respuesta correcta:</strong> {OPTION_LETTERS[q.answer]}) {q.options[q.answer]}
                        </p>
                      </div>

                      {/* Explicación */}
                      {q.explanation && (
                        <div className="rounded-xl bg-slate-900/90 p-3 text-xs text-slate-300 border border-slate-800/80">
                          <strong className="text-white block mb-0.5">Explicación:</strong>
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
