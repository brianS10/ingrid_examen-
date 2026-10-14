/**
 * App principal de Misión Prepa:
 * - Vistas claramente separadas:
 *   * Cuando entra Brian (Tutor/Admin): Ve su Panel del Tutor (monitoreo, banco de tareas listas y revisión de fotos de libreta).
 *   * Cuando entra Ingrid (Estudiante): Ve su panel amigable ("Mi Día", sus materias ECOEMS, práctica y entrega de tareas con fotos).
 */
import { useApp } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Toaster } from './components/ui/Feedback'

// Vistas
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TutorDashboard from './pages/TutorDashboard'
import LearningRoute from './pages/LearningRoute'
import Simulator from './pages/Simulator'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import SettingsPage from './pages/SettingsPage'

function PageRouter() {
  const { route, isTutor } = useApp()

  switch (route.view) {
    case 'inicio':
      return isTutor ? <TutorDashboard /> : <Dashboard />
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
      return isTutor ? <TutorDashboard /> : <Dashboard />
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
                  ? 'Panel de Tutor listo: asigna tareas prediseñadas y monitorea su avance.'
                  : '¡Lista para aprender hoy! Mucho éxito en tu preparación.',
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
