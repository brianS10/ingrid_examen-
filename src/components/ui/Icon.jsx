/**
 * Mapa de íconos por nombre (para usar íconos definidos en los datos mock).
 */
import {
  Atom, BookOpenText, CheckCheck, ClipboardCheck, Compass, Crown, Flame, FlaskConical, Footprints,
  Globe, Landmark, Leaf, Scale, Sigma, Sparkles, Trophy, TrendingUp, Layers, Award,
} from 'lucide-react'
import { SUBJECT_MAP } from '../../data/subjects'

const ICONS = {
  Atom, BookOpenText, CheckCheck, ClipboardCheck, Compass, Crown, Flame, FlaskConical, Footprints,
  Globe, Landmark, Leaf, Scale, Sigma, Sparkles, Trophy, TrendingUp, Layers, Award,
}

export function Icon({ name, ...props }) {
  const Cmp = ICONS[name] ?? Award
  return <Cmp {...props} />
}

/**
 * Ícono de materia dentro de un cuadro con el color de la materia.
 * `subjectId` 'general' muestra un ícono neutro.
 */
export function SubjectIcon({ subjectId, size = 'md', className = '' }) {
  const subject = SUBJECT_MAP[subjectId]
  const color = subject?.color ?? '#8d9acb'
  const dims = { sm: 'h-8 w-8 rounded-xl', md: 'h-11 w-11 rounded-2xl', lg: 'h-14 w-14 rounded-2xl' }[size]
  const iconSize = { sm: 16, md: 20, lg: 26 }[size]
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${dims} ${className}`}
      style={{ background: `${color}1f`, color, boxShadow: `inset 0 0 0 1px ${color}33` }}
      aria-hidden="true"
    >
      <Icon name={subject?.icon ?? 'Layers'} size={iconSize} strokeWidth={2.2} />
    </span>
  )
}
