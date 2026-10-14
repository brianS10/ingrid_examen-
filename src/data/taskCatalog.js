/**
 * Banco de Tareas y Retos Prediseñados para ECOEMS / COMIPEMS.
 * Brian (el tutor) puede elegir cualquiera de estas tareas con 1 clic y asignársela a Ingrid
 * con fecha de entrega, sin tener que redactar todo desde cero cada vez.
 */

export const TASK_CATALOG = [
  // MATEMÁTICAS
  {
    id: 'cat-mat-1',
    subjectId: 'matematicas',
    type: 'reto',
    title: '15 Ejercicios de Fracciones y Jerarquía de Operaciones',
    description: 'En tu libreta: resuelve 15 ejercicios combinando suma, resta, multiplicación y paréntesis. Escribe el procedimiento paso a paso sin calculadora.',
    points: 30,
    days: 3,
    ecoemsKey: 'Matemáticas (Aritmética básica)',
  },
  {
    id: 'cat-mat-2',
    subjectId: 'matematicas',
    type: 'tarea',
    title: 'Despeje de Ecuaciones de 1er Grado (10 problemas)',
    description: 'Resuelve en tu libreta los 10 despejes de ecuaciones lineales de la guía y anota la comprobación de al menos 3 de ellos.',
    points: 25,
    days: 2,
    ecoemsKey: 'Álgebra fundamental',
  },
  {
    id: 'cat-mat-3',
    subjectId: 'matematicas',
    type: 'reto',
    title: 'Reto de Productos Notables (Binomio al cuadrado y conjugados)',
    description: 'Desarrolla 12 binomios al cuadrado y 8 diferencias de cuadrados. Recuerda la regla del doble producto para no cometer el error típico.',
    points: 35,
    days: 4,
    ecoemsKey: 'Álgebra ECOEMS',
  },
  {
    id: 'cat-mat-4',
    subjectId: 'matematicas',
    type: 'tarea',
    title: 'Teorema de Pitágoras y Áreas de Figuras',
    description: 'Calcula la hipotenusa de 5 triángulos rectángulos y el área de 3 trapecios y 2 círculos con procedimiento completo en tu libreta.',
    points: 25,
    days: 3,
    ecoemsKey: 'Geometría y Medición',
  },

  // ESPAÑOL & HABILIDAD VERBAL
  {
    id: 'cat-esp-1',
    subjectId: 'espanol',
    type: 'tarea',
    title: 'Resumen e Idea Principal de Lectura ECOEMS',
    description: 'Lee el texto de comprensión lectora asignado. Escribe en tu libreta la idea principal en 2 renglones y 3 ideas secundarias bien identificadas.',
    points: 20,
    days: 2,
    ecoemsKey: 'Comprensión Lectora',
  },
  {
    id: 'cat-esp-2',
    subjectId: 'espanol',
    type: 'reto',
    title: 'Tarjetas de Reglas de Acentuación (Agudas, Graves y Esdrújulas)',
    description: 'Haz 15 tarjetas con palabras trampa del examen y anota por qué llevan o no llevan tilde según su terminación.',
    points: 30,
    days: 3,
    ecoemsKey: 'Ortografía y Gramática',
  },
  {
    id: 'cat-esp-3',
    subjectId: 'espanol',
    type: 'tarea',
    title: 'Identificar Sujeto, Predicado y Núcleos',
    description: 'Copia en tu libreta 10 oraciones complejas y subraya con color verde el núcleo del sujeto y con azul el núcleo del predicado.',
    points: 20,
    days: 2,
    ecoemsKey: 'Estructura de la Oración',
  },

  // FÍSICA
  {
    id: 'cat-fis-1',
    subjectId: 'fisica',
    type: 'tarea',
    title: 'Formulario y 8 Problemas de Velocidad y Aceleración (MRU)',
    description: 'Apunta las fórmulas de MRU y MRUA en tu libreta con sus unidades (m/s, km/h) y resuelve los 8 problemas de distancia y tiempo.',
    points: 25,
    days: 3,
    ecoemsKey: 'Cinemática',
  },
  {
    id: 'cat-fis-2',
    subjectId: 'fisica',
    type: 'reto',
    title: 'Mapa Mental: Las 3 Leyes de Newton con Ejemplos Cotidianos',
    description: 'Dibuja en una página completa de tu libreta un ejemplo para cada una de las 3 leyes de Newton (Inercia, F=m*a, Acción y Reacción).',
    points: 30,
    days: 4,
    ecoemsKey: 'Leyes del Movimiento',
  },

  // QUÍMICA
  {
    id: 'cat-qui-1',
    subjectId: 'quimica',
    type: 'reto',
    title: 'Fichas de Estudio: Primeros 20 Elementos Químicos',
    description: 'Escribe en tu libreta o en fichas: Nombre, Símbolo, Número atómico (Z) y si es metal o no metal para los primeros 20 elementos.',
    points: 35,
    days: 4,
    ecoemsKey: 'Tabla Periódica',
  },
  {
    id: 'cat-qui-2',
    subjectId: 'quimica',
    type: 'tarea',
    title: 'Balanceo de 5 Ecuaciones Químicas por Tanteo',
    description: 'Balancea en tu libreta las 5 reacciones comprobando la ley de conservación de la masa (mismo número de átomos antes y después).',
    points: 25,
    days: 2,
    ecoemsKey: 'Reacciones Químicas',
  },

  // BIOLOGÍA
  {
    id: 'cat-bio-1',
    subjectId: 'biologia',
    type: 'tarea',
    title: 'Cuadro Comparativo: Célula Animal vs Vegetal',
    description: 'En tu libreta haz una tabla con los organelos exclusivos de cada una (cloroplasto, pared celular, vacuola central) y su función.',
    points: 20,
    days: 2,
    ecoemsKey: 'La Célula',
  },
  {
    id: 'cat-bio-2',
    subjectId: 'biologia',
    type: 'reto',
    title: 'Resolución de 4 Cuadros de Punnett (Genética Mendeliana)',
    description: 'Resuelve los 4 cruces genéticos calculando porcentajes de genotipo y fenotipo dominante y recesivo con procedimiento en libreta.',
    points: 30,
    days: 3,
    ecoemsKey: 'Genética',
  },

  // HISTORIA
  {
    id: 'cat-his-1',
    subjectId: 'historia',
    type: 'tarea',
    title: 'Línea del Tiempo: Independencia de México (1810 - 1821)',
    description: 'Organiza en orden cronológico en tu libreta: Grito de Dolores, Sentimientos de la Nación, Resistencia y Abrazo de Acatempan / Plan de Iguala.',
    points: 25,
    days: 3,
    ecoemsKey: 'Historia de México',
  },
  {
    id: 'cat-his-2',
    subjectId: 'historia',
    type: 'tarea',
    title: 'Caudillos de la Revolución y sus Planes (Zapata, Madero, Carranza)',
    description: 'Escribe quién proclamó cada plan (San Luis, Ayala, Guadalupe) y cuál era la demanda principal de cada uno.',
    points: 25,
    days: 2,
    ecoemsKey: 'Revolución Mexicana',
  },

  // GEOGRAFÍA & FORMACIÓN CÍVICA
  {
    id: 'cat-geo-1',
    subjectId: 'geografia',
    type: 'tarea',
    title: 'Coordenadas Geográficas y Placas Tectónicas de México',
    description: 'Apunta la diferencia entre latitud y longitud, y las 5 placas tectónicas que interactúan en el territorio mexicano.',
    points: 20,
    days: 2,
    ecoemsKey: 'Espacio Geográfico',
  },
  {
    id: 'cat-civ-1',
    subjectId: 'civica',
    type: 'tarea',
    title: 'Los 3 Poderes de la Unión y Derechos Humanos',
    description: 'Explica en tu libreta qué función tiene el Poder Ejecutivo, Legislativo y Judicial, y anota 4 características de los Derechos Humanos.',
    points: 20,
    days: 2,
    ecoemsKey: 'Formación Cívica',
  },
]
