const syllabiSearch = document.querySelector("#syllabiSearch");
const syllabiLevel = document.querySelector("#syllabiLevel");
const syllabiItinerary = document.querySelector("#syllabiItinerary");
const syllabiList = document.querySelector("#syllabiList");
const syllabiPreview = document.querySelector("#syllabiPreview");

const syllabiItems = syllabiContentData.items
  .slice()
  .sort((a, b) => a.level - b.level || a.title.localeCompare(b.title, "es"));
const curriculumCourses = typeof curriculumDashboardData !== "undefined" ? curriculumDashboardData.courses : [];
const courseByTitle = new Map(curriculumCourses.map((course) => [normalize(course.title), course]));
const weeksPerCycle = 16;
const hoursPerCredit = 48;

let activeQuery = "";
let activeLevel = "all";
let activeItinerary = "all";
let activeSyllabusId = syllabiItems[0]?.id || "";

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bing\.?\b/g, "ingenieria")
    .replace(/\bii\b/g, "2")
    .replace(/\bi\b/g, "1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
}

function courseLoad(item) {
  const course = courseByTitle.get(normalize(item.title));
  if (!course) return null;
  const ape = Number(course.apeA || 0) + Number(course.apeT || 0);
  const acd = Number(course.acd || 0);
  const aa = Number(course.aa || 0);
  const total = (acd + ape + aa) * weeksPerCycle;
  return {
    acd: acd * weeksPerCycle,
    ape: ape * weeksPerCycle,
    aa: aa * weeksPerCycle,
    total,
    credits: total / hoursPerCredit
  };
}

function formatCredits(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function renderLoadSummary(item) {
  const load = courseLoad(item);
  if (!load) {
    return `<div class="syllabi-load-grid muted"><span>Horas no disponibles en la malla académica.</span></div>`;
  }

  return `
    <div class="syllabi-load-grid" aria-label="Carga horaria de la asignatura">
      <div><strong>${load.acd}</strong><span>ACD</span></div>
      <div><strong>${load.ape}</strong><span>APE</span></div>
      <div><strong>${load.aa}</strong><span>AA</span></div>
      <div><strong>${load.total}</strong><span>Total</span></div>
      <div><strong>${formatCredits(load.credits)}</strong><span>Créditos</span></div>
    </div>
  `;
}

function syllabusText(item) {
  return [
    item.title,
    item.level,
    item.itinerary,
    ...item.units.flatMap((unit) => [unit.title, ...unit.subunits.map((subunit) => subunit.title)])
  ].join(" ");
}

function itemMatchesQuery(item, query) {
  if (!query) return true;
  return normalize(syllabusText(item)).includes(query);
}

function matchingUnits(item) {
  const query = normalize(activeQuery);
  if (!query) return item.units;
  return item.units
    .map((unit) => {
      const unitMatch = normalize(unit.title).includes(query);
      const subunits = unit.subunits.filter((subunit) => unitMatch || normalize(subunit.title).includes(query));
      if (unitMatch || subunits.length) return { ...unit, subunits };
      return null;
    })
    .filter(Boolean);
}

function filteredSyllabi() {
  const query = normalize(activeQuery);
  return syllabiItems.filter((item) => {
    const matchesLevel = activeLevel === "all" || String(item.level) === activeLevel;
    const matchesItinerary = activeItinerary === "all" || (item.itinerary || "General") === activeItinerary;
    return matchesLevel && matchesItinerary && itemMatchesQuery(item, query);
  });
}

function selectedSyllabus() {
  return syllabiItems.find((item) => item.id === activeSyllabusId) || filteredSyllabi()[0] || syllabiItems[0];
}

function renderMetrics() {
  document.querySelector("#syllabiCount").textContent = syllabiContentData.summary.count;
  document.querySelector("#syllabiLevels").textContent = unique(syllabiItems.map((item) => item.level)).length;
  document.querySelector("#syllabiUnits").textContent = syllabiContentData.summary.units;
  document.querySelector("#syllabiSubunits").textContent = syllabiContentData.summary.subunits;
}

function renderControls() {
  const levels = unique(syllabiItems.map((item) => item.level)).sort((a, b) => Number(a) - Number(b));
  const itineraries = unique(syllabiItems.map((item) => item.itinerary || "General"));

  syllabiLevel.innerHTML = [
    `<option value="all">Todos los niveles</option>`,
    ...levels.map((level) => `<option value="${level}" ${String(level) === activeLevel ? "selected" : ""}>Nivel ${level}</option>`)
  ].join("");

  syllabiItinerary.innerHTML = [
    `<option value="all">Todos</option>`,
    ...itineraries.map((itinerary) => `<option value="${itinerary}" ${itinerary === activeItinerary ? "selected" : ""}>${itinerary}</option>`)
  ].join("");
}

function renderList() {
  const items = filteredSyllabi();
  if (!items.some((item) => item.id === activeSyllabusId)) {
    activeSyllabusId = items[0]?.id || syllabiItems[0]?.id || "";
  }

  syllabiList.innerHTML = items.length
    ? items
        .map((item) => {
          const units = matchingUnits(item);
          const matchText = activeQuery ? `${units.length} unidades relacionadas` : `${item.unitCount} unidades`;
          return `
            <button type="button" class="syllabus-card" data-syllabus="${item.id}" aria-pressed="${item.id === activeSyllabusId}">
              <span>Nivel ${item.level}${item.itinerary ? ` · ${item.itinerary}` : ""}</span>
              <strong>${item.title}</strong>
              <small>${matchText} · ${item.subunitCount} subunidades</small>
            </button>
          `;
        })
        .join("")
    : `<article class="empty-state">No hay contenidos con los filtros activos.</article>`;
}

function renderUnits(item) {
  const units = matchingUnits(item);
  if (!units.length) {
    return `<article class="empty-state">No se encontraron unidades relacionadas con la búsqueda actual.</article>`;
  }

  return `
    <div class="syllabi-content-units">
      ${units.map((unit, index) => `
        <article class="syllabi-unit-card">
          <button type="button" class="syllabi-unit-trigger" aria-expanded="${index === 0 ? "true" : "false"}">
            <span>${unit.code}</span>
            <strong>${unit.title}</strong>
            <em>${unit.subunits.length} subunidades</em>
          </button>
          <div class="syllabi-subunit-list" ${index === 0 ? "" : "hidden"}>
            ${unit.subunits.length
              ? unit.subunits.map((subunit) => `
                <div>
                  <span>${subunit.code}</span>
                  <p>${subunit.title}</p>
                </div>
              `).join("")
              : `<p>La unidad no registra subunidades separadas en el PDF.</p>`}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSimilar(item) {
  const similar = syllabiContentData.similar[item.id] || [];
  if (!similar.length) return `<p class="syllabi-similar-empty">No se detectaron materias con contenidos similares.</p>`;

  return `
    <div class="syllabi-similar-list">
      ${similar.map((entry) => `
        <button type="button" data-syllabus="${entry.id}">
          <span>Nivel ${entry.level} · ${(entry.score * 100).toFixed(0)}% afinidad</span>
          <strong>${entry.title}</strong>
          <small>${entry.keywords.length ? entry.keywords.join(" · ") : "Temas compartidos"}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderPreview() {
  const item = selectedSyllabus();
  if (!item) {
    syllabiPreview.innerHTML = `<article class="empty-state">Selecciona un sílabo para explorar contenidos.</article>`;
    return;
  }

  syllabiPreview.innerHTML = `
    <div class="syllabi-preview-head">
      <span>Nivel ${item.level}${item.itinerary ? ` · ${item.itinerary}` : ""}</span>
      <h2>${item.title}</h2>
      <p>${item.unitCount} unidades · ${item.subunitCount} subunidades extraídas</p>
      ${renderLoadSummary(item)}
    </div>
    <section class="syllabi-content-panel">
      <div class="section-heading compact">
        <p class="kicker">Contenidos categorizados</p>
        <h3>Unidades y subunidades</h3>
      </div>
      ${renderUnits(item)}
    </section>
    <section class="syllabi-content-panel">
      <div class="section-heading compact">
        <p class="kicker">Relaciones temáticas</p>
        <h3>Materias con contenidos similares</h3>
      </div>
      ${renderSimilar(item)}
    </section>
  `;
}

function render() {
  renderControls();
  renderList();
  renderPreview();
}

syllabiSearch.addEventListener("input", (event) => {
  activeQuery = event.target.value;
  render();
});

syllabiLevel.addEventListener("change", (event) => {
  activeLevel = event.target.value;
  render();
});

syllabiItinerary.addEventListener("change", (event) => {
  activeItinerary = event.target.value;
  render();
});

document.addEventListener("click", (event) => {
  const syllabusCard = event.target.closest("[data-syllabus]");
  if (syllabusCard) {
    activeSyllabusId = syllabusCard.dataset.syllabus;
    if (syllabusCard.closest(".syllabi-similar-list")) {
      activeQuery = "";
      activeLevel = "all";
      activeItinerary = "all";
      syllabiSearch.value = "";
    }
    render();
    return;
  }

  const trigger = event.target.closest(".syllabi-unit-trigger");
  if (!trigger) return;
  const content = trigger.nextElementSibling;
  const expanded = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", String(!expanded));
  if (content) content.hidden = expanded;
});

renderMetrics();
render();
