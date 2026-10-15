/**
 * Tarjetas de logros (badges) luminosas y amigables.
 */
import { Lock } from 'lucide-react'
import { Icon } from './ui/Icon'
import { ProgressBar } from './ui/Progress'

export function BadgeCard({ badge, compact = false }) {
  const { unlocked, color, title, description, current, target, icon } = badge
  return (
    <div
      className={`group relative flex items-center gap-3 overflow-hidden rounded-3xl border transition duration-200 ${
        unlocked
          ? 'border-indigo-200/90 bg-white hover:-translate-y-0.5 shadow-xs hover:shadow-md'
          : 'border-slate-200 bg-slate-50/70 opacity-80'
      } ${compact ? 'p-3' : 'p-4 sm:p-5'}`}
      title={description}
    >
      {unlocked && (
        <span
          className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full blur-2xl opacity-20"
          style={{ background: color }}
        />
      )}
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 ${
          compact ? 'h-11 w-11' : 'h-12 w-12'
        }`}
        style={
          unlocked
            ? {
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                color: '#ffffff',
                boxShadow: `0 6px 16px -4px ${color}60`,
              }
            : { background: '#f1f5f9', color: '#94a3b8' }
        }
      >
        {unlocked ? <Icon name={icon} size={compact ? 20 : 22} strokeWidth={2.4} /> : <Lock size={compact ? 16 : 18} />}
      </span>
      <div className="relative min-w-0 flex-1">
        <p className={`truncate text-sm font-bold ${unlocked ? 'text-slate-900' : 'text-slate-600'}`}>{title}</p>
        {!compact && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        {!unlocked && (
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar value={(current / target) * 100} height={5} color={color} glow={false} />
            <span className="text-[10px] font-bold whitespace-nowrap text-slate-500 tabular-nums">
              {current}/{target}
            </span>
          </div>
        )}
        {unlocked && compact && <p className="text-[11px] font-bold" style={{ color }}>¡Desbloqueado!</p>}
      </div>
    </div>
  )
}
