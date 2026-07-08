const semesterSelect = document.querySelector("#capstoneSemester");
const areaSelect = document.querySelector("#capstoneArea");
const searchInput = document.querySelector("#capstoneSearch");
const projectGrid = document.querySelector("#capstoneGrid");
const semesterRail = document.querySelector("#capstoneSemesters");
const projectCount = document.querySelector("#capstoneProjectCount");
const authorCount = document.querySelector("#capstoneAuthorCount");
const areaCount = document.querySelector("#capstoneAreaCount");
const featuredPanel = document.querySelector("#capstoneFeatured");
const previewDialog = document.querySelector("#capstonePreviewDialog");
const previewClose = document.querySelector("#capstonePreviewClose");
const previewImage = document.querySelector("#capstonePreviewImage");
const previewTitle = document.querySelector("#capstonePreviewTitle");
const previewAuthors = document.querySelector("#capstonePreviewAuthors");
const previewLinks = document.querySelector("#capstonePreviewLinks");

let activeSemester = capstoneSemesters[0].id;
let activeArea = "all";
let activeQuery = "";

const advisorChartAliases = {
  "Juan Carlos Llivisaca, M.Sc.": "Juan Carlos Llivisaca Villazhanay, M.Sc.",
  "Milton Barragan Landy, Ph.D.": "Milton F. Barragan-Landy, Ph.D.",
  "Milton F. Barragan-Landy": "Milton F. Barragan-Landy, Ph.D.",
  "Milton Francisco Barragan-Landy, Ph.D.": "Milton F. Barragan-Landy, Ph.D.",
  "Pablo Andres Flores Siguenza": "Pablo Andres Flores Siguenza",
  "Paulina Rebeca Espinoza Hernandez": "Paulina R. Espinoza Hernandez, M.Sc."
};

const areaChartAliases = {
  "Gestion de calidad y servicios": "Gestion de calidad",
  "Calidad y metrologia": "Gestion de calidad",
  "Lean Manufacturing y simulacion": "Mejora continua y productividad",
  "Produccion y metodos cuantitativos": "Produccion y metodos cuantitativos",
  "Optimizacion y planificacion": "Produccion y metodos cuantitativos",
  "Logistica y distribucion de planta": "Logistica y cadena de suministro",
  "Sostenibilidad y cadena de suministro": "Logistica y cadena de suministro",
  "Analitica e inventarios": "Analitica e inventarios",
  "Ergonomia y seguridad ocupacional": "Ergonomia y seguridad ocupacional",
  "Gestion organizacional": "Gestion organizacional"
};

function getAdvisorChartName(name) {
  return advisorChartAliases[name] || name;
}

function getAreaChartName(name) {
  return areaChartAliases[name] || name;
}

function getSemester() {
  return capstoneSemesters.find((semester) => semester.id === activeSemester) || capstoneSemesters[0];
}

function getAreas(semester) {
  return [...new Set(semester.projects.map((project) => project.area))].sort((a, b) => a.localeCompare(b));
}

function getFilteredProjects() {
  const semester = getSemester();
  const normalizedQuery = activeQuery.trim().toLowerCase();

  return semester.projects.filter((project) => {
    const matchesArea = activeArea === "all" || project.area === activeArea;
    const haystack = [project.title, project.area, project.advisor, ...project.authors, ...project.keywords]
      .join(" ")
      .toLowerCase();
    return matchesArea && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}

function renderControls() {
  const semester = getSemester();
  const areas = getAreas(semester);

  semesterSelect.innerHTML = capstoneSemesters
    .map(
      (item) => `<option value="${item.id}" ${item.id === activeSemester ? "selected" : ""}>${item.label}</option>`
    )
    .join("");

  areaSelect.innerHTML = [
    `<option value="all" ${activeArea === "all" ? "selected" : ""}>Todas las areas</option>`,
    ...areas.map((area) => `<option value="${area}" ${area === activeArea ? "selected" : ""}>${area}</option>`)
  ].join("");
}

function renderMetrics() {
  const semester = getSemester();
  const authors = new Set(semester.projects.flatMap((project) => project.authors));
  const areas = getAreas(semester);

  projectCount.textContent = semester.projects.length;
  authorCount.textContent = authors.size;
  areaCount.textContent = areas.length;
}

function renderSemesterRail() {
  semesterRail.innerHTML = capstoneSemesters
    .map((semester) => {
      const authors = new Set(semester.projects.flatMap((project) => project.authors));
      return `
        <button type="button" class="capstone-semester-card" data-semester="${semester.id}" aria-pressed="${semester.id === activeSemester}">
          <span>${semester.shortLabel}</span>
          <strong>${semester.projects.length} proyectos</strong>
          <small>${authors.size} estudiantes registrados</small>
        </button>
      `;
    })
    .join("");
}

function renderFeatured(projects) {
  if (!projects.length) {
    featuredPanel.innerHTML = "";
    return;
  }

  const advisorStats = [...projects.reduce((map, project) => {
    const advisorName = getAdvisorChartName(project.advisor);
    const current = map.get(advisorName) || {
      name: advisorName,
      projects: 0,
      students: 0,
      areas: new Set(),
      items: []
    };
    current.projects += 1;
    current.students += project.authors.length;
    current.areas.add(project.area);
    current.items.push(project);
    map.set(advisorName, current);
    return map;
  }, new Map()).values()].sort((a, b) => b.projects - a.projects || a.name.localeCompare(b.name));

  const areaStats = [...projects.reduce((map, project) => {
    const areaName = getAreaChartName(project.area);
    const current = map.get(areaName) || {
      name: areaName,
      projects: 0,
      students: 0,
      advisors: new Set(),
      items: []
    };
    current.projects += 1;
    current.students += project.authors.length;
    current.advisors.add(project.advisor);
    current.items.push(project);
    map.set(areaName, current);
    return map;
  }, new Map()).values()].sort((a, b) => b.projects - a.projects || a.name.localeCompare(b.name));

  const maxAdvisorProjects = Math.max(...advisorStats.map((item) => item.projects), 1);
  const maxAreaProjects = Math.max(...areaStats.map((item) => item.projects), 1);

  featuredPanel.innerHTML = `
    <article class="capstone-stat-panel">
      <div class="capstone-stat-panel__head">
        <p class="kicker">Direccion de tesis</p>
        <h2>Docentes directores</h2>
      </div>
      <div class="capstone-bar-chart" aria-label="Grafica de barras por docente director">
        ${advisorStats
          .map(
            (item) => `
              <div class="capstone-bar-row" tabindex="0">
                <div class="capstone-bar-row__main">
                  <div>
                    <strong>${item.name}</strong>
                    <small>${item.students} estudiantes · ${item.areas.size} areas</small>
                  </div>
                  <div class="capstone-bar-track">
                    <i style="width: ${Math.round((item.projects / maxAdvisorProjects) * 100)}%"></i>
                  </div>
                  <span>${item.projects}</span>
                </div>
                <div class="capstone-bar-details">
                  ${item.items
                    .map(
                      (project) => `
                        <button type="button" data-project="${project.id}">
                          <strong>${project.title}</strong>
                          <small>${project.authors.join(", ")} · ${project.area}</small>
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
    <article class="capstone-stat-panel">
      <div class="capstone-stat-panel__head">
        <p class="kicker">Distribucion academica</p>
        <h2>Areas de proyecto</h2>
      </div>
      <div class="capstone-bar-chart" aria-label="Grafica de barras por area de proyecto">
        ${areaStats
          .map(
            (item) => `
              <div class="capstone-bar-row capstone-bar-row--area" tabindex="0">
                <div class="capstone-bar-row__main">
                  <div>
                    <strong>${item.name}</strong>
                    <small>${item.students} estudiantes · ${item.advisors.size} directores</small>
                  </div>
                  <div class="capstone-bar-track">
                    <i style="width: ${Math.round((item.projects / maxAreaProjects) * 100)}%"></i>
                  </div>
                  <span>${item.projects}</span>
                </div>
                <div class="capstone-bar-details">
                  ${item.items
                    .map(
                      (project) => `
                        <button type="button" data-project="${project.id}">
                          <strong>${project.title}</strong>
                          <small>${project.authors.join(", ")} · Director: ${getAdvisorChartName(project.advisor)}</small>
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderProjects() {
  const projects = getFilteredProjects();
  renderFeatured(projects);

  if (!projects.length) {
    projectGrid.innerHTML = `
      <article class="empty-state">
        No se encontraron proyectos con los filtros activos.
      </article>
    `;
    return;
  }

  projectGrid.innerHTML = `
    <div class="capstone-table-head" aria-hidden="true">
      <span>Imagen</span>
      <span>Titulo</span>
      <span>Area</span>
      <span>Director</span>
      <span>Palabras clave</span>
      <span>Documentos</span>
    </div>
    ${projects
      .map(
        (project) => `
        <article class="capstone-card">
          <button type="button" class="capstone-card__preview" data-project="${project.id}" aria-label="Ver ${project.title}">
            <img src="${project.preview}" alt="Poster de ${project.title}" loading="lazy" />
          </button>
          <div class="capstone-card__content">
            <div>
              <span>Titulo</span>
              <h3>${project.title}</h3>
              <p>${project.authors.join(", ")}</p>
            </div>
            <div>
              <span>Area</span>
              <p>${project.area}</p>
            </div>
            <div>
              <span>Director</span>
              <p>${project.advisor}</p>
            </div>
            <div>
              <span>Palabras clave</span>
              <div class="capstone-keyword-bubbles">
                ${project.keywords.map((keyword, index) => `<small class="tone-${(index % 4) + 1}">${keyword}</small>`).join("")}
              </div>
            </div>
            <div class="capstone-docs">
              <a href="${project.documents.es}" target="_blank" rel="noreferrer">Poster ES</a>
              <a href="${project.documents.en}" target="_blank" rel="noreferrer">Poster EN</a>
            </div>
          </div>
        </article>
      `
      )
      .join("")}
  `;
}

function openPreview(projectId) {
  const project = getSemester().projects.find((item) => item.id === projectId);
  if (!project) return;

  previewImage.src = project.preview;
  previewImage.alt = `Previsualizacion de ${project.title}`;
  previewTitle.textContent = project.title;
  previewAuthors.textContent = `${project.authors.join(", ")} - Tutor: ${project.advisor}`;
  previewLinks.innerHTML = `
    <a href="${project.documents.es}" target="_blank" rel="noreferrer">Abrir poster en espanol</a>
    <a href="${project.documents.en}" target="_blank" rel="noreferrer">Abrir poster en ingles</a>
  `;
  previewDialog.showModal();
}

function render() {
  renderControls();
  renderMetrics();
  renderSemesterRail();
  renderProjects();
}

semesterSelect.addEventListener("change", (event) => {
  activeSemester = event.target.value;
  activeArea = "all";
  render();
});

areaSelect.addEventListener("change", (event) => {
  activeArea = event.target.value;
  render();
});

searchInput.addEventListener("input", (event) => {
  activeQuery = event.target.value;
  renderProjects();
});

semesterRail.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-semester]");
  if (!button) return;
  activeSemester = button.dataset.semester;
  activeArea = "all";
  render();
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-project]");
  if (!trigger) return;
  openPreview(trigger.dataset.project);
});

featuredPanel.addEventListener("click", (event) => {
  if (event.target.closest("[data-project]")) return;
  const row = event.target.closest(".capstone-bar-row");
  if (!row) return;
  row.classList.toggle("is-open");
});

previewClose.addEventListener("click", () => previewDialog.close());

previewDialog.addEventListener("click", (event) => {
  if (event.target === previewDialog) previewDialog.close();
});

render();
