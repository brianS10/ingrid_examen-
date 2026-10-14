/**
 * Utilidades de fechas (locale es-MX).
 */

/** Devuelve una fecha ISO (YYYY-MM-DD) desplazada `n` días desde hoy. */
export function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toDateKey(d)
}

/** Fecha → "YYYY-MM-DD" en hora local. */
export function toDateKey(date = new Date()) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Convierte "YYYY-MM-DD" a Date local (evita el desfase UTC). */
export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Diferencia en días naturales entre hoy y una fecha clave. */
export function daysUntil(key) {
  const today = parseDateKey(toDateKey())
  const target = parseDateKey(key.slice(0, 10))
  return Math.round((target - today) / 86_400_000)
}

export function formatDate(value, opts = { day: 'numeric', month: 'short' }) {
  const d = typeof value === 'string' && value.length === 10 ? parseDateKey(value) : new Date(value)
  return d.toLocaleDateString('es-MX', opts)
}

export function formatLongDate(value) {
  return formatDate(value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** Segundos → "mm:ss" o "h:mm:ss" */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(h ? 2 : 1, '0')
  const ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/** Segundos → texto legible: "1 h 20 min", "45 s" */
export function formatDuration(totalSeconds) {
  const s = Math.round(totalSeconds)
  if (s < 60) return `${s} s`
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  return h ? `${h} h ${m} min` : `${m} min`
}

/** Índice del día del año (para rotar frases del día). */
export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date - start) / 86_400_000)
}

/** Saludo según la hora */
export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
