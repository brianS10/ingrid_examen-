/**
 * RichText: renderiza el mini-markdown de apuntes/preguntas con fórmulas KaTeX.
 *
 * Soporta:
 *   Bloques → "### h3", "#### h4", "- viñeta", "1. lista", "> cita", "$$ fórmula $$", párrafos.
 *   En línea → **negritas**, *cursivas*, `código`, $fórmula$.
 *
 * Solo el HTML generado por KaTeX se inyecta con dangerouslySetInnerHTML;
 * el resto del texto se renderiza como nodos de React (seguro ante XSS).
 */
import { memo, useMemo } from 'react'
import katex from 'katex'

function renderMath(tex, displayMode) {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode, strict: false })
  } catch {
    return tex
  }
}

const INLINE_RE = /(\$[^$\n]+?\$|\*\*[^*]+?\*\*|\*[^*\n]+?\*|`[^`]+?`)/g

/** Convierte una línea con marcas en línea a nodos de React. */
function parseInline(text, keyPrefix = 'i') {
  const parts = text.split(INLINE_RE).filter((p) => p !== '')
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
      return <span key={key} dangerouslySetInnerHTML={{ __html: renderMath(part.slice(1, -1), false) }} />
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key}>{parseInline(part.slice(2, -2), key)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key}>{parseInline(part.slice(1, -1), key)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

/** Divide el texto en bloques y los convierte a elementos. */
function parseBlocks(text) {
  const lines = (text ?? '').split('\n').map((l) => l.trim())
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const key = `b-${i}`
    if (!line) {
      i++
      continue
    }
    // Fórmula en bloque: $$ ... $$ (una o varias líneas)
    if (line.startsWith('$$')) {
      let tex = line.slice(2)
      if (tex.endsWith('$$') && tex.length >= 2) {
        tex = tex.slice(0, -2)
        i++
      } else {
        i++
        while (i < lines.length && !lines[i].endsWith('$$')) tex += `\n${lines[i++]}`
        if (i < lines.length) tex += `\n${lines[i++].slice(0, -2)}`
      }
      out.push(<div key={key} className="math-block" dangerouslySetInnerHTML={{ __html: renderMath(tex.trim(), true) }} />)
      continue
    }
    if (line.startsWith('#### ')) {
      out.push(<h4 key={key}>{parseInline(line.slice(5), key)}</h4>)
      i++
      continue
    }
    if (line.startsWith('### ')) {
      out.push(<h3 key={key}>{parseInline(line.slice(4), key)}</h3>)
      i++
      continue
    }
    if (line.startsWith('> ')) {
      out.push(<blockquote key={key}>{parseInline(line.slice(2), key)}</blockquote>)
      i++
      continue
    }
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2))
      out.push(
        <ul key={key}>
          {items.map((it, j) => (
            <li key={j}>{parseInline(it, `${key}-${j}`)}</li>
          ))}
        </ul>,
      )
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s/, ''))
      out.push(
        <ol key={key}>
          {items.map((it, j) => (
            <li key={j}>{parseInline(it, `${key}-${j}`)}</li>
          ))}
        </ol>,
      )
      continue
    }
    out.push(<p key={key}>{parseInline(line, key)}</p>)
    i++
  }
  return out
}

function RichTextImpl({ text, inline = false, className = '' }) {
  const nodes = useMemo(() => (inline ? parseInline(text ?? '') : parseBlocks(text)), [text, inline])
  if (inline) return <span className={`rich-inline ${className}`}>{nodes}</span>
  return <div className={`rich ${className}`}>{nodes}</div>
}

export const RichText = memo(RichTextImpl)
