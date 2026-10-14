/**
 * Ajustes y Configuración de Misión Prepa:
 * - Nombres del estudiante y del tutor.
 * - Escuela meta y aciertos objetivo.
 * - Fecha del examen COMIPEMS.
 * - Opciones de exportar e importar datos (backup JSON) o reiniciar.
 */
import { useState } from 'react'
import {
  Calendar, Check, Download, GraduationCap, RefreshCw, Save,
  Settings, ShieldAlert, Sparkles, Upload, User, UserCheck
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader } from '../components/ui/Feedback'

export default function SettingsPage() {
  const { state, actions, toast } = useApp()

  const [student, setStudent] = useState(state.profile.student)
  const [tutor, setTutor] = useState(state.profile.tutor)
  const [targetSchool, setTargetSchool] = useState(state.profile.targetSchool)
  const [goalScore, setGoalScore] = useState(state.profile.goalScore)
  const [examDate, setExamDate] = useState(state.examDate)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    actions.updateProfile({
      student,
      tutor,
      targetSchool,
      goalScore: Number(goalScore),
    })
    actions.setExamDate(examDate)
    toast({
      tone: 'success',
      title: 'Configuración guardada exitosamente',
    })
  }

  // Exportar backup en JSON
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `mision-prepa-backup-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast({ tone: 'info', title: 'Copia de seguridad descargada en JSON' })
  }

  // Importar backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        actions.importState(json)
        toast({ tone: 'success', title: 'Datos restaurados con éxito' })
      } catch (err) {
        toast({ tone: 'warning', title: 'Archivo JSON inválido' })
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas reiniciar todos los datos a la configuración inicial?')) {
      actions.reset()
      toast({ tone: 'info', title: 'Datos restaurados a su estado inicial' })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        eyebrow="Personalización y Datos"
        title="Configuración de la Misión"
        description="Ajusta las metas, los nombres del tutor y estudiante, y administra las copias de seguridad de tu progreso."
      />

      <form onSubmit={handleSaveProfile} className="card p-6 space-y-6">
        <h3 className="section-title flex items-center gap-2">
          <UserCheck size={18} className="text-mint-400" /> Perfil y Metas
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nombre de la estudiante</label>
            <input
              type="text"
              className="input"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Nombre del tutor / asesor</label>
            <input
              type="text"
              className="input"
              value={tutor}
              onChange={(e) => setTutor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Escuela o preparatoria meta</label>
            <input
              type="text"
              className="input"
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              placeholder="Ej. ENP 6 Antonio Caso, CCH Sur, CECyT 9..."
              required
            />
          </div>

          <div>
            <label className="label">Aciertos objetivo (de 128)</label>
            <input
              type="number"
              min={60}
              max={128}
              className="input"
              value={goalScore}
              onChange={(e) => setGoalScore(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Fecha y hora del examen COMIPEMS</label>
            <input
              type="datetime-local"
              className="input"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn btn-primary font-bold">
            <Save size={16} /> Guardar cambios
          </button>
        </div>
      </form>

      {/* Respaldo y sincronización */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Download size={18} className="text-iris-400" /> Respaldo y Restauración de Datos
        </h3>
        <p className="text-xs text-ink-300">
          Toda la información se almacena localmente en tu navegador (LocalStorage). Puedes descargar un archivo JSON para guardar tu progreso o transferirlo a otra computadora.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="btn btn-ghost text-xs font-semibold"
          >
            <Download size={14} /> Exportar copia de seguridad (.json)
          </button>

          <label className="btn btn-ghost text-xs font-semibold cursor-pointer">
            <Upload size={14} /> Importar copia (.json)
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportData}
            />
          </label>
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="card p-6 border-rose-500/20 bg-rose-500/5 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <ShieldAlert size={16} /> Zona de reinicio
        </h3>
        <p className="text-xs text-ink-300">
          Si deseas reiniciar las notas, materias y simulacros a su estado original de demostración, puedes hacerlo aquí.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-danger text-xs font-bold"
        >
          <RefreshCw size={14} /> Restablecer datos iniciales
        </button>
      </div>
    </div>
  )
}
