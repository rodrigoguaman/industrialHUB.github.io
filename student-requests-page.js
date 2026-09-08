const requestsData = studentRequestsData;
const requestsMapSelect = document.querySelector("#requestsMapSelect");
const requestsRelationMode = document.querySelector("#requestsRelationMode");
const requestsMapSummary = document.querySelector("#requestsMapSummary");
const requestsFullMap = document.querySelector("#requestsFullMap");
const requestsCourseDialog = document.querySelector("#requestsCourseDialog");
const requestsDialogContent = document.querySelector("#requestsDialogContent");
const capacityRequestForm = document.querySelector("#capacityRequestForm");
const requestSelectedCourse = document.querySelector("#requestSelectedCourse");
const requestNrc = document.querySelector("#requestNrc");
const requestFormStatus = document.querySelector("#requestFormStatus");
const requestEmail = document.querySelector("#requestEmail");
const requestStatusForm = document.querySelector("#requestStatusForm");
const requestStatusMessage = document.querySelector("#requestStatusMessage");
const requestStatusTable = document.querySelector("#requestStatusTable");
const procedureType = document.querySelector("#procedureType");
const procedureOtherField = document.querySelector("#procedureOtherField");
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

let activeRelationMode = "all";
let activeCourseCode = requestsData.courses.find((course) => course.capacity.sections.length)?.courseCode ||
  requestsData.courses[0].courseCode;
let lastCourseClick = { code: "", time: 0 };

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function courseText(course) {
  return [
    course.legacyCode,
    course.courseCode,
    course.title,
    course.level,
    ...course.prerequisites.map((item) => `${item.courseCode} ${item.title}`),
    ...course.unlocks.map((item) => `${item.courseCode} ${item.title}`),
    ...course.capacity.sections.flatMap((section) => [section.nrc, section.teacher, section.type, section.section])
  ].join(" ");
}

function courseByCode(code) {
  return requestsData.courses.find((course) => course.courseCode === code);
}

function criticalAvailable(course) {
  if (!course.capacity.sections.length) return null;
  return Math.min(...course.capacity.sections.map((section) => section.available));
}

function availabilityState(course) {
  const critical = criticalAvailable(course);
  if (critical === null) return "no-offer";
  return course.capacity.available > 0 ? "available" : "full";
}

function statusLabel(course) {
  const state = availabilityState(course);
  if (state === "no-offer") return "Sin oferta";
  if (state === "full") return "Sin cupos disponibles";
  return `${course.capacity.available} cupos disponibles`;
}

function sheetEndpoint() {
  return typeof STUDENT_REQUESTS_SHEET_ENDPOINT !== "undefined" ? STUDENT_REQUESTS_SHEET_ENDPOINT.trim() : "";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function corequisites(course) {
  return course.corequisites || [];
}

function nextCycleUnlocks(course) {
  return course.unlocks.filter((item) => item.level === course.level + 1);
}

function relationItems(course, mode = activeRelationMode) {
  if (mode === "corequisites") return corequisites(course);
  if (mode === "unlocks") return nextCycleUnlocks(course);
  if (mode === "all") return [...course.prerequisites, ...corequisites(course), ...nextCycleUnlocks(course)];
  return course.prerequisites;
}

function relationLabel(mode = activeRelationMode) {
  const labels = {
    prerequisites: "prerrequisitos",
    corequisites: "correquisitos",
    unlocks: "materias posteriores",
    all: "relaciones"
  };
  return labels[mode] || labels.prerequisites;
}

function selectedCourse() {
  return courseByCode(activeCourseCode) || requestsData.courses[0];
}

function renderControls() {
  requestsMapSelect.innerHTML = requestsData.courses
    .slice()
    .sort((a, b) => a.level - b.level || a.title.localeCompare(b.title, "es"))
    .map((course) => `
      <option value="${course.courseCode}" ${course.courseCode === activeCourseCode ? "selected" : ""}>
        N${course.level} · ${course.courseCode} · ${course.title}
      </option>
    `)
    .join("");

  requestsRelationMode.value = activeRelationMode;
}

function renderRelationList(items, emptyText) {
  if (!items.length) return `<p class="requests-empty-note">${emptyText}</p>`;
  return `
    <div class="requests-relation-list">
      ${items.map((item) => `
        <button type="button" data-course="${item.courseCode}">
          <span>N${item.level || "-"} · ${item.legacyCode || "Sin cod. leg"} · ${item.courseCode}</span>
          <strong>${item.title}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function renderSectionRows(course) {
  if (!course.capacity.sections.length) {
    return `<article class="empty-state">La matriz de inscritos no registra oferta para esta materia.</article>`;
  }

  return `
      <div class="requests-section-table">
        <div class="requests-section-row requests-section-row--head">
        <span>NRC</span><span>Tipo</span><span>Sección</span><span>Docente</span><span>Máx.</span><span>Matric.</span><span>Disponible</span>
      </div>
      ${course.capacity.sections.map((section) => `
        <div class="requests-section-row">
          <span>${section.nrc}</span>
          <span>${section.type}</span>
          <span>${section.section}</span>
          <span>${section.teacher}</span>
          <span>${section.max}</span>
          <span>${section.enrolled}</span>
          <strong>${section.available}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCapacityNotice(course) {
  if (availabilityState(course) === "full") {
    return `
      <div class="requests-capacity-alert">
        <strong>Sin cupos disponibles</strong>
        <span>La asignatura seleccionada registra disponibilidad total 0 en la matriz vigente.</span>
      </div>
    `;
  }

  if (availabilityState(course) === "no-offer") {
    return `
      <div class="requests-capacity-alert requests-capacity-alert--neutral">
        <strong>Sin oferta en la matriz</strong>
        <span>No se encontraron NRC asociados para esta materia en el archivo de inscritos.</span>
      </div>
    `;
  }

  return "";
}

function nrcLabel(section) {
  return `${section.nrc} · ${section.type} · ${section.section} · ${section.teacher} · ${section.available} disponibles`;
}

function renderCourseDetailCard(course) {
  return `
    <div class="requests-detail-head">
      <span>Nivel ${course.level} · ${course.legacyCode || "Sin código leg."} · ${course.courseCode}</span>
      <h2 id="requestsDialogTitle">${course.title}</h2>
      <p>${course.totalHours.toFixed(0)} horas · ${course.credits} créditos · ${statusLabel(course)}</p>
    </div>
    <div class="requests-load-grid">
      <div><strong>${course.acd.toFixed(0)}</strong><span>ACD</span></div>
      <div><strong>${course.ape.toFixed(0)}</strong><span>APE</span></div>
      <div><strong>${course.aa.toFixed(0)}</strong><span>AA</span></div>
      <div><strong>${course.capacity.max}</strong><span>Cupo máx.</span></div>
      <div><strong>${course.capacity.available}</strong><span>Disp. total</span></div>
    </div>
    ${renderCapacityNotice(course)}
    <div class="requests-dialog-action">
      <button type="button" data-open-request-form>Solicitar apertura de cupo</button>
    </div>
    <section class="requests-detail-panel">
      <h3>Cupos por NRC</h3>
      ${renderSectionRows(course)}
    </section>
    <section class="requests-detail-panel">
      <h3>Prerrequisitos directos</h3>
      ${renderRelationList(course.prerequisites, "Esta materia no registra prerrequisitos.")}
    </section>
    <section class="requests-detail-panel">
      <h3>Correquisitos directos</h3>
      ${renderRelationList(corequisites(course), "Esta materia no registra correquisitos en la estructura adjunta.")}
    </section>
    <section class="requests-detail-panel">
      <h3>Materias que siguen en el ciclo siguiente</h3>
      ${renderRelationList(nextCycleUnlocks(course), "No se registran materias dependientes directas en el ciclo siguiente.")}
    </section>
  `;
}

function openCourseDialog(course) {
  if (!requestsCourseDialog || !requestsDialogContent) return;
  requestsDialogContent.innerHTML = renderCourseDetailCard(course);
  requestsCourseDialog.hidden = false;
}

function renderFullMap() {
  const selected = selectedCourse();
  const related = relationItems(selected);
  const prerequisiteCodes = new Set(selected.prerequisites.map((item) => item.courseCode));
  const corequisiteCodes = new Set(corequisites(selected).map((item) => item.courseCode));
  const nextCycleCodes = new Set(nextCycleUnlocks(selected).map((item) => item.courseCode));
  const relatedCodes = new Set(related.map((item) => item.courseCode));
  const levels = [...new Set(requestsData.courses.map((course) => course.level))]
    .filter(Boolean)
    .sort((a, b) => a - b);
  const highlighted = relatedCodes.size + 1;

  requestsMapSummary.innerHTML = `
    <article><strong>${selected.title}</strong><span>N${selected.level} · ${selected.legacyCode || "Sin código leg."} · ${selected.courseCode}</span></article>
    <article><strong>${related.length}</strong><span>elementos vinculados</span></article>
    <article><strong>${highlighted}</strong><span>materias iluminadas</span></article>
  `;

  requestsFullMap.innerHTML = levels.map((level) => {
    const courses = requestsData.courses
      .filter((course) => course.level === level)
      .sort((a, b) => a.title.localeCompare(b.title, "es"));
    return `
      <section class="requests-map-level">
        <div class="requests-map-level__head">
          <span>Nivel ${level}</span>
          <small>${courses.length} asignaturas</small>
        </div>
        <div class="requests-map-courses">
          ${courses.map((course) => {
            const isCurrent = course.courseCode === selected.courseCode;
            const isRelated = relatedCodes.has(course.courseCode);
            const isFull = availabilityState(course) === "full";
            let state = "dimmed";
            if (isCurrent) {
              state = isFull ? "current-full" : "current";
            } else if (isRelated && nextCycleCodes.has(course.courseCode)) {
              state = "next";
            } else if (isRelated && corequisiteCodes.has(course.courseCode)) {
              state = "corequisite";
            } else if (isRelated && prerequisiteCodes.has(course.courseCode)) {
              state = "prerequisite";
            } else if (isRelated) {
              state = "related";
            }
            return `
              <button type="button" class="requests-map-course requests-map-course--${state}" data-course="${course.courseCode}">
                <span>${course.legacyCode || "Sin cod. leg."} · ${course.courseCode}</span>
                <strong>${course.title}</strong>
                <small>${statusLabel(course)}</small>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function updateRequestForm(course = selectedCourse()) {
  if (!capacityRequestForm || !requestSelectedCourse || !requestNrc) return;
  requestSelectedCourse.classList.toggle("requests-selected-course--full", availabilityState(course) === "full");
  requestSelectedCourse.innerHTML = `
    <span>Asignatura seleccionada</span>
    <strong>${course.title}</strong>
    <small>Nivel ${course.level} · ${course.legacyCode || "Sin código leg."} · ${course.courseCode} · ${statusLabel(course)}</small>
  `;

  requestNrc.innerHTML = course.capacity.sections.length
    ? course.capacity.sections.map((section) => `
      <option
        value="${section.nrc}"
        data-type="${section.type}"
        data-section="${section.section}"
        data-teacher="${section.teacher}"
        data-available="${section.available}"
      >
        ${nrcLabel(section)}
      </option>
    `).join("")
    : `<option value="">Sin NRC en matriz</option>`;

  capacityRequestForm.elements.courseTitle.value = course.title;
  capacityRequestForm.elements.courseCode.value = course.courseCode;
  capacityRequestForm.elements.legacyCode.value = course.legacyCode || "";
  capacityRequestForm.elements.level.value = course.level;
  capacityRequestForm.elements.period.value = requestsData.summary.period;
  if (requestFormStatus) {
    requestFormStatus.textContent = availabilityState(course) === "full"
      ? "Esta asignatura no registra cupos disponibles; puedes enviar la solicitud."
      : "";
  }
}

function updateProcedureOtherState() {
  if (!procedureType || !procedureOtherField) return;
  const input = procedureOtherField.querySelector("input");
  const isOther = procedureType.value === "Otro";
  procedureOtherField.hidden = !isOther;
  if (input) {
    input.required = isOther;
    if (!isOther) input.value = "";
  }
}

function completeInstitutionalEmail() {
  if (!requestEmail) return;
  const value = requestEmail.value.trim();
  if (!value || value === "@ucuenca.edu.ec" || value.includes("@")) return;
  requestEmail.value = `${value}@ucuenca.edu.ec`;
}

async function formPayload(form) {
  const data = new FormData(form);
  const selectedOption = requestNrc?.selectedOptions?.[0];
  const attachment = form.elements.curriculumProgressFile?.files?.[0];

  if (selectedOption) {
    data.set("nrcType", selectedOption.dataset.type || "");
    data.set("nrcSection", selectedOption.dataset.section || "");
    data.set("nrcTeacher", selectedOption.dataset.teacher || "");
    data.set("nrcAvailable", selectedOption.dataset.available || "");
  }

  if (attachment) {
    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      throw new Error("attachment-too-large");
    }
    data.set("attachmentName", attachment.name);
    data.set("attachmentMimeType", attachment.type || "application/octet-stream");
    data.set("attachmentBase64", await fileToBase64(attachment));
    data.delete("curriculumProgressFile");
  }

  data.set("studentId", data.get("studentCode") || "");
  data.set("source", "Industrial Hub");
  return data;
}

function loadStatusRecords(query) {
  const endpoint = sheetEndpoint();
  if (!endpoint) return Promise.reject(new Error("missing-endpoint"));

  return new Promise((resolve, reject) => {
    const callbackName = `studentRequestsStatus_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const url = new URL(endpoint);
    url.searchParams.set("action", "status");
    url.searchParams.set("query", query);
    url.searchParams.set("callback", callbackName);

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload.records || []);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("status-load-error"));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
}

function renderStatusTable(records) {
  if (!requestStatusTable) return;
  if (!records.length) {
    requestStatusTable.innerHTML = `<article class="empty-state">No se encontraron solicitudes con ese dato de consulta.</article>`;
    return;
  }

  requestStatusTable.innerHTML = `
    <div class="requests-section-table requests-section-table--status">
      <div class="requests-section-row requests-section-row--head">
        <span>Fecha</span><span>Asignatura</span><span>NRC</span><span>Docente</span><span>Solicitud</span><span>Secretaría</span>
      </div>
      ${records.map((record) => `
        <article class="requests-section-row">
          <span>${escapeHtml(record.fecha)}</span>
          <span>${escapeHtml(record.codigo)} · ${escapeHtml(record.asignatura)}</span>
          <span>${escapeHtml(record.nrc)}</span>
          <span>${escapeHtml(record.docente)}</span>
          <strong>${escapeHtml(record.estadoSolicitud)}</strong>
          <strong>${escapeHtml(record.estadoSecretaria)}</strong>
        </article>
      `).join("")}
    </div>
  `;
}

function render() {
  renderControls();
  renderFullMap();
  updateRequestForm();
}

requestsMapSelect.addEventListener("change", (event) => {
  activeCourseCode = event.target.value;
  render();
});

requestsRelationMode.addEventListener("change", (event) => {
  activeRelationMode = event.target.value;
  render();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-dialog]")) {
    if (requestsCourseDialog) requestsCourseDialog.hidden = true;
    return;
  }

  if (event.target.closest("[data-open-request-form]")) {
    if (requestsCourseDialog) requestsCourseDialog.hidden = true;
    document.querySelector("#formulario-cupo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const courseButton = event.target.closest("[data-course]");
  if (!courseButton) return;
  event.preventDefault();
  const scrollPosition = { x: window.scrollX, y: window.scrollY };
  const nextCode = courseButton.dataset.course;
  const now = Date.now();
  const isDoubleClick = lastCourseClick.code === nextCode && now - lastCourseClick.time < 360;
  lastCourseClick = { code: nextCode, time: now };
  activeCourseCode = nextCode;
  render();
  window.scrollTo(scrollPosition.x, scrollPosition.y);
  if (courseButton.closest(".requests-dialog")) {
    requestsDialogContent.innerHTML = renderCourseDetailCard(selectedCourse());
    window.scrollTo(scrollPosition.x, scrollPosition.y);
  }
  if (isDoubleClick) {
    lastCourseClick = { code: "", time: 0 };
    openCourseDialog(selectedCourse());
  }
  requestAnimationFrame(() => window.scrollTo(scrollPosition.x, scrollPosition.y));
  setTimeout(() => window.scrollTo(scrollPosition.x, scrollPosition.y), 0);
  setTimeout(() => window.scrollTo(scrollPosition.x, scrollPosition.y), 80);
});

requestsCourseDialog?.addEventListener("click", (event) => {
  if (event.target === requestsCourseDialog) {
    requestsCourseDialog.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && requestsCourseDialog && !requestsCourseDialog.hidden) {
    requestsCourseDialog.hidden = true;
  }
});

capacityRequestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requestFormStatus) return;

  const endpoint = sheetEndpoint();
  if (!endpoint) {
    requestFormStatus.textContent = "Conexión pendiente: agrega la URL del Apps Script en student-requests-config.js.";
    requestFormStatus.dataset.state = "warning";
    return;
  }

  requestFormStatus.textContent = "Enviando solicitud...";
  requestFormStatus.dataset.state = "sending";

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: await formPayload(capacityRequestForm)
    });
    capacityRequestForm.reset();
    updateProcedureOtherState();
    updateRequestForm();
    requestFormStatus.textContent = "Solicitud enviada. Revisa la hoja de Google para confirmar el registro.";
    requestFormStatus.dataset.state = "success";
  } catch (error) {
    requestFormStatus.textContent = error.message === "attachment-too-large"
      ? "El anexo supera 5 MB. Comprime el archivo e intenta nuevamente."
      : "No se pudo enviar la solicitud. Revisa la conexión con Google Sheets.";
    requestFormStatus.dataset.state = "error";
  }
});

procedureType?.addEventListener("change", updateProcedureOtherState);

requestEmail?.addEventListener("focus", () => {
  if (requestEmail.value === "@ucuenca.edu.ec") {
    requestEmail.setSelectionRange(0, 0);
  }
});

requestEmail?.addEventListener("blur", completeInstitutionalEmail);

requestStatusForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requestStatusMessage || !requestStatusTable) return;

  const query = new FormData(requestStatusForm).get("query");
  if (!sheetEndpoint()) {
    requestStatusMessage.textContent = "Conexión pendiente: agrega la URL del Apps Script en student-requests-config.js.";
    requestStatusMessage.dataset.state = "warning";
    requestStatusTable.innerHTML = "";
    return;
  }

  requestStatusMessage.textContent = "Consultando estado...";
  requestStatusMessage.dataset.state = "sending";
  requestStatusTable.innerHTML = "";

  try {
    const records = await loadStatusRecords(query);
    renderStatusTable(records);
    requestStatusMessage.textContent = records.length
      ? `${records.length} solicitud(es) encontrada(s).`
      : "No hay solicitudes registradas con ese dato.";
    requestStatusMessage.dataset.state = records.length ? "success" : "warning";
  } catch (error) {
    requestStatusMessage.textContent = "No se pudo consultar el estado. Revisa la conexión con Google Sheets.";
    requestStatusMessage.dataset.state = "error";
  }
});

updateProcedureOtherState();
render();
