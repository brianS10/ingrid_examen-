/**
 * Contador regresivo al día del examen. Se actualiza cada segundo
 * (solo este componente se re-renderiza). El tutor puede editar la fecha.
 */
import { useEffect, useState } from 'react'
import { CalendarClock, Check, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatLongDate } from '../../lib/date'

function diffParts(target) {
  const ms = Math.max(0, new Date(target) - new Date())
  return {
    done: ms === 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  }
}

export function Countdown() {
  const { state, actions, isTutor, toast } = useApp()
  const [parts, setParts] = useState(() => diffParts(state.examDate))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(state.examDate)

  useEffect(() => {
    setParts(diffParts(state.examDate))
    const id = setInterval(() => setParts(diffParts(state.examDate)), 1000)
    return () => clearInterval(id)
  }, [state.examDate])

  const tiles = [
    { label: 'Días', value: parts.days },
    { label: 'Horas', value: parts.hours },
    { label: 'Min', value: parts.minutes },
    { label: 'Seg', value: parts.seconds },
  ]

  const save = () => {
    if (!draft) return
    actions.setExamDate(draft)
    setEditing(false)
    toast({ tone: 'success', title: 'Fecha del examen actualizada', description: formatLongDate(draft) })
  }

  return (
    <section className="card relative overflow-hidden" aria-labelledby="countdown-title">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-iris-500/25 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-iris-300 uppercase">
            <CalendarClock size={14} /> Cuenta regresiva
          </p>
          <h2 id="countdown-title" className="mt-1 text-lg font-bold">
            Día del examen
          </h2>
          <p className="text-sm text-ink-300 first-letter:uppercase">{formatLongDate(state.examDate)}</p>
        </div>
        {isTutor && !editing && (
          <button type="button" id="edit-exam-date" onClick={() => { setDraft(state.examDate); setEditing(true) }} className="btn btn-ghost h-9 w-9 rounded-xl p-0" aria-label="Editar fecha">
            <Pencil size={15} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="relative mt-4 flex gap-2">
          <input
            id="exam-date-input"
            type="datetime-local"
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="button" onClick={save} className="btn btn-mint px-3" aria-label="Guardar fecha">
            <Check size={18} />
          </button>
        </div>
      ) : (
        <div className="relative mt-4 grid grid-cols-4 gap-2">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-2xl border border-white/8 bg-ink-950/50 py-3 text-center">
              <p className="font-display text-2xl font-extrabold text-white tabular-nums sm:text-3xl">
                {String(t.value).padStart(2, '0')}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-ink-300 uppercase">{t.label}</p>
            </div>
          ))}
        </div>
      )}
      {parts.done && <p className="relative mt-3 text-sm font-semibold text-mint-300">¡Hoy es el gran día! Mucho éxito 🍀</p>}
    </section>
  )
}
