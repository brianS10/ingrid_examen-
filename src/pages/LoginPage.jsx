/**
 * Pantalla de inicio de sesión luminosa, acogedora y amigable.
 * Cuentas configuradas:
 *  - Estudiante: usuario 'ingrid', contraseña 'sanchez' -> rol 'estudiante'
 *  - Tutor: usuario 'brian', contraseña 'sanchez' -> rol 'tutor'
 */
import { useState } from 'react'
import { Eye, EyeOff, GraduationCap, Lock, LogIn, Rocket, Sparkles, User, UserCheck } from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const u = username.trim().toLowerCase()
    const p = password.trim()

    setTimeout(() => {
      if (u === 'ingrid' && p === 'sanchez') {
        onLogin({
          username: 'ingrid',
          name: 'Ingrid',
          role: 'estudiante',
        })
      } else if (u === 'brian' && p === 'sanchez') {
        onLogin({
          username: 'brian',
          name: 'Brian',
          role: 'tutor',
        })
      } else {
        setError('Usuario o contraseña incorrectos. Verifica tus datos.')
        setLoading(false)
      }
    }, 250)
  }

  // Atajos para pruebas rápidas
  const fillCredentials = (user, pass) => {
    setUsername(user)
    setPassword(pass)
    setError('')
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-50/80">
      {/* Fondos suaves y cálidos */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo & Marca */}
        <div className="text-center mb-7">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-xl shadow-indigo-200 mb-3.5">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white">
              <Rocket size={32} className="text-indigo-600" strokeWidth={2.4} />
            </div>
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900 sm:text-4xl">
            Misión Prepa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Aprende fácil y prepárate para el examen <strong className="text-indigo-600 font-bold">ECOEMS / COMIPEMS</strong>
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <LogIn size={18} className="text-indigo-600" /> Iniciar Sesión
            </h2>
            <span className="text-xs font-bold text-slate-400">Acceso Seguro</span>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700 animate-pop flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-username">
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  className="input pl-10"
                  placeholder="Ej: ingrid o brian"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pl-10 pr-10"
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-sm font-black shadow-md shadow-indigo-200 cursor-pointer mt-2"
            >
              {loading ? 'Ingresando...' : 'Comenzar a Estudiar 🚀'}
            </button>
          </form>

          {/* Botones de acceso rápido amigables */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center mb-3">
              ¿Quién va a ingresar hoy?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('ingrid', 'sanchez')}
                className="flex flex-col items-center gap-1 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 hover:bg-emerald-100 transition cursor-pointer text-center group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-xs">
                  <GraduationCap size={16} />
                </div>
                <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Ingrid</span>
                <span className="text-[10px] font-semibold text-slate-500">Estudiante</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('brian', 'sanchez')}
                className="flex flex-col items-center gap-1 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3 hover:bg-indigo-100 transition cursor-pointer text-center group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-xs">
                  <UserCheck size={16} />
                </div>
                <span className="text-xs font-black text-slate-900 group-hover:text-indigo-700">Brian</span>
                <span className="text-[10px] font-semibold text-slate-500">Tutor / Admin</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Preparación integral para ingreso a Preparatoria UNAM, CCH y Bachilleres.
        </p>
      </div>
    </div>
  )
}
