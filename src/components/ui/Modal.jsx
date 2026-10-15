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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Cerrar"
        className="fixed inset-0 cursor-default bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={
          isDrawer
            ? `relative ml-auto flex h-full w-full ${width} animate-slide-in flex-col border-l border-slate-200 bg-white shadow-2xl z-10`
            : `relative m-auto flex max-h-[92dvh] w-full ${width} animate-scale-up flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl z-10`
        }
      >
        {header ?? (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-black text-slate-900">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
