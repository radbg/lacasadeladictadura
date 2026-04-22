// ============================================================
//  data.js  —  Contenido de todos los cuartos y preguntas
// ============================================================

const ROOMS = [
  {
    id: 1,
    power: "PODER EJECUTIVO",
    name: "La Presidencia",
    image: "images/room-1-presidencia.jpg",
    isTransition: false,
    ambience: "Estás en el despacho presidencial del dictador.",
    questions: [
      {
        text: "¿Puede el Presidente de Venezuela ser reelegido indefinidamente según la Constitución de 1999?",
        options: [
          { text: "No, la Constitución prohíbe más de dos períodos consecutivos", correct: false },
          { text: "Sí, una enmienda de 2009 eliminó ese límite", correct: true }
        ],
        fact: "La Enmienda N°1 de 2009 eliminó los límites de reelección, pero fue aprobada de forma inconstitucional: una reforma idéntica ya había sido rechazada en referéndum en 2007. El artículo 345 de la CRBV prohíbe expresamente presentar ante la Asamblea Nacional cualquier iniciativa de reforma que haya sido rechazada por el pueblo durante el mismo período constitucional."
      },
      {
        text: "¿El Presidente puede disolver la Asamblea Nacional en Venezuela?",
        options: [
          { text: "No, la Constitución no le otorga esa facultad", correct: true },
          { text: "Sí, si declara estado de emergencia", correct: false }
        ],
        fact: "A diferencia de otros sistemas presidenciales, la Constitución venezolana de 1999 no contempla la disolución del Parlamento por parte del Ejecutivo."
      },
      {
        text: "¿Puede un ciudadano votar en Venezuela aunque su cédula de identidad esté vencida?",
        options: [
          { text: "No, debe renovarla antes de votar", correct: false },
          { text: "Sí, la cédula vencida es válida para votar", correct: true }
        ],
        fact: "El CNE y la Ley Orgánica del Sufragio establecen que la cédula vencida es documento válido para ejercer el voto."
      }
    ]
  },

  {
    id: 2,
    power: "PODER LEGISLATIVO",
    name: "La Asamblea Nacional",
    image: "images/room-2-asamblea.jpg",
    isTransition: false,
    ambience: "Estás en el hemiciclo de la Asamblea Nacional, cooptado por el poder Ejecutivo y con curules de sobra.",
    questions: [
      {
        text: "¿Puede la Asamblea Nacional aprobar una ley sin el voto de la mayoría de sus miembros?",
        options: [
          { text: "No, se requiere mayoría absoluta como mínimo para leyes ordinarias", correct: true },
          { text: "Sí, con quórum de un tercio es suficiente", correct: false }
        ],
        fact: "El artículo 221 de la CRBV establece que el quórum para sesionar es la mayoría absoluta de los integrantes."
      },
      {
        text: "¿Cuántos diputados tiene la Asamblea Nacional de Venezuela según la Constitución?",
        options: [
          { text: "El número lo fija la ley electoral, no la Constitución", correct: true },
          { text: "165 diputados, número fijo constitucional", correct: false }
        ],
        fact: "La Constitución establece los principios de representación pero delega en la ley la determinación del número exacto de diputados."
      },
      {
        text: "¿Puede la Asamblea Nacional interpelar a los ministros del gobierno?",
        options: [
          { text: "Sí, es una facultad de control parlamentario establecida en la Constitución", correct: true },
          { text: "No, eso viola la separación de poderes", correct: false }
        ],
        fact: "El artículo 222 CRBV faculta a la AN a realizar interpelaciones, investigaciones y preguntas a los ministros como mecanismo de control."
      }
    ]
  },

  {
    id: 3,
    power: "PODER JUDICIAL",
    name: "El TSJ",
    image: "images/room-3-tsj.jpg",
    isTransition: false,
    ambience: "Estás en la sala del Tribunal Supremo de Justicia, controlado por el régimen.",
    questions: [
      {
        text: "¿Los magistrados del Tribunal Supremo de Justicia son elegidos por el pueblo en Venezuela?",
        options: [
          { text: "No, son designados por la Asamblea Nacional", correct: true },
          { text: "Sí, mediante voto popular directo", correct: false }
        ],
        fact: "El artículo 264 CRBV establece que los magistrados son designados por la AN mediante un proceso con postulaciones del Comité de Postulaciones Judiciales."
      },
      {
        text: "¿Puede el TSJ declarar inconstitucional una ley aprobada por la Asamblea Nacional?",
        options: [
          { text: "Sí, esa es precisamente una de sus funciones", correct: true },
          { text: "No, el parlamento tiene la última palabra en materia legislativa", correct: false }
        ],
        fact: "La Sala Constitucional del TSJ tiene competencia para anular leyes que contravengan la Constitución, según el artículo 336 CRBV."
      },
      {
        text: "¿Cuántos años dura el período de un magistrado del TSJ en Venezuela?",
        options: [
          { text: "6 años, sin posibilidad de reelección", correct: false },
          { text: "12 años, sin posibilidad de reelección", correct: true }
        ],
        fact: "El artículo 264 CRBV establece un período de 12 años para los magistrados, precisamente para garantizar su independencia de los ciclos políticos."
      }
    ]
  },

  {
    id: 4,
    power: "MINISTERIO PÚBLICO",
    name: "La Fiscalía",
    image: "images/room-4-fiscalia.jpg",
    isTransition: false,
    ambience: "Estás en la sede de la Fiscalía General, donde los expedientes se abren y cierran según convenga.",
    questions: [
      {
        text: "¿El Fiscal General de Venezuela puede ser removido por el Presidente de la República?",
        options: [
          { text: "No, solo puede ser removido por la Asamblea Nacional", correct: true },
          { text: "Sí, el Presidente puede destituirlo en cualquier momento", correct: false }
        ],
        fact: "El Fiscal General es designado y puede ser removido por la AN (artículo 279 CRBV), no por el Ejecutivo, para garantizar su autonomía."
      },
      {
        text: "¿Tiene el Ministerio Público la obligación de investigar denuncias de violaciones a derechos humanos?",
        options: [
          { text: "Sí, es una obligación constitucional explícita", correct: true },
          { text: "Solo si las ordena el Tribunal Supremo", correct: false }
        ],
        fact: "El artículo 285 CRBV ordena al MP garantizar el respeto a los derechos constitucionales, incluyendo investigar sus violaciones."
      },
      {
        text: "¿La Defensoría del Pueblo forma parte del Poder Ciudadano junto al Ministerio Público?",
        options: [
          { text: "Sí, junto con la Contraloría General de la República", correct: true },
          { text: "No, depende del Poder Judicial", correct: false }
        ],
        fact: "El artículo 273 CRBV crea el Poder Ciudadano integrado por la Defensoría del Pueblo, el MP y la Contraloría General."
      }
    ]
  },

  {
    id: 5,
    power: "PODER ELECTORAL",
    name: "El CNE",
    image: "images/room-5-cne.jpg",
    isTransition: false,
    ambience: "Estás en la sala del Consejo Nacional Electoral, donde los números no siempre coinciden con la verdad.",
    questions: [
      {
        text: "¿Cuántos rectores principales tiene el Consejo Nacional Electoral?",
        options: [
          { text: "5 rectores principales", correct: true },
          { text: "7 rectores principales", correct: false }
        ],
        fact: "El artículo 296 CRBV establece que el CNE está integrado por 5 rectores principales y 10 suplentes, designados por la AN."
      },
      {
        text: "¿Tiene el CNE autonomía funcional del resto de los poderes del Estado?",
        options: [
          { text: "Sí, es un poder independiente con plena autonomía", correct: true },
          { text: "No, depende administrativamente del Poder Ejecutivo", correct: false }
        ],
        fact: "El Poder Electoral es el quinto poder del Estado venezolano según la CRBV de 1999, con plena autonomía presupuestaria y funcional."
      },
      {
        text: "¿Puede el CNE organizar referendos revocatorios presidenciales?",
        options: [
          { text: "Sí, es una de sus atribuciones constitucionales expresas", correct: true },
          { text: "No, los referendos solo los puede convocar el Presidente", correct: false }
        ],
        fact: "El artículo 72 CRBV establece el referendo revocatorio para todos los cargos electivos a mitad de período, y el CNE es el organismo que lo organiza."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  CUARTO DE TRANSICIÓN — LA BIBLIOTECA
  // ─────────────────────────────────────────────────────────
  {
    id: "biblioteca",
    power: "LA BIBLIOTECA",
    name: "quieroelegir",
    image: "images/room-6-biblioteca.jpg",
    isTransition: true,
    iframeUrl: "https://radbg.github.io/quieroelegir",
    timerSeconds: 60,
    ambience: "Encontraste una biblioteca oculta. Alguien dejó aquí un plan para recuperar las elecciones.",
    questions: [
      {
        text: "Según quieroelegir, ¿qué porcentaje de los 7.9 millones de venezolanos en el exterior SÍ puede votar hoy en día?",
        options: [
          { text: "1.4% — apenas 69.211 personas de 7.9 millones", correct: true },
          { text: "15.3% — aproximadamente 1.2 millones de personas", correct: false }
        ],
        fact: "Solo 69.211 venezolanos estaban inscritos para votar en el exterior en 2024, el 1.4% de los 7.9 millones en la diáspora. El 98.6% no puede ejercer su derecho al voto (R4V, nov. 2025)."
      },
      {
        text: "¿Cuántos meses mínimos de anticipación debe convocarse una elección según el artículo 298 constitucional, exigido por quieroelegir?",
        options: [
          { text: "3 meses de anticipación", correct: false },
          { text: "6 meses de anticipación", correct: true }
        ],
        fact: "El artículo 298 de la CRBV establece que la ley electoral no puede modificarse en los 6 meses anteriores a la elección. quieroelegir exige ese mismo plazo mínimo de convocatoria para garantizar condiciones justas."
      },
      {
        text: "Según quieroelegir, negarse a publicar los resultados electorales acta por acta debería ser considerado:",
        options: [
          { text: "Un delito electoral", correct: true },
          { text: "Una falta administrativa sancionable con multa", correct: false }
        ],
        fact: "quieroelegir exige publicación íntegra, oportuna y desagregada por mesa, centro, parroquia, municipio y estado. La propuesta establece que la negativa a publicar debe constituir un delito electoral, no una simple falta administrativa."
      }
    ]
  },

  {
    id: 6,
    power: "FUERZA ARMADA",
    name: "La FANB",
    image: "images/room-7-fanb.jpg",
    isTransition: false,
    ambience: "Estás ante el último obstáculo: la Fuerza Armada. Esta es la puerta final.",
    questions: [
      {
        text: "¿La Fuerza Armada venezolana puede ejercer el derecho al voto?",
        options: [
          { text: "No, los militares activos no pueden votar en Venezuela", correct: false },
          { text: "Sí, la Constitución de 1999 les otorgó ese derecho", correct: true }
        ],
        fact: "El artículo 330 CRBV establece que los integrantes de la FAN en situación activa tienen derecho al sufragio, a diferencia de la constitución de 1961."
      },
      {
        text: "¿Puede la Fuerza Armada participar en actividades políticas partidistas según la Constitución?",
        options: [
          { text: "Sí, como institución puede expresar preferencias políticas", correct: false },
          { text: "No, la Constitución la define como institución apolítica y sin militancia", correct: true }
        ],
        fact: "El artículo 328 CRBV define a la FAN como institución apolítica, obediente y no deliberante, aunque sí con derecho individual al voto."
      },
      {
        text: "¿Está permitido que militares activos sean candidatos a cargos de elección popular?",
        options: [
          { text: "Sí, si piden la baja temporal durante la campaña", correct: false },
          { text: "No, deben retirarse definitivamente de la institución primero", correct: true }
        ],
        fact: "Para postularse a cargos electivos, los militares deben solicitar su retiro de la institución, no solo una licencia temporal."
      }
    ]
  }
];

const REPRESSION_MESSAGES = [
  "RESPUESTA INCORRECTA. EL ESTADO TOMA NOTA.",
  "ERROR DETECTADO. SU EXPEDIENTE HA SIDO ACTUALIZADO.",
  "INFORMACIÓN NO AUTORIZADA. INTENTE NUEVAMENTE.",
  "EL RÉGIMEN RECUERDA: HAY UNA SOLA VERDAD OFICIAL.",
  "ACCESO DENEGADO. PERMANEZCA EN SU LUGAR.",
  "SU RESPUESTA FUE REGISTRADA. PROCEDA CON CAUTELA.",
  "INCORRECTO. LA REVOLUCIÓN ES PACÍFICA PERO ARMADA.",
  "ESTE INTENTO HA SIDO REPORTADO AL MINISTERIO CORRESPONDIENTE."
];
