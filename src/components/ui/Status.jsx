/**
 * Componentes de estado de un tema: insignia y selector segmentado.
 */
import { Circle, CircleCheckBig, RefreshCw } from 'lucide-react'
import { TOPIC_STATUS } from '../../data/subjects'

const STATUS_ICON = { pendiente: Circle, repaso: RefreshCw, dominado: CircleCheckBig }

export function StatusBadge({ status, className = '' }) {
  const s = TOPIC_STATUS[status]
  const Ico = STATUS_ICON[status]
  return (
    <span
      className={`chip ${className}`}
      style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}14` }}
    >
      <Ico size={12} strokeWidth={2.6} />
      {s.label}
    </span>
  )
}

/** Selector de 3 estados: Pendiente · En repaso · Dominado */
export function StatusSelector({ value, onChange, size = 'md', idPrefix = 'status' }) {
  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-ink-950/60 p-1" role="radiogroup" aria-label="Estado del tema">
      {Object.entries(TOPIC_STATUS).map(([key, s]) => {
        const active = value === key
        const Ico = STATUS_ICON[key]
        return (
          <button
            key={key}
            id={`${idPrefix}-${key}`}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(e) => {
              e.stopPropagation()
              onChange(key)
            }}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl font-semibold transition-all duration-200 ${
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
            } ${active ? 'scale-100 shadow-lg' : 'text-ink-300 hover:text-white'}`}
            style={active ? { background: `${s.color}22`, color: s.color, boxShadow: `inset 0 0 0 1px ${s.color}55` } : undefined}
          >
            <Ico size={size === 'sm' ? 12 : 14} strokeWidth={2.5} />
            <span className={size === 'sm' ? 'hidden sm:inline' : ''}>{s.label}</span>
          </button>
        )
      })}
    </div>
  )
}
