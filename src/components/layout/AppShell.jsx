/**
 * Estructura de navegación moderna, luminosa y amigable.
 * Menú claro:
 *  1. 🏠 Mi Salón (Inicio)
 *  2. 🎓 Mis Clases (Aula interactiva en 4 pasos)
 *  3. 🗂️ Tarjetas de Memoria (Flashcards)
 *  4. 📝 Tareas de Brian (Libreta y retroalimentación)
 *  5. 🎯 Quizzes & Examen (Simulador ECOEMS)
 *  6. 🏆 Mi Progreso (Estadísticas y medallas)
 *  + Botón de Acordeón Rápido siempre disponible.
 */
import { useState } from 'react'
import {
  Award, BookOpen, CheckSquare, Flame, GraduationCap, Home,
  Layers, LogOut, Rocket, Settings, Sparkles, UserCheck, Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { daysUntil } from '../../lib/date'
import { CheatSheetModal } from '../learning/CheatSheetModal'

export const TUTOR_NAV_ITEMS = [
  { id: 'inicio', label: 'Panel Tutor', icon: Home },
  { id: 'tareas', label: 'Tareas y Libreta', icon: CheckSquare },
  { id: 'ruta', label: 'Temario y Clases', icon: BookOpen },
  { id: 'tarjetas', label: 'Tarjetas de Memoria', icon: Layers },
  { id: 'estadisticas', label: 'Reporte Ingrid', icon: Award },
]

export const STUDENT_NAV_ITEMS = [
  { id: 'inicio', label: 'Mi Salón', icon: Home },
  { id: 'ruta', label: 'Mis Clases', icon: BookOpen },
  { id: 'tarjetas', label: 'Tarjetas', icon: Layers },
  { id: 'tareas', label: 'Tareas Brian', icon: CheckSquare },
  { id: 'simulador', label: 'Quizzes', icon: Zap },
  { id: 'estadisticas', label: 'Progreso', icon: Award },
]

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-md shadow-indigo-200">
        <Rocket size={20} className="text-white" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-base font-black text-slate-900 leading-tight">Misión Prepa</p>
          <p className="text-[10px] font-black tracking-wider text-indigo-600 uppercase">ECOEMS / COMIPEMS</p>
        </div>
      )}
    </div>
  )
}

function Sidebar({ onOpenCheatSheet }) {
  const { route, navigate, state, actions, isTutor, toast } = useApp()
  const days = daysUntil(state.examDate)
  const navItems = isTutor ? TUTOR_NAV_ITEMS : STUDENT_NAV_ITEMS

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-200/90 bg-white/95 px-4 py-6 backdrop-blur-xl lg:flex shadow-xs">
      <div>
        <Logo />

        {/* Indicador de perfil activo */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                isTutor ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isTutor ? <UserCheck size={16} /> : <GraduationCap size={16} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">
                {isTutor ? state.profile.tutor : state.profile.student}
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {isTutor ? 'Tutor / Admin' : 'Aspirante Prepa'}
              </p>
            </div>
          </div>
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${isTutor ? 'bg-indigo-600' : 'bg-emerald-500'}`}
            title="Sesión activa"
          />
        </div>

        {/* Botón destacado: Acordeón oficial */}
        <button
          type="button"
          onClick={onOpenCheatSheet}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-linear-to-r from-amber-50 to-orange-50 px-3.5 py-2.5 text-xs font-black text-amber-900 shadow-xs hover:border-amber-400 hover:shadow-sm transition"
        >
          <Zap size={14} className="text-amber-600 fill-amber-500" />
          <span>⚡ Acordeón de Examen</span>
        </button>

        {/* Menú de navegación principal con iconos amigables */}
        <nav className="mt-4 space-y-1" aria-label="Navegación principal">
          {navItems.map(({ id, label, icon: Ico }) => {
            const active = route.view === id
            return (
              <button
                key={id}
                id={`nav-${id}`}
                type="button"
                onClick={() => navigate(id)}
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    active ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'
                  }`}
                >
                  <Ico size={16} strokeWidth={2.4} />
                </span>
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3">
        {/* Contador amigable y minimalista */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Examen ECOEMS / COMIPEMS</p>
          <p className="font-display text-2xl font-black text-slate-900 mt-0.5">
            {Math.max(0, days)} <span className="text-xs font-bold text-slate-500">días faltan</span>
          </p>
        </div>

        {/* Botón de salir */}
        <button
          type="button"
          onClick={() => {
            actions.logout()
            window.location.hash = '#/inicio'
            toast({ tone: 'info', title: 'Hasta pronto 👋' })
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function Header({ onOpenCheatSheet }) {
  const { state, actions, navigate, isTutor, toast } = useApp()
  const name = isTutor ? state.profile.tutor : state.profile.student

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="lg:hidden">
          <Logo compact />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-bold text-slate-800">
            {isTutor ? (
              <span className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[11px] font-black text-indigo-700 border border-indigo-200">
                  Modo Tutor
                </span>
                Supervisando el estudio de {state.profile.student}
              </span>
            ) : (
              `¡Hola ${name}! 🍀 Mucho éxito en tu clase de hoy`
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Botón de Acordeón en cabecera para celular y escritorio */}
          <button
            type="button"
            onClick={onOpenCheatSheet}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900 hover:bg-amber-100 transition cursor-pointer"
            title="Abrir formulario y fórmulas"
          >
            <Zap size={13} className="text-amber-600 fill-amber-500" />
            <span className="hidden sm:inline">Acordeón Rápido</span>
            <span className="sm:hidden">Acordeón</span>
          </button>

          {/* Racha con llama */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 shadow-xs"
            title="Días seguidos de estudio"
          >
            <Flame size={14} className={state.streak.count > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
            <span>{state.streak.count} {state.streak.count === 1 ? 'día' : 'días'}</span>
          </div>

          {/* Salir en celular */}
          <button
            type="button"
            onClick={() => {
              actions.logout()
              window.location.hash = '#/inicio'
              toast({ tone: 'info', title: 'Hasta pronto 👋' })
            }}
            className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 lg:hidden cursor-pointer"
          >
            <LogOut size={13} /> Salir
          </button>

          {/* Ajustes: SOLO visible para el tutor / admin (Brian) */}
          {isTutor && (
            <button
              type="button"
              onClick={() => navigate('ajustes')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              title="Ajustes del tutor"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const { route, navigate, isTutor } = useApp()
  const navItems = isTutor ? TUTOR_NAV_ITEMS : STUDENT_NAV_ITEMS
  const cols = navItems.length === 5 ? 'grid-cols-5' : 'grid-cols-6'

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden shadow-lg"
      aria-label="Navegación móvil"
    >
      <div className={`mx-auto grid max-w-md ${cols} py-1.5`}>
        {navItems.map(({ id, label, icon: Ico }) => {
          const active = route.view === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={`flex cursor-pointer flex-col items-center gap-1 py-1 text-[10px] font-bold transition ${
                active ? 'text-indigo-600 font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`flex h-7 w-9 items-center justify-center rounded-xl transition ${active ? 'bg-indigo-100 text-indigo-700' : ''}`}>
                <Ico size={17} strokeWidth={active ? 2.6 : 2} />
              </span>
              <span className="truncate max-w-[55px]">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function AppShell({ children }) {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-slate-50/60">
      <Sidebar onOpenCheatSheet={() => setIsCheatSheetOpen(true)} />
      <div className="lg:pl-64">
        <Header onOpenCheatSheet={() => setIsCheatSheetOpen(true)} />
        <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 sm:px-6 lg:pb-12">{children}</main>
      </div>
      <MobileNav />
      <CheatSheetModal isOpen={isCheatSheetOpen} onClose={() => setIsCheatSheetOpen(false)} />
    </div>
  )
}
