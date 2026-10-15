/**
 * Mock data inicial: tareas asignadas para comenzar desde cero,
 * sin simulacros simulados previos y con frases motivacionales.
 */
import { daysFromNow } from '../lib/date'

/* ─────────────────────────── Tareas iniciales (todas pendientes) ─────────────────────────── */
/**
 * type:   'tarea' | 'reto'
 * status: 'pendiente' | 'entregada' | 'revisada'
 */
export const INITIAL_TASKS = [
  {
    id: 't-1',
    type: 'reto',
    title: 'Resolver 15 problemas de fracciones',
    difficulty: 'medio',
    description:
      'Del cuadernillo de práctica, páginas 12 a 14. Incluye suma, resta, multiplicación y problemas de reparto. Escribe el procedimiento completo, sin calculadora.',
    subjectId: 'matematicas',
    dueDate: daysFromNow(2),
    points: 30,
    status: 'pendiente',
    evidence: null,
    review: null,
  },
  {
    id: 't-2',
    type: 'tarea',
    title: 'Leer y resumir: "El agua en México"',
    difficulty: 'facil',
    description:
      'Lee el texto de comprensión lectora (2 páginas). Escribe un resumen de máximo 8 renglones con la idea principal y 3 ideas secundarias.',
    subjectId: 'espanol',
    dueDate: daysFromNow(3),
    points: 20,
    status: 'pendiente',
    evidence: null,
    review: null,
  },
  {
    id: 't-3',
    type: 'tarea',
    title: 'Mapa conceptual: Independencia de México',
    difficulty: 'facil',
    description: 'Incluye causas, etapas (inicio, organización, resistencia, consumación), personajes y fechas clave.',
    subjectId: 'historia',
    dueDate: daysFromNow(4),
    points: 25,
    status: 'pendiente',
    evidence: null,
    review: null,
  },
  {
    id: 't-4',
    type: 'reto',
    title: 'Reto: 20 ejercicios de productos notables',
    difficulty: 'dificil',
    description: 'Binomios al cuadrado y conjugados. Meta: resolverlos en menos de 25 minutos con al menos 17 aciertos.',
    subjectId: 'matematicas',
    dueDate: daysFromNow(5),
    points: 40,
    status: 'pendiente',
    evidence: null,
    review: null,
  },
  {
    id: 't-5',
    type: 'tarea',
    title: 'Video + cuestionario: Leyes de Newton',
    difficulty: 'medio',
    description: 'Ve el video de 12 minutos que te mandé por WhatsApp y responde las 8 preguntas en tu cuaderno.',
    subjectId: 'fisica',
    dueDate: daysFromNow(6),
    points: 20,
    status: 'pendiente',
    evidence: null,
    review: null,
  },
]

/* ─────────────────────── Historial de simulacros inicial (vacío) ────────────────────── */
export const INITIAL_HISTORY = []

/* ───────────────────────── Frases motivacionales ────────────────────── */
export const QUOTES = [
  { text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', author: 'Robert Collier' },
  { text: 'No tienes que ser genial para empezar, pero tienes que empezar para ser genial.', author: 'Zig Ziglar' },
  { text: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.', author: 'Nelson Mandela' },
  { text: 'Cada tema dominado es un paso más cerca de la prepa que quieres.', author: 'Tu tutor' },
  { text: 'La disciplina es el puente entre las metas y los logros.', author: 'Jim Rohn' },
  { text: 'Equivocarte en la práctica es la mejor forma de acertar en el examen.', author: 'Tu tutor' },
  { text: 'No cuentes los días, haz que los días cuenten.', author: 'Muhammad Ali' },
  { text: 'Lo que hoy parece difícil, mañana será tu fortaleza.', author: 'Anónimo' },
  { text: 'Aprender es como remar contra corriente: en cuanto se deja, se retrocede.', author: 'Edward Benjamin Britten' },
  { text: 'Tu único límite es el que tú misma te pongas.', author: 'Anónimo' },
  { text: 'La constancia vence lo que la dicha no alcanza.', author: 'Refrán popular' },
  { text: 'Estudia no para saber una cosa más, sino para saberla mejor.', author: 'Séneca' },
  { text: 'El esfuerzo de hoy es el orgullo de mañana.', author: 'Anónimo' },
  { text: 'Confía en tu proceso: 20 minutos diarios hacen una gran diferencia.', author: 'Tu tutor' },
]
