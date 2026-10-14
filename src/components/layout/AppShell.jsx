/**
 * Estructura de navegación simplificada, amigable y limpia.
 * Menú claro:
 *  1. 🏠 Mi Día (Inicio)
 *  2. 📚 Materias (Temario fácil)
 *  3. ⚡ Practicar (Quizzes rápidos y simulacros)
 *  4. 📝 Tareas (Retos con Brian)
 *  5. 🏆 Progreso (Medallas y estadísticas)
 */
import {
  Award, BookOpen, CheckSquare, Flame, GraduationCap, Home,
  LogOut, Rocket, Settings, Sparkles, UserCheck, Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { daysUntil } from '../../lib/date'

export const TUTOR_NAV_ITEMS = [
  { id: 'inicio', label: 'Panel Tutor', icon: Home },
  { id: 'tareas', label: 'Tareas y Libreta', icon: CheckSquare },
  { id: 'ruta', label: 'Temario ECOEMS', icon: BookOpen },
  { id: 'estadisticas', label: 'Reporte Ingrid', icon: Award },
]

export const STUDENT_NAV_ITEMS = [
  { id: 'inicio', label: 'Mi Día', icon: Home },
  { id: 'ruta', label: 'Materias', icon: BookOpen },
  { id: 'simulador', label: 'Practicar', icon: Zap },
  { id: 'tareas', label: 'Mis Tareas', icon: CheckSquare },
  { id: 'estadisticas', label: 'Progreso', icon: Award },
]

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-md">
        <Rocket size={20} className="text-white" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-base font-extrabold text-white leading-tight">Misión Prepa</p>
          <p className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">ECOEMS / COMIPEMS</p>
        </div>
      )}
    </div>
  )
}

function Sidebar() {
  const { route, navigate, state, actions, isTutor, toast } = useApp()
  const days = daysUntil(state.examDate)
  const navItems = isTutor ? TUTOR_NAV_ITEMS : STUDENT_NAV_ITEMS

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-900/95 px-4 py-6 backdrop-blur-xl lg:flex">
      <div>
        <Logo />

        {/* Indicador de perfil activo */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isTutor ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isTutor ? <UserCheck size={14} /> : <GraduationCap size={14} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {isTutor ? state.profile.tutor : state.profile.student}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTutor ? 'Admin / Tutor' : 'Alumna ECOEMS'}
              </p>
            </div>
          </div>
          <span
            className={`inline-block h-2 w-2 rounded-full ${isTutor ? 'bg-indigo-400' : 'bg-emerald-400'}`}
            title="Sesión activa"
          />
        </div>

        {/* Menú de navegación principal con iconos amigables */}
        <nav className="mt-6 space-y-1.5" aria-label="Navegación principal">
          {navItems.map(({ id, label, icon: Ico }) => {
            const active = route.view === id
            return (
              <button
                key={id}
                id={`nav-${id}`}
                type="button"
                onClick={() => navigate(id)}
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    active ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 group-hover:text-white'
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
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Examen ECOEMS / COMIPEMS</p>
          <p className="font-display text-2xl font-black text-white mt-0.5">
            {Math.max(0, days)} <span className="text-sm font-bold text-slate-400">días restantes</span>
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function Header() {
  const { state, actions, navigate, isTutor, toast } = useApp()
  const name = isTutor ? state.profile.tutor : state.profile.student

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="lg:hidden">
          <Logo compact />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-white">
            {isTutor ? (
              <span className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-300 border border-indigo-500/30">
                  Modo Tutor
                </span>
                Asesorando a {state.profile.student} para el examen ECOEMS
              </span>
            ) : (
              `¡Hola ${name}! 🍀 Mucho éxito en tu estudio hoy`
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Racha con llama */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300"
            title="Días seguidos de estudio"
          >
            <Flame size={14} className={state.streak.count > 0 ? 'text-amber-400 fill-amber-400' : ''} />
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
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-800 px-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 lg:hidden"
          >
            <LogOut size={13} /> Salir
          </button>

          {/* Ajustes */}
          <button
            type="button"
            onClick={() => navigate('ajustes')}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Ajustes de la app"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const { route, navigate, isTutor } = useApp()
  const navItems = isTutor ? TUTOR_NAV_ITEMS : STUDENT_NAV_ITEMS
  const cols = navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden"
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
              className={`flex cursor-pointer flex-col items-center gap-1 py-1 text-[11px] font-semibold transition ${
                active ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`flex h-7 w-10 items-center justify-center rounded-full transition ${active ? 'bg-emerald-500/20' : ''}`}>
                <Ico size={18} strokeWidth={active ? 2.6 : 2} />
              </span>
              <span className="truncate max-w-[65px]">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function AppShell({ children }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 sm:px-6 lg:pb-12">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
