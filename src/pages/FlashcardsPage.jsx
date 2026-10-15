/**
 * Centro de Tarjetas de Memoria (Flashcards) para el examen ECOEMS.
 * Aprendizaje activo y dinámico: voltea la tarjeta, memoriza conceptos clave y mide tu dominio.
 */
import { useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Award, CheckCircle2, ChevronRight,
  Flame, HelpCircle, Layers, RefreshCw, RotateCcw, Shuffle,
  Sparkles, Star, Trophy, Zap
} from 'lucide-react'
import { FLASHCARD_DECKS } from '../data/flashcardsData'
import { useApp } from '../context/AppContext'

export default function FlashcardsPage() {
  const { navigate, isTutor } = useApp()
  const [selectedSubjectId, setSelectedSubjectId] = useState('matematicas')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCardIds, setKnownCardIds] = useState(new Set())
  const [viewMode, setViewMode] = useState('interactive') // 'interactive' | 'grid'

  const currentDeck = useMemo(() => {
    return FLASHCARD_DECKS.find((d) => d.subjectId === selectedSubjectId) || FLASHCARD_DECKS[0]
  }, [selectedSubjectId])

  const cards = currentDeck.cards
  const currentCard = cards[currentIndex] || cards[0]
  const isMastered = knownCardIds.has(currentCard?.id)
  const totalMasteredInDeck = cards.filter((c) => knownCardIds.has(c.id)).length
  const pctDeck = Math.round((totalMasteredInDeck / cards.length) * 100) || 0

  // Cambiar de materia
  const handleSelectSubject = (id) => {
    setSelectedSubjectId(id)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // Marcar como conocida o para repasar
  const markKnown = (known) => {
    setKnownCardIds((prev) => {
      const next = new Set(prev)
      if (known) next.add(currentCard.id)
      else next.delete(currentCard.id)
      return next
    })

    // Pasar a la siguiente tarjeta si hay más
    if (currentIndex < cards.length - 1) {
      setTimeout(() => {
        setIsFlipped(false)
        setCurrentIndex((i) => i + 1)
      }, 200)
    }
  }

  // Barajar mazo
  const shuffleDeck = () => {
    setIsFlipped(false)
    setCurrentIndex(0)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-black text-indigo-700">
            <Layers size={13} /> Memorización Rápida
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Tarjetas de Memoria ECOEMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Voltea las tarjetas para repasar fórmulas, fechas y conceptos que siempre vienen en el examen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'interactive' ? 'grid' : 'interactive'))}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            {viewMode === 'interactive' ? 'Ver todas en cuadrícula' : 'Modo Interactivo (1 a 1)'}
          </button>
        </div>
      </div>

      {/* Selector de Mazos por Materia */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FLASHCARD_DECKS.map((deck) => {
          const active = deck.subjectId === selectedSubjectId
          const masteredInThis = deck.cards.filter((c) => knownCardIds.has(c.id)).length
          return (
            <button
              key={deck.subjectId}
              type="button"
              onClick={() => handleSelectSubject(deck.subjectId)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer border ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <span>{deck.subjectName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {masteredInThis}/{deck.cards.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Barra de dominio del mazo */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              Dominio del mazo: <span style={{ color: currentDeck.color }}>{currentDeck.subjectName}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Has dominado {totalMasteredInDeck} de {cards.length} tarjetas ({pctDeck}%)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pctDeck}%`, backgroundColor: currentDeck.color }}
          />
        </div>
      </div>

      {/* ───────── VISTA INTERACTIVA (TARJETA QUE GIRA) ───────── */}
      {viewMode === 'interactive' && currentCard && (
        <div className="space-y-4">
          {/* Contador de posición */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>
              Tarjeta {currentIndex + 1} de {cards.length}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <RefreshCw size={12} /> Haz clic en la tarjeta para voltearla
            </span>
          </div>

          {/* Tarjeta 3D */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative min-h-[300px] sm:min-h-[320px] w-full rounded-3xl cursor-pointer select-none transition-all duration-300 hover:shadow-xl"
            style={{ perspective: '1000px' }}
          >
            <div
              className={`relative h-full min-h-[300px] sm:min-h-[320px] w-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg flex flex-col justify-between transition-all duration-500 ${
                isFlipped
                  ? 'bg-linear-to-br from-indigo-50/70 via-white to-emerald-50/50 border-indigo-200'
                  : 'hover:border-slate-300'
              }`}
            >
              {/* Badge de tema y estado */}
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-extrabold"
                  style={{
                    backgroundColor: `${currentDeck.color}15`,
                    color: currentDeck.color,
                  }}
                >
                  {currentCard.topic}
                </span>

                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isMastered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isMastered ? '✓ Dominada' : 'Por repasar'}
                </span>
              </div>

              {/* Contenido (Pregunta o Respuesta) */}
              <div className="my-auto py-6 text-center space-y-3">
                {!isFlipped ? (
                  <>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Pregunta de Examen
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {currentCard.question}
                    </h2>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center justify-center gap-1">
                      <Sparkles size={13} /> Respuesta Correcta
                    </p>
                    <div className="font-display text-lg sm:text-xl font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                      {currentCard.answer}
                    </div>

                    {currentCard.tip && (
                      <div className="mt-3 inline-block rounded-xl bg-amber-50/80 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 text-left">
                        💡 <strong>Truco ECOEMS:</strong> {currentCard.tip}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Indicador inferior */}
              <div className="flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition">
                <RotateCcw size={13} className="mr-1.5" />
                {isFlipped ? 'Toca para volver a la pregunta' : 'Toca para ver la respuesta'}
              </div>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  setIsFlipped(false)
                  setCurrentIndex((i) => Math.max(0, i - 1))
                }}
                className="btn btn-ghost flex-1 sm:flex-initial py-2.5 text-xs font-bold"
              >
                <ArrowLeft size={14} /> Anterior
              </button>

              <button
                type="button"
                disabled={currentIndex === cards.length - 1}
                onClick={() => {
                  setIsFlipped(false)
                  setCurrentIndex((i) => Math.min(cards.length - 1, i + 1))
                }}
                className="btn btn-ghost flex-1 sm:flex-initial py-2.5 text-xs font-bold"
              >
                Siguiente <ArrowRight size={14} />
              </button>
            </div>

            {/* ¿Te la supiste? */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => markKnown(false)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw size={14} /> Repasar después
              </button>

              <button
                type="button"
                onClick={() => markKnown(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 px-5 py-2.5 text-xs font-bold transition cursor-pointer"
              >
                <CheckCircle2 size={15} /> ¡Me la sé!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── VISTA CUADRÍCULA (TODAS LAS TARJETAS) ───────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, idx) => {
            const mastered = knownCardIds.has(card.id)
            return (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400"># {idx + 1} · {card.topic}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setKnownCardIds((prev) => {
                        const next = new Set(prev)
                        if (mastered) next.delete(card.id)
                        else next.add(card.id)
                        return next
                      })
                    }}
                    className={`rounded-lg px-2 py-0.5 text-[11px] font-black cursor-pointer border ${
                      mastered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {mastered ? '✓ Dominada' : 'Por repasar'}
                  </button>
                </div>

                <h3 className="font-display text-sm font-black text-slate-900">
                  {card.question}
                </h3>

                <div className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700 whitespace-pre-line border border-slate-100">
                  {card.answer}
                </div>

                {card.tip && (
                  <p className="text-[11px] text-amber-700 font-medium">
                    💡 {card.tip}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Banner de motivación final */}
      <div className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/60 via-purple-50/40 to-emerald-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              ¿Quieres poner a prueba lo que memorizaste?
            </h4>
            <p className="text-xs text-slate-600">
              Ve a las clases completas o realiza un quiz rápido para ganar puntos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('ruta', { subject: selectedSubjectId })}
          className="btn btn-primary px-5 py-2.5 text-xs font-black shrink-0 cursor-pointer"
        >
          Ir a las clases de {currentDeck.subjectName} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
