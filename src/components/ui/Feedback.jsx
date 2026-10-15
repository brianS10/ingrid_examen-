/**
 * Notificaciones flotantes (toasts) y encabezado de página.
 */
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Icon } from './Icon'

const TONES = {
  success: { icon: CheckCircle2, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
  info: { icon: Info, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', text: '#3730a3' },
  warning: { icon: TriangleAlert, color: '#d97706', bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  badge: { icon: null, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' },
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
            className="pointer-events-auto flex w-full max-w-sm animate-scale-up items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md"
            style={{ backgroundColor: '#ffffff', borderColor: tone.border }}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.tone === 'badge' ? 'animate-float' : ''}`}
              style={{ background: tone.bg, color: tone.color }}
            >
              {Ico ? <Ico size={18} /> : <Icon name={t.icon} size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-slate-600">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="cursor-pointer text-slate-400 hover:text-slate-700"
              aria-label="Cerrar notificación"
            >
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
          <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase">
            {Ico && <Ico size={14} />}
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function EmptyState({ icon: Ico, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-xs">
      {Ico && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Ico size={26} />
        </span>
      )}
      <p className="font-display text-lg font-bold text-slate-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
