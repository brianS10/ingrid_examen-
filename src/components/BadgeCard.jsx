/**
 * Tarjetas de logros (badges). Se usan en el Dashboard (compacto) y en Estadísticas (completo).
 */
import { Lock } from 'lucide-react'
import { Icon } from './ui/Icon'
import { ProgressBar } from './ui/Progress'

export function BadgeCard({ badge, compact = false }) {
  const { unlocked, color, title, description, current, target, icon } = badge
  return (
    <div
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 transition duration-300 ${
        unlocked ? 'border-white/10 bg-white/4 hover:-translate-y-0.5' : 'border-white/6 bg-ink-950/40'
      } ${compact ? '' : 'p-4'}`}
      title={description}
    >
      {unlocked && (
        <span className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full blur-2xl" style={{ background: `${color}30` }} />
      )}
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 ${
          compact ? 'h-11 w-11' : 'h-13 w-13'
        }`}
        style={
          unlocked
            ? { background: `linear-gradient(135deg, ${color}, ${color}88)`, color: '#060a1a', boxShadow: `0 8px 24px -8px ${color}` }
            : { background: 'rgb(255 255 255 / 0.05)', color: '#8d9acb' }
        }
      >
        {unlocked ? <Icon name={icon} size={compact ? 20 : 24} strokeWidth={2.4} /> : <Lock size={compact ? 16 : 20} />}
      </span>
      <div className="relative min-w-0 flex-1">
        <p className={`truncate text-sm font-bold ${unlocked ? 'text-white' : 'text-ink-200'}`}>{title}</p>
        {!compact && <p className="text-xs text-ink-300">{description}</p>}
        {!unlocked && (
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar value={(current / target) * 100} height={5} color={color} glow={false} />
            <span className="text-[10px] font-bold whitespace-nowrap text-ink-300 tabular-nums">
              {current}/{target}
            </span>
          </div>
        )}
        {unlocked && compact && <p className="text-[11px] font-semibold" style={{ color }}>Desbloqueado</p>}
      </div>
    </div>
  )
}
