/**
 * Estructura principal: barra lateral (desktop), encabezado y navegación inferior (móvil).
 */
import {
  BarChart3, ClipboardList, Flame, GraduationCap, House, LogOut, Route, Rocket, Settings, Timer, UserRound,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { daysUntil, greeting } from '../../lib/date'

export const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: House },
  { id: 'ruta', label: 'Ruta', longLabel: 'Ruta de aprendizaje', icon: Route },
  { id: 'simulador', label: 'Simulador', icon: Timer },
  { id: 'tareas', label: 'Tareas', longLabel: 'Tareas y retos', icon: ClipboardList },
  { id: 'estadisticas', label: 'Progreso', longLabel: 'Estadísticas', icon: BarChart3 },
]

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-iris-500 via-sky-glow to-mint-400 shadow-lg shadow-iris-600/40">
        <Rocket size={20} className="text-white" strokeWidth={2.4} />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold text-white">Misión Prepa</p>
          <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase">COMIPEMS 2027</p>
        </div>
      )}
    </div>
  )
}

/** Interruptor de rol Estudiante / Tutor */
export function RoleSwitch({ className = '' }) {
  const { state, actions, toast } = useApp()
  const roles = [
    { id: 'estudiante', label: 'Estudiante', icon: GraduationCap },
    { id: 'tutor', label: 'Tutor', icon: UserRound },
  ]
  return (
    <div className={`inline-flex rounded-2xl border border-white/10 bg-ink-950/70 p-1 ${className}`} role="radiogroup" aria-label="Vista">
      {roles.map(({ id, label, icon: Ico }) => {
        const active = state.role === id
        return (
          <button
            key={id}
            id={`role-${id}`}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (active) return
              actions.setRole(id)
              toast({
                tone: 'info',
                title: id === 'tutor' ? 'Modo tutor activado' : 'Vista de estudiante',
                description: id === 'tutor' ? 'Puedes editar consejos, apuntes, tareas y el tema del día.' : '¡A estudiar! 💪',
                duration: 2500,
              })
            }}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              active
                ? id === 'tutor'
                  ? 'bg-iris-500 text-white shadow-lg shadow-iris-600/40'
                  : 'bg-mint-400 text-ink-950 shadow-lg shadow-mint-500/30'
                : 'text-ink-300 hover:text-white'
            }`}
          >
            <Ico size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function Sidebar() {
  const { route, navigate, state } = useApp()
  const days = daysUntil(state.examDate)
  const items = [...NAV_ITEMS, { id: 'ajustes', label: 'Ajustes', icon: Settings }]
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 flex-col border-r border-white/6 bg-ink-900/60 px-5 py-6 backdrop-blur-xl lg:flex">
      <Logo />
      <nav className="mt-10 flex flex-1 flex-col gap-1.5" aria-label="Navegación principal">
        {items.map(({ id, label, longLabel, icon: Ico }) => {
          const active = route.view === id
          return (
            <button
              key={id}
              id={`nav-${id}`}
              type="button"
              onClick={() => navigate(id)}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                active ? 'bg-white/8 text-white' : 'text-ink-300 hover:bg-white/4 hover:text-white'
              }`}
            >
              {active && <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-mint-400 shadow-[0_0_12px] shadow-mint-400" />}
              <Ico size={19} className={active ? 'text-mint-400' : 'transition group-hover:scale-110'} />
              {longLabel ?? label}
            </button>
          )
        })}
      </nav>

      {/* Mini contador */}
      <button
        type="button"
        onClick={() => navigate('inicio')}
        className="card mb-4 cursor-pointer overflow-hidden bg-linear-to-br from-iris-600/30 to-ink-850/80 p-4 text-left"
      >
        <p className="text-xs font-semibold text-iris-300">Faltan</p>
        <p className="font-display text-3xl font-extrabold text-white">
          {Math.max(0, days)} <span className="text-base font-bold text-ink-200">días</span>
        </p>
        <p className="text-xs text-ink-300">para tu examen COMIPEMS</p>
      </button>

      {/* Perfil activo y Cerrar Sesión */}
      <div className="rounded-2xl border border-white/8 bg-ink-950/60 p-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              {state.currentUser?.name || (state.role === 'tutor' ? state.profile.tutor : state.profile.student)}
            </p>
            <p className="text-[10px] font-semibold text-mint-400 capitalize">
              Rol: {state.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              actions.logout()
              toast({ tone: 'info', title: 'Sesión cerrada' })
            }}
            className="btn btn-ghost h-8 w-8 rounded-xl p-0 text-ink-300 hover:text-rose-400 hover:bg-rose-500/10"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function Header() {
  const { state, actions, navigate, isTutor, toast } = useApp()
  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm text-ink-300">
            {greeting()}, <span className="font-semibold text-white">{isTutor ? state.profile.tutor : state.profile.student}</span>
            {isTutor && <span className="text-ink-300"> · monitoreando a {state.profile.student}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="chip border-orange-400/30 bg-orange-400/10 text-orange-300"
            title="Días seguidos estudiando"
          >
            <Flame size={14} className={state.streak.count >= 3 ? 'animate-pulse' : ''} />
            {state.streak.count} {state.streak.count === 1 ? 'día' : 'días'}
          </span>
          <button
            type="button"
            id="header-logout"
            onClick={() => {
              actions.logout()
              toast({ tone: 'info', title: 'Sesión cerrada' })
            }}
            className="btn btn-ghost h-9 w-9 rounded-xl p-0 text-ink-300 hover:text-rose-400 hover:bg-rose-500/10 lg:hidden"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
          <button
            type="button"
            id="header-settings"
            onClick={() => navigate('ajustes')}
            className="btn btn-ghost h-9 w-9 rounded-xl p-0 lg:hidden"
            aria-label="Ajustes"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
      {isTutor && (
        <div className="border-t border-iris-400/20 bg-iris-500/10 py-1.5 text-center text-xs font-semibold text-iris-200">
          Modo Tutor Activo · viendo el progreso de {state.profile.student}
        </div>
      )}
    </header>
  )
}

function MobileNav() {
  const { route, navigate } = useApp()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-ink-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map(({ id, label, icon: Ico }) => {
          const active = route.view === id
          return (
            <button
              key={id}
              id={`mnav-${id}`}
              type="button"
              onClick={() => navigate(id)}
              className={`flex cursor-pointer flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                active ? 'text-mint-400' : 'text-ink-300'
              }`}
            >
              <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-all ${active ? 'bg-mint-400/15' : ''}`}>
                <Ico size={20} />
              </span>
              {label}
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
      <div className="lg:pl-68">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pb-12">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
