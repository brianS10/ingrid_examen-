/**
 * Estado global de la app + persistencia en LocalStorage.
 *
 * - `useReducer` centraliza todas las mutaciones (acciones tipadas abajo).
 * - El estado completo se guarda en localStorage con la clave STORAGE_KEY.
 * - También expone: navegación por hash (#/vista), toasts y detección de logros nuevos.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { INITIAL_HISTORY, INITIAL_TASKS } from '../data/mockData'
import { computeBadges } from '../lib/progress'
import { daysFromNow, toDateKey } from '../lib/date'

const STORAGE_KEY = 'mision-prepa:v2'

/* ─────────────────────────── Estado inicial ─────────────────────────── */
export function createInitialState() {
  return {
    version: 2,
    currentUser: null, // { username, name, role }
    role: 'estudiante', // 'estudiante' | 'tutor'
    profile: {
      student: 'Ingrid',
      tutor: 'Brian',
      targetSchool: 'Escuela Nacional Preparatoria (UNAM)',
      goalScore: 100, // aciertos meta de 128
    },
    examDate: '2027-06-19T09:00',
    topics: {}, // overrides por tema: { status, tip, summary, notes, subDone: { [subId]: bool } }
    tasks: INITIAL_TASKS,
    history: INITIAL_HISTORY,
    todayTopicId: null,
    streak: { count: 0, lastDate: null },
    quizDefaults: { feedback: 'inmediata', timer: true },
    seenBadges: null, // se inicializa al primer render para no lanzar toasts de logros ya obtenidos
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const saved = JSON.parse(raw)
    const base = createInitialState()
    return {
      ...base,
      ...saved,
      profile: { ...base.profile, ...saved.profile },
      currentUser: saved.currentUser ?? null,
    }
  } catch {
    return createInitialState()
  }
}

/* ─────────────────────────────── Reducer ────────────────────────────── */
function bumpStreak(streak) {
  const today = toDateKey()
  if (streak.lastDate === today) return streak
  const yesterday = daysFromNow(-1)
  return { count: streak.lastDate === yesterday ? streak.count + 1 : 1, lastDate: today }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.user,
        role: action.user.role,
      }
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
      }
    case 'SET_ROLE':
      return { ...state, role: action.role }
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.patch } }
    case 'SET_EXAM_DATE':
      return { ...state, examDate: action.value }
    case 'SET_QUIZ_DEFAULTS':
      return { ...state, quizDefaults: { ...state.quizDefaults, ...action.patch } }
    case 'UPDATE_TOPIC': {
      const prev = state.topics[action.id] ?? {}
      const next = { ...state, topics: { ...state.topics, [action.id]: { ...prev, ...action.patch } } }
      return action.activity ? { ...next, streak: bumpStreak(state.streak) } : next
    }
    case 'TOGGLE_SUBTOPIC': {
      const prev = state.topics[action.topicId] ?? {}
      return {
        ...state,
        streak: bumpStreak(state.streak),
        topics: {
          ...state.topics,
          [action.topicId]: { ...prev, subDone: { ...prev.subDone, [action.subId]: action.done } },
        },
      }
    }
    case 'SET_TODAY_TOPIC':
      return { ...state, todayTopicId: action.id }
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'UPDATE_TASK':
      return {
        ...state,
        streak: action.activity ? bumpStreak(state.streak) : state.streak,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    case 'ADD_ATTEMPT':
      return { ...state, streak: bumpStreak(state.streak), history: [...state.history, action.attempt] }
    case 'DELETE_ATTEMPT':
      return { ...state, history: state.history.filter((h) => h.id !== action.id) }
    case 'MARK_BADGES_SEEN':
      return { ...state, seenBadges: action.ids }
    case 'IMPORT':
      return { ...createInitialState(), ...action.state }
    case 'RESET':
      return createInitialState()
    default:
      return state
  }
}

/* ─────────────────────────── Navegación (hash) ──────────────────────── */
export const VIEWS = ['inicio', 'ruta', 'simulador', 'tareas', 'estadisticas', 'ajustes']

function parseHash() {
  const [path, query = ''] = window.location.hash.replace(/^#\/?/, '').split('?')
  const view = VIEWS.includes(path) ? path : 'inicio'
  return { view, params: Object.fromEntries(new URLSearchParams(query)) }
}

/* ─────────────────────────────── Contexto ───────────────────────────── */
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [route, setRoute] = useState(parseHash)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Sincroniza la vista con el hash de la URL
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((view, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    window.location.hash = `/${view}${qs ? `?${qs}` : ''}`
  }, [])

  /* Toasts ------------------------------------------------------------ */
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (t) => {
      const id = ++toastId.current
      setToasts((list) => [...list, { id, tone: 'info', ...t }])
      setTimeout(() => dismissToast(id), t.duration ?? 3800)
    },
    [dismissToast],
  )

  /* Logros: detecta desbloqueos nuevos y lanza un toast ---------------- */
  const badges = useMemo(() => computeBadges(state), [state])
  useEffect(() => {
    const unlocked = badges.filter((b) => b.unlocked).map((b) => b.id)
    if (state.seenBadges === null) {
      dispatch({ type: 'MARK_BADGES_SEEN', ids: unlocked })
      return
    }
    const fresh = badges.filter((b) => b.unlocked && !state.seenBadges.includes(b.id))
    if (fresh.length) {
      fresh.forEach((b) =>
        toast({ tone: 'badge', title: `¡Logro desbloqueado: ${b.title}!`, description: b.description, icon: b.icon }),
      )
      dispatch({ type: 'MARK_BADGES_SEEN', ids: unlocked })
    }
  }, [badges, state.seenBadges, toast])

  /* Acciones de alto nivel --------------------------------------------- */
  const actions = useMemo(
    () => ({
      login: (user) => dispatch({ type: 'LOGIN', user }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      setRole: (role) => dispatch({ type: 'SET_ROLE', role }),
      updateProfile: (patch) => dispatch({ type: 'UPDATE_PROFILE', patch }),
      setExamDate: (value) => dispatch({ type: 'SET_EXAM_DATE', value }),
      setQuizDefaults: (patch) => dispatch({ type: 'SET_QUIZ_DEFAULTS', patch }),
      setTopicStatus: (id, status) => dispatch({ type: 'UPDATE_TOPIC', id, patch: { status }, activity: true }),
      updateTopic: (id, patch) => dispatch({ type: 'UPDATE_TOPIC', id, patch }),
      toggleSubtopic: (topicId, subId, done) => dispatch({ type: 'TOGGLE_SUBTOPIC', topicId, subId, done }),
      setTodayTopic: (id) => dispatch({ type: 'SET_TODAY_TOPIC', id }),
      addTask: (task) =>
        dispatch({
          type: 'ADD_TASK',
          task: { id: `t-${Date.now()}`, status: 'pendiente', evidence: null, review: null, ...task },
        }),
      updateTask: (id, patch, activity = false) => dispatch({ type: 'UPDATE_TASK', id, patch, activity }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', id }),
      addAttempt: (attempt) => dispatch({ type: 'ADD_ATTEMPT', attempt }),
      deleteAttempt: (id) => dispatch({ type: 'DELETE_ATTEMPT', id }),
      importState: (data) => dispatch({ type: 'IMPORT', state: data }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [],
  )

  const value = useMemo(
    () => ({
      state,
      actions,
      badges,
      route,
      navigate,
      toasts,
      toast,
      dismissToast,
      isTutor: state.role === 'tutor',
    }),
    [state, actions, badges, route, navigate, toasts, toast, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
