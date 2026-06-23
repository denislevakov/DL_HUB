const initialData = {
  minimum: 325000,
  income: 400000,
  capitalLow: 12500000,
  capitalHigh: 14000000,
  goal: 100000000
};

const sectionCopy = {
  overview: {
    name: "Обзор",
    title: "Где я сейчас",
    subtitle: "Снимок капитала, прожиточного минимума и пространства для свободы. Всё пересчитывается автоматически."
  },
  assets: {
    name: "Активы",
    title: "Что уже работает",
    subtitle: "Текущие активы, денежные резервы и капитал, который можно направлять в стратегические решения."
  },
  targets: {
    name: "Целевые активы",
    title: "Что строю дальше",
    subtitle: "Крупные покупки и активы идентичности, которые задают направление на период 37–40."
  },
  cashflow: {
    name: "Доход и расходы",
    title: "Как движутся деньги",
    subtitle: "Доход, минимум, комфортный коридор и свободный остаток после обязательных расходов."
  },
  map: {
    name: "Карта жизни",
    title: "Стратегическая карта",
    subtitle: "Периоды, цели, ограничения и решения, которые связывают капитал с качеством жизни."
  },
  freedom: {
    name: "Свобода",
    title: "Сколько свободы уже есть",
    subtitle: "Запас прочности, независимость от обязательных расходов и траектория к капиталу свободы."
  }
};

const scenarioIncomes = [400000, 500000, 1000000, 2000000];
const navButtons = document.querySelectorAll(".nav-item");
const scenarioGrid = document.querySelector("#scenarioGrid");
const incomeInput = document.querySelector("#incomeInput");
const resetButton = document.querySelector("#resetData");
const chart = document.querySelector("#freedomChart");
const ctx = chart.getContext("2d");

let data = { ...initialData };

function formatRub(value, compact = false) {
  if (compact && value >= 1000000) {
    const millions = value / 1000000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M ₽`;
  }

  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
}

function formatSignedRub(value) {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${formatRub(Math.abs(value))}`;
}

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderMetrics() {
  const average = (data.capitalLow + data.capitalHigh) / 2;
  const progress = Math.min(100, Math.round((average / data.goal) * 100));
  const ratio = data.income / data.minimum;

  document.querySelector("#capitalRange").textContent = `${(data.capitalLow / 1000000).toFixed(1)}–${Math.round(data.capitalHigh / 1000000)} млн ₽`;
  document.querySelector("#capitalAverage").textContent = `${(average / 1000000).toFixed(1)} млн ₽`;
  document.querySelector("#freedomPercent").textContent = `${progress}%`;
  document.querySelector("#progressBar").style.width = `${progress}%`;
  document.querySelector("#capitalGoal").textContent = formatRub(data.goal);
  document.querySelector("#monthlyMinimum").textContent = formatRub(data.minimum);
  document.querySelector("#minimumIncome").textContent = formatRub(data.income);
  document.querySelector("#ratioIncome").textContent = formatRub(data.income);
  document.querySelector("#safetyRatio").textContent = `${ratio.toFixed(1)}×`;
  document.querySelector("#incomeReadout").textContent = formatRub(data.income);
}

function renderScenarios() {
  scenarioGrid.innerHTML = "";

  scenarioIncomes.forEach((income) => {
    const free = income - data.minimum;
    const yearly = free * 12;
    const coverage = income / data.minimum;
    const card = document.createElement("article");
    card.className = "scenario-card";
    card.innerHTML = `
      <span>${formatRub(income)} / мес</span>
      <strong>${formatSignedRub(free)}</strong>
      <small>${formatRub(yearly)} в год · покрытие ${coverage.toFixed(1)}×</small>
    `;
    scenarioGrid.append(card);
  });
}

function drawChart() {
  const width = chart.width;
  const height = chart.height;
  const padding = 28;
  const colors = {
    card: cssColor("--card"),
    border: cssColor("--border"),
    primary: cssColor("--chart-1"),
    marker: cssColor("--chart-2"),
    muted: cssColor("--muted-foreground")
  };
  const average = (data.capitalLow + data.capitalHigh) / 2;
  const yearlyFree = Math.max(0, (data.income - data.minimum) * 12);
  const points = Array.from({ length: 8 }, (_, index) => average + yearlyFree * index * 1.18);
  const max = Math.max(data.goal, ...points);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = colors.card;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + ((width - padding * 2) / (points.length - 1)) * index;
    const y = height - padding - (point / max) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.fillStyle = colors.marker;
  points.forEach((point, index) => {
    const x = padding + ((width - padding * 2) / (points.length - 1)) * index;
    const y = height - padding - (point / max) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = colors.muted;
  ctx.font = "18px Inter, system-ui, sans-serif";
  ctx.fillText("сейчас", padding, height - 8);
  ctx.fillText("горизонт", width - padding - 82, height - 8);
}

function updateSection(section) {
  const copy = sectionCopy[section];
  document.querySelector("#currentSectionName").textContent = copy.name;
  document.querySelector("#sectionTitle").textContent = copy.title;
  document.querySelector("#sectionSubtitle").textContent = copy.subtitle;

  navButtons.forEach((button) => {
    const isActive = button.dataset.section === section;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function render() {
  renderMetrics();
  renderScenarios();
  drawChart();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => updateSection(button.dataset.section));
});

incomeInput.addEventListener("input", (event) => {
  data.income = Number(event.target.value);
  render();
});

resetButton.addEventListener("click", () => {
  data = { ...initialData };
  incomeInput.value = data.income;
  updateSection("overview");
  render();
});

window.addEventListener("resize", drawChart);

render();
