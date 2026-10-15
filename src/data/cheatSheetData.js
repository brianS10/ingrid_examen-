/**
 * Acordeón Oficial y Formulario de Consulta Rápida ECOEMS / COMIPEMS.
 * Todo lo que Ingrid necesita tener a la mano en un solo clic.
 */
export const CHEATSHEET_SECTIONS = [
  {
    id: 'matematicas',
    title: 'Matemáticas (Fórmulas Clave)',
    icon: 'Sigma',
    color: '#4f46e5',
    items: [
      {
        name: 'Leyes de los Signos',
        content: '(+) × (+) = (+)\n(−) × (−) = (+)\n(+) × (−) = (−)\n(−) × (+) = (−)',
        tip: 'Signos iguales dan positivo, signos distintos dan negativo.',
      },
      {
        name: 'Teorema de Pitágoras',
        content: 'a² + b² = c²\nPara hipotenusa: c = √(a² + b²)\nPara un cateto: a = √(c² − b²)',
        tip: 'Solo en triángulos rectángulos (90°).',
      },
      {
        name: 'Áreas y Perímetros',
        content: '• Cuadrado: A = L², P = 4L\n• Rectángulo: A = b × h, P = 2b + 2h\n• Triángulo: A = (b × h) / 2\n• Círculo: A = π × r², P = 2π × r',
        tip: 'Si te dan el diámetro, el radio es la mitad: r = d / 2.',
      },
      {
        name: 'Porcentajes Rápidos',
        content: '• 50% = dividir entre 2\n• 25% = dividir entre 4\n• 20% = dividir entre 5\n• 10% = recorrer el punto 1 lugar a la izq.\n• Descuento del 15% = multiplicar por 0.85',
        tip: 'Te ahorra minutos valiosos en el examen.',
      },
      {
        name: 'Jerarquía de Operaciones',
        content: '1. Paréntesis () [] {}\n2. Potencias y Raíces\n3. Multiplicación y División\n4. Suma y Resta',
        tip: 'Si están en el mismo nivel, se resuelven de izquierda a derecha.',
      },
    ],
  },
  {
    id: 'espanol',
    title: 'Español (Reglas de Oro)',
    icon: 'Book',
    color: '#e11d48',
    items: [
      {
        name: 'Reglas de Acentuación',
        content: '• Agudas: Tilde si terminan en N, S o Vocal (ej. cajón, café).\n• Graves: Tilde si NO terminan en N, S o Vocal (ej. árbol, lápiz).\n• Esdrújulas: ¡SIEMPRE llevan tilde! (ej. pájaro, música).',
        tip: 'Aprende la palabra SEGA: Sobresdrújula, Esdrújula, Grave, Aguda.',
      },
      {
        name: 'Figuras Retóricas',
        content: '• Símil: "Tus ojos brillan como el sol" (usa "como" o "cual").\n• Metáfora: "El sol de tu mirada" (identificación directa).\n• Hipérbole: "Lloré un río de lágrimas" (exageración).\n• Personificación: "El viento susurraba" (cualidad humana a objetos).',
        tip: 'Aparece en 2 o 3 preguntas de lectura.',
      },
      {
        name: 'Nexos Gramaticales',
        content: '• Causales: porque, ya que, puesto que.\n• Consecutivos: por tanto, en consecuencia, así que.\n• Adversativos: pero, sin embargo, no obstante.\n• Condicionales: si, con tal que, a menos que.',
        tip: 'Fíjate qué relación lógica une a las dos oraciones.',
      },
    ],
  },
  {
    id: 'ciencias',
    title: 'Biología, Química y Física',
    icon: 'Sparkles',
    color: '#059669',
    items: [
      {
        name: 'Célula: Procariota vs Eucariota',
        content: '• Procariota: Sin núcleo organizado (bacterias).\n• Eucariota: Con núcleo definido y organelos (animales, plantas, hongos).\n• Mitocondria = Genera energía ATP.\n• Cloroplasto = Fotosíntesis en plantas.',
        tip: 'Los virus NO son células vivas.',
      },
      {
        name: 'Química: Átomo y pH',
        content: '• Protones (+), Neutrones (neutros), Electrones (−).\n• Z = Número atómico (número de protones).\n• A = Masa atómica (protones + neutrones).\n• pH 0 a 6.9: Ácido | pH 7: Neutro | pH 7.1 a 14: Básico.',
        tip: 'N = A − Z (así calculas neutrones).',
      },
      {
        name: 'Física: Leyes de Newton y Movimiento',
        content: '• 1ª Ley: Inercia (los cuerpos resisten cambiar su movimiento).\n• 2ª Ley: F = m × a (Fuerza = masa × aceleración).\n• 3ª Ley: Acción y Reacción (igual magnitud, sentido contrario).\n• Velocidad: v = d / t (distancia ÷ tiempo).',
        tip: 'Si la velocidad es constante, la aceleración es CERO.',
      },
    ],
  },
  {
    id: 'historia',
    title: 'Historia de México (Fechas Clave)',
    icon: 'History',
    color: '#7c3aed',
    items: [
      {
        name: 'Línea del Tiempo Esencial',
        content: '• 1521: Caída de Tenochtitlán y Conquista.\n• 1810 - 1821: Independencia de México.\n• 1857: Constitución Liberal y Leyes de Reforma (Juárez).\n• 1876 - 1911: Porfiriato.\n• 1910: Inicio de la Revolución Mexicana (Madero).\n• 1917: Promulgación de la Constitución actual.',
        tip: 'Memoriza los siglos: Conquista (XVI), Independencia (XIX), Revolución (XX).',
      },
      {
        name: 'Artículos Clave de la Constitución 1917',
        content: '• Art. 3°: Educación laica, gratuita y obligatoria.\n• Art. 27°: Tierras, aguas y recursos naturales para la Nación.\n• Art. 123°: Jornada máxima de 8 horas, salario mínimo y derechos laborales.',
        tip: 'Siempre preguntan por el 3°, 27° y 123°.',
      },
    ],
  },
]
