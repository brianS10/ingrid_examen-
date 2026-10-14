/**
 * Panel lateral de un tema: estado, checklist de subtemas, apuntes (texto enriquecido con fórmulas),
 * "Consejos del Profe" (editable por el tutor) y notas personales del estudiante.
 */
import { useEffect, useState } from 'react'
import {
  BookOpen, Check, CheckCircle2, Circle, Eye, GraduationCap, Lightbulb, NotebookPen, Pencil, Pin, Timer, X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SUBJECT_MAP, TOPIC_STATUS } from '../../data/subjects'
import { getTopic } from '../../lib/progress'
import { Modal } from '../ui/Modal'
import { RichText } from '../ui/RichText'
import { StatusSelector } from '../ui/Status'
import { SubjectIcon } from '../ui/Icon'

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: BookOpen },
  { id: 'consejos', label: 'Consejos del Profe', icon: Lightbulb },
  { id: 'notas', label: 'Mis notas', icon: NotebookPen },
]

/** Editor sencillo con vista previa en vivo para el mini-markdown. */
function MarkdownEditor({ value, onSave, onCancel, rows = 12 }) {
  const [draft, setDraft] = useState(value)
  const [preview, setPreview] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-300">
          Usa <code className="text-mint-300">**negrita**</code>, <code className="text-mint-300">- viñeta</code>,{' '}
          <code className="text-mint-300">### título</code> y fórmulas <code className="text-mint-300">$x^2$</code> o{' '}
          <code className="text-mint-300">$$\frac{'{a}{b}'}$$</code>
        </p>
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-xs" onClick={() => setPreview((p) => !p)}>
          {preview ? <Pencil size={13} /> : <Eye size={13} />} {preview ? 'Editar' : 'Vista previa'}
        </button>
      </div>
      {preview ? (
        <div className="min-h-40 rounded-2xl border border-white/10 bg-ink-950/40 p-4">
          <RichText text={draft} />
        </div>
      ) : (
        <textarea className="input font-mono text-[13px] leading-relaxed" rows={rows} value={draft} onChange={(e) => setDraft(e.target.value)} />
      )}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          <X size={15} /> Cancelar
        </button>
        <button type="button" className="btn btn-mint" onClick={() => onSave(draft)}>
          <Check size={15} /> Guardar
        </button>
      </div>
    </div>
  )
}

export function TopicDrawer({ topicId, onClose }) {
  const { state, actions, isTutor, toast, navigate } = useApp()
  const [tab, setTab] = useState('resumen')
  const [editing, setEditing] = useState(null) // 'summary' | 'tip' | null
  const topic = topicId ? getTopic(state, topicId) : null
  const [notes, setNotes] = useState(topic?.notes ?? '')

  // Reinicia el panel al cambiar de tema
  useEffect(() => {
    setTab('resumen')
    setEditing(null)
    setNotes(topicId ? getTopic(state, topicId)?.notes ?? '' : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  // Autoguardado de notas personales (debounce)
  useEffect(() => {
    if (!topic || notes === topic.notes) return
    const id = setTimeout(() => actions.updateTopic(topic.id, { notes }), 500)
    return () => clearTimeout(id)
  }, [notes, topic, actions])

  if (!topic) return null
  const subject = SUBJECT_MAP[topic.subjectId]
  const done = topic.subtopics.filter((s) => s.done).length
  const isToday = state.todayTopicId === topic.id

  const header = (
    <div
      className="relative overflow-hidden border-b border-white/8 px-6 pt-6 pb-5"
      style={{ backgroundImage: `radial-gradient(28rem 12rem at 0% 0%, ${subject.color}30, transparent 70%)` }}
    >
      <button type="button" onClick={onClose} className="btn btn-ghost absolute top-4 right-4 h-9 w-9 rounded-xl p-0" aria-label="Cerrar">
        <X size={18} />
      </button>
      <div className="flex items-center gap-3 pr-10">
        <SubjectIcon subjectId={subject.id} />
        <div>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: subject.color }}>{subject.name}</p>
          <h2 className="text-xl leading-tight font-bold sm:text-2xl">{topic.title}</h2>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusSelector
          value={topic.status}
          idPrefix="drawer-status"
          onChange={(s) => {
            actions.setTopicStatus(topic.id, s)
            toast({
              tone: s === 'dominado' ? 'success' : 'info',
              title: s === 'dominado' ? '¡Tema dominado! 🎉' : `Marcado como "${TOPIC_STATUS[s].label}"`,
              description: topic.title,
              duration: 2500,
            })
          }}
        />
        <span className="chip border-white/10 bg-white/5 text-ink-200">
          <Timer size={12} /> {topic.minutes} min
        </span>
      </div>
    </div>
  )

  return (
    <Modal open={!!topicId} onClose={onClose} variant="drawer" size="lg" title={topic.title} header={header}
      footer={
        <>
          {isTutor && (
            <button
              type="button"
              id="pin-today"
              className={`btn ${isToday ? 'btn-mint' : 'btn-ghost'}`}
              onClick={() => {
                actions.setTodayTopic(isToday ? null : topic.id)
                toast({ tone: 'success', title: isToday ? 'Tema de hoy en automático' : 'Fijado como tema de hoy' })
              }}
            >
              <Pin size={15} /> {isToday ? 'Tema de hoy' : 'Fijar como tema de hoy'}
            </button>
          )}
          <button type="button" id="practice-topic" className="btn btn-primary" onClick={() => { onClose(); navigate('simulador', { subject: subject.id }) }}>
            <GraduationCap size={16} /> Practicar {subject.short}
          </button>
        </>
      }
    >
      {/* Checklist de subtemas */}
      <section aria-labelledby="subtopics-title">
        <div className="mb-2 flex items-center justify-between">
          <h3 id="subtopics-title" className="text-sm font-bold tracking-wide text-ink-200 uppercase">Subtemas</h3>
          <span className="text-xs font-semibold text-ink-300">{done}/{topic.subtopics.length} completados</span>
        </div>
        <ul className="space-y-2">
          {topic.subtopics.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                id={`sub-${s.id}`}
                onClick={() => actions.toggleSubtopic(topic.id, s.id, !s.done)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition active:scale-[0.99] ${
                  s.done ? 'border-mint-400/25 bg-mint-400/8' : 'border-white/8 bg-ink-950/30 hover:border-white/15'
                }`}
              >
                {s.done ? (
                  <CheckCircle2 size={19} className="animate-pop text-mint-400" />
                ) : (
                  <Circle size={19} className="text-ink-500" />
                )}
                <span className={s.done ? 'text-ink-200 line-through decoration-ink-500' : 'text-white'}>{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Pestañas */}
      <div className="no-scrollbar mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-white/8 bg-ink-950/50 p-1" role="tablist">
        {TABS.map(({ id, label, icon: Ico }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => { setTab(id); setEditing(null) }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition ${
              tab === id ? 'bg-white/10 text-white' : 'text-ink-300 hover:text-white'
            }`}
          >
            <Ico size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-4 animate-fade-up" key={tab}>
        {tab === 'resumen' &&
          (editing === 'summary' ? (
            <MarkdownEditor
              value={topic.summary}
              onCancel={() => setEditing(null)}
              onSave={(v) => {
                actions.updateTopic(topic.id, { summary: v })
                setEditing(null)
                toast({ tone: 'success', title: 'Apuntes actualizados' })
              }}
            />
          ) : (
            <div>
              {isTutor && (
                <div className="mb-3 flex justify-end">
                  <button type="button" id="edit-summary" className="btn btn-ghost px-3 py-1.5 text-xs" onClick={() => setEditing('summary')}>
                    <Pencil size={13} /> Editar apuntes
                  </button>
                </div>
              )}
              <RichText text={topic.summary} />
            </div>
          ))}

        {tab === 'consejos' &&
          (editing === 'tip' ? (
            <MarkdownEditor
              rows={5}
              value={topic.tip}
              onCancel={() => setEditing(null)}
              onSave={(v) => {
                actions.updateTopic(topic.id, { tip: v })
                setEditing(null)
                toast({ tone: 'success', title: 'Consejo guardado', description: `${state.profile.student} lo verá en este tema.` })
              }}
            />
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-iris-400/25 bg-linear-to-br from-iris-500/15 to-transparent p-5">
              <Lightbulb size={64} className="absolute -right-3 -bottom-3 text-iris-400/10" />
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-iris-300 uppercase">
                <Lightbulb size={14} /> Consejo de {state.profile.tutor}
              </p>
              {topic.tip ? (
                <RichText text={topic.tip} className="mt-2" />
              ) : (
                <p className="mt-2 text-sm text-ink-300">Aún no hay consejos para este tema.</p>
              )}
              {isTutor && (
                <button type="button" id="edit-tip" className="btn btn-ghost relative mt-4 px-3 py-1.5 text-xs" onClick={() => setEditing('tip')}>
                  <Pencil size={13} /> {topic.tip ? 'Editar consejo' : 'Escribir consejo'}
                </button>
              )}
            </div>
          ))}

        {tab === 'notas' && (
          <div>
            <label htmlFor="personal-notes" className="label">Tus apuntes personales (se guardan solos)</label>
            <textarea
              id="personal-notes"
              className="input min-h-48 leading-relaxed"
              placeholder="Escribe dudas, ejemplos o trucos que te funcionen… Puedes usar fórmulas como $a^2 + b^2$."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {notes.trim() && (
              <div className="mt-4 rounded-2xl border border-white/8 bg-ink-950/40 p-4">
                <p className="label">Vista previa</p>
                <RichText text={notes} />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
