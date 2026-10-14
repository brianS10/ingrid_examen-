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

export const NAV_ITEMS = [
  { id: 'inicio', label: 'Mi Día', icon: Home },
  { id: 'ruta', label: 'Materias', icon: BookOpen },
  { id: 'simulador', label: 'Practicar', icon: Zap },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'estadisticas', label: 'Progreso', icon: Award },
]

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-iris-500 via-sky-400 to-mint-400 shadow-lg shadow-iris-600/30">
        <Rocket size={20} className="text-white" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-base font-extrabold text-white leading-tight">Misión Prepa</p>
          <p className="text-[10px] font-bold tracking-wider text-mint-400 uppercase">COMIPEMS</p>
        </div>
      )}
    </div>
  )
}

function Sidebar() {
  const { route, navigate, state, actions, isTutor, toast } = useApp()
  const days = daysUntil(state.examDate)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-white/6 bg-ink-900/80 px-4 py-6 backdrop-blur-2xl lg:flex">
      <div>
        <Logo />

        {/* Menú de navegación principal con iconos amigables */}
        <nav className="mt-8 space-y-1.5" aria-label="Navegación principal">
          {NAV_ITEMS.map(({ id, label, icon: Ico }) => {
            const active = route.view === id
            return (
              <button
                key={id}
                id={`nav-${id}`}
                type="button"
                onClick={() => navigate(id)}
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition-all ${
                  active
                    ? 'bg-mint-400/15 text-mint-300 shadow-md shadow-mint-500/10'
                    : 'text-ink-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    active ? 'bg-mint-400 text-ink-950 shadow-sm' : 'bg-white/5 text-ink-300 group-hover:text-white'
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
        <div className="rounded-2xl border border-iris-500/20 bg-linear-to-br from-iris-600/15 to-transparent p-3.5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-iris-300">Faltan para el examen</p>
          <p className="font-display text-2xl font-black text-white mt-0.5">
            {Math.max(0, days)} <span className="text-sm font-bold text-ink-200">días</span>
          </p>
        </div>

        {/* Tarjeta de usuario activa con botón de salir bien claro */}
        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-ink-950/60 p-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold ${
                isTutor ? 'bg-iris-500/20 text-iris-300' : 'bg-mint-400/20 text-mint-400'
              }`}
            >
              {isTutor ? <UserCheck size={16} /> : <GraduationCap size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-white">
                {isTutor ? state.profile.tutor : state.profile.student}
              </p>
              <p className="text-[10px] text-ink-300 font-medium">
                {isTutor ? 'Tutor' : 'Aspirante'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              actions.logout()
              window.location.hash = '#/inicio'
              toast({ tone: 'info', title: 'Hasta pronto 👋' })
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-ink-300 hover:bg-rose-500/15 hover:text-rose-400 transition"
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
  const name = isTutor ? state.profile.tutor : state.profile.student

  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="lg:hidden">
          <Logo compact />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-bold text-white">
            {isTutor ? `Panel de Brian (Supervisando a ${state.profile.student})` : `¡Hola ${name}! 🍀`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Racha con llama */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300"
            title="Días de racha de estudio"
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
            className="flex h-8 items-center gap-1 rounded-xl border border-white/10 px-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 lg:hidden"
          >
            <LogOut size={13} /> Salir
          </button>

          {/* Ajustes en computadora */}
          <button
            type="button"
            onClick={() => navigate('ajustes')}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-ink-300 hover:bg-white/5 hover:text-white transition"
            title="Ajustes"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const { route, navigate } = useApp()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 py-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Ico }) => {
          const active = route.view === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={`flex cursor-pointer flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
                active ? 'text-mint-400' : 'text-ink-300 hover:text-white'
              }`}
            >
              <span className={`flex h-7 w-10 items-center justify-center rounded-full transition ${active ? 'bg-mint-400/20' : ''}`}>
                <Ico size={18} strokeWidth={active ? 2.6 : 2} />
              </span>
              <span>{label}</span>
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
