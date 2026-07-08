const curriculumData = curriculumDashboardData;
const curriculumSearch = document.querySelector("#curriculumSearch");
const curriculumLevel = document.querySelector("#curriculumLevel");
const curriculumField = document.querySelector("#curriculumField");
const showPrerequisites = document.querySelector("#showPrerequisites");
const curriculumGrid = document.querySelector("#curriculumGrid");
const courseDetail = document.querySelector("#courseDetail");

let activeLevel = "all";
let activeField = "all";
let activeQuery = "";
let activeCourseCode = curriculumData.courses.find((course) => course.prerequisites.length)?.code || curriculumData.courses[0].code;

const facultySource = typeof facultyDashboardData === "undefined" ? { faculty: [], courses: [] } : facultyDashboardData;
const facultyByName = new Map((facultySource.faculty || []).map((teacher) => [normalize(teacher.name), teacher]));
const teacherImageFallbacks = new Map([
  ["james arias", "assets/faculty/ing-arias-cisneros-james-marlon-ms.jpg"]
]);
const normalizeSubject = (value) => normalize(value)
  .replace(/\b6\b/g, "six")
  .replace(/\bsuministros\b/g, "suministro")
  .replace(/\bservicio comunitario\b/g, "vinculacion")
  .replace(/\blaborales\s+(\d+)\b/g, "laborales $1")
  .replace(/\b(g|p)\d+\b/g, "")
  .replace(/\bi[12]\b/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();
function resolveTeacherProfile(name) {
  const normalizedName = normalize(name);
  const profile = facultyByName.get(normalizedName);
  const image = profile?.image && !profile.image.includes("default-profile")
    ? profile.image
    : teacherImageFallbacks.get(normalizedName) || profile?.image || "assets/faculty/default-profile.png";
  return { profile, image };
}
const teachersByCourseCode = (facultySource.courses || []).reduce((map, item) => {
  if (!item.code || !item.teacher || normalize(item.teacher) === "por definir") return map;
  const key = String(item.code);
  const current = map.get(key) || [];
  if (!current.some((teacher) => normalize(teacher.name) === normalize(item.teacher))) {
    const { profile, image } = resolveTeacherProfile(item.teacher);
    current.push({
      name: item.teacher,
      group: item.group,
      image,
      title: profile?.title || "Docente",
      formation: profile?.formation || "",
      modality: profile?.modality || ""
    });
  }
  map.set(key, current);
  return map;
}, new Map());
const teachersBySubject = (facultySource.courses || []).reduce((map, item) => {
  if (!item.subject || !item.teacher || normalize(item.teacher) === "por definir") return map;
  const key = normalizeSubject(item.subject);
  const current = map.get(key) || [];
  if (!current.some((teacher) => normalize(teacher.name) === normalize(item.teacher))) {
    const { profile, image } = resolveTeacherProfile(item.teacher);
    current.push({
      name: item.teacher,
      group: item.group,
      image,
      title: profile?.title || "Docente",
      formation: profile?.formation || "",
      modality: profile?.modality || ""
    });
  }
  map.set(key, current);
  return map;
}, new Map());

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getCourse(code) {
  return curriculumData.courses.find((course) => course.code === code);
}

function getCourseTeachers(course) {
  const byCode = teachersByCourseCode.get(String(course.code)) || [];
  if (byCode.length) return byCode;
  const courseSubject = normalizeSubject(course.title);
  const exact = teachersBySubject.get(courseSubject) || [];
  if (exact.length) return exact;
  const fuzzy = [...teachersBySubject.entries()].find(([subject]) => subject.includes(courseSubject) || courseSubject.includes(subject));
  return fuzzy?.[1] || [];
}

function renderCourseAvatars(course) {
  const teachers = getCourseTeachers(course);
  if (!teachers.length) {
    return `
      <div class="curriculum-teacher-strip">
        <img src="assets/faculty/default-profile.png" alt="" loading="lazy">
        <span>Docente por definir</span>
      </div>
    `;
  }
  const visibleTeachers = teachers.slice(0, 3);
  const remaining = teachers.length - visibleTeachers.length;
  return `
    <div class="curriculum-teacher-strip" aria-label="Docentes de ${course.title}">
      <div>
        ${visibleTeachers.map((teacher) => `
          <img src="${teacher.image}" alt="${teacher.name}" loading="lazy">
        `).join("")}
      </div>
      <span>${visibleTeachers.map((teacher) => teacher.name.split(" ").slice(0, 2).join(" ")).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}</span>
    </div>
  `;
}

function renderTeacherPanel(course) {
  const teachers = getCourseTeachers(course);
  return `
    <div class="curriculum-teachers-panel">
      <h3>Docente que imparte la asignatura</h3>
      <div>
        ${teachers.length ? teachers.map((teacher) => `
          <article>
            <img src="${teacher.image}" alt="${teacher.name}" loading="lazy">
            <div>
              <strong>${teacher.name}</strong>
              <span>${[teacher.title, teacher.formation, teacher.modality].filter(Boolean).join(" · ")}</span>
              <small>${teacher.group || "Grupo registrado"}</small>
            </div>
          </article>
        `).join("") : `
          <article>
            <img src="assets/faculty/default-profile.png" alt="" loading="lazy">
            <div>
              <strong>Docente por definir</strong>
              <span>No registra docente asignado en la base actual.</span>
            </div>
          </article>
        `}
      </div>
    </div>
  `;
}

function filteredCourses() {
  const q = normalize(activeQuery);
  return curriculumData.courses.filter((course) => {
    const matchesLevel = activeLevel === "all" || String(course.level) === activeLevel;
    const matchesField = activeField === "all" || course.field === activeField;
    const haystack = normalize([course.code, course.title, course.field, course.unit].join(" "));
    return matchesLevel && matchesField && (!q || haystack.includes(q));
  });
}

function renderMetrics() {
  const totalEdges = curriculumData.courses.reduce((sum, course) => sum + course.prerequisites.length, 0);
  document.querySelector("#curriculumCourseCount").textContent = curriculumData.summary.courseCount;
  document.querySelector("#curriculumLevelCount").textContent = curriculumData.summary.levelCount;
  document.querySelector("#curriculumPrereqCount").textContent = totalEdges;
  document.querySelector("#curriculumTotalHours").textContent = curriculumData.summary.totals.totalLearning;
}

function renderControls() {
  const fields = [...new Set(curriculumData.courses.map((course) => course.field))].sort((a, b) => a.localeCompare(b));
  curriculumLevel.innerHTML = [
    `<option value="all">Todos los niveles</option>`,
    ...curriculumData.levels.map((level) => `<option value="${level.level}" ${String(level.level) === activeLevel ? "selected" : ""}>Nivel ${level.level}</option>`)
  ].join("");
  curriculumField.innerHTML = [
    `<option value="all">Todos los campos</option>`,
    ...fields.map((field) => `<option value="${field}" ${field === activeField ? "selected" : ""}>${field}</option>`)
  ].join("");
}

function renderTinyBars(container, items, key = "totalLearning") {
  const max = Math.max(...items.map((item) => item.value), 1);
  container.innerHTML = items.map((item) => `
    <div class="curriculum-bar-row">
      <span>${item.label}</span>
      <div><i style="width:${Math.round((item.value / max) * 100)}%"></i></div>
      <strong>${item.value}</strong>
    </div>
  `).join("");
}

function renderCharts() {
  renderTinyBars(
    document.querySelector("#levelLoadChart"),
    curriculumData.levels.map((level) => ({ label: `Nivel ${level.level}`, value: level.totals.totalLearning }))
  );

  const fieldCounts = curriculumData.courses.reduce((map, course) => {
    map.set(course.field, (map.get(course.field) || 0) + 1);
    return map;
  }, new Map());
  renderTinyBars(
    document.querySelector("#fieldChart"),
    [...fieldCounts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  );
}

function renderGrid() {
  const courses = filteredCourses();
  if (!courses.some((course) => course.code === activeCourseCode)) {
    activeCourseCode = courses[0]?.code || curriculumData.courses[0].code;
  }

  curriculumGrid.innerHTML = curriculumData.levels.map((level) => {
    const levelCourses = courses.filter((course) => course.level === level.level);
    if (!levelCourses.length) return "";
    return `
      <section class="curriculum-level-card">
        <div class="curriculum-level-card__head">
          <span>Nivel ${level.level}</span>
          <small>ACD ${level.totals.acd} · APE/A ${level.totals.apeA} · APE/T ${level.totals.apeT} · AA ${level.totals.aa}</small>
        </div>
        <div class="curriculum-course-list">
          ${levelCourses.map((course) => `
            <button type="button" class="curriculum-course-card" data-course="${course.code}" aria-pressed="${course.code === activeCourseCode}">
              <span>${course.code}</span>
              <strong>${course.title}</strong>
              <small>${course.field}</small>
              ${renderCourseAvatars(course)}
              <em>${course.prerequisites.length} prerreq. · ${course.unlocks.length} desbloquea</em>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }).join("") || `<article class="empty-state">No hay asignaturas con los filtros activos.</article>`;
}

function renderDetail() {
  const course = getCourse(activeCourseCode) || curriculumData.courses[0];
  const prereqVisible = showPrerequisites.checked;
  courseDetail.innerHTML = `
    <div class="curriculum-detail-head">
      <span>${course.code}</span>
      <div>
        <p class="kicker">Asignatura seleccionada</p>
        <h2>${course.title}</h2>
        <p>Nivel ${course.level} · ${course.unit}</p>
      </div>
    </div>
    <div class="curriculum-hours-grid">
      <div><strong>${course.acd}</strong><span>ACD / ACE</span></div>
      <div><strong>${course.apeA}</strong><span>APE/A</span></div>
      <div><strong>${course.apeT}</strong><span>APE/T</span></div>
      <div><strong>${course.aa}</strong><span>AA</span></div>
    </div>
    <div class="curriculum-detail-meta">
      <span>${course.field}</span>
      <span>Total ${course.totalLearning}</span>
    </div>
    ${renderTeacherPanel(course)}
    <div class="curriculum-chain ${prereqVisible ? "" : "is-hidden"}">
      <h3>Prerrequisitos</h3>
      <div>
        ${course.prerequisites.length ? course.prerequisites.map((item) => `
          <button type="button" data-course="${item.code}">
            <span>${item.code}</span>
            <strong>${item.title}</strong>
          </button>
        `).join("") : `<p>No registra prerrequisitos en el PDF.</p>`}
      </div>
    </div>
    <div class="curriculum-chain">
      <h3>Encadenamientos posteriores</h3>
      <div>
        ${course.unlocks.length ? course.unlocks.map((item) => `
          <button type="button" data-course="${item.code}">
            <span>Nivel ${item.level} · ${item.code}</span>
            <strong>${item.title}</strong>
          </button>
        `).join("") : `<p>No desbloquea asignaturas registradas.</p>`}
      </div>
    </div>
  `;
}

function renderGlossary() {
  const legend = curriculumData.summary.legend;
  document.querySelector("#curriculumGlossary").innerHTML = Object.entries(legend).map(([code, text]) => `
    <article>
      <strong>${code}</strong>
      <p>${text}</p>
    </article>
  `).join("");
}

function render() {
  renderControls();
  renderCharts();
  renderGrid();
  renderDetail();
}

curriculumSearch.addEventListener("input", (event) => {
  activeQuery = event.target.value;
  render();
});
curriculumLevel.addEventListener("change", (event) => {
  activeLevel = event.target.value;
  render();
});
curriculumField.addEventListener("change", (event) => {
  activeField = event.target.value;
  render();
});
showPrerequisites.addEventListener("change", renderDetail);
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-course]");
  if (!target) return;
  activeCourseCode = target.dataset.course;
  activeLevel = "all";
  render();
});

renderMetrics();
renderGlossary();
render();
