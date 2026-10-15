/**
 * Pantalla de inicio de sesión para Misión Prepa.
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
    }, 350)
  }

  // Atajos para pruebas rápidas
  const fillCredentials = (user, pass) => {
    setUsername(user)
    setPassword(pass)
    setError('')
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Fondos suaves y naturales */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo & Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 p-0.5 shadow-xl shadow-indigo-500/20 mb-4">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-slate-950/80 backdrop-blur-sm">
              <Rocket size={32} className="text-white" strokeWidth={2.4} />
            </div>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Misión Prepa
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Plataforma interactiva de estudio y tutoría para el examen <strong className="text-emerald-400">ECOEMS / COMIPEMS</strong>
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="card p-6 sm:p-8 backdrop-blur-2xl border-white/10 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LogIn size={18} className="text-mint-400" /> Iniciar Sesión
            </h2>
            <span className="text-xs font-semibold text-ink-300">Acceso Seguro</span>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 animate-pop flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-username">
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  className="input pl-10"
                  placeholder="ej. ingrid o brian"
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
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-white p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-sm font-bold shadow-xl shadow-iris-600/30 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} /> Entrar a la plataforma
                </span>
              )}
            </button>
          </form>

          {/* Accesos rápidos preconfigurados para comodidad */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Seleccionar perfil rápido
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('ingrid', 'sanchez')}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-left text-xs hover:border-emerald-500/40 hover:bg-emerald-500/10 transition cursor-pointer group"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition">
                  <GraduationCap size={15} />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">Ingrid</p>
                  <p className="text-[10px] text-slate-400">Estudiante</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('brian', 'sanchez')}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-left text-xs hover:border-indigo-400/40 hover:bg-indigo-500/10 transition cursor-pointer group"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-105 transition">
                  <UserCheck size={15} />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">Brian</p>
                  <p className="text-[10px] text-slate-400">Tutor</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de pie */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Preparación para el examen de ingreso a preparatoria · ECOEMS / COMIPEMS
        </p>
      </div>
    </div>
  )
}
