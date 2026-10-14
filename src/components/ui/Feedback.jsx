/**
 * Notificaciones flotantes (toasts) y encabezado de página.
 */
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Icon } from './Icon'

const TONES = {
  success: { icon: CheckCircle2, color: '#6ef0c3' },
  info: { icon: Info, color: '#5ab4ff' },
  warning: { icon: TriangleAlert, color: '#fbbf24' },
  badge: { icon: null, color: '#c4b5fd' },
}

export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6" aria-live="polite">
      {toasts.map((t) => {
        const tone = TONES[t.tone] ?? TONES.info
        const Ico = tone.icon
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-pop items-start gap-3 rounded-2xl border border-white/10 bg-ink-850/95 p-4 shadow-2xl backdrop-blur-xl"
            style={{ boxShadow: `0 20px 50px -20px ${tone.color}66` }}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.tone === 'badge' ? 'animate-float' : ''}`}
              style={{ background: `${tone.color}22`, color: tone.color }}
            >
              {Ico ? <Ico size={18} /> : <Icon name={t.icon} size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-ink-300">{t.description}</p>}
            </div>
            <button type="button" onClick={() => dismissToast(t.id)} className="cursor-pointer text-ink-300 hover:text-white" aria-label="Cerrar notificación">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions, icon: Ico }) {
  return (
    <header className="mb-6 flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-mint-400 uppercase">
            {Ico && <Ico size={14} />}
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function EmptyState({ icon: Ico, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center">
      {Ico && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-iris-500/15 text-iris-300">
          <Ico size={26} />
        </span>
      )}
      <p className="font-display text-lg font-bold text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-300">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
