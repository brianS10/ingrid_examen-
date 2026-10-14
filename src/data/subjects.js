/**
 * Mock data: materias, temas y subtemas del examen COMIPEMS.
 *
 * - `status` inicial de cada tema: 'pendiente' | 'repaso' | 'dominado'.
 * - `summary` usa un mini-markdown propio (ver components/ui/RichText.jsx):
 *     ### Título, #### Subtítulo, - viñetas, 1. listas, > cita,
 *     **negritas**, *cursivas*, $fórmula en línea$ y $$fórmula en bloque$$ (KaTeX).
 * - Se usa String.raw (alias `md`) para no tener que escapar las "\" de LaTeX.
 * - `tip` = "Consejos del Profe" (editable por el tutor desde la app).
 */
const md = String.raw

export const SUBJECTS = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    short: 'Mate',
    color: '#5ab4ff',
    icon: 'Sigma',
    examQuestions: 16,
    description: 'Aritmética, álgebra, geometría y probabilidad sin calculadora.',
    topics: [
      {
        id: 'mat-1',
        title: 'Fracciones, decimales y porcentajes',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-1-a', title: 'Operaciones con fracciones', done: false },
          { id: 'mat-1-b', title: 'Conversión fracción ↔ decimal', done: false },
          { id: 'mat-1-c', title: 'Porcentajes y descuentos', done: false },
          { id: 'mat-1-d', title: 'Razones y proporcionalidad', done: false },
        ],
        summary: md`### Operaciones básicas
- **Suma / resta** con distinto denominador: $\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$
- **Multiplicación** (en línea recta): $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$
- **División** (multiplica por el recíproco): $\frac{a}{b} \div \frac{c}{d} = \frac{ad}{bc}$
### Porcentajes
$$x\% \text{ de } N = \frac{x}{100} \cdot N$$
- Un descuento del 25% equivale a pagar el **75%**: $N \cdot 0.75$
- Regla de tres directa: $\frac{a}{b} = \frac{c}{x} \Rightarrow x = \frac{b \cdot c}{a}$
> Truco: 50% = $\frac12$, 25% = $\frac14$, 20% = $\frac15$, 12.5% = $\frac18$.`,
        tip: 'Simplifica SIEMPRE antes de multiplicar: ahorras tiempo y evitas números enormes. En el examen no hay calculadora.',
      },
      {
        id: 'mat-2',
        title: 'Álgebra: ecuaciones lineales y sistemas',
        minutes: 60,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-2-a', title: 'Lenguaje algebraico', done: false },
          { id: 'mat-2-b', title: 'Ecuaciones de primer grado', done: false },
          { id: 'mat-2-c', title: 'Sistemas de ecuaciones 2×2', done: false },
          { id: 'mat-2-d', title: 'Desigualdades', done: false },
        ],
        summary: md`### Despejar una incógnita
Lo que *suma* pasa restando, lo que *multiplica* pasa dividiendo (y viceversa).
$$2x + 5 = 17 \;\Rightarrow\; 2x = 12 \;\Rightarrow\; x = 6$$
### Lenguaje algebraico
- "El doble de un número aumentado en 3": $2x + 3$
- "La mitad de un número": $\frac{x}{2}$
- "Dos números consecutivos": $x$ y $x + 1$
### Sistemas 2×2 (suma y resta)
$$\begin{cases} x + y = 10 \\ x - y = 4 \end{cases} \Rightarrow 2x = 14 \Rightarrow x = 7,\; y = 3$$
> Comprueba sustituyendo la solución en **ambas** ecuaciones.`,
        tip: 'En opción múltiple puedes sustituir cada respuesta en la ecuación: a veces es más rápido que resolver.',
      },
      {
        id: 'mat-3',
        title: 'Productos notables y factorización',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-3-a', title: 'Binomio al cuadrado', done: false },
          { id: 'mat-3-b', title: 'Binomios conjugados', done: false },
          { id: 'mat-3-c', title: 'Factor común', done: false },
          { id: 'mat-3-d', title: 'Trinomio de la forma x² + bx + c', done: false },
        ],
        summary: md`### Fórmulas que debes memorizar
$$(a + b)^2 = a^2 + 2ab + b^2$$
$$(a - b)^2 = a^2 - 2ab + b^2$$
$$(a + b)(a - b) = a^2 - b^2$$
$$(x + a)(x + b) = x^2 + (a + b)x + ab$$
### Factorizar
- **Factor común**: $6x^2 + 9x = 3x(2x + 3)$
- **Diferencia de cuadrados**: $x^2 - 25 = (x + 5)(x - 5)$
- **Trinomio**: busca dos números que *multiplicados* den $c$ y *sumados* den $b$: $x^2 + 7x + 12 = (x + 3)(x + 4)$`,
        tip: 'Error clásico: (a + b)² NO es a² + b². Falta el doble producto 2ab. Lo vamos a practicar con tarjetas.',
      },
      {
        id: 'mat-4',
        title: 'Geometría: áreas, volúmenes y Pitágoras',
        minutes: 55,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-4-a', title: 'Teorema de Pitágoras', done: false },
          { id: 'mat-4-b', title: 'Áreas y perímetros', done: false },
          { id: 'mat-4-c', title: 'Volumen de prismas y cilindros', done: false },
          { id: 'mat-4-d', title: 'Ángulos y triángulos', done: false },
        ],
        summary: md`### Teorema de Pitágoras
En un triángulo rectángulo: $$c^2 = a^2 + b^2$$
Ternas útiles: **3-4-5**, **5-12-13**, **6-8-10**, **8-15-17**.
### Fórmulas de área
- Triángulo: $A = \frac{b \cdot h}{2}$
- Trapecio: $A = \frac{(B + b)\,h}{2}$
- Círculo: $A = \pi r^2$, perímetro $P = 2\pi r$
### Volumen
- Prisma / cilindro: $V = A_{base} \cdot h$ → cilindro $V = \pi r^2 h$
- Pirámide / cono: $V = \frac{A_{base} \cdot h}{3}$
> Los ángulos internos de un triángulo suman $180^\circ$.`,
        tip: 'Memoriza las ternas pitagóricas: te ahorran calcular raíces cuadradas en muchos reactivos.',
      },
      {
        id: 'mat-5',
        title: 'Ecuaciones cuadráticas',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-5-a', title: 'Por factorización', done: false },
          { id: 'mat-5-b', title: 'Fórmula general', done: false },
          { id: 'mat-5-c', title: 'Discriminante', done: false },
        ],
        summary: md`### Forma general
$$ax^2 + bx + c = 0$$
### Fórmula general
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
### Discriminante $\Delta = b^2 - 4ac$
- $\Delta > 0$: dos soluciones reales distintas
- $\Delta = 0$: una solución (doble)
- $\Delta < 0$: no hay soluciones reales`,
        tip: 'Si la ecuación se puede factorizar, hazlo: es mucho más rápido que la fórmula general.',
      },
      {
        id: 'mat-6',
        title: 'Probabilidad y estadística',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'mat-6-a', title: 'Media, mediana y moda', done: false },
          { id: 'mat-6-b', title: 'Probabilidad clásica', done: false },
          { id: 'mat-6-c', title: 'Lectura de gráficas', done: false },
        ],
        summary: md`### Medidas de tendencia central
- **Media**: $\bar{x} = \frac{\sum x_i}{n}$
- **Mediana**: el dato central (ordena primero)
- **Moda**: el dato que más se repite
### Probabilidad clásica
$$P(A) = \frac{\text{casos favorables}}{\text{casos posibles}}$$
> La probabilidad siempre está entre **0** (imposible) y **1** (seguro).`,
        tip: 'Para la mediana, ¡ordena los datos primero! Es el error más común.',
      },
    ],
  },
  {
    id: 'espanol',
    name: 'Español',
    short: 'Esp',
    color: '#f472b6',
    icon: 'BookOpenText',
    examQuestions: 16,
    description: 'Comprensión lectora, gramática, ortografía y literatura.',
    topics: [
      {
        id: 'esp-1',
        title: 'Comprensión lectora',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'esp-1-a', title: 'Idea principal e ideas secundarias', done: false },
          { id: 'esp-1-b', title: 'Inferencias', done: false },
          { id: 'esp-1-c', title: 'Propósito del autor', done: false },
          { id: 'esp-1-d', title: 'Tipos de texto', done: false },
        ],
        summary: md`### Estrategia de 3 pasos
1. Lee primero la **pregunta**, después el texto.
2. Subraya palabras clave y conectores (*sin embargo, por lo tanto, además*).
3. Descarta opciones que digan algo que el texto **no** dice.
### Tipos de texto
- **Narrativo**: cuenta hechos (cuento, novela, noticia).
- **Expositivo**: informa / explica (artículo de divulgación).
- **Argumentativo**: defiende una postura con argumentos.
- **Instructivo**: indica pasos (receta, manual).
> La idea principal responde: ¿de qué trata **todo** el texto?`,
        tip: 'Ojo con las respuestas "trampa" que son verdad en la vida real pero NO aparecen en el texto.',
      },
      {
        id: 'esp-2',
        title: 'Categorías gramaticales',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'esp-2-a', title: 'Sustantivo, adjetivo y artículo', done: false },
          { id: 'esp-2-b', title: 'Verbo: tiempos y modos', done: false },
          { id: 'esp-2-c', title: 'Adverbio, preposición y conjunción', done: false },
        ],
        summary: md`### Palabras variables
- **Sustantivo**: nombra (*libro, Ingrid, felicidad*).
- **Adjetivo**: califica al sustantivo (*libro viejo*).
- **Verbo**: acción o estado; tiene modo indicativo, subjuntivo e imperativo.
- **Pronombre**: sustituye al sustantivo (*ella, nosotros*).
### Palabras invariables
- **Adverbio**: modifica verbo/adjetivo (*rápidamente, muy, aquí*).
- **Preposición**: a, ante, bajo, con, contra, de, desde, en, entre, hacia, hasta, para, por, según, sin, sobre, tras.
- **Conjunción**: une (*y, pero, aunque, porque*).`,
        tip: '¡Excelente trabajo aquí! Solo dale un repaso rápido a la lista de preposiciones una vez por semana.',
      },
      {
        id: 'esp-3',
        title: 'Ortografía y acentuación',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'esp-3-a', title: 'Agudas, graves y esdrújulas', done: false },
          { id: 'esp-3-b', title: 'Tilde diacrítica', done: false },
          { id: 'esp-3-c', title: 'Uso de b/v, c/s/z, g/j', done: false },
        ],
        summary: md`### Reglas de acentuación
- **Agudas** (última sílaba): llevan tilde si terminan en *n, s* o vocal → *canción, compás, café*.
- **Graves** (penúltima): llevan tilde si **no** terminan en *n, s* o vocal → *árbol, lápiz, fácil*.
- **Esdrújulas** (antepenúltima): **siempre** llevan tilde → *matemáticas, brújula*.
### Tilde diacrítica
- *tú* (pronombre) / *tu* (posesivo)
- *él* (pronombre) / *el* (artículo)
- *más* (cantidad) / *mas* (pero)
- *sí* (afirmación) / *si* (condición)`,
        tip: 'Truco: separa en sílabas en voz alta y aplaude en la que suena más fuerte.',
      },
      {
        id: 'esp-4',
        title: 'Figuras retóricas y géneros literarios',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'esp-4-a', title: 'Metáfora, símil e hipérbole', done: false },
          { id: 'esp-4-b', title: 'Personificación y aliteración', done: false },
          { id: 'esp-4-c', title: 'Géneros: narrativo, lírico y dramático', done: false },
        ],
        summary: md`### Figuras retóricas
- **Símil**: compara usando *como, cual, semejante a* → "Blanca *como* la nieve".
- **Metáfora**: identifica sin nexo → "Tus ojos son dos luceros".
- **Hipérbole**: exagera → "Te lo dije un millón de veces".
- **Personificación**: da cualidades humanas → "El viento susurraba".
### Géneros literarios
- **Narrativo**: narrador cuenta una historia (cuento, novela, leyenda).
- **Lírico**: expresa sentimientos, suele ir en verso (poema).
- **Dramático**: diálogos para representarse (teatro).`,
        tip: 'Si hay "como" o "cual" casi siempre es símil; si no hay nexo, piensa en metáfora.',
      },
      {
        id: 'esp-5',
        title: 'La oración: sujeto y predicado',
        minutes: 30,
        status: 'pendiente',
        subtopics: [
          { id: 'esp-5-a', title: 'Núcleo del sujeto', done: false },
          { id: 'esp-5-b', title: 'Núcleo del predicado', done: false },
          { id: 'esp-5-c', title: 'Complementos del verbo', done: false },
        ],
        summary: md`### Estructura
- **Sujeto**: de quién se habla. Su núcleo es un sustantivo o pronombre.
- **Predicado**: lo que se dice del sujeto. Su núcleo es el **verbo**.
> Para hallar el sujeto pregunta al verbo: ¿quién(es) + verbo?
### Complementos
- **Directo**: ¿qué? → "Leí *un libro*".
- **Indirecto**: ¿a quién? / ¿para quién? → "Di un regalo *a mi tía*".
- **Circunstancial**: tiempo, lugar, modo → "Estudio *por la tarde*".`,
        tip: 'El sujeto y el verbo concuerdan en número: si cambias a plural uno, cambia el otro.',
      },
    ],
  },
  {
    id: 'fisica',
    name: 'Física',
    short: 'Fís',
    color: '#fbbf24',
    icon: 'Atom',
    examQuestions: 16,
    description: 'Movimiento, fuerzas, energía y electricidad.',
    topics: [
      {
        id: 'fis-1',
        title: 'Cinemática: MRU y MRUA',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'fis-1-a', title: 'Distancia vs desplazamiento', done: false },
          { id: 'fis-1-b', title: 'Movimiento rectilíneo uniforme', done: false },
          { id: 'fis-1-c', title: 'Movimiento uniformemente acelerado', done: false },
          { id: 'fis-1-d', title: 'Caída libre', done: false },
        ],
        summary: md`### MRU (velocidad constante)
$$v = \frac{d}{t}$$
### MRUA (aceleración constante)
$$a = \frac{v_f - v_i}{t}$$
$$d = v_i\,t + \frac{1}{2} a t^2$$
### Caída libre
Se usa $g \approx 9.8\ \text{m/s}^2$ (a veces se redondea a $10\ \text{m/s}^2$).
> Revisa siempre las **unidades**: km/h ≠ m/s. Para convertir km/h a m/s divide entre 3.6.`,
        tip: 'Dibuja un esquema del problema con flechas: te ayuda a no confundir datos.',
      },
      {
        id: 'fis-2',
        title: 'Leyes de Newton',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'fis-2-a', title: '1ª ley: inercia', done: false },
          { id: 'fis-2-b', title: '2ª ley: F = m·a', done: false },
          { id: 'fis-2-c', title: '3ª ley: acción y reacción', done: false },
          { id: 'fis-2-d', title: 'Peso y masa', done: false },
        ],
        summary: md`### Las tres leyes
1. **Inercia**: un cuerpo sigue en reposo o MRU si no actúa una fuerza neta.
2. **Fuerza**: $F = m \cdot a$ (unidad: Newton, $1\ \text{N} = 1\ \text{kg}\cdot\text{m/s}^2$).
3. **Acción y reacción**: a toda fuerza corresponde otra igual y opuesta.
### Peso
$$W = m \cdot g$$
> La **masa** (kg) no cambia; el **peso** (N) depende de la gravedad del lugar.`,
        tip: 'Relaciona cada ley con un ejemplo cotidiano: frenar en el camión (1ª), empujar un carrito (2ª), nadar (3ª).',
      },
      {
        id: 'fis-3',
        title: 'Trabajo, energía y potencia',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'fis-3-a', title: 'Trabajo mecánico', done: false },
          { id: 'fis-3-b', title: 'Energía cinética y potencial', done: false },
          { id: 'fis-3-c', title: 'Conservación de la energía', done: false },
        ],
        summary: md`### Fórmulas clave
- Trabajo: $W = F \cdot d$ (Joules)
- Energía cinética: $E_c = \frac{1}{2} m v^2$
- Energía potencial: $E_p = m g h$
- Potencia: $P = \frac{W}{t}$ (Watts)
> **Conservación**: la energía no se crea ni se destruye, solo se transforma.`,
        tip: 'Si la velocidad se duplica, la energía cinética se CUADRUPLICA (por el v²). Pregunta favorita del examen.',
      },
      {
        id: 'fis-4',
        title: 'Electricidad y magnetismo',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'fis-4-a', title: 'Carga eléctrica', done: false },
          { id: 'fis-4-b', title: 'Ley de Ohm', done: false },
          { id: 'fis-4-c', title: 'Circuitos en serie y paralelo', done: false },
          { id: 'fis-4-d', title: 'Imanes y electromagnetismo', done: false },
        ],
        summary: md`### Ley de Ohm
$$V = I \cdot R$$
Voltaje (V, volts) · Corriente (I, amperes) · Resistencia (R, ohms $\Omega$)
### Circuitos
- **Serie**: $R_T = R_1 + R_2 + \dots$ (misma corriente)
- **Paralelo**: $\frac{1}{R_T} = \frac{1}{R_1} + \frac{1}{R_2} + \dots$ (mismo voltaje)
> Cargas iguales se repelen; cargas opuestas se atraen.`,
        tip: 'Usa el triángulo V/I·R: tapa lo que buscas y queda la operación.',
      },
    ],
  },
  {
    id: 'quimica',
    name: 'Química',
    short: 'Quím',
    color: '#a78bfa',
    icon: 'FlaskConical',
    examQuestions: 16,
    description: 'Materia, átomo, tabla periódica y reacciones.',
    topics: [
      {
        id: 'qui-1',
        title: 'La materia: propiedades y estados',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'qui-1-a', title: 'Propiedades intensivas y extensivas', done: false },
          { id: 'qui-1-b', title: 'Cambios de estado', done: false },
          { id: 'qui-1-c', title: 'Mezclas y métodos de separación', done: false },
        ],
        summary: md`### Propiedades
- **Extensivas**: dependen de la cantidad (masa, volumen).
- **Intensivas**: no dependen de la cantidad (densidad, punto de ebullición).
### Cambios de estado
- Sólido → líquido: **fusión** · Líquido → gas: **evaporación**
- Gas → líquido: **condensación** · Líquido → sólido: **solidificación**
- Sólido → gas: **sublimación**
### Métodos de separación
Filtración, decantación, destilación, evaporación, cromatografía, imantación.
> Densidad: $\rho = \frac{m}{V}$`,
        tip: '¡Dominado! Úsalo como "calentamiento" antes de estudiar temas más difíciles.',
      },
      {
        id: 'qui-2',
        title: 'Estructura atómica y tabla periódica',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'qui-2-a', title: 'Partículas subatómicas', done: false },
          { id: 'qui-2-b', title: 'Número atómico y masa atómica', done: false },
          { id: 'qui-2-c', title: 'Grupos, periodos y familias', done: false },
          { id: 'qui-2-d', title: 'Metales, no metales y metaloides', done: false },
        ],
        summary: md`### El átomo
- **Protón** (+) en el núcleo · **Neutrón** (sin carga) en el núcleo · **Electrón** (−) en la nube.
- **Número atómico** $Z$ = número de protones.
- **Número de masa** $A = Z + N$ (protones + neutrones).
### Tabla periódica
- **Grupos** (columnas): mismos electrones de valencia → propiedades similares.
- **Periodos** (filas): mismo número de niveles de energía.
- Grupo 1: metales alcalinos · Grupo 17: halógenos · Grupo 18: gases nobles.`,
        tip: 'Aprende los primeros 20 elementos con su símbolo. Tarea de tarjetas esta semana.',
      },
      {
        id: 'qui-3',
        title: 'Enlaces químicos',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'qui-3-a', title: 'Regla del octeto', done: false },
          { id: 'qui-3-b', title: 'Enlace iónico', done: false },
          { id: 'qui-3-c', title: 'Enlace covalente y metálico', done: false },
        ],
        summary: md`### Tipos de enlace
- **Iónico**: metal + no metal, se **transfieren** electrones → $NaCl$.
- **Covalente**: no metal + no metal, se **comparten** electrones → $H_2O$, $CO_2$.
- **Metálico**: entre metales, "mar de electrones" → conductividad.
> **Regla del octeto**: los átomos tienden a completar 8 electrones en su capa externa.`,
        tip: 'Pregunta clave: ¿metal con no metal? → iónico. ¿Puro no metal? → covalente.',
      },
      {
        id: 'qui-4',
        title: 'Reacciones químicas, balanceo y pH',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'qui-4-a', title: 'Ley de conservación de la masa', done: false },
          { id: 'qui-4-b', title: 'Balanceo por tanteo', done: false },
          { id: 'qui-4-c', title: 'Ácidos, bases y pH', done: false },
          { id: 'qui-4-d', title: 'Cambio físico vs químico', done: false },
        ],
        summary: md`### Conservación de la masa (Lavoisier)
"La materia no se crea ni se destruye, solo se transforma."
$$2H_2 + O_2 \rightarrow 2H_2O$$
### Escala de pH
- $pH < 7$: **ácido** (limón, vinagre)
- $pH = 7$: **neutro** (agua pura)
- $pH > 7$: **básico** (jabón, bicarbonato)
> Un **cambio químico** forma sustancias nuevas (oxidación, combustión); uno **físico** no (fusión, disolver).`,
        tip: 'Para balancear: primero metales, luego no metales, al final hidrógeno y oxígeno.',
      },
    ],
  },
  {
    id: 'biologia',
    name: 'Biología',
    short: 'Bio',
    color: '#34d9a5',
    icon: 'Leaf',
    examQuestions: 16,
    description: 'Célula, cuerpo humano, genética, evolución y ecología.',
    topics: [
      {
        id: 'bio-1',
        title: 'La célula',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'bio-1-a', title: 'Procariota vs eucariota', done: false },
          { id: 'bio-1-b', title: 'Organelos y funciones', done: false },
          { id: 'bio-1-c', title: 'Célula animal vs vegetal', done: false },
        ],
        summary: md`### Tipos de célula
- **Procariota**: sin núcleo definido (bacterias).
- **Eucariota**: con núcleo (animales, plantas, hongos, protistas).
### Organelos clave
- **Núcleo**: contiene el ADN.
- **Mitocondria**: respiración celular → energía (ATP).
- **Cloroplasto**: fotosíntesis (solo vegetales).
- **Ribosoma**: síntesis de proteínas.
> La célula vegetal tiene **pared celular**, **cloroplastos** y una **vacuola** grande.`,
        tip: 'Muy bien dominado. Relaciónalo con fotosíntesis y respiración para el examen.',
      },
      {
        id: 'bio-2',
        title: 'Nutrición y sistemas del cuerpo humano',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'bio-2-a', title: 'Sistema digestivo', done: false },
          { id: 'bio-2-b', title: 'Sistemas respiratorio y circulatorio', done: false },
          { id: 'bio-2-c', title: 'Plato del bien comer', done: false },
          { id: 'bio-2-d', title: 'Sistema nervioso e inmunológico', done: false },
        ],
        summary: md`### Sistemas principales
- **Digestivo**: boca → esófago → estómago → intestino delgado (absorción) → intestino grueso.
- **Respiratorio**: intercambio de $O_2$ y $CO_2$ en los **alvéolos**.
- **Circulatorio**: el corazón bombea sangre; arterias salen, venas regresan.
### Plato del bien comer
Verduras y frutas · Cereales · Leguminosas y alimentos de origen animal.
> Una dieta **correcta** es: completa, equilibrada, inocua, suficiente, variada y adecuada.`,
        tip: 'Haz un dibujo del recorrido de los alimentos. Lo visual se te queda mejor.',
      },
      {
        id: 'bio-3',
        title: 'Herencia y genética',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'bio-3-a', title: 'ADN, genes y cromosomas', done: false },
          { id: 'bio-3-b', title: 'Leyes de Mendel', done: false },
          { id: 'bio-3-c', title: 'Cuadro de Punnett', done: false },
        ],
        summary: md`### Conceptos
- **ADN**: molécula que guarda la información genética (doble hélice).
- **Gen**: fragmento de ADN que codifica una característica.
- **Alelo dominante** (A) se expresa siempre; **recesivo** (a) solo en $aa$.
### Cruza $Aa \times Aa$
- Genotipos: 25% $AA$, 50% $Aa$, 25% $aa$
- Fenotipos: **75%** dominante, **25%** recesivo (proporción 3:1)`,
        tip: 'Practica 5 cuadros de Punnett distintos. Una vez que lo entiendes, son puntos seguros.',
      },
      {
        id: 'bio-4',
        title: 'Evolución y biodiversidad',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'bio-4-a', title: 'Teoría de Darwin-Wallace', done: false },
          { id: 'bio-4-b', title: 'Selección natural', done: false },
          { id: 'bio-4-c', title: 'México, país megadiverso', done: false },
        ],
        summary: md`### Selección natural
1. Hay **variación** entre individuos.
2. Algunas variantes sobreviven y se reproducen más (**adaptación**).
3. Esas características se heredan y se vuelven comunes.
> México es uno de los **países megadiversos**: alberga cerca del 10% de las especies del planeta.`,
        tip: 'Diferencia clave: Lamarck = "uso y desuso"; Darwin = "selección natural".',
      },
      {
        id: 'bio-5',
        title: 'Ecología y cadenas tróficas',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'bio-5-a', title: 'Productores, consumidores y descomponedores', done: false },
          { id: 'bio-5-b', title: 'Ciclos biogeoquímicos', done: false },
          { id: 'bio-5-c', title: 'Impacto ambiental', done: false },
        ],
        summary: md`### Niveles tróficos
- **Productores**: plantas y algas (fotosíntesis).
- **Consumidores**: primarios (herbívoros), secundarios y terciarios (carnívoros).
- **Descomponedores**: hongos y bacterias, reciclan nutrientes.
> En cada nivel solo pasa ~10% de la energía al siguiente.`,
        tip: 'Relaciona con lo que viste de fotosíntesis: todo empieza con la energía del Sol.',
      },
    ],
  },
  {
    id: 'historia',
    name: 'Historia',
    short: 'Hist',
    color: '#fb923c',
    icon: 'Landmark',
    examQuestions: 16,
    description: 'Historia de México y universal: fechas, procesos y personajes.',
    topics: [
      {
        id: 'his-1',
        title: 'México prehispánico',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'his-1-a', title: 'Preclásico: olmecas', done: false },
          { id: 'his-1-b', title: 'Clásico: Teotihuacan y mayas', done: false },
          { id: 'his-1-c', title: 'Posclásico: mexicas', done: false },
        ],
        summary: md`### Periodos de Mesoamérica
- **Preclásico** (2500 a.C. – 200 d.C.): **olmecas**, "cultura madre"; cabezas colosales.
- **Clásico** (200 – 900 d.C.): **Teotihuacan**, mayas (Palenque, Tikal); auge de ciudades.
- **Posclásico** (900 – 1521): toltecas y **mexicas**; Tenochtitlan fundada en **1325**.
> Rasgos comunes: maíz, juego de pelota, calendario, politeísmo, pirámides.`,
        tip: 'Ordena con una línea del tiempo visual; los periodos se confunden si solo memorizas.',
      },
      {
        id: 'his-2',
        title: 'Conquista y Virreinato',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'his-2-a', title: 'Caída de Tenochtitlan (1521)', done: false },
          { id: 'his-2-b', title: 'Sociedad de castas', done: false },
          { id: 'his-2-c', title: 'Economía novohispana', done: false },
        ],
        summary: md`### Datos clave
- **1519**: llega Hernán Cortés · **1521**: cae Tenochtitlan.
- **1535**: se establece el Virreinato de la Nueva España.
### Sociedad
Peninsulares → criollos → mestizos → indígenas → castas (mezclas).
### Economía
Minería (plata de Zacatecas y Guanajuato), haciendas, encomienda, comercio con la *Nao de China*.`,
        tip: 'El descontento de los criollos es la "semilla" de la Independencia. Conecta ambos temas.',
      },
      {
        id: 'his-3',
        title: 'Independencia y siglo XIX',
        minutes: 55,
        status: 'pendiente',
        subtopics: [
          { id: 'his-3-a', title: 'Inicio y consumación', done: false },
          { id: 'his-3-b', title: 'Guerra con EE.UU. (1846-1848)', done: false },
          { id: 'his-3-c', title: 'Reforma y Benito Juárez', done: false },
          { id: 'his-3-d', title: 'Porfiriato', done: false },
        ],
        summary: md`### Línea del tiempo
- **1810**: Grito de Dolores (Miguel Hidalgo).
- **1821**: Consumación con el **Plan de Iguala** (Iturbide y Guerrero).
- **1846-1848**: guerra con EE.UU.; México pierde ~55% del territorio.
- **1857**: Constitución liberal · **1858-1861**: Guerra de Reforma.
- **1876-1911**: **Porfiriato** — "orden y progreso", ferrocarriles, desigualdad.`,
        tip: 'Memoriza 1810 y 1821 como "inicio" y "fin". Son de las preguntas más frecuentes.',
      },
      {
        id: 'his-4',
        title: 'Revolución Mexicana y México contemporáneo',
        minutes: 50,
        status: 'pendiente',
        subtopics: [
          { id: 'his-4-a', title: 'Plan de San Luis y Madero', done: false },
          { id: 'his-4-b', title: 'Caudillos: Villa, Zapata, Carranza', done: false },
          { id: 'his-4-c', title: 'Constitución de 1917', done: false },
          { id: 'his-4-d', title: 'Cárdenas y la expropiación petrolera', done: false },
        ],
        summary: md`### Revolución
- **1910**: Madero lanza el **Plan de San Luis** (20 de noviembre).
- **1911**: Zapata proclama el **Plan de Ayala** ("Tierra y libertad").
- **1917**: nueva **Constitución** (arts. 3°, 27 y 123).
### Posrevolución
- **1938**: Lázaro Cárdenas, **expropiación petrolera**.
- **1968**: movimiento estudiantil · **1994**: TLCAN.`,
        tip: 'Asocia cada caudillo con su lema o plan. Así evitas confundirlos.',
      },
      {
        id: 'his-5',
        title: 'Historia universal: siglos XIX y XX',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'his-5-a', title: 'Revolución Industrial', done: false },
          { id: 'his-5-b', title: 'Primera y Segunda Guerra Mundial', done: false },
          { id: 'his-5-c', title: 'Guerra Fría', done: false },
        ],
        summary: md`### Procesos clave
- **Revolución Industrial** (s. XVIII-XIX): máquina de vapor, fábricas, urbanización.
- **I Guerra Mundial** (1914-1918) · **II Guerra Mundial** (1939-1945).
- **Guerra Fría** (1947-1991): EE.UU. (capitalismo) vs URSS (socialismo).
> 1989: cae el **Muro de Berlín** · 1991: se disuelve la URSS.`,
        tip: 'Une causas y consecuencias con flechas; el examen pregunta mucho el "por qué".',
      },
    ],
  },
  {
    id: 'geografia',
    name: 'Geografía',
    short: 'Geo',
    color: '#22d3ee',
    icon: 'Globe',
    examQuestions: 16,
    description: 'Espacio geográfico, naturaleza, población y economía.',
    topics: [
      {
        id: 'geo-1',
        title: 'Cartografía y coordenadas',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'geo-1-a', title: 'Latitud y longitud', done: false },
          { id: 'geo-1-b', title: 'Escalas', done: false },
          { id: 'geo-1-c', title: 'Husos horarios', done: false },
        ],
        summary: md`### Coordenadas geográficas
- **Paralelos** → **latitud** (0° a 90° N/S), referencia: Ecuador.
- **Meridianos** → **longitud** (0° a 180° E/O), referencia: Greenwich.
### Husos horarios
La Tierra gira $360^\circ$ en 24 h → $15^\circ$ por hora.
> Escala 1:50 000 → 1 cm del mapa = 50 000 cm = **500 m** reales.`,
        tip: 'Perfecto. Repasa conversiones de escala de vez en cuando, salen seguido.',
      },
      {
        id: 'geo-2',
        title: 'Relieve, clima y agua',
        minutes: 45,
        status: 'pendiente',
        subtopics: [
          { id: 'geo-2-a', title: 'Placas tectónicas', done: false },
          { id: 'geo-2-b', title: 'Climas del mundo y de México', done: false },
          { id: 'geo-2-c', title: 'Cuencas y vertientes', done: false },
        ],
        summary: md`### Placas tectónicas
México está sobre 5 placas: **Norteamericana** (la mayor parte), Pacífico, Cocos, Rivera y Caribe → zona sísmica y volcánica.
### Climas
- **Cálido** (húmedo y subhúmedo) · **Seco** (desértico) · **Templado** · **Frío** (alta montaña).
### Agua
Vertientes de México: **Pacífico**, **Golfo de México / Caribe** e **interna**.`,
        tip: 'Ubica en un mapa mudo las placas y volcanes principales. ¡Lo visual ayuda mucho!',
      },
      {
        id: 'geo-3',
        title: 'Población y diversidad cultural',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'geo-3-a', title: 'Crecimiento y distribución', done: false },
          { id: 'geo-3-b', title: 'Migración', done: false },
          { id: 'geo-3-c', title: 'Pirámides de población', done: false },
        ],
        summary: md`### Conceptos
- **Densidad de población** $= \frac{\text{habitantes}}{\text{km}^2}$
- **Migración**: emigración (salir) / inmigración (llegar).
- **Pirámide** de base ancha → población joven; de base estrecha → envejecida.
> México tiene 68 pueblos indígenas y más de 360 variantes lingüísticas.`,
        tip: 'Emigrar = Exit (salir). Inmigrar = In (entrar). Así no se te olvida.',
      },
      {
        id: 'geo-4',
        title: 'Economía y recursos naturales',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'geo-4-a', title: 'Sectores económicos', done: false },
          { id: 'geo-4-b', title: 'Recursos renovables y no renovables', done: false },
          { id: 'geo-4-c', title: 'Desarrollo sustentable', done: false },
        ],
        summary: md`### Sectores económicos
- **Primario**: obtiene recursos (agricultura, pesca, minería).
- **Secundario**: transforma (industria, manufactura).
- **Terciario**: servicios (comercio, turismo, transporte).
### Recursos
- **Renovables**: agua, Sol, viento, bosques (si se manejan bien).
- **No renovables**: petróleo, gas, minerales.`,
        tip: 'El turismo es terciario aunque se haga en la playa. Pregunta trampa típica.',
      },
    ],
  },
  {
    id: 'civica',
    name: 'Formación Cívica y Ética',
    short: 'FCyE',
    color: '#e879f9',
    icon: 'Scale',
    examQuestions: 16,
    description: 'Derechos humanos, democracia, identidad y convivencia.',
    topics: [
      {
        id: 'civ-1',
        title: 'Derechos humanos',
        minutes: 35,
        status: 'pendiente',
        subtopics: [
          { id: 'civ-1-a', title: 'Características de los DD.HH.', done: false },
          { id: 'civ-1-b', title: 'Declaración Universal (1948)', done: false },
          { id: 'civ-1-c', title: 'Instituciones: CNDH', done: false },
        ],
        summary: md`### Características
- **Universales**: para todas las personas.
- **Inalienables**: no se pueden renunciar ni transferir.
- **Indivisibles e interdependientes**: todos tienen la misma importancia.
- **Progresivos**: solo pueden ampliarse, no retroceder.
> 1948: la ONU proclama la **Declaración Universal de los Derechos Humanos**. En México los protege la **CNDH**.`,
        tip: 'Aprende las características con la palabra "UNIPI": Universales, iNalienables, Indivisibles, Progresivos, Interdependientes.',
      },
      {
        id: 'civ-2',
        title: 'Democracia y Estado mexicano',
        minutes: 40,
        status: 'pendiente',
        subtopics: [
          { id: 'civ-2-a', title: 'División de poderes', done: false },
          { id: 'civ-2-b', title: 'Federalismo', done: false },
          { id: 'civ-2-c', title: 'Participación ciudadana e INE', done: false },
        ],
        summary: md`### Poderes de la Unión
- **Ejecutivo**: Presidente(a) de la República.
- **Legislativo**: Congreso de la Unión (Cámara de Diputados + Senado).
- **Judicial**: Suprema Corte de Justicia de la Nación.
### Forma de gobierno
República **representativa, democrática, laica y federal** (art. 40 constitucional).`,
        tip: 'Relaciona cada poder con su función: hacer leyes, aplicarlas, interpretarlas.',
      },
      {
        id: 'civ-3',
        title: 'Adolescencia, identidad y valores',
        minutes: 30,
        status: 'pendiente',
        subtopics: [
          { id: 'civ-3-a', title: 'Autoestima y autoconocimiento', done: false },
          { id: 'civ-3-b', title: 'Valores y toma de decisiones', done: false },
          { id: 'civ-3-c', title: 'Proyecto de vida', done: false },
        ],
        summary: md`### Ideas clave
- **Identidad**: rasgos que te hacen único(a) y te vinculan con grupos.
- **Valores**: principios que guían decisiones (respeto, responsabilidad, honestidad).
- **Asertividad**: expresar lo que piensas con respeto, sin agresión ni sumisión.
> Un **proyecto de vida** incluye metas a corto, mediano y largo plazo. ¡Entrar a la prepa es una de ellas!`,
        tip: 'Este tema lo dominas. Tu proyecto de vida es justo lo que estamos construyendo juntos 💪',
      },
      {
        id: 'civ-4',
        title: 'Convivencia y cultura de la legalidad',
        minutes: 30,
        status: 'pendiente',
        subtopics: [
          { id: 'civ-4-a', title: 'Resolución no violenta de conflictos', done: false },
          { id: 'civ-4-b', title: 'Mediación y negociación', done: false },
          { id: 'civ-4-c', title: 'Normas y leyes', done: false },
        ],
        summary: md`### Formas de resolver conflictos
- **Negociación**: las partes dialogan directamente.
- **Mediación**: un **tercero imparcial** facilita el diálogo.
- **Arbitraje**: un tercero **decide** la solución.
> **Cultura de la legalidad**: respetar y cumplir las leyes por convicción, no por miedo al castigo.`,
        tip: 'Diferencia mediación (ayuda a dialogar) vs arbitraje (decide por ellos).',
      },
    ],
  },
]

/** Índice rápido: id de materia → materia */
export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]))

/** Lista plana de temas con referencia a su materia */
export const ALL_TOPICS = SUBJECTS.flatMap((s) =>
  s.topics.map((t) => ({ ...t, subjectId: s.id })),
)

export const TOPIC_MAP = Object.fromEntries(ALL_TOPICS.map((t) => [t.id, t]))

/** Estados posibles de un tema */
export const TOPIC_STATUS = {
  pendiente: { label: 'Pendiente', short: 'Pend.', color: '#8d9acb', weight: 0 },
  repaso: { label: 'En repaso', short: 'Repaso', color: '#fbbf24', weight: 0.5 },
  dominado: { label: 'Dominado', short: 'Dominado', color: '#34d9a5', weight: 1 },
}
