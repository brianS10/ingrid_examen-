/**
 * Aula de Clases Interactivas ECOEMS:
 * Estructura pedagógica guiada en 4 Pasos:
 *  - Paso 1: 🎓 La Clase (Explicación clara en lenguaje sencillo + Consejo de Brian + Checklist)
 *  - Paso 2: 💡 Ejemplos Resueltos (Paso a paso cómo viene en el examen)
 *  - Paso 3: 🗂️ Tarjetas de Memoria (Flashcards interactivas del tema)
 *  - Paso 4: 🎯 Quiz del Tema (Evaluación directa con retroalimentación)
 */
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Check, CheckCircle2, ChevronRight,
  Circle, Clock, Edit3, HelpCircle, Layers, Lightbulb, NotebookPen, Pencil,
  Play, RefreshCw, RotateCcw, Sparkles, Star, Trophy, X, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { getSubjectTopics, getTopic, subjectProgress } from '../lib/progress'
import { getTopicExamples } from '../data/topicExamples'
import { FLASHCARD_DECKS } from '../data/flashcardsData'
import { ProgressBar } from '../components/ui/Progress'
import { SubjectIcon } from '../components/ui/Icon'
import { RichText } from '../components/ui/RichText'

export default function LearningRoute() {
  const { state, actions, route, navigate, isTutor, toast } = useApp()
  const initialSubject = route.params.subject || 'matematicas'
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject)
  const [activeTopicId, setActiveTopicId] = useState(route.params.topic || null)

  // Paso activo dentro de la clase: 1 = Clase, 2 = Ejemplos, 3 = Tarjetas, 4 = Quiz
  const [classStep, setClassStep] = useState(1)

  // Estado para voltear tarjetas dentro de la clase
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)

  // Sincronizar parámetros de ruta
  useEffect(() => {
    if (route.params.subject) setSelectedSubjectId(route.params.subject)
    if (route.params.topic) {
      setActiveTopicId(route.params.topic)
      setClassStep(1)
    }
  }, [route.params.subject, route.params.topic])

  const currentSubject = SUBJECT_MAP[selectedSubjectId] || SUBJECTS[0]
  const topics = useMemo(() => {
    return getSubjectTopics(state, currentSubject.id)
  }, [state, currentSubject.id])

  const progress = useMemo(() => {
    return subjectProgress(state, currentSubject.id)
  }, [state, currentSubject.id])

  // Tema activo actualmente abierto para la clase
  const activeTopic = activeTopicId ? getTopic(state, activeTopicId) : null

  // Ejemplos resueltos para este tema
  const examples = useMemo(() => {
    return activeTopic ? getTopicExamples(activeTopic.id, currentSubject.id) : []
  }, [activeTopic, currentSubject.id])

  // Flashcards para este tema / materia
  const topicCards = useMemo(() => {
    const deck = FLASHCARD_DECKS.find((d) => d.subjectId === currentSubject.id)
    return deck ? deck.cards : []
  }, [currentSubject.id])

  // Estado para notas personales y edición de consejos del tutor
  const [personalNotes, setPersonalNotes] = useState(activeTopic?.notes ?? '')
  const [isEditingTip, setIsEditingTip] = useState(false)
  const [tipDraft, setTipDraft] = useState(activeTopic?.tip ?? '')

  useEffect(() => {
    if (activeTopic) {
      setPersonalNotes(activeTopic.notes ?? '')
      setTipDraft(activeTopic.tip ?? '')
      setIsEditingTip(false)
      setActiveCardIndex(0)
      setCardFlipped(false)
    }
  }, [activeTopicId])

  // Autoguardado de notas personales
  useEffect(() => {
    if (!activeTopic || personalNotes === activeTopic.notes) return
    const timer = setTimeout(() => {
      actions.updateTopic(activeTopic.id, { notes: personalNotes })
    }, 600)
    return () => clearTimeout(timer)
  }, [personalNotes, activeTopic, actions])

  // Tema anterior y siguiente
  const { prevTopic, nextTopic } = useMemo(() => {
    if (!activeTopic) return { prevTopic: null, nextTopic: null }
    const index = topics.findIndex((t) => t.id === activeTopic.id)
    return {
      prevTopic: index > 0 ? topics[index - 1] : null,
      nextTopic: index >= 0 && index < topics.length - 1 ? topics[index + 1] : null,
    }
  }, [topics, activeTopic])

  /* ─────────────────────────────────────────────────────────────
     VISTA 1: AULA DE CLASE INTERACTIVA (LECCIÓN GUIADA EN 4 PASOS)
  ───────────────────────────────────────────────────────────── */
  if (activeTopic) {
    const isMastered = activeTopic.status === 'dominado'
    const doneSubs = activeTopic.subtopics.filter((s) => s.done).length

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
        {/* Barra superior de regreso y acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTopicId(null)
              navigate('ruta', { subject: currentSubject.id })
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver al temario de {currentSubject.name}
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const next = isMastered ? 'pendiente' : 'dominado'
                actions.setTopicStatus(activeTopic.id, next)
                toast({
                  tone: next === 'dominado' ? 'success' : 'info',
                  title: next === 'dominado' ? '¡Tema dominado! 🌟' : 'Marcado para repasar',
                })
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                isMastered
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isMastered ? '✓ Clase Dominada' : 'Marcar como Dominada'}
            </button>

            {/* Acceso directo a Quiz si ya se lo saben */}
            <button
              type="button"
              onClick={() =>
                navigate('simulador', {
                  topic: activeTopic.id,
                  subject: currentSubject.id,
                  auto: 'true',
                })
              }
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-1.5 text-xs shadow-sm transition cursor-pointer"
            >
              <Zap size={14} fill="currentColor" /> Hacer Quiz ahora
            </button>
          </div>
        </div>

        {/* Encabezado del Tema */}
        <div
          className="rounded-3xl border p-6 sm:p-8 space-y-3 bg-white shadow-sm"
          style={{
            borderColor: `${currentSubject.color}40`,
            backgroundImage: `linear-gradient(135deg, ${currentSubject.color}08, #ffffff 70%)`,
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{ background: `${currentSubject.color}18`, color: currentSubject.color }}
            >
              {currentSubject.name}
            </span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Clock size={13} className="text-indigo-600" /> ~{activeTopic.minutes} min de clase
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              • {doneSubs} de {activeTopic.subtopics.length} puntos entendidos
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {activeTopic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Sigue los pasos de esta clase interactiva para entender el tema a fondo, ver ejemplos resueltos, memorizar fórmulas y ponerte a prueba.
          </p>
        </div>

        {/* ───────── NAVEGACIÓN POR PASOS DE LA CLASE (4 PASOS) ───────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setClassStep(1)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
              classStep === 1
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={15} /> 1. La Explicación
          </button>

          <button
            type="button"
            onClick={() => setClassStep(2)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
              classStep === 2
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb size={15} /> 2. Ejemplos Guía
          </button>

          <button
            type="button"
            onClick={() => setClassStep(3)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
              classStep === 3
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={15} /> 3. Tarjetas Rápidas
          </button>

          <button
            type="button"
            onClick={() => setClassStep(4)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
              classStep === 4
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={15} /> 4. Quiz del Tema
          </button>
        </div>

        {/* ───────── PASO 1: EXPLICACIÓN DE LA CLASE ───────── */}
        {classStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Contenido Teórico Explicado */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600" /> Explicación de la Clase
                </h2>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Guía Oficial ECOEMS
                </span>
              </div>

              <div className="pt-2 text-slate-800 leading-relaxed">
                <RichText text={activeTopic.summary} />
              </div>
            </section>

            {/* Consejo especial del Tutor Brian */}
            <section className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 sm:p-6 space-y-3 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  Consejo de {state.profile.tutor} para este tema en el examen:
                </h3>
                {isTutor && !isEditingTip && (
                  <button
                    type="button"
                    onClick={() => setIsEditingTip(true)}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    <Pencil size={12} /> Editar consejo
                  </button>
                )}
              </div>

              {isEditingTip ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-indigo-300 bg-white p-3 text-xs text-slate-800 focus:outline-indigo-500"
                    value={tipDraft}
                    onChange={(e) => setTipDraft(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTip(false)}
                      className="rounded-lg px-3 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        actions.updateTopic(activeTopic.id, { tip: tipDraft })
                        setIsEditingTip(false)
                        toast({ tone: 'success', title: 'Consejo actualizado para Ingrid' })
                      }}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-indigo-950 italic leading-relaxed">
                  “{activeTopic.tip || 'Lee este tema con calma y anota las dudas que te surjan en tus notas.'}”
                </p>
              )}
            </section>

            {/* Checklist de comprensión de subtemas */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Conceptos que debes dominar:
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Marca las casillas conforme sientas que ya comprendiste cada parte.
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {doneSubs} de {activeTopic.subtopics.length}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {activeTopic.subtopics.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => actions.toggleSubtopic(activeTopic.id, sub.id, !sub.done)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                      sub.done
                        ? 'border-emerald-200 bg-emerald-50/70 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                        sub.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {sub.done ? '✓' : '○'}
                    </span>
                    <span className={`text-xs sm:text-sm font-medium ${sub.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {sub.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Apuntes de Ingrid */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-sm">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <NotebookPen size={15} className="text-indigo-600" /> Mis notas personales de esta clase:
              </label>
              <textarea
                rows={2}
                placeholder="Escribe dudas para preguntarle a Brian o trucos que quieras recordar..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
              />
            </section>

            {/* Botón para pasar al siguiente paso */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setClassStep(2)}
                className="btn btn-primary px-6 py-3 text-xs sm:text-sm font-black shadow-md cursor-pointer"
              >
                Paso 2: Ver Ejemplos Resueltos <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ───────── PASO 2: EJEMPLOS RESUELTOS PASO A PASO ───────── */}
        {classStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-center gap-2.5">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span>
                <strong>Así viene en el examen:</strong> Revisa el desarrollo de cada reactivo para aprender a resolverlo rápido y descartar respuestas trampa.
              </span>
            </div>

            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black">
                      {idx + 1}
                    </span>
                    {ex.title}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Problema Explicado
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 font-semibold text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {ex.problem}
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs text-indigo-950 leading-relaxed">
                    <strong className="text-indigo-700 font-bold block mb-1">Paso 1: Identificar datos y fórmula</strong>
                    {ex.step1}
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-950 leading-relaxed">
                    <strong className="text-emerald-700 font-bold block mb-1">Paso 2: Operaciones y despeje</strong>
                    {ex.step2}
                  </div>

                  <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 text-xs text-purple-950 leading-relaxed">
                    <strong className="text-purple-700 font-bold block mb-1">Paso 3: Conclusión y respuesta</strong>
                    {ex.step3}
                  </div>
                </div>

                {ex.examSecret && (
                  <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3 text-xs text-amber-900 font-medium flex items-center gap-2">
                    <Zap size={14} className="text-amber-600 shrink-0" />
                    <span><strong>Truco del examen:</strong> {ex.examSecret}</span>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setClassStep(1)}
                className="btn btn-ghost px-5 py-2.5 text-xs font-bold"
              >
                <ArrowLeft size={14} /> Volver a la explicación
              </button>

              <button
                type="button"
                onClick={() => setClassStep(3)}
                className="btn btn-primary px-6 py-3 text-xs sm:text-sm font-black shadow-md cursor-pointer"
              >
                Paso 3: Tarjetas de Repaso <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ───────── PASO 3: TARJETAS DE MEMORIA DEL TEMA ───────── */}
        {classStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 text-xs text-indigo-900 flex items-center gap-2.5">
              <Layers size={16} className="text-indigo-600 shrink-0" />
              <span>
                <strong>Memorización activa:</strong> Lee la pregunta, piensa la respuesta y toca la tarjeta para comprobar si acertaste antes del quiz.
              </span>
            </div>

            {topicCards.length > 0 ? (
              <div className="space-y-4">
                {/* Selector rápido de tarjeta */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Tarjeta {activeCardIndex + 1} de {topicCards.length}</span>
                  <span className="text-indigo-600 flex items-center gap-1">
                    <RotateCcw size={12} /> Toca la tarjeta para voltearla
                  </span>
                </div>

                {/* Tarjeta interactiva */}
                <div
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className={`min-h-[260px] sm:min-h-[280px] rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-md ${
                    cardFlipped
                      ? 'bg-linear-to-br from-indigo-50 via-white to-emerald-50 border-indigo-300'
                      : 'bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-100 text-indigo-800 px-3 py-0.5 text-xs font-black">
                      {topicCards[activeCardIndex].topic}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {cardFlipped ? 'Respuesta' : 'Pregunta'}
                    </span>
                  </div>

                  <div className="my-auto py-4 text-center space-y-2">
                    {!cardFlipped ? (
                      <>
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Pregunta</p>
                        <h3 className="font-display text-lg sm:text-xl font-black text-slate-900">
                          {topicCards[activeCardIndex].question}
                        </h3>
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Respuesta</p>
                        <p className="font-display text-base sm:text-lg font-bold text-slate-800 whitespace-pre-line leading-relaxed">
                          {topicCards[activeCardIndex].answer}
                        </p>
                        {topicCards[activeCardIndex].tip && (
                          <p className="text-xs text-amber-800 bg-amber-50 rounded-xl p-2 font-medium mt-2 inline-block">
                            💡 {topicCards[activeCardIndex].tip}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-center text-xs font-bold text-slate-400">
                    {cardFlipped ? 'Toca para volver a la pregunta' : 'Toca para ver la respuesta'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={activeCardIndex === 0}
                    onClick={() => {
                      setCardFlipped(false)
                      setActiveCardIndex((i) => Math.max(0, i - 1))
                    }}
                    className="btn btn-ghost px-4 py-2 text-xs font-bold"
                  >
                    <ArrowLeft size={14} /> Anterior
                  </button>

                  <button
                    type="button"
                    disabled={activeCardIndex === topicCards.length - 1}
                    onClick={() => {
                      setCardFlipped(false)
                      setActiveCardIndex((i) => Math.min(topicCards.length - 1, i + 1))
                    }}
                    className="btn btn-ghost px-4 py-2 text-xs font-bold"
                  >
                    Siguiente tarjeta <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Pasa al siguiente paso para realizar el quiz del tema.
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClassStep(2)}
                className="btn btn-ghost px-5 py-2.5 text-xs font-bold"
              >
                <ArrowLeft size={14} /> Volver a Ejemplos
              </button>

              <button
                type="button"
                onClick={() => setClassStep(4)}
                className="btn btn-primary px-6 py-3 text-xs sm:text-sm font-black shadow-md cursor-pointer"
              >
                Paso 4: ¡Hacer el Quiz del Tema! 🎯 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ───────── PASO 4: EVALUACIÓN Y QUIZ DEL TEMA ───────── */}
        {classStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl border border-emerald-300 bg-linear-to-br from-emerald-50 via-white to-indigo-50 p-6 sm:p-8 shadow-lg text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                <Trophy size={28} />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  <Sparkles size={13} /> Evaluación Final del Tema
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  ¡Hora de demostrar lo que aprendiste!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                  Responde los reactivos específicos de <strong>{activeTopic.title}</strong> para ganar puntos y marcar la clase como dominada.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate('simulador', {
                      topic: activeTopic.id,
                      subject: currentSubject.id,
                      auto: 'true',
                    })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-xs sm:text-sm font-black text-white shadow-xl shadow-indigo-200 transition cursor-pointer"
                >
                  <Zap size={18} fill="currentColor" /> Comenzar Quiz de este Tema
                </button>

                <button
                  type="button"
                  onClick={() => {
                    actions.setTopicStatus(activeTopic.id, 'dominado')
                    toast({ tone: 'success', title: '¡Clase marcada como Dominada! 🌟' })
                  }}
                  className="w-full sm:w-auto rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-4 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Ya lo sé todo, marcar como Dominada
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setClassStep(1)}
                className="btn btn-ghost px-5 py-2.5 text-xs font-bold"
              >
                <ArrowLeft size={14} /> Volver a repasar la explicación
              </button>
            </div>
          </div>
        )}

        {/* Navegación entre temas (Anterior y Siguiente) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
          {prevTopic ? (
            <button
              type="button"
              onClick={() => {
                setActiveTopicId(prevTopic.id)
                setClassStep(1)
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Anterior: {prevTopic.title}
            </button>
          ) : <div />}

          {nextTopic ? (
            <button
              type="button"
              onClick={() => {
                setActiveTopicId(nextTopic.id)
                setClassStep(1)
              }}
              className="flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              Siguiente: {nextTopic.title} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTopicId(null)
                navigate('ruta', { subject: currentSubject.id })
              }}
              className="font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
            >
              ¡Has terminado todos los temas de {currentSubject.name}!
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────────────────
     VISTA 2: LISTA GENERAL DE MATERIAS Y SUS CLASES
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700">
            <BookOpen size={13} /> Tu Salón de Clases
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Mis Clases ECOEMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Selecciona una materia, lee la clase con ejemplos resueltos y pon a prueba tu conocimiento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('tarjetas')}
          className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Layers size={15} /> Ver Tarjetas de Memoria
        </button>
      </div>

      {/* Selector de Materias en Pestañas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SUBJECTS.map((sub) => {
          const active = sub.id === selectedSubjectId
          const p = subjectProgress(state, sub.id)
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer border ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <SubjectIcon subjectId={sub.id} size="xs" />
              <span>{sub.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {p.dominado}/{p.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tarjeta de Progreso de la Materia Seleccionada */}
      <div
        className="rounded-3xl border bg-white p-6 sm:p-7 shadow-sm space-y-3"
        style={{
          borderColor: `${currentSubject.color}40`,
          backgroundImage: `linear-gradient(135deg, ${currentSubject.color}08, #ffffff 65%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SubjectIcon subjectId={currentSubject.id} size="md" />
            <div>
              <h2 className="text-lg font-black text-slate-900">{currentSubject.name}</h2>
              <p className="text-xs text-slate-500">{currentSubject.description}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">Avance de la materia</span>
            <p className="font-display text-xl font-black" style={{ color: currentSubject.color }}>
              {progress.pct}% ({progress.dominado} de {progress.total} clases dominadas)
            </p>
          </div>
        </div>

        <ProgressBar value={progress.pct} color={currentSubject.color} height={7} />
      </div>

      {/* Lista de Clases / Temas */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider px-1">
          Clases de {currentSubject.name} (en orden recomendado)
        </h3>

        {topics.map((t, idx) => {
          const isMastered = t.status === 'dominado'
          const doneSubs = t.subtopics.filter((s) => s.done).length

          return (
            <div
              key={t.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isMastered
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-700">
                    {idx + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isMastered ? '✓ Clase Dominada' : 'Por Estudiar'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Clock size={12} /> ~{t.minutes} min
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-slate-900">
                  {t.title}
                </h4>

                <p className="text-xs text-slate-500">
                  {doneSubs} de {t.subtopics.length} partes dominadas
                </p>
              </div>

              {/* Botones de Acción: Entrar a Clase vs Hacer Quiz */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTopicId(t.id)
                    setClassStep(1)
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-3 text-xs shadow-md shadow-indigo-200 transition cursor-pointer"
                >
                  <BookOpen size={15} /> Entrar a la Clase
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate('simulador', {
                      topic: t.id,
                      subject: currentSubject.id,
                      auto: 'true',
                    })
                  }
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-4 py-3 text-xs transition cursor-pointer"
                  title="Saltar directo al quiz si ya lo leíste"
                >
                  <Zap size={14} className="text-amber-600" /> Quiz directo
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
