/**
 * Modal reutilizable. `variant="drawer"` lo muestra como panel lateral (derecha).
 * Cierra con Escape o clic en el fondo. Bloquea el scroll del body mientras está abierto.
 */
import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, subtitle, children, footer, variant = 'center', size = 'md', header }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const isDrawer = variant === 'drawer'
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size]

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 cursor-default bg-ink-950/70 backdrop-blur-sm animate-[fade-up_0.25s_ease_both]"
        onClick={onClose}
      />
      <div
        className={
          isDrawer
            ? `relative ml-auto flex h-full w-full ${width} animate-slide-in flex-col border-l border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-xl`
            : `relative m-auto flex max-h-[92dvh] w-[calc(100%-1.5rem)] ${width} animate-pop flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-xl`
        }
      >
        {header ?? (
          <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-ink-300">{subtitle}</p>}
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost h-9 w-9 rounded-xl p-0" aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-white/8 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
