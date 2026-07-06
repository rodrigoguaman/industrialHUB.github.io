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

let activeFilter = "todos";
let searchTerm = "";

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

renderResources();
renderFaculty();
