/**
 * App principal de Misión Prepa:
 * Integra inicio de sesión protegido, AppShell, enrutador por hash (#/inicio, #/ruta, etc.) y Toaster.
 */
import { useApp } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Toaster } from './components/ui/Feedback'

// Vistas
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import LearningRoute from './pages/LearningRoute'
import Simulator from './pages/Simulator'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import SettingsPage from './pages/SettingsPage'

function PageRouter() {
  const { route } = useApp()

  switch (route.view) {
    case 'inicio':
      return <Dashboard />
    case 'ruta':
      return <LearningRoute />
    case 'simulador':
      return <Simulator />
    case 'tareas':
      return <Tasks />
    case 'estadisticas':
      return <Analytics />
    case 'ajustes':
      return <SettingsPage />
    default:
      return <Dashboard />
  }
}

export default function App() {
  const { state, actions, toast } = useApp()

  // Si no hay sesión iniciada, mostrar LoginPage
  if (!state.currentUser) {
    return (
      <>
        <LoginPage
          onLogin={(user) => {
            actions.login(user)
            toast({
              tone: 'success',
              title: `¡Bienvenid${user.name === 'Ingrid' ? 'a' : 'o'}, ${user.name}! 👋`,
              description:
                user.role === 'tutor'
                  ? 'Panel de tutor activado: monitorea y asigna tareas.'
                  : 'Tu misión COMIPEMS comienza hoy. ¡Mucho éxito!',
            })
          }}
        />
        <Toaster />
      </>
    )
  }

  return (
    <AppShell>
      <PageRouter />
      <Toaster />
    </AppShell>
  )
}
