const scheduleData = scheduleDashboardData;
const facultyData = typeof facultyDashboardData === "undefined" ? { faculty: [] } : facultyDashboardData;
const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hourSlots = Array.from({ length: 14 }, (_, index) => {
  const start = index + 7;
  return `${String(start).padStart(2, "0")}:00-${String(start + 1).padStart(2, "0")}:00`;
});

const cycleButtons = document.querySelector("#scheduleCycleButtons");
const roomGuide = document.querySelector("#scheduleRoomGuide");
const weekGrid = document.querySelector("#scheduleWeekGrid");
const resultCount = document.querySelector("#scheduleResultCount");
const weekTitle = document.querySelector("#scheduleWeekTitle");
const scheduleModal = document.querySelector("#scheduleModal");
const scheduleModalImage = document.querySelector("#scheduleModalImage");
const scheduleModalTeacherImage = document.querySelector("#scheduleModalTeacherImage");
const scheduleModalRoomType = document.querySelector("#scheduleModalRoomType");
const scheduleModalTitle = document.querySelector("#scheduleModalTitle");
const scheduleModalMeta = document.querySelector("#scheduleModalMeta");
const scheduleModalDetails = document.querySelector("#scheduleModalDetails");
const scheduleModalHours = document.querySelector("#scheduleModalHours");

let activeBlockId = scheduleData.blocks[0]?.id || "";
let activeEvents = [];

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

function activeBlock() {
  return scheduleData.blocks.find((block) => block.id === activeBlockId) || scheduleData.blocks[0];
}

function sessionsForActiveBlock() {
  const block = activeBlock();
  return (block?.sessions || []).map((session) => ({
    ...session,
    blockId: block.id,
    blockTitle: block.title,
    teacherProfile: enrichTeacher(session.teacher)
  }));
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

function cleanRoom(room) {
  return String(room || "Por definir")
    .replace(/\s+/g, " ")
    .replace(/^\d+\s+(CB|CC|TEC)-/i, "$1-")
    .replace(/^S?Lab/i, "Lab")
    .replace("LAB I4,0", "LAB I4.0")
    .trim();
}

function roomDetails(room) {
  const value = cleanRoom(room);
  const normalized = normalize(value);
  const match = value.match(/^(CB|CC|TEC)-?([BC])?(\d)?(\d{2})?/i);
  const campusCode = match?.[1]?.toUpperCase() || "";
  const buildingCode = isIndustrialLabRoom(value) ? "C" : match?.[2]?.toUpperCase() || "";
  const floorCode = match?.[3] || "";
  const campus = normalized.includes("fablab") || normalized.includes("lab i4 0") || normalized.includes("lab man flex") ? "Campus Balzay" : {
    CB: "Campus Balzay",
    CC: "Campus Central",
    TEC: "Tecnológico"
  }[campusCode] || "Espacio especial";
  const building = {
    B: "Aulario 1",
    C: "Aulario 2"
  }[buildingCode] || "Laboratorio o aula específica";
  const floor = {
    1: "Planta baja",
    2: "Primera planta alta",
    3: "Segunda planta alta",
    4: "Nivel superior"
  }[floorCode] || "Según señalética del espacio";

  return { value, campusCode, campus, buildingCode, building, floorCode, floor };
}

function roomCategory(room) {
  const value = cleanRoom(room);
  const normalized = normalize(value);
  if (normalized.includes("cb c003")) return "computing";
  if (
    normalized.includes("fablab") ||
    normalized.includes("lab i4 0") ||
    normalized.includes("lab man flex")
  ) {
    return "lab";
  }
  return "campus";
}

function roomCategoryLabel(room) {
  const category = roomCategory(room);
  if (category === "computing") return "Centro de Cómputo";
  if (category === "lab") return "Laboratorios Ingeniería Industrial";
  return "Aula Campus Balzay";
}

function isFabLabRoom(room) {
  return normalize(cleanRoom(room)).includes("fablab");
}

function isLabI40Room(room) {
  return normalize(cleanRoom(room)).includes("lab i4 0");
}

function isLabManFlexRoom(room) {
  return normalize(cleanRoom(room)).includes("lab man flex");
}

function isIndustrialLabRoom(room) {
  return isFabLabRoom(room) || isLabI40Room(room) || isLabManFlexRoom(room);
}

function locationImageForRoom(room) {
  if (isFabLabRoom(room)) {
    return {
      src: "assets/schedule-fablab-location.jpeg",
      alt: "Laboratorio FABLAB"
    };
  }

  if (isLabManFlexRoom(room)) {
    return {
      src: "assets/schedule-lab-man-flex-location.jpeg",
      alt: "Laboratorio de Manufactura Flexible"
    };
  }

  if (isLabI40Room(room)) {
    return {
      src: "assets/schedule-lab-i40-location.jpeg",
      alt: "Laboratorio i4.0"
    };
  }

  const details = roomDetails(room);
  if (details.buildingCode === "C") {
    return {
      src: "assets/schedule-aulario-2.png",
      alt: "Bloque C - Aulario 2"
    };
  }

  return {
    src: "assets/schedule-aulario-1.png",
    alt: "Bloque B - Aulario 1"
  };
}

function courseForEvent(event) {
  return coursesById.get(event.courseId) || null;
}

function hourGroupsForEvent(event) {
  const course = courseForEvent(event);
  const hours = course?.hours || {};
  const labels = [
    ["ACD", "ACD"],
    ["APE/A", "APE/A"],
    ["AA", "AA"]
  ];

  return labels.map(([key, label]) => {
    const value = Number(hours[key] || 0);
    return {
      label,
      hours: value
    };
  });
}

function openScheduleModal(eventId) {
  const event = activeEvents.find((item) => item.eventId === eventId);
  if (!event || !scheduleModal) return;

  const room = roomDetails(event.room);
  const locationImage = locationImageForRoom(event.room);
  const course = courseForEvent(event);
  const hourGroups = hourGroupsForEvent(event);

  scheduleModalImage.src = locationImage.src;
  scheduleModalImage.alt = locationImage.alt;
  scheduleModalTeacherImage.src = event.teacherProfile.image;
  scheduleModalTeacherImage.alt = displayTeacher(event);
  scheduleModalRoomType.textContent = roomCategoryLabel(event.room);
  scheduleModalTitle.textContent = displaySubject(event);
  scheduleModalMeta.textContent = `${event.day} · ${String(event.startHour).padStart(2, "0")}:00-${String(event.endHour).padStart(2, "0")}:00 · ${displayTeacher(event)}`;
  scheduleModalDetails.innerHTML = `
    <div><dt>Aula</dt><dd>${room.value}</dd></div>
    <div><dt>Campus</dt><dd>${room.campus}</dd></div>
    <div><dt>Bloque</dt><dd>${room.building}</dd></div>
    <div><dt>Planta</dt><dd>${room.floor}</dd></div>
  `;
  scheduleModalHours.innerHTML = hourGroups.map((item) => `
    <article>
      <strong>${item.label}</strong>
      <span>${item.hours || 0} h</span>
    </article>
  `).join("");

  if (!course) {
    scheduleModalHours.insertAdjacentHTML("beforeend", `
      <article>
        <strong>Ficha</strong>
        <span>Sin enlace</span>
      </article>
    `);
  }

  scheduleModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("schedule-modal-open");
}

function closeScheduleModal() {
  if (!scheduleModal) return;
  scheduleModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("schedule-modal-open");
}

function roomCategoryMeta(category) {
  return {
    campus: {
      label: "Aula Campus Balzay",
      detail: "Aulas regulares del campus.",
      className: "is-campus"
    },
    lab: {
      label: "Laboratorios Ingeniería Industrial",
      detail: "FABLAB, LAB i4.0 y Laboratorio de Manufactura Flexible.",
      className: "is-lab"
    },
    computing: {
      label: "Centro de Cómputo",
      detail: "Aula CB-C003.",
      className: "is-computing"
    }
  }[category];
}

function renderRoomGuide() {
  if (!roomGuide) return;

  const grouped = allSessions().reduce((map, session) => {
    const room = cleanRoom(session.room);
    const category = roomCategory(room);
    if (!map.has(category)) map.set(category, new Map());
    const roomMap = map.get(category);
    roomMap.set(room, (roomMap.get(room) || 0) + 1);
    return map;
  }, new Map());

  const order = ["campus", "lab", "computing"];
  roomGuide.innerHTML = order.map((category) => {
    const meta = roomCategoryMeta(category);
    const rooms = [...(grouped.get(category) || new Map()).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const total = rooms.reduce((sum, [, count]) => sum + count, 0);

    return `
      <article class="schedule-room-card ${meta.className}">
        <div>
          <strong>${meta.label}</strong>
          <span>${total} sesiones</span>
        </div>
        <p>${meta.detail}</p>
        <ul>
          ${rooms.map(([room, count]) => `<li><b>${room}</b><small>${count}</small></li>`).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function mergeConsecutiveSessions(sessions) {
  const ordered = [...sessions].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    return dayDiff || sessionStartHour(a) - sessionStartHour(b);
  });
  const events = [];

  ordered.forEach((session) => {
    const startHour = sessionStartHour(session);
    const last = events[events.length - 1];
    const key = [
      session.day,
      session.courseId || normalize(displaySubject(session)),
      cleanRoom(session.room),
      displayTeacher(session),
      session.component || "Clase"
    ].join("|");

    if (last && last.key === key && last.endHour === startHour) {
      last.endHour = startHour + 1;
      last.duration += 1;
      return;
    }

    events.push({
      ...session,
      key,
      startHour,
      endHour: startHour + 1,
      duration: 1
    });
  });

  return events;
}

function renderCycleButtons() {
  cycleButtons.innerHTML = scheduleData.blocks.map((block) => `
    <button class="schedule-cycle-button${block.id === activeBlockId ? " is-active" : ""}" type="button" data-block="${block.id}">
      <strong>${block.title}</strong>
      <span>${block.courses.length} asignaturas · ${block.sessions.length} clases</span>
    </button>
  `).join("");

  cycleButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeBlockId = button.dataset.block;
      renderSchedule();
    });
  });
}

function renderWeek() {
  const sessions = sessionsForActiveBlock().filter((session) => {
    const hour = sessionStartHour(session);
    return hour >= 7 && hour < 21;
  });
  const events = mergeConsecutiveSessions(sessions).map((event, index) => ({
    ...event,
    eventId: `event-${activeBlockId}-${index}`
  }));
  activeEvents = events;
  const block = activeBlock();

  resultCount.textContent = `${events.length} bloque${events.length === 1 ? "" : "s"}`;
  weekTitle.textContent = block?.title || "Horario por ciclo";

  weekGrid.innerHTML = `
    <div class="schedule-time-header" style="grid-column: 1; grid-row: 1;">Hora</div>
    ${dayOrder.map((day, index) => `
      <div class="schedule-day-header" style="grid-column: ${index + 2}; grid-row: 1;">${day}</div>
    `).join("")}
    ${hourSlots.map((slot, slotIndex) => `
      <div class="schedule-time-cell" style="grid-column: 1; grid-row: ${slotIndex + 2};">${slot.replaceAll(":00", "")}</div>
      ${dayOrder.map((day) => {
        const hour = Number(slot.slice(0, 2));
        const hasClass = sessions.some((session) => session.day === day && sessionStartHour(session) === hour);
        const dayColumn = dayOrder.indexOf(day) + 2;
        return `
          <div
            class="schedule-grid-cell${hasClass ? " has-class" : ""}"
            style="grid-column: ${dayColumn}; grid-row: ${slotIndex + 2};"
          ></div>
        `;
      }).join("")}
    `).join("")}
    ${events.map((event) => {
      const room = roomDetails(event.room);
      const category = roomCategory(event.room);
      const startRow = hourSlots.findIndex((slot) => Number(slot.slice(0, 2)) === event.startHour) + 2;
      const dayColumn = dayOrder.indexOf(event.day) + 2;
      return `
        <article
          class="schedule-event-card is-room-${category}"
          style="grid-column: ${dayColumn}; grid-row: ${startRow} / span ${event.duration};"
          role="button"
          tabindex="0"
          data-event-id="${event.eventId}"
          title="${room.value} · ${roomCategoryLabel(event.room)} · ${room.campus} · ${room.building}"
        >
          <div class="schedule-card-media">
            <img
              class="schedule-teacher-photo"
              src="${event.teacherProfile.image}"
              alt="${displayTeacher(event)}"
              loading="lazy"
            />
            ${isFabLabRoom(event.room) ? `
              <img
                class="schedule-fablab-logo"
                src="assets/fablab-logo.png"
                alt="FABLAB"
                loading="lazy"
              />
            ` : ""}
          </div>
          <span>${event.component || "Clase"}</span>
          <strong>${displaySubject(event)}</strong>
          <small>${room.value} · ${roomCategoryLabel(event.room)}</small>
          <em>${displayTeacher(event)}</em>
          <b>${String(event.startHour).padStart(2, "0")}:00-${String(event.endHour).padStart(2, "0")}:00</b>
        </article>
      `;
    }).join("")}
  `;

  weekGrid.querySelectorAll(".schedule-event-card").forEach((card) => {
    card.addEventListener("click", () => openScheduleModal(card.dataset.eventId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openScheduleModal(card.dataset.eventId);
      }
    });
  });
}

function renderMetrics() {
  document.querySelector("#scheduleLevelCount").textContent = scheduleData.summary.levels;
  document.querySelector("#scheduleBlockCount").textContent = scheduleData.summary.blocks;
  document.querySelector("#scheduleCourseCount").textContent = scheduleData.summary.courses;
  document.querySelector("#scheduleSessionCount").textContent = scheduleData.summary.sessions;
}

function renderSchedule() {
  renderCycleButtons();
  renderWeek();
}

renderMetrics();
renderRoomGuide();
renderSchedule();

document.querySelectorAll("[data-schedule-modal-close]").forEach((element) => {
  element.addEventListener("click", closeScheduleModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeScheduleModal();
});
