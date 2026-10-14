/**
 * Indicadores de progreso: barra lineal y anillo circular (SVG).
 */

export function ProgressBar({ value = 0, color, height = 8, className = '', glow = true, label }) {
  const v = Math.max(0, Math.min(100, value))
  const bg = color ?? 'linear-gradient(90deg, var(--color-mint-400), var(--color-sky-glow), var(--color-iris-400))'
  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-white/8 ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="relative h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${v}%`,
          background: bg,
          boxShadow: glow && v > 0 ? `0 0 12px ${color ?? 'rgb(110 240 195 / 0.5)'}` : undefined,
        }}
      >
        <span className="shimmer-bar absolute inset-0 rounded-full opacity-40" />
      </div>
    </div>
  )
}

export function ProgressRing({ value = 0, size = 72, stroke = 7, color = '#6ef0c3', track = 'rgb(255 255 255 / 0.08)', children, gradientId }) {
  const v = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c
  const id = gradientId ?? `ring-${color.replace('#', '')}`
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
