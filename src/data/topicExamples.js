/**
 * Ejemplos de examen resueltos paso a paso para el salón de clases ECOEMS / COMIPEMS.
 * Muestra el problema real, datos, pasos de desarrollo y cómo descartar respuestas incorrectas.
 */
export const TOPIC_EXAMPLES = {
  'mat-1': [
    {
      title: 'Problema típico de fracciones en examen',
      problem: 'En una tienda de ropa, un suéter cuesta $600 pesos. Si tiene un descuento del 20% y además al pagar te descuentan un 10% adicional sobre lo que quedó, ¿cuánto pagas al final?',
      step1: 'Paso 1: Calcula el primer descuento del 20% sobre $600. El 20% es 600 × 0.20 = $120. El precio con el primer descuento es 600 - 120 = $480.',
      step2: 'Paso 2: Ahora calcula el 10% sobre los $480 restantes (¡no sobre los 600 iniciales!). El 10% de 480 es 480 × 0.10 = $48.',
      step3: 'Paso 3: Resta este segundo descuento: 480 - 48 = $432.',
      examSecret: '¡Cuidado con la trampa! Nunca sumes 20% + 10% = 30%. Si hicieras el 30% de 600 te daría 420, que es la respuesta trampa más común en el COMIPEMS.',
    },
    {
      title: 'Suma de fracciones con distinto denominador',
      problem: 'Resuelve la operación: 2/3 + 3/4 - 1/2',
      step1: 'Paso 1: Encuentra el mínimo común denominador entre 3, 4 y 2. El número más pequeño divisible entre los tres es el 12.',
      step2: 'Paso 2: Convierte cada fracción con denominador 12:\n• 2/3 = (2 × 4) / 12 = 8/12\n• 3/4 = (3 × 3) / 12 = 9/12\n• 1/2 = (1 × 6) / 12 = 6/12',
      step3: 'Paso 3: Suma y resta numeradores: (8 + 9 - 6) / 12 = 11/12.',
      examSecret: 'Revisa siempre si el resultado se puede simplificar. En este caso 11/12 es irreducible.',
    },
  ],
  'mat-2': [
    {
      title: 'Despeje de ecuación de primer grado',
      problem: 'Resuelve la ecuación: 3x - 5 = 19 - x',
      step1: 'Paso 1: Agrupa las incógnitas (x) del lado izquierdo y los números del lado derecho. La "-x" de la derecha pasa como "+x", y el "-5" de la izquierda pasa como "+5".',
      step2: 'Paso 2: Simplifica ambos lados: 3x + x = 19 + 5  =>  4x = 24.',
      step3: 'Paso 3: Despeja x pasando el 4 dividiendo: x = 24 / 4  =>  x = 6.',
      examSecret: 'Comprobación rápida en 5 segundos: sustituye x=6 en la original: 3(6) - 5 = 13 y 19 - 6 = 13. ¡Da lo mismo, está correcta!',
    },
  ],
  'esp-1': [
    {
      title: 'Clasificación de palabras por acentuación',
      problem: '¿Cuál de las siguientes palabras debe llevar tilde ortográfica según las reglas?\na) Examen\nb) Dictamen\nc) Resumenes\nd) Imagen',
      step1: 'Paso 1: Separa en sílabas y ubica la sílaba tónica de cada una:\n• Ex-a-men (grave, termina en n: NO lleva tilde)\n• Dic-ta-men (grave, termina en n: NO lleva tilde)\n• Re-sú-me-nes (esdrújula, tónica en "sú")\n• I-ma-gen (grave, termina en n: NO lleva tilde)',
      step2: 'Paso 2: Recuerda la regla de oro: ¡TODAS las palabras esdrújulas llevan tilde siempre!',
      step3: 'Paso 3: La respuesta correcta es c) Resúmenes.',
      examSecret: '"Examen" no lleva acento porque es grave terminada en N, pero en plural "exámenes" se vuelve esdrújula y SÍ lleva acento.',
    },
  ],
  'bio-1': [
    {
      title: 'Identificación de organelo celular',
      problem: 'En una prueba de laboratorio se analiza una célula que tiene pared celular de celulosa, cloroplastos y una gran vacuola central. ¿Qué tipo de célula es?',
      step1: 'Paso 1: Observa los organelos clave mencionados: pared de celulosa y cloroplastos.',
      step2: 'Paso 2: Las células animales nunca tienen cloroplastos ni pared celular (solo tienen membrana plasmática).',
      step3: 'Paso 3: Por lo tanto, se trata de una Célula Vegetal Eucariota.',
      examSecret: 'Si en el examen te mencionan cloroplastos o pared celular rígida, de inmediato piensa en plantas/célula vegetal.',
    },
  ],
  'qui-1': [
    {
      title: 'Cálculo de neutrones en un átomo',
      problem: 'Un átomo de Sodio (Na) tiene número atómico Z = 11 y masa atómica A = 23. ¿Cuántos protones, electrones y neutrones tiene?',
      step1: 'Paso 1: El número atómico Z indica los PROTONES. Protones = 11.',
      step2: 'Paso 2: Como es un átomo neutro, el número de ELECTRONES es igual a los protones = 11.',
      step3: 'Paso 3: Para los NEUTRONES, resta la masa atómica menos el número atómico: Neutrones = A - Z = 23 - 11 = 12 neutrones.',
      examSecret: 'Fórmula que debes memorizar: N = A - Z. Siempre se resta Masa menos Número Atómico.',
    },
  ],
  'his-1': [
    {
      title: 'Orden cronológico de la Independencia',
      problem: 'Ordena cronológicamente los siguientes eventos de la Independencia de México:\n1. Consumación con el Ejército Trigarante\n2. Grito de Dolores por Miguel Hidalgo\n3. Constitución de Apatzingán de Morelos\n4. Muerte de Morelos en Ecatepec',
      step1: 'Paso 1: Inicia en 1810 con el Grito de Dolores (Evento 2).',
      step2: 'Paso 2: Continúa la etapa de Morelos con Apatzingán (1814) y su fusilamiento en 1815 (Eventos 3 y luego 4).',
      step3: 'Paso 3: Finaliza con la Consumación en 1821 por Iturbide y Guerrero (Evento 1). El orden es: 2, 3, 4, 1.',
      examSecret: 'Las 4 etapas de la Independencia son: Iniciación (Hidalgo), Organización (Morelos), Resistencia (Guerrero) y Consumación (Iturbide-Guerrero).',
    },
  ],
}

/** Devuelve ejemplos para un tema o ejemplos genéricos de la materia */
export function getTopicExamples(topicId, subjectId) {
  if (TOPIC_EXAMPLES[topicId]) {
    return TOPIC_EXAMPLES[topicId]
  }
  // Búsqueda por prefijo o materia
  const prefix = topicId ? topicId.split('-')[0] : subjectId?.slice(0, 3)
  for (const [key, examples] of Object.entries(TOPIC_EXAMPLES)) {
    if (key.startsWith(prefix)) return examples
  }
  // Ejemplo universal didáctico por defecto
  return [
    {
      title: 'Ejemplo resuelto para el examen ECOEMS',
      problem: '¿Cómo identificar la respuesta correcta cuando hay opciones que parecen muy similares?',
      step1: 'Paso 1: Lee la pregunta con atención e identifica la palabra clave (ej: "excepto", "principal causa", "fórmula correcta").',
      step2: 'Paso 2: Descarta las 2 opciones visiblemente incorrectas o exageradas (el método del descarte).',
      step3: 'Paso 3: Entre las 2 restantes, elige la que responda directamente al concepto fundamental sin rodeos.',
      examSecret: 'En el examen ECOEMS, descartar 2 opciones aumenta tus probabilidades de acierto del 25% al 50%.',
    },
  ]
}
