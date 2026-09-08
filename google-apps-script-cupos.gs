const SPREADSHEET_ID = "1VyIlRF-H4Fd_Cw4KyhDcwANKQIstnUysRrNCjO0Hg14";
const SHEET_NAME = "Solicitudes de cupo";
const DRIVE_FOLDER_ID = "1kKIxzt3U6oZSM5T98Ut6txgetUHGbula";
const HEADERS = [
  "Fecha",
  "Nombres y apellidos",
  "Código del estudiante",
  "Cédula de identidad",
  "Cédula o código estudiantil",
  "Correo institucional",
  "Teléfono",
  "Ciclo que cursa",
  "Tipo de trámite",
  "Detalle otro trámite",
  "Tipo de matrícula",
  "Ubicación curricular",
  "Asignatura",
  "Código académico",
  "Código legado",
  "Nivel asignatura",
  "NRC",
  "Tipo",
  "Sección",
  "Docente",
  "Cupos disponibles",
  "Periodo",
  "Justificación",
  "Anexo avance de malla",
  "Estado del anexo",
  "Estado de la solicitud",
  "Estado del trámite en secretaría",
  "Origen"
];

function doPost(event) {
  const sheet = getOrCreateSheet_();
  const data = event.parameter || {};
  const attachment = saveAttachment_(data);

  ensureHeaders_(sheet);
  appendRecord_(sheet, {
    "Fecha": new Date(),
    "Nombres y apellidos": data.studentName || "",
    "Código del estudiante": data.studentCode || data.studentId || "",
    "Cédula de identidad": data.nationalId || "",
    "Cédula o código estudiantil": data.studentCode || data.studentId || data.nationalId || "",
    "Correo institucional": data.email || "",
    "Teléfono": data.phone || "",
    "Ciclo que cursa": data.studentCycle || "",
    "Tipo de trámite": data.procedureType || "",
    "Detalle otro trámite": data.procedureOther || "",
    "Tipo de matrícula": data.enrollmentAttempt || "",
    "Ubicación curricular": data.coursePlacement || "",
    "Asignatura": data.courseTitle || "",
    "Código académico": data.courseCode || "",
    "Código legado": data.legacyCode || "",
    "Nivel asignatura": data.level || "",
    "NRC": data.nrc || "",
    "Tipo": data.nrcType || "",
    "Sección": data.nrcSection || "",
    "Docente": data.nrcTeacher || "",
    "Cupos disponibles": data.nrcAvailable || "",
    "Periodo": data.period || "",
    "Justificación": data.reason || "",
    "Anexo avance de malla": attachment.url,
    "Estado del anexo": attachment.status,
    "Estado de la solicitud": "Recibida",
    "Estado del trámite en secretaría": "Pendiente",
    "Origen": data.source || "Industrial Hub"
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(event) {
  const params = event.parameter || {};
  const payload = params.action === "status"
    ? getStatusPayload_(params.query || "")
    : { ok: true, service: "Solicitudes de cupo" };
  const body = JSON.stringify(payload);

  if (params.callback) {
    return ContentService
      .createTextOutput(`${params.callback}(${body})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missingHeaders = HEADERS.filter((header) => currentHeaders.indexOf(header) === -1);
  if (!missingHeaders.length) return;

  sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
}

function appendRecord_(sheet, record) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((header) => record[header] || ""));
}

function getStatusPayload_(query) {
  const normalizedQuery = normalize_(query);
  if (!normalizedQuery) return { ok: true, records: [] };

  const sheet = getOrCreateSheet_();
  ensureHeaders_(sheet);

  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const records = values
    .map((row) => rowToRecord_(headers, row))
    .filter((record) => {
      const studentId = normalize_(record["Cédula o código estudiantil"]);
      const studentCode = normalize_(record["Código del estudiante"]);
      const nationalId = normalize_(record["Cédula de identidad"]);
      const email = normalize_(record["Correo institucional"]);
      return studentId === normalizedQuery || studentCode === normalizedQuery || nationalId === normalizedQuery || email === normalizedQuery;
    })
    .map((record) => ({
      fecha: formatDate_(record["Fecha"]),
      asignatura: record["Asignatura"] || "",
      codigo: record["Código académico"] || "",
      nrc: record["NRC"] || "",
      docente: record["Docente"] || "",
      estadoSolicitud: record["Estado de la solicitud"] || "Recibida",
      estadoSecretaria: record["Estado del trámite en secretaría"] || "Pendiente"
    }));

  return { ok: true, records: records };
}

function rowToRecord_(headers, row) {
  return headers.reduce((record, header, index) => {
    record[header] = row[index];
    return record;
  }, {});
}

function normalize_(value) {
  return String(value || "").trim().toLowerCase();
}

function formatDate_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) !== "[object Date]") return String(value);
  return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
}

function saveAttachment_(data) {
  if (!data.attachmentBase64) {
    return { url: "", status: "Sin anexo recibido" };
  }

  try {
    const bytes = Utilities.base64Decode(data.attachmentBase64);
    const blob = Utilities.newBlob(
      bytes,
      data.attachmentMimeType || "application/octet-stream",
      buildAttachmentName_(data)
    );
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);
    return { url: file.getUrl(), status: "Anexo guardado en Drive" };
  } catch (error) {
    return { url: "", status: `Error al guardar anexo: ${error.message}` };
  }
}

function buildAttachmentName_(data) {
  const studentCode = sanitizeFilePart_(data.studentCode || data.studentId || "sin-codigo");
  const courseCode = sanitizeFilePart_(data.courseCode || "sin-asignatura");
  const originalName = sanitizeFilePart_(data.attachmentName || "avance-malla.pdf");
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
  return `${studentCode}_${courseCode}_${stamp}_${originalName}`;
}

function sanitizeFilePart_(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|#%{}~&]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 90);
}
