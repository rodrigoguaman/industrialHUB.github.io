const resources = [
  {
    title: "Guia base de Investigacion de Operaciones",
    type: "apuntes",
    area: "Optimizacion",
    level: "Fundamentos",
    description:
      "Resumen estructurado de programacion lineal, sensibilidad, transporte y asignacion.",
    link: "#"
  },
  {
    title: "Lean Manufacturing: caso de diagnostico VSM",
    type: "caso",
    area: "Produccion",
    level: "Aplicado",
    description:
      "Plantilla para mapear flujo de valor, detectar desperdicios y priorizar mejoras.",
    link: "#"
  },
  {
    title: "Simulacion discreta con enfoque de servicios",
    type: "herramienta",
    area: "Simulacion",
    level: "Laboratorio",
    description:
      "Modelo inicial para estudiar colas, utilizacion de recursos y escenarios de capacidad.",
    link: "#"
  },
  {
    title: "Paper club: supply chain resilience",
    type: "paper",
    area: "Logistica",
    level: "Lectura",
    description:
      "Seleccion de lecturas para resiliencia, riesgo operativo y diseno robusto de redes.",
    link: "#"
  },
  {
    title: "Control estadistico de procesos",
    type: "apuntes",
    area: "Calidad",
    level: "Intermedio",
    description:
      "Cartas de control, capacidad de proceso, muestreo y criterios de interpretacion.",
    link: "#"
  },
  {
    title: "Dashboard de inventarios ABC",
    type: "herramienta",
    area: "Datos",
    level: "Practico",
    description:
      "Estructura para clasificar SKUs, estimar rotacion y visualizar criticidad operativa.",
    link: "#"
  }
];

const knowledgeAreas = [
  {
    id: "administracion",
    code: "01",
    title: "Administración",
    tone: "gold",
    summary:
      "Integra gestión, costos, finanzas, talento humano, marketing y estrategia para dirigir sistemas productivos.",
    courses: [
      { cycle: 4, name: "Contabilidad" },
      { cycle: 5, name: "Costos y presupuestos de producción" },
      { cycle: 6, name: "Gestión del talento humano" },
      { cycle: 6, name: "Economía general" },
      { cycle: 7, name: "Matemática financiera" },
      { cycle: 7, name: "Marketing" },
      { cycle: 9, name: "Gestión financiera" },
      { cycle: 9, name: "Sistemas de información estratégica" },
      { cycle: 10, name: "Diseño y gestión de proyectos" },
      { cycle: 10, name: "Gestión estratégica" }
    ],
    teachers: ["Saúl Jerves", "Rodrigo Guamán", "Cristian Zamora", "Juan Llivisaca", "Otilia Cordero"]
  },
  {
    id: "matematica-estadistica",
    code: "02",
    title: "Unidad Básica: Matemática y Estadística",
    tone: "blue",
    summary:
      "Sostiene el modelado cuantitativo con cálculo, programación, estadística, inferencia, simulación y diseño experimental.",
    courses: [
      { cycle: 1, name: "Álgebra lineal" },
      { cycle: 1, name: "Cálculo diferencial" },
      { cycle: 2, name: "Lenguajes de programación" },
      { cycle: 2, name: "Cálculo integral" },
      { cycle: 3, name: "Ecuaciones diferenciales" },
      { cycle: 3, name: "Estadística analítica" },
      { cycle: 4, name: "Métodos numéricos" },
      { cycle: 4, name: "Técnicas de inferencia estadística" },
      { cycle: 9, name: "Diseño experimental" }
    ],
    teachers: ["Franklin Guamán", "Juan Vidal", "Carlos Sánchez", "Rodrigo Guamán", "Paulina Echeverría", "Juan Llivisaca"]
  },
  {
    id: "ciencias-fisica-quimica",
    code: "03",
    title: "Unidad Básica: Ciencias Física y Química",
    tone: "blue",
    summary:
      "Aporta bases científicas para comprender materiales, energía, fluidos, electricidad y fenómenos industriales.",
    courses: [
      { cycle: 1, name: "Física I" },
      { cycle: 1, name: "Química general" },
      { cycle: 2, name: "Física II" },
      { cycle: 2, name: "Química orgánica" },
      { cycle: 3, name: "Termodinámica" },
      { cycle: 4, name: "Transporte de fluidos" },
      { cycle: 4, name: "Transferencia de calor" },
      { cycle: 3, name: "Ingeniería y tecnología eléctricas" }
    ],
    teachers: ["Cristian Mejía", "Andrea Íñiguez", "Freddy Narváez", "Franklin Guamán", "James Arias"]
  },
  {
    id: "industria-produccion",
    code: "04",
    title: "Industria y Producción",
    tone: "green",
    summary:
      "Concentra procesos, producción, logística, calidad, control, investigación operativa, simulación y gestión ambiental.",
    courses: [
      { cycle: 2, name: "Ingeniería de procesos y ergonomía" },
      { cycle: 5, name: "Lean Manufacturing y Six Sigma (I)" },
      { cycle: 6, name: "Organización de la producción" },
      { cycle: 7, name: "Logística y cadena de suministro" },
      { cycle: 7, name: "Lean Manufacturing y Six Sigma (II)" },
      { cycle: 8, name: "Gestión de calidad" },
      { cycle: 8, name: "Sistemas de control de la producción" },
      { cycle: 8, name: "Tecnología energética" },
      { cycle: 9, name: "Investigación operativa" },
      { cycle: 10, name: "Simulación de la producción" },
      { cycle: 10, name: "Introducción a la Ingeniería Industrial" },
      { cycle: 8, name: "Gestión ambiental empresarial" }
    ],
    teachers: ["Ximena Álvarez", "Juan Llivisaca", "Paola Vintimilla", "Milton Barragán", "Pablo Flores", "James Arias", "Diana Jadán"]
  },
  {
    id: "diseno-industrial",
    code: "05",
    title: "Diseño Industrial",
    tone: "green",
    summary:
      "Reúne materiales, diseño de máquinas, CAD, equipos, mantenimiento, instrumentación y desarrollo de productos.",
    courses: [
      { cycle: 3, name: "Mecánica de materiales" },
      { cycle: 4, name: "Tecnología de materiales" },
      { cycle: 5, name: "Diseño de máquinas" },
      { cycle: 5, name: "Diseño industrial CAD" },
      { cycle: 6, name: "Máquinas, herramientas y accesorios" },
      { cycle: 7, name: "Equipo industrial" },
      { cycle: 8, name: "Ingeniería del mantenimiento" },
      { cycle: 9, name: "Instrumentación y control" },
      { cycle: 6, name: "Investigación y desarrollo de nuevos productos" }
    ],
    teachers: ["Paúl Álvarez", "Raúl Peláez", "Paola Vintimilla", "Francisco Vázquez", "Jenny Rojas"]
  },
  {
    id: "factor-humano",
    code: "06",
    title: "Factor Humano en la Industria",
    tone: "gold",
    summary:
      "Articula investigación, emprendimiento, ética, psicología, legislación, seguridad ocupacional, servicios e innovación.",
    courses: [
      { cycle: 1, name: "Metodología de la investigación" },
      { cycle: 5, name: "Desarrollo de emprendedores" },
      { cycle: 5, name: "Ética de la ciencia" },
      { cycle: 5, name: "Psicología industrial" },
      { cycle: 6, name: "Legislación ecuatoriana" },
      { cycle: 7, name: "Seguridad y salud ocupacional" },
      { cycle: 9, name: "Lean Services y Sigma Sigma I" },
      { cycle: 10, name: "Innovation Management" }
    ],
    teachers: ["Silvia Peña", "Saúl Jerves", "Paulina Espinoza", "Milton Barragán", "Diana Jadán"]
  }
];

const abetResults = [
  {
    id: "ra1",
    code: "RA1",
    title: "Solución de problemas",
    description:
      "Identifica, formula y soluciona problemas complejos de ingeniería aplicando principios de ingeniería, ciencia y matemáticas.",
    outcomes: [
      "Plantea alternativas de solución de problemas, mediante el uso de la información proveniente de indicadores de gestión de la producción.",
      "Interpreta la información basada en modelos matemáticos, físicos, químicos y su interrelación."
    ]
  },
  {
    id: "ra2",
    code: "RA2",
    title: "Diseño",
    description:
      "Aplica diseño de ingeniería para producir soluciones que satisfagan necesidades específicas teniendo en cuenta la salud pública, la seguridad y el bienestar, así como factores globales, culturales, sociales, ambientales y económicos.",
    outcomes: [
      "Diseña e implementa modelos de gestión orientados a la optimización de los procesos.",
      "Construye modelos de simulación basado en diferentes metodologías de la ingeniería industrial."
    ]
  },
  {
    id: "ra6",
    code: "RA6",
    title: "Experimentación",
    description:
      "Desarrolla y efectúa experimentación apropiada, analiza e interpreta los datos y usa criterio de ingeniería para obtener conclusiones.",
    outcomes: [
      "Plantea alternativas de solución de problemas, mediante el uso de la información proveniente de indicadores de gestión de la producción.",
      "Evalúa modelos existentes de transporte en la gestión logística de procesos productores de bienes y servicio.",
      "Identifica los elementos que componen los sistemas de gestión de calidad y sus interrelaciones con un enfoque de economía circular para la agregación de valor en un sistema de producción.",
      "Recomienda el mejor procedimiento para la optimización de un sistema de producción."
    ]
  },
  {
    id: "ra3",
    code: "RA3",
    title: "Comunicación",
    description: "Comunica temas profesionales a un rango de audiencias con efectividad.",
    outcomes: [
      "Argumenta la validez de las decisiones tomadas en la formulación, ejecución y evaluación del proyecto."
    ]
  },
  {
    id: "ra4",
    code: "RA4",
    title: "Ética y responsabilidad",
    description:
      "Reconoce responsabilidades éticas y profesionales en situaciones de ingeniería para hacer juicios informados que deben considerar el impacto de las soluciones de ingeniería en contextos globales, económicos, ambientales y sociales.",
    outcomes: [
      "Selecciona los mejores métodos, procesos, procedimientos, de manera integral para el bienestar del factor humano, basado en la normativa legal vigente en el país.",
      "Identifica los impactos que generaría la implementación de proyectos.",
      "Analiza los riesgos de proyectos que pueden presentarse en su ejecución."
    ]
  },
  {
    id: "ra5",
    code: "RA5",
    title: "Trabajo en equipo",
    description:
      "Trabaja en un equipo cuyos miembros en conjunto proveen liderazgo, crean un ambiente colaborativo e incluyente, establecen metas, planes de trabajo y logran objetivos con efectividad.",
    outcomes: [
      "Integra las normativas relacionadas con la seguridad y salud ocupacional, ambiente y legislación laboral con los procedimientos y el bienestar para generar un ambiente propicio de trabajo para el factor humano."
    ]
  },
  {
    id: "ra7",
    code: "RA7",
    title: "Aprendizaje autónomo",
    description:
      "Adquiere y aplica nuevo conocimiento según lo requiera, utilizando estrategias de aprendizaje adecuadas.",
    outcomes: [
      "Identifica el problema de desarrollo en donde se planteará un proyecto de intervención.",
      "Describe y asocia los distintos componentes en una cadena de suministros.",
      "Establece criterios prácticos de posicionamiento logístico en la cadena de suministro.",
      "Establece los parámetros de control en un sistema de producción real."
    ]
  }
];

const faculty = [
  {
    name: "Ing. Alvarez Lloret Edgar Paul, MS.",
    role: "Docente",
    email: "paul.alvarez@ucuenca.edu.ec",
    orcid: "",
    bio: "Master en métodos numéricos para el calculo y diseño en ingeniería. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-alvarez-lloret-edgar-paul-ms.jpg"
  },
  {
    name: "Ing. Alvarez Palomeque Lourdes Ximena, MS.",
    role: "Docente",
    email: "ximena.alvarez@ucuenca.edu.ec",
    orcid: "0000-0001-6724-7997",
    bio: "Magister en Gestión Ambiental para Industrial de Producción y Servicios. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-alvarez-palomeque-lourdes-ximena-ms.jpg"
  },
  {
    name: "Ing. Arcentales Carrión Rodrigo Nicanor, PhD.",
    role: "Docente",
    email: "rodrigo.arcentales@ucuenca.edu.ec",
    orcid: "0000-0002-9700-8898",
    bio: "Doctor en Ciencias de la Administración. Docente periodo académico marzo - agosto 2025.",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "Ing. Arias Cisneros James Marlon, MS.",
    role: "Docente",
    email: "james.arias@ucuenca.edu.ec",
    orcid: "",
    bio: "Magister en Gestión Tecnológica. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-arias-cisneros-james-marlon-ms.jpg"
  },
  {
    name: "Ing. Barragan Landy Milton Francisco, PhD.",
    role: "Docente",
    email: "mfrancisco.barraganl@ucuenca.edu.ec",
    orcid: "0000-0003-4623-6150",
    bio: "PhD in Industrial and Systems Enginnering. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-barragan-landy-milton-francisco-phd.jpg"
  },
  {
    name: "BQF. Bustamante Pacheco Freddy Enrique",
    role: "Técnico Docente",
    email: "freddy.bustamante2607@ucuenca.edu.ec",
    orcid: "",
    bio: "Técnico docente periodo septiembre 2025 - febrero 2026.",
    image: "assets/faculty/bqf-bustamante-pacheco-freddy-enrique.jpg"
  },
  {
    name: "Ing. Cordero Ahiman Otilia Vanessa, PhD.",
    role: "Docente",
    email: "otilia.cordero@ucuenca.edu.ec",
    orcid: "0000-0002-5446-4383",
    bio: "Doctora en Economía Agraria Alimentaria y de los Recursos Naturales. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "CPA. Polo Moreira María Paz. MS.",
    role: "Docente",
    email: "maria.polo@ucuenca.edu.ec",
    orcid: "0000-0001-9115-1610",
    bio: "Magister en Contabilidad y Finanzas con Mención en Gerencia y Planeamiento Tributario. Docente periodo académico marzo - agosto 2025.",
    image: "assets/faculty/cpa-polo-moreira-maria-paz-ms.jpg"
  },
  {
    name: "Ing. Escandón Quezada Denisse Estefania, MS.",
    role: "Docente",
    email: "denisse.escandon@ucuenca.edu.ec",
    orcid: "",
    bio: "Magister en Seguridad e Higuiene Industrial. Docente periodo académico marzo - agosto 2025.E",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "Ing. Espinoza Hernández Paulina Rebeca, MS.",
    role: "Docente",
    email: "paulina.espinoza@ucuenca.edu.ec",
    orcid: "0000-0001-9416-5225",
    bio: "Magister en Sistemas Integrados de Gestión Integrados de la Calidad, Ambiente y Seguridad. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-espinoza-hernandez-paulina-rebeca-ms.jpg"
  },
  {
    name: "Fís. Mejía Guamán Christian Fernando, PhD.",
    role: "Docente",
    email: "christian.mejia@ucuenca.edu.ec",
    orcid: "0000-0001-7283-3421",
    bio: "PhD- Doutor em Ciencias Fisica. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/fis-mejia-guaman-christian-fernando-phd.jpg"
  },
  {
    name: "Ing. Flores Siguenza Pablo Andrés, PhD.",
    role: "Docente - Investigador",
    email: "pablo.floress@ucuenca.edu.ec",
    orcid: "0000-0002-8038-2912",
    bio: "PhD en Ingeniería Industrial. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-flores-siguenza-pablo-andres-phd.jpg"
  },
  {
    name: "Ing. Guamán Guachichullca Noe Rodrigo, MBA.",
    role: "Docente - Director de la Carrera de Ingeniería Industrial",
    email: "rodrigo.guaman@ucuenca.edu.ec",
    orcid: "0000-0002-9577-0264",
    bio: "Magister en Administración de Empresas con mención en Logística y Transporte. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-guaman-guachichullca-noe-rodrigo-mba.jpg"
  },
  {
    name: "Ing. Guaman Ortiz Franklin Eduardo, MS.",
    role: "Docente",
    email: "franklin.guamano@ucuenca.edu.ec",
    orcid: "",
    bio: "Magister en Ciencias Naturales y Matemáticas. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-guaman-ortiz-franklin-eduardo-ms.jpg"
  },
  {
    name: "Ing. Guanuchi Quito Alexandra Elizabeth, MS.",
    role: "Docente",
    email: "alexandra.guanuchi@ucuenca.edu.ec",
    orcid: "0000-0002-5583-8674",
    bio: "Master Universitario en Ingeniería Hidráulica y Medio Ambiente.",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "Ing. Guanuchi Quito Juan Carlos, MS.",
    role: "Docente",
    email: "juan.guanuchiq@ucuenca.edu.ec",
    orcid: "0009-0002-0898-1088",
    bio: "Master Universitario en Ingeniería Ambiental - Especialidad en Dirección de Estaciones de Depuración de Aguas Residuales - Especialidad en Gestión Ambiental en la Industria. Docente periodo académico marzo - agosto 2025.",
    image: "assets/faculty/ing-guanuchi-quito-juan-carlos-ms.jpg"
  },
  {
    name: "Ing. Iñiguez Morán Andrea María, MBA",
    role: "Docente",
    email: "andrea.iniguez@ucuenca.edu.ec",
    orcid: "",
    bio: "Magister en Administración de Empresas. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-iniguez-moran-andrea-maria-mba.jpg"
  },
  {
    name: "Ing. Jadán Avilés Diana Carolina, MS.",
    role: "Docente",
    email: "diana.jadan@ucuenca.edu.ec",
    orcid: "0000-0002-7264-5188",
    bio: "Master of Science in Management of Logistics and Production Systems. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "Ing. Llivisaca Villazhañay Juan Carlos, MS.",
    role: "Docente",
    email: "juan.llivisaca@ucuenca.edu.ec",
    orcid: "0000-0003-2154-3277",
    bio: "Magister en Estadística Aplicada, Ciencias Naturales, Matermáticas y Estadística. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-llivisaca-villazhanay-juan-carlos-ms.jpg"
  },
  {
    name: "Ing. Montero Izquierdo Iván Andrés, PhD.",
    role: "Docente",
    email: "andres.montero@ucuenca.edu.ec",
    orcid: "0000-0001-5366-8029",
    bio: "PhD - Doctorado en Tecnologías de Climatización y Eficiencia Energética en Edificios. Docente periodo académico marzo - agosto 2025.",
    image: "assets/faculty/ing-montero-izquierdo-ivan-andres-phd.jpg"
  },
  {
    name: "Ing. Narváez Buestán Freddy Eduardo, MSc.",
    role: "Docente",
    email: "freddy.narvaezb@ucuenca.edu.ec",
    orcid: "0000-0003-3877-8080",
    bio: "Magister en Métodos Matemáticos y Simulación Numérica en Ingeniería. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-narvaez-buestan-freddy-eduardo-msc.jpg"
  },
  {
    name: "Ing. Peláez Samaniego Manuel Raúl, PhD.",
    role: "Docente",
    email: "manuel.pelaez@ucuenca.edu.ec",
    orcid: "0000-0002-7618-9474",
    bio: "PhD - Doctor of Philosophy - Docencia, Investigación y Gestión en Educación Superior. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/default-profile.png"
  },
  {
    name: "Ing. Peña González Silvia Alexandra, PhD.",
    role: "Docente",
    email: "silvia.penag@ucuenca.edu.ec",
    orcid: "0000-0002-6439-5289",
    bio: "PhD - Doctora en Ingeniería de Producción, Área de Concentración, Investigación Operativa e Intervención en Sistemas Sociotécnicos - Docencia, Investigación y Gestión en Educación Superior. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-pena-gonzalez-silvia-alexandra-phd.jpg"
  },
  {
    name: "Psic. Jerves Mora Rodrigo Saúl, MS.",
    role: "Docente",
    email: "rodrigo.jerves@ucuenca.edu.ec",
    orcid: "0000-0002-0126-2032",
    bio: "Magister en Psicoterapia del Niño y la Familia. Docente periodo académico 2025 - febrero 2026.",
    image: "assets/faculty/psic-jerves-mora-rodrigo-saul-ms.jpg"
  },
  {
    name: "Ing. Rojas Quinde Jenny Maritza, MS.",
    role: "Técnica Docente",
    email: "maritza.rojas@ucuenca.edu.ec",
    orcid: "",
    bio: "",
    image: "assets/faculty/ing-rojas-quinde-jenny-maritza-ms.jpg"
  },
  {
    name: "Ing. Sánchez Alvarracin Carlos Mauricio, MS.",
    role: "Docente",
    email: "carlos.sancheza@ucuenca.edu.ec",
    orcid: "0000-0003-4521-6158",
    bio: "Magister en Métodos Numéricos y Simulación Numérica en Ingeeniería. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-sanchez-alvarracin-carlos-mauricio-ms.jpg"
  },
  {
    name: "Ing. Vanegas Peña Paúl Fernando, MBA.",
    role: "Docente",
    email: "paul.vanegas@ucuenca.edu.ec",
    orcid: "0000-0002-3805-4130",
    bio: "Master eb Administración Industrial. Docente peridodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-vanegas-pena-paul-fernando-mba.jpg"
  },
  {
    name: "Ing. Vidal Davila Juan Carlos, MS.",
    role: "Docente",
    email: "juan.vidald@ucuenca.edu.ec",
    orcid: "",
    bio: "Master Universitario en Ingeniería, Matemática y Computación. Docente periodo académico marzo - agosto 2024.",
    image: "assets/faculty/ing-vidal-davila-juan-carlos-ms.jpg"
  },
  {
    name: "Ing. Vintimilla Álvarez Paola Fernanda, MS.",
    role: "Docente",
    email: "paola.vintimilla@ucuenca.edu.ec",
    orcid: "0000-0002-8194-6054",
    bio: "Master Universitario en Ingeniería Avanzada de Producción, Logística y Cadema de Suministro, el la Especialidad Profesional Logística y Transporte. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/ing-vintimilla-alvarez-paola-fernanda-ms.jpg"
  },
  {
    name: "Ing. Zamora Matute Cristian Eduardo, PhD.",
    role: "Docente",
    email: "cristian.zamora@ucuenca.edu.ec",
    orcid: "0009-0008-0797-0129",
    bio: "PhD - Doctor en Ciencias Administrativas. Docente periodo académico septiembre 2025 - febrero 2026.",
    image: "assets/faculty/default-profile.png"
  }
];

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelectorAll(".filter");
const searchInput = document.querySelector("#resourceSearch");
const searchForm = document.querySelector("#searchForm");
const facultyGrid = document.querySelector("#facultyGrid");
const facultySearch = document.querySelector("#facultySearch");
const areaTabs = document.querySelector("#areaTabs");
const areaCode = document.querySelector("#areaCode");
const areaTitle = document.querySelector("#areaTitle");
const areaSummary = document.querySelector("#areaSummary");
const areaCourseCount = document.querySelector("#areaCourseCount");
const areaTeacherCount = document.querySelector("#areaTeacherCount");
const areaCourses = document.querySelector("#areaCourses");
const areaTeachers = document.querySelector("#areaTeachers");
const areasOverview = document.querySelector("#areasOverview");
const abetList = document.querySelector("#abetList");
const abetCode = document.querySelector("#abetCode");
const abetTitle = document.querySelector("#abetTitle");
const abetDescription = document.querySelector("#abetDescription");
const abetOutcomeCount = document.querySelector("#abetOutcomeCount");
const abetOutcomes = document.querySelector("#abetOutcomes");
const abetSummaryGrid = document.querySelector("#abetSummaryGrid");
let activeFilter = "todos";
let searchTerm = "";
let activeArea = knowledgeAreas[0].id;
let activeAbet = abetResults[0].id;

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderResources() {
  const query = normalizeText(searchTerm);
  const filtered = resources.filter((resource) => {
    const matchesFilter = activeFilter === "todos" || resource.type === activeFilter;
    const searchable = normalizeText(
      `${resource.title} ${resource.type} ${resource.area} ${resource.level} ${resource.description}`
    );
    return matchesFilter && searchable.includes(query);
  });

  grid.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No hay recursos con ese criterio todavia.";
    grid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "resource-card";
    card.innerHTML = `
      <div class="resource-meta">
        <span>${resource.type}</span>
        <span>${resource.area}</span>
      </div>
      <h3>${resource.title}</h3>
      <p>${resource.description}</p>
      <a href="${resource.link}" aria-label="Abrir ${resource.title}">Abrir recurso</a>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function renderFaculty() {
  if (!facultyGrid) return;

  const query = normalizeText(facultySearch?.value || "");
  const filtered = faculty.filter((person) => {
    const searchable = normalizeText(
      `${person.name} ${person.role} ${person.email} ${person.orcid} ${person.bio}`
    );
    return searchable.includes(query);
  });

  facultyGrid.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No hay docentes con ese criterio.";
    facultyGrid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((person) => {
    const card = document.createElement("article");
    card.className = "faculty-card";
    card.innerHTML = `
      <img src="${person.image}" alt="${person.name}" loading="lazy">
      <div class="faculty-card__content">
        <span class="faculty-role">${person.role}</span>
        <h3>${person.name}</h3>
        <p>${person.bio || "Ficha docente pendiente de ampliar."}</p>
        <div class="faculty-card__meta">
          <a href="mailto:${person.email}">${person.email}</a>
          ${person.orcid ? `<span>ORCID ${person.orcid}</span>` : ""}
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  facultyGrid.appendChild(fragment);
}

function renderAreaTabs() {
  if (!areaTabs) return;

  const fragment = document.createDocumentFragment();
  areaTabs.innerHTML = "";

  knowledgeAreas.forEach((area) => {
    const button = document.createElement("button");
    button.className = `area-tab area-tab--${area.tone}`;
    button.type = "button";
    button.dataset.area = area.id;
    button.setAttribute("aria-pressed", String(area.id === activeArea));
    button.innerHTML = `
      <span>${area.code}</span>
      <strong>${area.title}</strong>
      <small>${area.courses.length} asignaturas</small>
    `;
    fragment.appendChild(button);
  });

  areaTabs.appendChild(fragment);
}

function renderAreaDetail() {
  if (!areaCode || !areaCourses || !areaTeachers) return;

  const area = knowledgeAreas.find((item) => item.id === activeArea) || knowledgeAreas[0];
  areaCode.textContent = area.code;
  areaTitle.textContent = area.title;
  areaSummary.textContent = area.summary;
  areaCourseCount.textContent = area.courses.length;
  areaTeacherCount.textContent = area.teachers.length;
  areaCourses.innerHTML = "";
  areaTeachers.innerHTML = "";

  const courses = [...area.courses].sort((a, b) => a.cycle - b.cycle || a.name.localeCompare(b.name));
  const courseFragment = document.createDocumentFragment();

  courses.forEach((course) => {
    const item = document.createElement("article");
    item.className = "course-item";
    item.innerHTML = `
      <span>Ciclo ${course.cycle}</span>
      <strong>${course.name}</strong>
    `;
    courseFragment.appendChild(item);
  });

  const teacherFragment = document.createDocumentFragment();

  area.teachers.forEach((teacher) => {
    const item = document.createElement("span");
    item.className = "teacher-chip";
    item.textContent = teacher;
    teacherFragment.appendChild(item);
  });

  areaCourses.appendChild(courseFragment);
  areaTeachers.appendChild(teacherFragment);
}

function renderAreasOverview() {
  if (!areasOverview) return;

  const fragment = document.createDocumentFragment();
  areasOverview.innerHTML = "";

  knowledgeAreas.forEach((area) => {
    const card = document.createElement("article");
    card.className = `area-overview-card area-overview-card--${area.tone}`;
    card.innerHTML = `
      <span>${area.code}</span>
      <h3>${area.title}</h3>
      <p>${area.summary}</p>
    `;
    fragment.appendChild(card);
  });

  areasOverview.appendChild(fragment);
}

function renderAreas() {
  renderAreaTabs();
  renderAreaDetail();
  renderAreasOverview();
}

function renderAbetList() {
  if (!abetList) return;

  const fragment = document.createDocumentFragment();
  abetList.innerHTML = "";

  abetResults.forEach((result) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "abet-item";
    button.dataset.abet = result.id;
    button.setAttribute("aria-pressed", String(result.id === activeAbet));
    button.innerHTML = `
      <span>${result.code}</span>
      <strong>${result.title}</strong>
      <small>${result.outcomes.length} logros</small>
    `;
    fragment.appendChild(button);
  });

  abetList.appendChild(fragment);
}

function renderAbetDetail() {
  if (!abetCode || !abetOutcomes) return;

  const result = abetResults.find((item) => item.id === activeAbet) || abetResults[0];
  abetCode.textContent = result.code;
  abetTitle.textContent = result.title;
  abetDescription.textContent = result.description;
  abetOutcomeCount.textContent = result.outcomes.length;
  abetOutcomes.innerHTML = "";

  const fragment = document.createDocumentFragment();

  result.outcomes.forEach((outcome, index) => {
    const card = document.createElement("article");
    card.className = "abet-outcome-card";
    card.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <p>${outcome}</p>
    `;
    fragment.appendChild(card);
  });

  abetOutcomes.appendChild(fragment);
}

function renderAbetSummary() {
  if (!abetSummaryGrid) return;

  const fragment = document.createDocumentFragment();
  abetSummaryGrid.innerHTML = "";

  abetResults.forEach((result) => {
    const card = document.createElement("article");
    card.className = "abet-summary-card";
    card.innerHTML = `
      <span>${result.code}</span>
      <h3>${result.title}</h3>
      <p>${result.outcomes.length} logro${result.outcomes.length === 1 ? "" : "s"} de rediseño</p>
    `;
    fragment.appendChild(card);
  });

  abetSummaryGrid.appendChild(fragment);
}

function renderAbet() {
  renderAbetList();
  renderAbetDetail();
  renderAbetSummary();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderResources();
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderResources();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchInput.focus();
});

facultySearch?.addEventListener("input", renderFaculty);

areaTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-area]");
  if (!button) return;

  activeArea = button.dataset.area;
  renderAreas();
});

abetList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-abet]");
  if (!button) return;

  activeAbet = button.dataset.abet;
  renderAbet();
});

renderResources();
renderFaculty();
renderAreas();
renderAbet();
