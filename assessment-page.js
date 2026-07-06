const semesterSelect = document.querySelector("#semesterSelect");
const soSelect = document.querySelector("#soSelect");
const piSelect = document.querySelector("#piSelect");
const cycleSelect = document.querySelector("#cycleSelect");
const selectedCode = document.querySelector("#selectedCode");
const selectedTitle = document.querySelector("#selectedTitle");
const selectedDefinition = document.querySelector("#selectedDefinition");
const selectedAchievement = document.querySelector("#selectedAchievement");
const selectedAverage = document.querySelector("#selectedAverage");
const selectedTotal = document.querySelector("#selectedTotal");
const selectedStudents = document.querySelector("#selectedStudents");
const levelBreakdown = document.querySelector("#levelBreakdown");
const piCards = document.querySelector("#piCards");
const subjectsTitle = document.querySelector("#subjectsTitle");
const subjectGrid = document.querySelector("#subjectGrid");
const cycleTitle = document.querySelector("#cycleTitle");
const cycleGrid = document.querySelector("#cycleGrid");
const bestSubjects = document.querySelector("#bestSubjects");
const improveSubjects = document.querySelector("#improveSubjects");
const areaRankingList = document.querySelector("#areaRankingList");
const comparisonTable = document.querySelector("#comparisonTable");
const semesterLineChart = document.querySelector("#semesterLineChart");
const cycleLineChart = document.querySelector("#cycleLineChart");
const soScoreBarChart = document.querySelector("#soScoreBarChart");

let activeSemester = assessmentSemesters[0].id;
let activeSo = assessmentSemesters[0].outcomes[0].id;
let activePi = "all";
let activeCycle = "all";

function formatPercent(value) {
  if (value === null || value === undefined) return "N/D";
  return `${Math.round(value * 100)}%`;
}

function formatDelta(value) {
  if (value === null || value === undefined) return "N/D";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value * 100)} pts`;
}

function byWorstScore(a, b) {
  return a.averageLevel - b.averageLevel || a.achievementRate - b.achievementRate || b.total - a.total;
}

function getSemester() {
  return assessmentSemesters.find((semester) => semester.id === activeSemester) || assessmentSemesters[0];
}

function getOutcome() {
  const semester = getSemester();
  return semester.outcomes.find((outcome) => outcome.id === activeSo) || semester.outcomes[0];
}

function getSource() {
  const outcome = getOutcome();
  const pi = activePi === "all" ? null : outcome.pis.find((item) => item.piNo === activePi);
  const cycleOutcome = activeCycle === "all" || pi ? null : getCycleOutcome(outcome.code, activeCycle);
  return { outcome, source: cycleOutcome || pi || outcome, pi, cycleOutcome };
}

function getCycleOutcome(code, cycleValue) {
  const insight = getCycleInsight();
  const cycle = insight?.cycles.find((item) => item.cycle === cycleValue);
  return cycle?.outcomes.find((item) => item.code === code) || null;
}

function renderControls() {
  const semester = getSemester();
  const outcome = getOutcome();

  semesterSelect.innerHTML = assessmentSemesters
    .map(
      (item) => `<option value="${item.id}" ${item.id === semester.id ? "selected" : ""}>${item.label}</option>`
    )
    .join("");

  soSelect.innerHTML = semester.outcomes
    .map(
      (item) => `<option value="${item.id}" ${item.id === outcome.id ? "selected" : ""}>${item.code}</option>`
    )
    .join("");

  piSelect.innerHTML = [
    `<option value="all" ${activePi === "all" ? "selected" : ""}>Todos los PI</option>`,
    ...outcome.pis.map(
      (pi) => `<option value="${pi.piNo}" ${activePi === pi.piNo ? "selected" : ""}>${pi.piNo}</option>`
    )
  ].join("");

  const insight = getCycleInsight();
  const cycles = insight?.cycles.filter((cycle) => cycle.outcomes.some((item) => item.code === outcome.code)) || [];
  cycleSelect.innerHTML = [
    `<option value="all" ${activeCycle === "all" ? "selected" : ""}>Todos los ciclos</option>`,
    ...cycles.map(
      (cycle) => `<option value="${cycle.cycle}" ${activeCycle === cycle.cycle ? "selected" : ""}>Ciclo ${cycle.cycle}</option>`
    )
  ].join("");
}

function renderDashboard() {
  const semester = getSemester();
  const { outcome, source, pi, cycleOutcome } = getSource();
  const visibleLevels = source.levels;

  selectedCode.textContent = pi ? `${outcome.code} - ${pi.piNo}` : cycleOutcome ? `${outcome.code} - ciclo ${activeCycle}` : outcome.code;
  selectedTitle.textContent = pi ? "Indicador de desempe?o" : semester.label;
  selectedDefinition.textContent = pi ? pi.description : outcome.definition;
  selectedAchievement.textContent = formatPercent(source.achievementRate);
  selectedAverage.textContent = source.averageLevel.toFixed(2);
  selectedTotal.textContent = source.total;
  selectedStudents.textContent = source.students;

  levelBreakdown.innerHTML = visibleLevels
    .map(
      (item) => `
        <article class="assessment-level-card">
          <div>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </div>
          <div class="assessment-bar" aria-label="${item.label} ${formatPercent(item.percent)}">
            <span style="width: ${Math.round(item.percent * 100)}%"></span>
          </div>
          <small>${formatPercent(item.percent)}</small>
        </article>
      `
    )
    .join("");
}
function renderPiCards() {
  const { outcome } = getSource();

  piCards.innerHTML = outcome.pis
    .map(
      (pi) => `
        <button class="assessment-pi-item" type="button" data-pi="${pi.piNo}" aria-pressed="${activePi === pi.piNo}">
          <span>${pi.piNo}</span>
          <strong>${formatPercent(pi.achievementRate)}</strong>
          <p>${pi.description}</p>
          <small>Ponderación ${pi.weight} · Nivel ${pi.averageLevel.toFixed(2)} · ${pi.total} valoraciones</small>
        </button>
      `
    )
    .join("");
}

function renderSubjects() {
  const semester = getSemester();
  const outcome = getOutcome();
  subjectsTitle.textContent = `${outcome.code} · ${semester.label}`;

  if (!outcome.subjects.length) {
    subjectGrid.innerHTML = `
      <article class="subject-empty">
        Este archivo no incluye asignaturas para ${semester.label}. El dato está disponible en el semestre septiembre 2025 - febrero 2026.
      </article>
    `;
    return;
  }

  subjectGrid.innerHTML = outcome.subjects
    .map((subject) => `<article class="subject-chip">${subject}</article>`)
    .join("");
}

function getCycleInsight() {
  return assessmentCycleInsights.find((item) => item.semesterId === activeSemester);
}

function getAreaRanking() {
  return assessmentAreaRankings.find((item) => item.semesterId === activeSemester);
}

function renderCycles() {
  const semester = getSemester();
  const outcome = getOutcome();
  const insight = getCycleInsight();
  cycleTitle.textContent = `${outcome.code} por ciclo · ${semester.label}`;

  if (!insight || !insight.cycles.length) {
    cycleGrid.innerHTML = `
      <article class="subject-empty">
        Este semestre no incluye datos de ciclo en el archivo fuente.
      </article>
    `;
    return;
  }

  const cards = insight.cycles
    .map((cycle) => {
      const cycleOutcome = cycle.outcomes.find((item) => item.code === outcome.code);
      if (!cycleOutcome) return "";
      const subjects = cycleOutcome.subjects.slice(0, 4).join(", ");

      return `
        <article class="cycle-card">
          <span>Ciclo ${cycle.cycle}</span>
          <strong>${formatPercent(cycleOutcome.achievementRate)}</strong>
          <div class="assessment-bar">
            <span style="width: ${Math.round(cycleOutcome.achievementRate * 100)}%"></span>
          </div>
          <p>Nivel ${cycleOutcome.averageLevel.toFixed(2)} · ${cycleOutcome.total} valoraciones</p>
          <small>${subjects || "Sin asignaturas registradas"}</small>
        </article>
      `;
    })
    .filter(Boolean);

  cycleGrid.innerHTML = cards.length
    ? cards.join("")
    : `<article class="subject-empty">No hay registros de ${outcome.code} en los ciclos de este semestre.</article>`;
}

function renderSubjectRankingCards(container, items) {
  if (!items.length) {
    container.innerHTML = `<article class="subject-empty">No hay datos de asignaturas para este semestre.</article>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item, index) => `
        <article class="ranking-card ranking-card--expandable">
          <button type="button" class="ranking-card__trigger" aria-expanded="false">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${item.subject}</strong>
              <p>${item.area} · ${item.outcomes.join(", ")} · ciclo ${item.cycles.join(", ")}</p>
            </div>
            <em>${formatPercent(item.achievementRate)}</em>
          </button>
          <div class="ranking-card__details" hidden>
            <div class="ranking-detail-kpis">
              <span><strong>${item.total}</strong> valoraciones</span>
              <span><strong>${item.averageLevel.toFixed(2)}</strong> nivel promedio</span>
              <span><strong>${formatPercent(item.achievementRate)}</strong> logro</span>
            </div>
            <div class="ranking-level-list">
              ${item.levels
                .map(
                  (level) => `
                    <div>
                      <span>${level.label}</span>
                      <div class="assessment-bar"><span style="width: ${Math.round(level.percent * 100)}%"></span></div>
                      <strong>${level.value} · ${formatPercent(level.percent)}</strong>
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="ranking-pi-list">
              ${item.pis
                .map(
                  (pi) => `
                    <span>${pi.piNo}: ${formatPercent(pi.achievementRate)} · nivel ${pi.averageLevel.toFixed(2)}</span>
                  `
                )
                .join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderRankings() {
  const ranking = getAreaRanking();

  if (!ranking || !ranking.areas.length) {
    renderSubjectRankingCards(bestSubjects, []);
    renderSubjectRankingCards(improveSubjects, []);
    areaRankingList.innerHTML = "";
    return;
  }

  renderSubjectRankingCards(bestSubjects, ranking.overallBest);
  renderSubjectRankingCards(improveSubjects, [...ranking.overallImprove].sort(byWorstScore));

  areaRankingList.innerHTML = ranking.areas
    .map(
      (area) => `
        <article class="area-ranking-card">
          <h3>${area.area}</h3>
          <div>
            <strong>Top</strong>
            <p>${area.bestSubjects.slice(0, 3).map((item) => `${item.subject} (${formatPercent(item.achievementRate)})`).join(" ? ")}</p>
          </div>
          <div>
            <strong>A mejorar</strong>
            <p>${[...area.improveSubjects].sort(byWorstScore).slice(0, 3).map((item) => `${item.subject} (${item.averageLevel.toFixed(2)} nivel ? ${formatPercent(item.achievementRate)})`).join(" ? ")}</p>
          </div>
        </article>
      `
    )
    .join("");
}
function renderComparison() {
  const semesterHeads = assessmentSemesters.map((semester) => `<span>${semester.label}</span>`).join("");

  comparisonTable.innerHTML = `
    <div class="comparison-head comparison-head--historic">
      <span>SO</span>
      ${semesterHeads}
      <span>Variaci?n total</span>
      <span>Asignaturas ?ltimo periodo</span>
    </div>
    ${assessmentComparison
      .map((row) => {
        const measured = row.semesters.filter((item) => !item.missing);
        const lastMeasured = measured[measured.length - 1];
        const subjects = lastMeasured?.subjects?.length ? lastMeasured.subjects.join(", ") : "No disponible";
        const semesterCells = row.semesters
          .map((item) => {
            if (item.missing) return `<span>No medido</span>`;
            return `<span>${formatPercent(item.achievementRate)} logro ? nivel ${item.averageLevel.toFixed(2)}</span>`;
          })
          .join("");

        return `
          <article class="comparison-row comparison-row--historic">
            <strong>${row.code}</strong>
            ${semesterCells}
            <span class="${row.deltaAchievement !== null && row.deltaAchievement < 0 ? "is-negative" : "is-positive"}">
              ${formatDelta(row.deltaAchievement)}
            </span>
            <p>${subjects}</p>
          </article>
        `;
      })
      .join("")}
  `;
}

const soPalette = ["#005EB8", "#C8102E", "#F2A900", "#4B5563", "#7C3AED", "#00A3E0", "#8A1538"];

function chartPoint(value, min, max, height, padding) {
  const range = max - min || 1;
  return padding + (1 - (value - min) / range) * (height - padding * 2);
}

function renderSemesterLineChart() {
  const width = 760;
  const height = 340;
  const padding = 46;
  const codes = assessmentComparison.map((item) => item.code);
  const labels = assessmentSemesters.map((item) => item.label.replace(" - ", " "));
  const values = assessmentComparison.flatMap((row) =>
    row.semesters.filter((item) => !item.missing).map((item) => item.achievementRate)
  );
  const min = Math.max(0, Math.min(...values) - 0.08);
  const max = Math.min(1, Math.max(...values) + 0.08);
  const xFor = (index) => padding + index * ((width - padding * 2) / Math.max(1, labels.length - 1));

  const lines = assessmentComparison
    .map((row, rowIndex) => {
      const points = row.semesters
        .map((item, index) => {
          if (item.missing) return null;
          return `${xFor(index)},${chartPoint(item.achievementRate, min, max, height, padding)}`;
        })
        .filter(Boolean);
      if (points.length < 2) return "";
      const color = soPalette[rowIndex % soPalette.length];
      return `
        <polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="3" />
        ${points
          .map((point) => {
            const [x, y] = point.split(",");
            return `<circle cx="${x}" cy="${y}" r="4" fill="${color}" />`;
          })
          .join("")}
      `;
    })
    .join("");

  const legend = codes
    .map(
      (code, index) => `
        <span><i style="background:${soPalette[index % soPalette.length]}"></i>${code}</span>
      `
    )
    .join("");

  semesterLineChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Histórico por semestre de cada SO">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" />
      ${[0, 0.25, 0.5, 0.75, 1]
        .map((tick) => {
          const y = chartPoint(tick, min, max, height, padding);
          return `<g><line class="grid" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" /><text x="10" y="${y + 4}">${Math.round(tick * 100)}%</text></g>`;
        })
        .join("")}
      ${labels
        .map((label, index) => `<text x="${xFor(index) - 48}" y="${height - 12}">${label}</text>`)
        .join("")}
      ${lines}
    </svg>
    <div class="chart-legend">${legend}</div>
  `;
}

function renderCycleLineChart() {
  const insight = getCycleInsight();
  if (!insight?.cycles.length) {
    cycleLineChart.innerHTML = `<p class="chart-empty">No hay ciclos disponibles para este semestre.</p>`;
    return;
  }

  const width = 760;
  const height = 340;
  const padding = 46;
  const cycles = insight.cycles;
  const codes = getSemester().outcomes.map((item) => item.code);
  const allValues = cycles.flatMap((cycle) => cycle.outcomes.map((outcome) => outcome.achievementRate));
  const min = Math.max(0, Math.min(...allValues) - 0.08);
  const max = Math.min(1, Math.max(...allValues) + 0.08);
  const xFor = (index) => padding + index * ((width - padding * 2) / Math.max(1, cycles.length - 1));

  const lines = codes
    .map((code, codeIndex) => {
      const points = cycles
        .map((cycle, index) => {
          const outcome = cycle.outcomes.find((item) => item.code === code);
          if (!outcome) return null;
          return `${xFor(index)},${chartPoint(outcome.achievementRate, min, max, height, padding)}`;
        })
        .filter(Boolean);
      if (points.length < 2) return "";
      const color = soPalette[codeIndex % soPalette.length];
      return `<polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="3" />`;
    })
    .join("");

  const legend = codes
    .map(
      (code, index) => `
        <span><i style="background:${soPalette[index % soPalette.length]}"></i>${code}</span>
      `
    )
    .join("");

  cycleLineChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Logro de cada SO por ciclo">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" />
      ${[0, 0.25, 0.5, 0.75, 1]
        .map((tick) => {
          const y = chartPoint(tick, min, max, height, padding);
          return `<g><line class="grid" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" /><text x="10" y="${y + 4}">${Math.round(tick * 100)}%</text></g>`;
        })
        .join("")}
      ${cycles
        .map((cycle, index) => `<text x="${xFor(index) - 12}" y="${height - 12}">${cycle.cycle}</text>`)
        .join("")}
      ${lines}
    </svg>
    <div class="chart-legend">${legend}</div>
  `;
}

function renderSoScoreBarChart() {
  if (!soScoreBarChart) return;

  const semester = getSemester();
  const outcomes = semester.outcomes;
  const maxScore = Math.max(...outcomes.map((item) => item.achievementRate), 1);
  const sorted = [...outcomes].sort((a, b) => a.achievementRate - b.achievementRate);
  const weakest = sorted[0];

  soScoreBarChart.innerHTML = `
    <div class="so-score-note">
      <strong>Prioridad sugerida: ${weakest.code}</strong>
      <span>${formatPercent(weakest.achievementRate)} de logro ? nivel ${weakest.averageLevel.toFixed(2)}</span>
    </div>
    <div class="so-score-bars">
      ${outcomes
        .map((outcome) => {
          const width = Math.max(4, Math.round((outcome.achievementRate / maxScore) * 100));
          const tone = outcome.achievementRate < 0.6 ? "is-low" : outcome.achievementRate < 0.8 ? "is-mid" : "is-high";
          return `
            <article class="so-score-row ${tone}">
              <span>${outcome.code}</span>
              <div class="so-score-track"><i style="width: ${width}%"></i></div>
              <strong>${formatPercent(outcome.achievementRate)}</strong>
              <small>Nivel ${outcome.averageLevel.toFixed(2)} ? ${outcome.total} valoraciones</small>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function render() {
  renderControls();
  renderDashboard();
  renderPiCards();
  renderSubjects();
  renderCycles();
  renderRankings();
  renderComparison();
  renderSemesterLineChart();
  renderCycleLineChart();
  renderSoScoreBarChart();
}

semesterSelect.addEventListener("change", (event) => {
  activeSemester = event.target.value;
  const semester = getSemester();
  if (!semester.outcomes.some((outcome) => outcome.id === activeSo)) {
    activeSo = semester.outcomes[0].id;
  }
  activePi = "all";
  activeCycle = "all";
  render();
});

soSelect.addEventListener("change", (event) => {
  activeSo = event.target.value;
  activePi = "all";
  activeCycle = "all";
  render();
});

piSelect.addEventListener("change", (event) => {
  activePi = event.target.value;
  activeCycle = "all";
  render();
});

cycleSelect.addEventListener("change", (event) => {
  activeCycle = event.target.value;
  activePi = "all";
  render();
});

piCards.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-pi]");
  if (!button) return;

  activePi = button.dataset.pi;
  activeCycle = "all";
  render();
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".ranking-card__trigger");
  if (!trigger) return;

  const details = trigger.closest(".ranking-card")?.querySelector(".ranking-card__details");
  if (!details) return;

  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", String(!isOpen));
  details.hidden = isOpen;
});

render();
