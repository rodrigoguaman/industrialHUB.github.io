const data = facultyDashboardData;
const searchInput = document.querySelector("#facultyPageSearch");
const formationSelect = document.querySelector("#facultyFormation");
const typeSelect = document.querySelector("#facultyType");
const cycleSelect = document.querySelector("#facultyCycle");
const facultyGridPage = document.querySelector("#facultyPageGrid");
const facultyDetail = document.querySelector("#facultyDetail");
const realFaculty = data.faculty.filter((person) => person.name !== "POR DEFINIR");

let activeFormation = "all";
let activeType = "all";
let activeCycle = "all";
let activeQuery = "";
let activeFacultyId = realFaculty.find((item) => item.subjects.length)?.id || realFaculty[0].id;

const knowledgeAreaCourses = [
  {
    area: "Administración",
    courses: [
      "Contabilidad",
      "Costos y presupuestos de producción",
      "Gestión del talento humano",
      "Economía general",
      "Matemática financiera",
      "Marketing",
      "Gestión financiera",
      "Sistemas de información estratégica",
      "Diseño y gestión de proyectos",
      "Gestión estratégica"
    ]
  },
  {
    area: "Unidad Básica: Matemática y Estadística",
    courses: [
      "Álgebra lineal",
      "Cálculo diferencial",
      "Lenguajes de programación",
      "Cálculo integral",
      "Ecuaciones diferenciales",
      "Estadística analítica",
      "Métodos numéricos",
      "Técnicas de inferencia estadística",
      "Diseño experimental"
    ]
  },
  {
    area: "Unidad Básica: Ciencias Física y Química",
    courses: [
      "Física I",
      "Química general",
      "Física II",
      "Química orgánica",
      "Termodinámica",
      "Transporte de fluidos",
      "Transferencia de calor",
      "Ingeniería y tecnología eléctricas"
    ]
  },
  {
    area: "Industria y Producción",
    courses: [
      "Ingeniería de procesos y ergonomía",
      "Lean Manufacturing y Six Sigma (I)",
      "Organización de la producción",
      "Logística y cadena de suministro",
      "Lean Manufacturing y Six Sigma (II)",
      "Gestión de calidad",
      "Sistemas de control de la producción",
      "Tecnología energética",
      "Investigación operativa",
      "Simulación de la producción",
      "Introducción a la Ingeniería Industrial",
      "Gestión ambiental empresarial"
    ]
  },
  {
    area: "Diseño Industrial",
    courses: [
      "Mecánica de materiales",
      "Tecnología de materiales",
      "Diseño de máquinas",
      "Diseño industrial CAD",
      "Máquinas, herramientas y accesorios",
      "Equipo industrial",
      "Ingeniería del mantenimiento",
      "Instrumentación y control",
      "Investigación y desarrollo de nuevos productos"
    ]
  },
  {
    area: "Factor Humano en la Industria",
    courses: [
      "Metodología de la investigación",
      "Desarrollo de emprendedores",
      "Ética de la ciencia",
      "Psicología industrial",
      "Legislación ecuatoriana",
      "Seguridad y salud ocupacional",
      "Lean Services y Sigma Sigma I",
      "Innovation Management"
    ]
  }
];

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeSubjectName(value) {
  return normalize(value)
    .replace(/\b6\b/g, "six")
    .replace(/\bsuministros\b/g, "suministro")
    .replace(/\blaborales\s+(\d+)/g, "laborales $1")
    .replace(/\b(g|p)\d+\b/g, "")
    .replace(/\bi[12]\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const courseAreaMap = knowledgeAreaCourses.reduce((map, group) => {
  group.courses.forEach((course) => {
    map.set(normalizeSubjectName(course), group.area);
  });
  return map;
}, new Map());

function subjectArea(subjectName) {
  const normalizedSubject = normalizeSubjectName(subjectName);
  const direct = courseAreaMap.get(normalizedSubject);
  if (direct) return direct;

  const fuzzy = [...courseAreaMap.entries()].find(([course]) => normalizedSubject.includes(course) || course.includes(normalizedSubject));
  return fuzzy?.[1] || "Área no vinculada";
}

function facultyAreas(person) {
  return uniq(visibleSubjects(person).map((subject) => subjectArea(subject.subject)).filter((area) => area !== "Área no vinculada"));
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function visibleSubjects(person) {
  if (activeCycle === "all") return person.subjects;
  return person.subjects.filter((subject) => String(subject.cycle) === activeCycle);
}

function filteredFaculty() {
  const q = normalize(activeQuery);
  return realFaculty.filter((person) => {
    const subjects = visibleSubjects(person);
    const matchesFormation = activeFormation === "all" || person.formation === activeFormation;
    const matchesType = activeType === "all" || person.type === activeType;
    const matchesCycle = activeCycle === "all" || subjects.length > 0;
    const haystack = normalize([
      person.name,
      person.title,
      person.formation,
      person.type,
      person.dedication,
      person.belonging,
      ...person.subjects.map((subject) => subject.subject)
    ].join(" "));
    return matchesFormation && matchesType && matchesCycle && (!q || haystack.includes(q));
  });
}

function renderOffer() {
  const offer = data.academicOffer;
  document.querySelector("#offerDescription").textContent = offer.description;
  document.querySelector("#offerCourses").textContent = offer.totalCourses;
  document.querySelector("#offerCycles").textContent = offer.cycles;
  document.querySelector("#offerHours").textContent = offer.totalHours.toLocaleString("es-EC");
  document.querySelector("#offerPeriod").textContent = offer.period;
}

function renderControls() {
  const formations = uniq(realFaculty.map((person) => person.formation));
  const types = uniq(realFaculty.map((person) => person.type));
  const cycles = uniq(data.courses.map((course) => String(course.cycle))).sort((a, b) => Number(a) - Number(b));

  formationSelect.innerHTML = [
    `<option value="all">Todas</option>`,
    ...formations.map((item) => `<option value="${item}" ${item === activeFormation ? "selected" : ""}>${item}</option>`)
  ].join("");
  typeSelect.innerHTML = [
    `<option value="all">Todos</option>`,
    ...types.map((item) => `<option value="${item}" ${item === activeType ? "selected" : ""}>${item}</option>`)
  ].join("");
  cycleSelect.innerHTML = [
    `<option value="all">Todos los ciclos</option>`,
    ...cycles.map((item) => `<option value="${item}" ${item === activeCycle ? "selected" : ""}>Ciclo ${item}</option>`)
  ].join("");
}

function countBy(items, getter) {
  return items.reduce((map, item) => {
    const key = getter(item) || "N/D";
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
}

function renderBars(container, entries, tone = "blue") {
  const max = Math.max(...entries.map((entry) => entry.value), 1);
  container.innerHTML = entries
    .map(
      (entry) => `
        <div class="faculty-bar-row ${tone === "gold" ? "faculty-bar-row--gold" : ""}">
          <span>${entry.label}</span>
          <div><i style="width:${Math.round((entry.value / max) * 100)}%"></i></div>
          <strong>${entry.value}</strong>
        </div>
      `
    )
    .join("");
}

function renderStats() {
  const faculty = filteredFaculty();
  const assignedCourseIds = new Set(faculty.flatMap((person) => visibleSubjects(person).map((subject) => subject.id)));
  const phd = faculty.filter((person) => normalize(person.formation).includes("phd")).length;
  const exclusive = faculty.filter((person) => normalize(person.belonging).includes("exclusivo")).length;

  document.querySelector("#totalFaculty").textContent = faculty.length;
  document.querySelector("#totalAssignedCourses").textContent = assignedCourseIds.size;
  document.querySelector("#totalPhd").textContent = phd;
  document.querySelector("#totalExclusive").textContent = exclusive;

  renderBars(
    document.querySelector("#formationBars"),
    [...countBy(faculty, (person) => person.formation)].map(([label, value]) => ({ label, value }))
  );
  renderBars(
    document.querySelector("#titleBars"),
    [...countBy(faculty, (person) => person.title)].map(([label, value]) => ({ label, value })),
    "gold"
  );
  renderBars(
    document.querySelector("#typeBars"),
    [...countBy(faculty, (person) => person.type)].map(([label, value]) => ({ label, value }))
  );
  renderBars(
    document.querySelector("#modalityBars"),
    [...countBy(faculty, (person) => person.modality)].map(([label, value]) => ({ label, value })),
    "gold"
  );
  renderBars(
    document.querySelector("#belongingBars"),
    [...countBy(faculty, (person) => person.belonging)].map(([label, value]) => ({ label, value }))
  );
  renderBars(
    document.querySelector("#dedicationBars"),
    [...countBy(faculty, (person) => person.dedication)].map(([label, value]) => ({ label, value })),
    "gold"
  );
  renderBars(
    document.querySelector("#loadBars"),
    faculty
      .map((person) => ({ label: person.name, value: visibleSubjects(person).length }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  );
}

function renderFacultyGrid() {
  const people = filteredFaculty().sort((a, b) => visibleSubjects(b).length - visibleSubjects(a).length || a.name.localeCompare(b.name));
  if (!people.some((person) => person.id === activeFacultyId)) {
    activeFacultyId = people[0]?.id || realFaculty[0].id;
  }

  const isDirector = (person) => normalize(person.name).includes("guaman guachichullca");
  const sections = [
    {
      title: "Dirección de carrera",
      people: people.filter(isDirector)
    },
    {
      title: "Planta docente",
      people: people.filter((person) => person.type === "Docente" && !isDirector(person))
    },
    {
      title: "Técnicos docentes",
      people: people.filter((person) => normalize(person.type).includes("tecnico"))
    }
  ].filter((section) => section.people.length);

  const renderCard = (person) => {
    const areas = facultyAreas(person);
    const areaText = areas.length ? areas.slice(0, 2).join(" · ") + (areas.length > 2 ? ` · +${areas.length - 2}` : "") : "Sin asignaturas asignadas";
    return `
            <button type="button" class="faculty-page-card" data-faculty="${person.id}" aria-pressed="${person.id === activeFacultyId}">
              <img src="${person.image}" alt="${person.name}" loading="lazy" />
              <div>
                <span>${isDirector(person) ? "Director de carrera" : person.type}</span>
                <strong>${person.name}</strong>
                <p>${person.title} · ${person.formation}</p>
                <small>${areaText}</small>
                <small>${person.modality} · ${person.dedication} · ${visibleSubjects(person).length} asignaturas</small>
              </div>
            </button>
          `;
  };

  facultyGridPage.innerHTML = people.length
    ? sections
        .map(
          (section) => `
            <section class="faculty-card-section">
              <h3>${section.title}</h3>
              <div>
                ${section.people.map(renderCard).join("")}
              </div>
            </section>
          `
        )
        .join("")
    : `<article class="empty-state">No hay docentes con los filtros activos.</article>`;
}

function renderDetail() {
  const person = realFaculty.find((item) => item.id === activeFacultyId) || realFaculty[0];
  const subjects = visibleSubjects(person);
  const totalHours = subjects.reduce((sum, subject) => sum + Number(subject.acd || 0) + Number(subject.ape || 0) + Number(subject.aa || 0), 0);

  facultyDetail.innerHTML = `
    <div class="faculty-detail-head">
      <img src="${person.image}" alt="${person.name}" />
      <div>
        <p class="kicker">Detalle docente</p>
        <h2>${person.name}</h2>
        <p>${person.title} · ${person.formation}</p>
      </div>
    </div>
    <div class="faculty-detail-kpis">
      <div><strong>${subjects.length}</strong><span>asignaturas</span></div>
      <div><strong>${totalHours}</strong><span>horas ACD/APE/AA</span></div>
      <div><strong>${person.modality}</strong><span>modalidad</span></div>
    </div>
    <div class="faculty-detail-meta">
      <span>${person.type}</span>
      <span>${person.belonging}</span>
      <span>${person.dedication}</span>
    </div>
    <div class="faculty-subject-list">
      ${
        subjects.length
          ? subjects
              .map(
                (subject) => `
                  <article>
                    <span>Ciclo ${subject.cycle} · ${subject.role}</span>
                    <strong>${subject.subject}</strong>
                    <small>Área ${subjectArea(subject.subject)} · ACD ${subject.acd} · APE ${subject.ape} · AA ${subject.aa} · Oferta ${subject.offer}</small>
                  </article>
                `
              )
              .join("")
          : `<article><strong>Sin asignaturas en el ciclo seleccionado</strong></article>`
      }
    </div>
  `;
}

function render() {
  renderControls();
  renderStats();
  renderFacultyGrid();
  renderDetail();
}

searchInput.addEventListener("input", (event) => {
  activeQuery = event.target.value;
  render();
});
formationSelect.addEventListener("change", (event) => {
  activeFormation = event.target.value;
  render();
});
typeSelect.addEventListener("change", (event) => {
  activeType = event.target.value;
  render();
});
cycleSelect.addEventListener("change", (event) => {
  activeCycle = event.target.value;
  render();
});
facultyGridPage.addEventListener("click", (event) => {
  const card = event.target.closest("[data-faculty]");
  if (!card) return;
  activeFacultyId = card.dataset.faculty;
  render();
});

renderOffer();
render();
