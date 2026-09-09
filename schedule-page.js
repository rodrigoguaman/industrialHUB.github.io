const scheduleData = scheduleDashboardData;
const facultyData = typeof facultyDashboardData === "undefined" ? { faculty: [] } : facultyDashboardData;
const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hourSlots = Array.from({ length: 14 }, (_, index) => {
  const start = index + 7;
  return `${String(start).padStart(2, "0")}:00-${String(start + 1).padStart(2, "0")}:00`;
});

const blockSelect = document.querySelector("#scheduleBlockSelect");
const daySelect = document.querySelector("#scheduleDaySelect");
const teacherSelect = document.querySelector("#scheduleTeacherSelect");
const roomSelect = document.querySelector("#scheduleRoomSelect");
const searchInput = document.querySelector("#scheduleSearch");
const weekGrid = document.querySelector("#scheduleWeekGrid");
const dayBars = document.querySelector("#scheduleDayBars");
const teacherBars = document.querySelector("#scheduleTeacherBars");
const resultCount = document.querySelector("#scheduleResultCount");

let activeFilters = {
  block: scheduleData.blocks[0]?.id || "all",
  day: "all",
  teacher: "all",
  room: "all",
  query: ""
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactTeacherName(value) {
  return normalize(value)
    .replace(/\bcristian\b/g, "christian")
    .replace(/\b(mgt|mgtr|msc|ms|phd|ing|fis|psic|bqf|cpa|mba|docente)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function teacherTokens(value) {
  return compactTeacherName(value).split(" ").filter((token) => token.length > 2);
}

function resolveTeacherProfile(name) {
  const target = teacherTokens(name);
  if (!target.length || normalize(name) === "por definir") return null;

  return facultyData.faculty.find((person) => {
    const haystack = compactTeacherName(person.name);
    return target.every((token) => haystack.includes(token));
  }) || facultyData.faculty.find((person) => {
    const source = teacherTokens(person.name);
    const matches = target.filter((token) => source.includes(token)).length;
    return matches >= Math.min(2, target.length);
  }) || null;
}

function enrichTeacher(name) {
  const profile = resolveTeacherProfile(name);
  return {
    name,
    displayName: profile?.name || name,
    title: profile?.title || "",
    formation: profile?.formation || "",
    type: profile?.type || "",
    modality: profile?.modality || "",
    belonging: profile?.belonging || "",
    dedication: profile?.dedication || "",
    email: profile?.email || "",
    image: profile?.image || "assets/faculty/default-profile.png"
  };
}

function uniqueSorted(items) {
  return [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function allSessions() {
  return scheduleData.blocks.flatMap((block) =>
    block.sessions.map((session) => ({
      ...session,
      blockId: block.id,
      blockTitle: block.title,
      teacherProfile: enrichTeacher(session.teacher)
    }))
  );
}

function allCourses() {
  return scheduleData.blocks.flatMap((block) =>
    block.courses.map((course) => ({
      ...course,
      blockId: block.id,
      blockTitle: block.title,
      teacherProfile: enrichTeacher(course.teacher)
    }))
  );
}

const coursesById = new Map(allCourses().map((course) => [course.id, course]));

function populateSelect(select, options, allLabel, includeAll = true) {
  select.innerHTML = [
    includeAll ? `<option value="all">${allLabel}</option>` : "",
    ...options.map((item) => `<option value="${item.value}">${item.label}</option>`)
  ].join("");
}

function initializeFilters() {
  document.querySelector("#scheduleLevelCount").textContent = scheduleData.summary.levels;
  document.querySelector("#scheduleBlockCount").textContent = scheduleData.summary.blocks;
  document.querySelector("#scheduleCourseCount").textContent = scheduleData.summary.courses;
  document.querySelector("#scheduleSessionCount").textContent = scheduleData.summary.sessions;

  populateSelect(
    blockSelect,
    scheduleData.blocks.map((block) => ({ value: block.id, label: block.title })),
    "Seleccione un nivel",
    false
  );
  blockSelect.value = activeFilters.block;

  populateSelect(
    daySelect,
    dayOrder.map((day) => ({ value: day, label: day })),
    "Todos los días"
  );

  populateSelect(
    teacherSelect,
    uniqueSorted(allCourses().map((course) => course.teacher)).map((teacher) => ({
      value: teacher,
      label: teacher
    })),
    "Todos los docentes"
  );

  populateSelect(
    roomSelect,
    uniqueSorted(allSessions().map((session) => session.room)).map((room) => ({
      value: room,
      label: room
    })),
    "Todas las aulas"
  );
}

function matchesFilters(item) {
  const query = normalize(activeFilters.query);
  const haystack = normalize([
    item.subject,
    item.teacher,
    item.teacherProfile?.displayName,
    item.teacherProfile?.email,
    item.room,
    item.day,
    item.time,
    item.blockTitle
  ].join(" "));

  return (
    (activeFilters.block === "all" || item.blockId === activeFilters.block) &&
    (activeFilters.day === "all" || item.day === activeFilters.day) &&
    (activeFilters.teacher === "all" || item.teacher === activeFilters.teacher) &&
    (activeFilters.room === "all" || item.room === activeFilters.room) &&
    (!query || haystack.includes(query))
  );
}

function filteredSessions() {
  return allSessions().filter(matchesFilters);
}

function sessionStartHour(session) {
  const match = String(session.time).match(/^(\d{2}):00/);
  return match ? Number(match[1]) : null;
}

function displaySubject(session) {
  const course = coursesById.get(session.courseId);
  const source = course?.subject || session.subject;

  return String(source)
    .replace(/\bAcd\b/g, "")
    .replace(/\bApe\b/g, "")
    .replace(/\bACD\b/g, "")
    .replace(/\bAPE\b/g, "")
    .replace(/\bSg\d+\b/gi, "")
    .replace(/\bG\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || session.subject;
}

function displayTeacher(session) {
  return session.teacher || session.teacherProfile.displayName;
}

function sessionsForCell(sessions, day, slot) {
  const hour = Number(slot.slice(0, 2));
  return sessions.filter((session) => session.day === day && sessionStartHour(session) === hour);
}

function teacherMeta(profile) {
  return [profile.title, profile.formation, profile.modality, profile.dedication]
    .filter(Boolean)
    .join(" · ");
}

function renderWeek() {
  const sessions = filteredSessions();
  const visibleSessions = sessions.filter((session) => {
    const hour = sessionStartHour(session);
    return hour >= 7 && hour < 21;
  });
  const selectedBlock = scheduleData.blocks.find((block) => block.id === activeFilters.block);
  resultCount.textContent = `${visibleSessions.length} clase${visibleSessions.length === 1 ? "" : "s"}`;
  document.querySelector("#scheduleWeekTitle").textContent = selectedBlock?.title || "Horario filtrado";

  weekGrid.innerHTML = `
    <div class="schedule-time-header">Hora</div>
    ${dayOrder.map((day) => `<div class="schedule-day-header">${day}</div>`).join("")}
    ${hourSlots.map((slot) => `
      <div class="schedule-time-cell">${slot.replace(":00", "").replace(":00", "")}</div>
      ${dayOrder.map((day) => {
        const cellSessions = sessionsForCell(visibleSessions, day, slot);
        const isDimmed = activeFilters.day !== "all" && activeFilters.day !== day;
        return `
          <div class="schedule-grid-cell${cellSessions.length ? " has-class" : ""}${isDimmed ? " is-dimmed" : ""}">
            ${cellSessions.map((session) => `
              <article class="schedule-slot-card">
                <span>${session.component || "Clase"}</span>
                <strong>${displaySubject(session)}</strong>
                <small>${session.room}</small>
                <em>${displayTeacher(session)}</em>
              </article>
            `).join("")}
          </div>
        `;
      }).join("")}
    `).join("")}
  `;

}

function countBy(items, keyGetter) {
  return items.reduce((map, item) => {
    const key = keyGetter(item);
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
}

function renderBars(container, entries) {
  const max = Math.max(...entries.map(([, value]) => value), 1);
  container.innerHTML = entries.map(([label, value]) => `
    <div class="schedule-bar-row">
      <span>${label}</span>
      <div><i style="width: ${(value / max) * 100}%"></i></div>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderStats() {
  const sessions = filteredSessions().filter((session) => {
    const hour = sessionStartHour(session);
    return hour >= 7 && hour < 21;
  });
  const byDay = dayOrder
    .map((day) => [day, sessions.filter((session) => session.day === day).length])
    .filter(([, value]) => value);
  const byTeacher = [...countBy(sessions, (session) => displayTeacher(session)).entries()]
    .filter(([teacher]) => teacher !== "Por definir")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  renderBars(dayBars, byDay);
  renderBars(teacherBars, byTeacher);
}

function renderSchedule() {
  renderWeek();
  renderStats();
}

blockSelect.addEventListener("change", () => {
  activeFilters.block = blockSelect.value;
  renderSchedule();
});

daySelect.addEventListener("change", () => {
  activeFilters.day = daySelect.value;
  renderSchedule();
});

teacherSelect.addEventListener("change", () => {
  activeFilters.teacher = teacherSelect.value;
  renderSchedule();
});

roomSelect.addEventListener("change", () => {
  activeFilters.room = roomSelect.value;
  renderSchedule();
});

searchInput.addEventListener("input", () => {
  activeFilters.query = searchInput.value;
  renderSchedule();
});

initializeFilters();
renderSchedule();
