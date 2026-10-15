/**
 * Modal del Acordeón Oficial y Formulario del Examen ECOEMS.
 * Diseño limpio, claro, organizado por pestañas de materias.
 */
import { useState } from 'react'
import { BookOpen, Check, Copy, Sparkles, X, Zap } from 'lucide-react'
import { CHEATSHEET_SECTIONS } from '../../data/cheatSheetData'

export function CheatSheetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(CHEATSHEET_SECTIONS[0].id)
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!isOpen) return null

  const section = CHEATSHEET_SECTIONS.find((s) => s.id === activeTab) || CHEATSHEET_SECTIONS[0]

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-linear-to-r from-indigo-50 via-white to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-black text-slate-900">
                  Acordeón Oficial ECOEMS
                </h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                  Fórmulas & Reglas
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consulta rápida de fórmulas, fechas históricas y trucos clave para el examen.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selector de materias */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-100 bg-slate-50/80 overflow-x-auto no-scrollbar">
          {CHEATSHEET_SECTIONS.map((sec) => {
            const active = sec.id === activeTab
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveTab(sec.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{sec.title.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-slate-50/30">
          {section.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm hover:shadow-md transition space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: section.color }} />
                  {item.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleCopy(item.content, idx)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                  title="Copiar fórmula"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 font-mono text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line border border-slate-100">
                {item.content}
              </div>

              {item.tip && (
                <p className="text-[11px] font-medium text-amber-700 bg-amber-50/70 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500 shrink-0" />
                  <span>{item.tip}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Pie */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white text-xs text-slate-500">
          <span>💡 Tip: Puedes abrir este acordeón en cualquier momento para repasar.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            Listo, entendido
          </button>
        </div>
      </div>
    </div>
  )
}
