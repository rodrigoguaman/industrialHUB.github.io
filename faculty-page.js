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

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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

  const renderCard = (person) => `
            <button type="button" class="faculty-page-card" data-faculty="${person.id}" aria-pressed="${person.id === activeFacultyId}">
              <img src="${person.image}" alt="${person.name}" loading="lazy" />
              <div>
                <span>${isDirector(person) ? "Director de carrera" : person.type}</span>
                <strong>${person.name}</strong>
                <p>${person.title} · ${person.formation}</p>
                <small>${person.modality} · ${person.dedication} · ${visibleSubjects(person).length} asignaturas</small>
              </div>
            </button>
          `;

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
                    <small>ACD ${subject.acd} · APE ${subject.ape} · AA ${subject.aa} · Oferta ${subject.offer}</small>
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
