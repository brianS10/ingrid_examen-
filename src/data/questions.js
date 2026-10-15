/**
 * Banco de reactivos tipo COMIPEMS (opción múltiple A–D).
 *
 * Estructura de cada reactivo:
 *   id, subjectId, topicId, difficulty (1-3), question, options[4], answer (índice 0-3), explanation
 *
 * Los textos admiten el mismo mini-markdown que los apuntes ($fórmulas$, **negritas**, etc.).
 * Para cantidades de dinero se escribe "pesos" para no chocar con el delimitador $ de fórmulas.
 */
const md = String.raw

export const QUESTIONS = [
  // ───────────── Matemáticas ─────────────
  {
    id: 'q-mat-1',
    subjectId: 'matematicas',
    topicId: 'mat-1',
    difficulty: 1,
    question: 'Un pantalón cuesta 480 pesos y tiene 25% de descuento. ¿Cuánto se paga por él?',
    options: ['360 pesos', '380 pesos', '420 pesos', '455 pesos'],
    answer: 0,
    explanation: md`El 25% de 480 es $\frac{1}{4} \cdot 480 = 120$. Entonces se paga $480 - 120 = 360$ pesos. Atajo: pagar con 25% de descuento es pagar el 75%: $480 \cdot 0.75 = 360$.`,
  },
  {
    id: 'q-mat-2',
    subjectId: 'matematicas',
    topicId: 'mat-2',
    difficulty: 1,
    question: md`¿Cuál es el valor de $x$ en la ecuación $3x - 7 = 2x + 5$?`,
    options: ['$x = 2$', '$x = -2$', '$x = 12$', '$x = -12$'],
    answer: 2,
    explanation: md`Pasamos los términos con $x$ a un lado y los números al otro: $3x - 2x = 5 + 7$, por lo tanto $x = 12$. Comprobación: $3(12) - 7 = 29$ y $2(12) + 5 = 29$ ✔.`,
  },
  {
    id: 'q-mat-3',
    subjectId: 'matematicas',
    topicId: 'mat-3',
    difficulty: 2,
    question: md`¿Cuál es el desarrollo de $(x + 4)^2$?`,
    options: [md`$x^2 + 16$`, md`$x^2 + 4x + 16$`, md`$x^2 + 8x + 16$`, md`$x^2 + 8x + 8$`],
    answer: 2,
    explanation: md`Binomio al cuadrado: $(a + b)^2 = a^2 + 2ab + b^2$. Con $a = x$, $b = 4$: $x^2 + 2(x)(4) + 16 = x^2 + 8x + 16$. La opción $x^2 + 16$ olvida el doble producto (error muy común).`,
  },
  {
    id: 'q-mat-4',
    subjectId: 'matematicas',
    topicId: 'mat-4',
    difficulty: 1,
    question: 'Los catetos de un triángulo rectángulo miden 6 cm y 8 cm. ¿Cuánto mide la hipotenusa?',
    options: ['7 cm', '10 cm', '12 cm', '14 cm'],
    answer: 1,
    explanation: md`Por Pitágoras: $c = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10$ cm. Es la terna 6-8-10 (múltiplo de 3-4-5).`,
  },
  {
    id: 'q-mat-5',
    subjectId: 'matematicas',
    topicId: 'mat-1',
    difficulty: 2,
    question: md`¿Cuál es el resultado de $\frac{2}{3} + \frac{3}{4}$?`,
    options: [md`$\frac{5}{7}$`, md`$\frac{5}{12}$`, md`$\frac{17}{12}$`, md`$\frac{6}{12}$`],
    answer: 2,
    explanation: md`Común denominador 12: $\frac{2}{3} = \frac{8}{12}$ y $\frac{3}{4} = \frac{9}{12}$. Sumando: $\frac{8 + 9}{12} = \frac{17}{12}$. Nunca se suman numeradores y denominadores directamente ($\frac{5}{7}$ es incorrecto).`,
  },
  {
    id: 'q-mat-6',
    subjectId: 'matematicas',
    topicId: 'mat-6',
    difficulty: 2,
    question: 'Al lanzar un dado normal, ¿cuál es la probabilidad de obtener un número mayor que 4?',
    options: [md`$\frac{1}{6}$`, md`$\frac{1}{3}$`, md`$\frac{1}{2}$`, md`$\frac{2}{3}$`],
    answer: 1,
    explanation: md`Los casos favorables son 5 y 6 (2 casos) de 6 posibles: $P = \frac{2}{6} = \frac{1}{3}$.`,
  },

  // ───────────── Español ─────────────
  {
    id: 'q-esp-1',
    subjectId: 'espanol',
    topicId: 'esp-1',
    difficulty: 2,
    question:
      'Lee el fragmento: «Las abejas no solo producen miel; al polinizar, permiten que se reproduzcan cerca del 75% de los cultivos que consumimos. Su desaparición pondría en riesgo la seguridad alimentaria mundial.» ¿Cuál es la idea principal?',
    options: [
      'La miel es el producto más importante de las abejas.',
      'Las abejas son fundamentales para la producción de alimentos.',
      'El 75% de los cultivos del mundo están en peligro.',
      'La seguridad alimentaria depende solo de la miel.',
    ],
    answer: 1,
    explanation:
      'El texto destaca que la polinización de las abejas permite la mayoría de los cultivos, por lo que son clave para la alimentación. La opción A contradice el "no solo"; la C exagera un dato y la D distorsiona el texto.',
  },
  {
    id: 'q-esp-2',
    subjectId: 'espanol',
    topicId: 'esp-4',
    difficulty: 1,
    question: '¿Qué figura retórica se usa en el verso «Tus ojos son dos luceros»?',
    options: ['Símil', 'Metáfora', 'Hipérbole', 'Personificación'],
    answer: 1,
    explanation:
      'Se identifica "ojos" con "luceros" sin usar nexo comparativo (como, cual). Eso es una metáfora. Si dijera "tus ojos son como luceros" sería un símil.',
  },
  {
    id: 'q-esp-3',
    subjectId: 'espanol',
    topicId: 'esp-3',
    difficulty: 1,
    question: '¿Cuál de las siguientes palabras está escrita correctamente?',
    options: ['Examén', 'Árbol', 'Cancion', 'Lapíz'],
    answer: 1,
    explanation:
      '"Árbol" es grave (ÁR-bol) y termina en "l" (no en n, s o vocal), así que lleva tilde. "Examen" es grave terminada en n (sin tilde), "canción" es aguda terminada en n (con tilde) y "lápiz" es grave terminada en z (tilde en la "a").',
  },
  {
    id: 'q-esp-4',
    subjectId: 'espanol',
    topicId: 'esp-5',
    difficulty: 2,
    question: 'En la oración «Los alumnos de tercer grado resolvieron el examen», ¿cuál es el núcleo del sujeto?',
    options: ['Los', 'alumnos', 'tercer grado', 'resolvieron'],
    answer: 1,
    explanation:
      'El sujeto es "Los alumnos de tercer grado" y su núcleo es el sustantivo "alumnos". "Resolvieron" es el núcleo del predicado (verbo).',
  },

  // ───────────── Física ─────────────
  {
    id: 'q-fis-1',
    subjectId: 'fisica',
    topicId: 'fis-1',
    difficulty: 1,
    question: 'Un automóvil recorre 150 km en 2 horas con velocidad constante. ¿Cuál es su velocidad?',
    options: ['50 km/h', '75 km/h', '150 km/h', '300 km/h'],
    answer: 1,
    explanation: md`En MRU: $v = \frac{d}{t} = \frac{150\ \text{km}}{2\ \text{h}} = 75\ \text{km/h}$.`,
  },
  {
    id: 'q-fis-2',
    subjectId: 'fisica',
    topicId: 'fis-2',
    difficulty: 2,
    question: 'Se aplica una fuerza de 20 N a un objeto de 4 kg. ¿Qué aceleración adquiere?',
    options: [md`$0.2\ \text{m/s}^2$`, md`$5\ \text{m/s}^2$`, md`$16\ \text{m/s}^2$`, md`$80\ \text{m/s}^2$`],
    answer: 1,
    explanation: md`Segunda ley de Newton: $a = \frac{F}{m} = \frac{20\ \text{N}}{4\ \text{kg}} = 5\ \text{m/s}^2$.`,
  },
  {
    id: 'q-fis-3',
    subjectId: 'fisica',
    topicId: 'fis-4',
    difficulty: 2,
    question: md`Por una resistencia de $10\ \Omega$ circula una corriente de 2 A. ¿Cuál es el voltaje?`,
    options: ['5 V', '8 V', '12 V', '20 V'],
    answer: 3,
    explanation: md`Ley de Ohm: $V = I \cdot R = 2\ \text{A} \cdot 10\ \Omega = 20\ \text{V}$.`,
  },
  {
    id: 'q-fis-4',
    subjectId: 'fisica',
    topicId: 'fis-2',
    difficulty: 1,
    question: 'Al empujar una pared sentimos que ella nos empuja con la misma fuerza. ¿Qué ley lo explica?',
    options: ['Primera ley de Newton', 'Segunda ley de Newton', 'Tercera ley de Newton', 'Ley de la gravitación universal'],
    answer: 2,
    explanation:
      'La tercera ley (acción y reacción) dice que a toda fuerza le corresponde otra de igual magnitud y sentido opuesto aplicada sobre el otro cuerpo.',
  },
  {
    id: 'q-fis-5',
    subjectId: 'fisica',
    topicId: 'fis-3',
    difficulty: 3,
    question: 'Si la velocidad de un objeto se duplica, ¿qué pasa con su energía cinética?',
    options: ['Se mantiene igual', 'Se duplica', 'Se triplica', 'Se cuadruplica'],
    answer: 3,
    explanation: md`$E_c = \frac{1}{2} m v^2$. Si $v \to 2v$: $\frac{1}{2} m (2v)^2 = 4 \cdot \frac{1}{2} m v^2$. La energía se multiplica por 4.`,
  },

  // ───────────── Química ─────────────
  {
    id: 'q-qui-1',
    subjectId: 'quimica',
    topicId: 'qui-2',
    difficulty: 1,
    question: 'El número atómico (Z) de un elemento indica la cantidad de:',
    options: ['Neutrones en el núcleo', 'Protones en el núcleo', 'Protones más neutrones', 'Niveles de energía'],
    answer: 1,
    explanation:
      'Z es el número de protones y es lo que identifica a cada elemento. Protones + neutrones es el número de masa (A).',
  },
  {
    id: 'q-qui-2',
    subjectId: 'quimica',
    topicId: 'qui-3',
    difficulty: 2,
    question: 'El cloruro de sodio (NaCl, sal de mesa) se forma mediante un enlace:',
    options: ['Covalente polar', 'Covalente no polar', 'Iónico', 'Metálico'],
    answer: 2,
    explanation:
      'El sodio (metal) transfiere un electrón al cloro (no metal), formando iones Na⁺ y Cl⁻ que se atraen: enlace iónico.',
  },
  {
    id: 'q-qui-3',
    subjectId: 'quimica',
    topicId: 'qui-4',
    difficulty: 1,
    question: '¿Cuál de los siguientes es un cambio químico?',
    options: ['Derretir un cubo de hielo', 'Disolver azúcar en agua', 'La oxidación de un clavo', 'Romper un vaso de vidrio'],
    answer: 2,
    explanation:
      'En la oxidación el hierro reacciona con el oxígeno y forma una sustancia nueva (óxido de hierro). Los demás son cambios físicos: la sustancia sigue siendo la misma.',
  },
  {
    id: 'q-qui-4',
    subjectId: 'quimica',
    topicId: 'qui-4',
    difficulty: 2,
    question: 'Una sustancia con pH = 3 se clasifica como:',
    options: ['Ácida', 'Neutra', 'Básica', 'Alcalina fuerte'],
    answer: 0,
    explanation: 'En la escala de pH, valores menores que 7 son ácidos, 7 es neutro y mayores que 7 son básicos (alcalinos).',
  },

  // ───────────── Biología ─────────────
  {
    id: 'q-bio-1',
    subjectId: 'biologia',
    topicId: 'bio-1',
    difficulty: 1,
    question: '¿Qué organelo se encarga de la respiración celular y la producción de energía (ATP)?',
    options: ['Ribosoma', 'Cloroplasto', 'Mitocondria', 'Aparato de Golgi'],
    answer: 2,
    explanation:
      'La mitocondria realiza la respiración celular y produce ATP. El cloroplasto hace fotosíntesis y el ribosoma sintetiza proteínas.',
  },
  {
    id: 'q-bio-2',
    subjectId: 'biologia',
    topicId: 'bio-3',
    difficulty: 3,
    question: md`Si se cruzan dos plantas heterocigotas ($Aa \times Aa$), ¿qué porcentaje de la descendencia mostrará el carácter recesivo?`,
    options: ['0%', '25%', '50%', '75%'],
    answer: 1,
    explanation: md`El cuadro de Punnett da $AA$, $Aa$, $Aa$, $aa$. Solo $aa$ (1 de 4) muestra el carácter recesivo: **25%**.`,
  },
  {
    id: 'q-bio-3',
    subjectId: 'biologia',
    topicId: 'bio-4',
    difficulty: 2,
    question: 'Según Darwin, ¿cuál es el principal mecanismo de la evolución?',
    options: ['El uso y desuso de los órganos', 'La selección natural', 'La generación espontánea', 'La creación independiente'],
    answer: 1,
    explanation:
      'Darwin propuso la selección natural: los individuos con variaciones ventajosas sobreviven y se reproducen más. "Uso y desuso" es la idea de Lamarck.',
  },

  // ───────────── Historia ─────────────
  {
    id: 'q-his-1',
    subjectId: 'historia',
    topicId: 'his-3',
    difficulty: 1,
    question: '¿En qué año se consumó la Independencia de México?',
    options: ['1810', '1815', '1821', '1824'],
    answer: 2,
    explanation:
      'La guerra inició en 1810 con el Grito de Dolores y se consumó el 27 de septiembre de 1821 con la entrada del Ejército Trigarante a la Ciudad de México.',
  },
  {
    id: 'q-his-2',
    subjectId: 'historia',
    topicId: 'his-4',
    difficulty: 2,
    question: '¿Qué documento convocó al levantamiento armado del 20 de noviembre de 1910?',
    options: ['Plan de Ayala', 'Plan de San Luis', 'Plan de Guadalupe', 'Plan de Iguala'],
    answer: 1,
    explanation:
      'Francisco I. Madero promulgó el Plan de San Luis contra la reelección de Porfirio Díaz. El Plan de Ayala es de Zapata (1911), el de Guadalupe de Carranza (1913) y el de Iguala es de la Independencia (1821).',
  },
  {
    id: 'q-his-3',
    subjectId: 'historia',
    topicId: 'his-1',
    difficulty: 1,
    question: '¿Qué cultura es considerada la "cultura madre" de Mesoamérica?',
    options: ['Maya', 'Mexica', 'Olmeca', 'Tolteca'],
    answer: 2,
    explanation:
      'Los olmecas (Preclásico) desarrollaron rasgos que heredaron las culturas posteriores: juego de pelota, calendario y culto al jaguar.',
  },

  // ───────────── Geografía ─────────────
  {
    id: 'q-geo-1',
    subjectId: 'geografia',
    topicId: 'geo-1',
    difficulty: 1,
    question: 'Las líneas imaginarias paralelas al Ecuador que sirven para medir la latitud se llaman:',
    options: ['Meridianos', 'Paralelos', 'Husos horarios', 'Trópicos'],
    answer: 1,
    explanation:
      'Los paralelos miden la latitud (norte-sur). Los meridianos van de polo a polo y miden la longitud (este-oeste).',
  },
  {
    id: 'q-geo-2',
    subjectId: 'geografia',
    topicId: 'geo-2',
    difficulty: 2,
    question: '¿Sobre qué placa tectónica se encuentra la mayor parte del territorio mexicano?',
    options: ['Placa de Cocos', 'Placa del Pacífico', 'Placa Norteamericana', 'Placa del Caribe'],
    answer: 2,
    explanation:
      'La mayor parte de México está sobre la placa Norteamericana. La península de Baja California está sobre la del Pacífico y la subducción de la de Cocos genera muchos sismos.',
  },
  {
    id: 'q-geo-3',
    subjectId: 'geografia',
    topicId: 'geo-4',
    difficulty: 1,
    question: '¿A qué sector económico pertenece el turismo?',
    options: ['Primario', 'Secundario', 'Terciario', 'Cuaternario extractivo'],
    answer: 2,
    explanation: 'El turismo es un servicio, por lo que pertenece al sector terciario junto con el comercio y el transporte.',
  },

  // ───────────── Formación Cívica y Ética ─────────────
  {
    id: 'q-civ-1',
    subjectId: 'civica',
    topicId: 'civ-1',
    difficulty: 2,
    question: '¿Qué característica de los derechos humanos indica que no se pueden renunciar, vender ni transferir?',
    options: ['Universalidad', 'Progresividad', 'Inalienabilidad', 'Interdependencia'],
    answer: 2,
    explanation:
      'Inalienables significa que nadie puede renunciar a ellos ni quitárselos. Universales = para todos; progresivos = solo se amplían.',
  },
  {
    id: 'q-civ-2',
    subjectId: 'civica',
    topicId: 'civ-2',
    difficulty: 1,
    question: '¿Cuáles son los tres Poderes de la Unión en México?',
    options: [
      'Federal, Estatal y Municipal',
      'Ejecutivo, Legislativo y Judicial',
      'Presidente, Senado y Gobernadores',
      'Electoral, Militar y Civil',
    ],
    answer: 1,
    explanation:
      'La Constitución divide el Supremo Poder de la Federación en Ejecutivo (Presidencia), Legislativo (Congreso) y Judicial (Suprema Corte). Federal, estatal y municipal son niveles de gobierno.',
  },
  {
    id: 'q-civ-3',
    subjectId: 'civica',
    topicId: 'civ-4',
    difficulty: 2,
    question: 'Forma de resolver un conflicto en la que un tercero imparcial ayuda a las partes a dialogar, sin decidir por ellas:',
    options: ['Arbitraje', 'Mediación', 'Negociación directa', 'Juicio'],
    answer: 1,
    explanation:
      'En la mediación el tercero solo facilita la comunicación. En el arbitraje (y en un juicio) el tercero sí decide la solución.',
  },

  // ───────────── Preguntas de refuerzo para cobertura total de temas ─────────────
  {
    id: 'q-mat-7',
    subjectId: 'matematicas',
    topicId: 'mat-5',
    difficulty: 2,
    question: md`¿Cuáles son las soluciones de la ecuación cuadrática $x^2 - 25 = 0$?`,
    options: [md`$x = 5$ solamente`, md`$x = -5$ solamente`, md`$x = 5$ y $x = -5$`, md`$x = 0$ y $x = 25$`],
    answer: 2,
    explanation: md`Despejando: $x^2 = 25 \Rightarrow x = \pm \sqrt{25} = \pm 5$. Toda raíz cuadrada en ecuaciones de segundo grado genera dos soluciones: una positiva y una negativa.`,
  },
  {
    id: 'q-esp-5',
    subjectId: 'espanol',
    topicId: 'esp-2',
    difficulty: 1,
    question: 'En la oración «El automóvil rojo avanzó rápidamente por la carretera», la palabra «rápidamente» funciona como:',
    options: ['Sustantivo', 'Adjetivo', 'Adverbio de modo', 'Preposición'],
    answer: 2,
    explanation:
      '«Rápidamente» modifica al verbo «avanzó» indicando cómo ocurrió la acción, por lo tanto es un adverbio de modo (la mayoría de palabras con terminación -mente son adverbios).',
  },
  {
    id: 'q-qui-5',
    subjectId: 'quimica',
    topicId: 'qui-1',
    difficulty: 1,
    question: 'El paso directo del estado sólido al gaseoso sin pasar por el líquido se conoce como:',
    options: ['Evaporación', 'Sublimación', 'Condensación', 'Fusión'],
    answer: 1,
    explanation:
      'La sublimación es el cambio de fase directo de sólido a gas (ejemplo: el hielo seco o las pastillas de naftalina).',
  },
  {
    id: 'q-bio-4',
    subjectId: 'biologia',
    topicId: 'bio-2',
    difficulty: 1,
    question: '¿Qué órgano del cuerpo humano es el principal responsable de la absorción de los nutrientes durante la digestión?',
    options: ['Estómago', 'Intestino delgado', 'Hígado', 'Intestino grueso'],
    answer: 1,
    explanation:
      'El intestino delgado (a través de sus microvellosidades) absorbe la mayor parte de carbohidratos, lípidos, proteínas y vitaminas hacia el torrente sanguíneo.',
  },
  {
    id: 'q-bio-5',
    subjectId: 'biologia',
    topicId: 'bio-5',
    difficulty: 1,
    question: 'En una cadena trófica, los organismos fotosintéticos como las plantas ocupan el nivel de:',
    options: ['Consumidores primarios', 'Productores', 'Consumidores secundarios', 'Descomponedores'],
    answer: 1,
    explanation:
      'Las plantas y algas son productores porque fabrican su propia materia orgánica a partir de la luz solar (organismos autótrofos).',
  },
  {
    id: 'q-his-4',
    subjectId: 'historia',
    topicId: 'his-2',
    difficulty: 1,
    question: '¿En qué año ocurrió la caída de México-Tenochtitlan a manos de Hernán Cortés y sus aliados indígenas?',
    options: ['1492', '1510', '1521', '1810'],
    answer: 2,
    explanation:
      'El 13 de agosto de 1521 cayó Tenochtitlan, dando inicio al periodo virreinal de la Nueva España (que duró exactamente 300 años hasta 1821).',
  },
  {
    id: 'q-his-5',
    subjectId: 'historia',
    topicId: 'his-5',
    difficulty: 2,
    question: '¿Qué acontecimiento detonó el inicio de la Primera Guerra Mundial en 1914?',
    options: [
      'La invasión de Polonia por Alemania',
      'El asesinato del archiduque Francisco Fernando en Sarajevo',
      'El bombardeo de Pearl Harbor',
      'La caída del Muro de Berlín',
    ],
    answer: 1,
    explanation:
      'El asesinato del heredero al trono austrohúngaro en Sarajevo desató el sistema de alianzas que inició la Primera Guerra Mundial. La invasión de Polonia inició la Segunda Guerra en 1939.',
  },
  {
    id: 'q-geo-4',
    subjectId: 'geografia',
    topicId: 'geo-3',
    difficulty: 1,
    question: 'La salida de personas de su lugar de origen para establecerse en otra región o país se denomina:',
    options: ['Inmigración', 'Emigración', 'Crecimiento natural', 'Densidad de población'],
    answer: 1,
    explanation:
      'Emigración es salir de un lugar de origen; inmigración es llegar al lugar de destino.',
  },
  {
    id: 'q-civ-4',
    subjectId: 'civica',
    topicId: 'civ-3',
    difficulty: 1,
    question: 'La capacidad de las personas para tomar decisiones responsables según sus propios principios éticos y valores se llama:',
    options: ['Heteronomía', 'Autonomía moral', 'Presión social', 'Imposición'],
    answer: 1,
    explanation:
      'La autonomía moral consiste en gobernarse a uno mismo y decidir con responsabilidad sin dejarse llevar ciegamente por lo que dicen los demás.',
  },
]

export const QUESTION_MAP = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]))

/** Letras para las opciones */
export const OPTION_LETTERS = ['A', 'B', 'C', 'D']
