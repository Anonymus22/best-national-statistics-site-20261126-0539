// NusaStat views: hash router and page rendering.
// Routes: #/ overview, #/population, #/economy, #/health-education,
// #/regions, #/methodology. Every page is reached by a link in the nav.

let currentYear = 2024;
let economyMetric = "gdpGrowth";
let provinceSort = { key: "population", dir: -1 };
let provinceQuery = "";

function fmt(value, decimals) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 0
  });
}

function indicatorValue(key, year) {
  return NUSA.indicators[key].values[year];
}

function kpiCard(key, year) {
  const ind = NUSA.indicators[key];
  const value = ind.values[year];
  const prev = ind.values[year - 1];
  const change = prev === undefined ? null : value - prev;
  const changeText = change === null ? "" :
    (change >= 0 ? "+" : "") + fmt(change, key === "gdpPerCapita" ? 0 : 2) +
    (key === "gdpPerCapita" ? " USD" : key === "population" ? "m" : " pts");
  const display = key === "gdpPerCapita" ? "$" + fmt(value) :
    key === "population" ? fmt(value, 1) + "m" :
    fmt(value, 2) + (key === "lifeExpectancy" ? " yrs" : "%");
  return '<article class="kpi">' +
    '<h3>' + ind.label + '</h3>' +
    '<p class="kpi-value">' + display + '</p>' +
    '<p class="kpi-meta">' + ind.unit + ' &middot; ' + year +
    (changeText ? ' &middot; <span class="kpi-change">' + changeText + ' vs ' + (year - 1) + '</span>' : '') +
    '</p><p class="kpi-source">Source: ' + ind.source + '</p></article>';
}

function yearSelector() {
  let options = "";
  NUSA.years.forEach(function (y) {
    options += '<option value="' + y + '"' + (y === currentYear ? ' selected' : '') + '>' + y + '</option>';
  });
  return '<label class="year-pick">Year <select id="year-select" aria-label="Select year">' + options + '</select></label>';
}

function pageHead(title, intro) {
  return '<h1>' + title + '</h1><p class="lede">' + intro + '</p>';
}

function renderOverview() {
  const cards = ["population", "gdpGrowth", "gdpPerCapita", "unemployment", "poverty", "lifeExpectancy"]
    .map(function (k) { return kpiCard(k, currentYear); }).join("");
  return pageHead("Indonesia at a glance",
      "The headline numbers for the world's fourth most populous country, " +
      "from the latest published figures. Pick a year to see the same indicators for earlier years.") +
    '<div class="toolbar">' + yearSelector() +
    '<p class="toolbar-note">All figures: BPS and World Bank, ' + currentYear + ' unless noted.</p></div>' +
    '<section class="kpi-grid" aria-label="Headline indicators">' + cards + '</section>' +
    '<section class="chart-block"><h2>Population, 2019-' + currentYear + '</h2>' +
    '<p class="chart-note">Millions of people. Source: BPS mid-year estimates.</p>' +
    '<canvas id="chart-pop" class="chart" width="560" height="260"></canvas></section>' +
    '<section class="chart-block"><h2>GDP growth, 2019-' + currentYear + '</h2>' +
    '<p class="chart-note">Percent change year on year. Source: BPS national accounts.</p>' +
    '<canvas id="chart-gdp" class="chart" width="560" height="260"></canvas></section>' +
    '<section class="fact-row"><article><h2>Did you know?</h2><p>More than half of Indonesia\'s 281.6 million people ' +
    'live on Java, an island about the size of England. The median age is just 30.</p>' +
    '<p><a href="#/population">Explore the population &rarr;</a></p></article>' +
    '<article><h2>Where the money is</h2><p>Manufacturing is the largest single sector of the economy at 18.7% of GDP, ' +
    'ahead of trade at 12.8% and agriculture at 11.9% (BPS, 2024).</p>' +
    '<p><a href="#/economy">Explore the economy &rarr;</a></p></article></section>';
}

function renderPopulation() {
  return pageHead("Population",
      "281.6 million people in 2024 (BPS), growing by about 0.9% a year. " +
      "The charts below show how the population has grown and who it is made of.") +
    '<div class="toolbar">' + yearSelector() + '</div>' +
    '<section class="kpi-grid">' + kpiCard("population", currentYear) + kpiCard("lifeExpectancy", currentYear) + '</section>' +
    '<section class="chart-block"><h2>Population growth, 2019-2024</h2>' +
    '<p class="chart-note">Millions of people. Source: BPS.</p>' +
    '<canvas id="chart-pop" class="chart" width="560" height="260"></canvas></section>' +
    '<section class="chart-block"><h2>Age structure, 2024</h2>' +
    '<p class="chart-note">Share of the population by age group. Source: BPS projections, 2024.</p>' +
    '<div class="split"><canvas id="chart-age" class="chart chart-square" width="300" height="300"></canvas>' +
    '<ul class="legend">' + NUSA.ageGroups2024.map(function (g, i) {
      const colors = ["#0e6b62", "#e8a33d", "#3aa79a", "#c25e3a", "#7a9e8f"];
      return '<li><span class="swatch" style="background:' + colors[i] + '"></span>' +
        g.group + ' years: <strong>' + g.share + '%</strong></li>';
    }).join("") + '</ul></div>' +
    '<p class="chart-note">Working-age people (15-64) are 68.3% of the population; ' +
    'children under 15 are 24.1% and people 65 and over are 7.6%.</p></section>' +
    '<section class="chart-block"><h2>Key facts</h2><ul class="fact-list">' +
    '<li>Median age: about 30 years (BPS, 2024).</li>' +
    '<li>Annual growth: about 2.5 million people a year since 2019.</li>' +
    '<li>Most populous province: Jawa Barat, 49.9 million (BPS, 2024).</li>' +
    '<li>Least populous province: Papua Pegunungan, about 1.5 million (BPS, 2024).</li></ul></section>';
}

function renderEconomy() {
  const metricOptions = [
    { key: "gdpGrowth", label: "GDP growth (%)" },
    { key: "inflation", label: "Inflation (%)" },
    { key: "gdpPerCapita", label: "GDP per capita (USD)" }
  ];
  const buttons = metricOptions.map(function (m) {
    return '<button type="button" class="metric-btn' + (economyMetric === m.key ? ' active' : '') +
      '" data-metric="' + m.key + '">' + m.label + '</button>';
  }).join("");
  const sectorItems = NUSA.sectors2024.map(function (s) { return { label: s.sector, value: s.share }; });
  return pageHead("Economy",
      "The largest economy in Southeast Asia: GDP of about $1.40 trillion in 2024 (World Bank), " +
      "growing 5.03% in 2024 (BPS). Switch the chart between growth, inflation and income per person.") +
    '<div class="toolbar">' + yearSelector() + '</div>' +
    '<section class="kpi-grid">' + kpiCard("gdpGrowth", currentYear) + kpiCard("gdpPerCapita", currentYear) +
    kpiCard("inflation", currentYear) + '</section>' +
    '<section class="chart-block"><h2 id="economy-chart-title">GDP growth, 2019-2024</h2>' +
    '<div class="metric-switch" role="group" aria-label="Choose metric">' + buttons + '</div>' +
    '<p class="chart-note" id="economy-chart-note">Percent change year on year. Source: BPS national accounts.</p>' +
    '<canvas id="chart-economy" class="chart" width="560" height="260"></canvas></section>' +
    '<section class="chart-block"><h2>What the economy is made of, 2024</h2>' +
    '<p class="chart-note">Share of GDP by sector. Source: BPS national accounts, 2024.</p>' +
    '<canvas id="chart-sectors" class="chart chart-tall" width="560" height="300"></canvas></section>' +
    '<section class="chart-block"><h2>Key facts</h2><ul class="fact-list">' +
    '<li>Nominal GDP 2024: Rp 22,139 trillion, about $1.40 trillion (BPS / World Bank).</li>' +
    '<li>Growth has held near 5% a year since the 2020 contraction of 2.07%.</li>' +
    '<li>Inflation fell to 1.57% in 2024, the lowest in the series shown (BPS).</li>' +
    '<li>Indonesia is the world\'s largest producer of palm oil and a top exporter of coal and nickel.</li></ul></section>';
}

function renderHealthEducation() {
  const rows = NUSA.healthEducation.map(function (h) {
    return '<tr><td>' + h.fact + '</td><td><strong>' + h.value + '</strong></td><td>' + h.year +
      '</td><td>' + h.source + '</td></tr>';
  }).join("");
  return pageHead("Health &amp; Education",
      "People live longer and stay in school longer than a generation ago: " +
      "life expectancy reached 74.2 years in 2024 (BPS), and 96.9% of adults can read and write (BPS, 2023).") +
    '<section class="kpi-grid">' + kpiCard("lifeExpectancy", currentYear) + kpiCard("literacy", currentYear) + '</section>' +
    '<section class="chart-block"><h2>Life expectancy, 2019-2024</h2>' +
    '<p class="chart-note">Years at birth. Source: BPS.</p>' +
    '<canvas id="chart-life" class="chart" width="560" height="260"></canvas></section>' +
    '<section class="chart-block"><h2>Health and education in numbers</h2>' +
    '<table class="data-table"><thead><tr><th>Measure</th><th>Value</th><th>Year</th><th>Source</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></section>' +
    '<section class="chart-block"><h2>What stands out</h2><ul class="fact-list">' +
    '<li>Stunting fell from 37.2% in 2013 to 21.5% in 2023, but still affects one child in five (Ministry of Health).</li>' +
    '<li>Mean years of schooling rose to 9.1 in 2024, up from 8.0 a decade earlier (BPS).</li>' +
    '<li>Infant mortality is 15.7 deaths per 1,000 live births (BPS, 2023).</li></ul></section>';
}

function provinceRows() {
  let list = NUSA.provinces.slice();
  if (provinceQuery) {
    const q = provinceQuery.toLowerCase();
    list = list.filter(function (p) { return p.name.toLowerCase().indexOf(q) !== -1; });
  }
  const key = provinceSort.key;
  list.sort(function (a, b) {
    const diff = key === "name" ? a.name.localeCompare(b.name) : a[key] - b[key];
    return diff * provinceSort.dir;
  });
  if (list.length === 0) {
    return '<tr><td colspan="4">No province matches "' + provinceQuery + '". Clear the search to see all 16 provinces.</td></tr>';
  }
  return list.map(function (p) {
    return '<tr><td>' + p.name + '</td><td>' + fmt(p.population, 2) + '</td><td>' +
      fmt(p.gdpShare, 1) + '%</td><td>' + fmt(p.unemployment, 2) + '%</td></tr>';
  }).join("");
}

function sortArrow(key) {
  if (provinceSort.key !== key) return "";
  return provinceSort.dir === 1 ? " &#9650;" : " &#9660;";
}

function renderRegions() {
  return pageHead("Regions",
      "Indonesia has 38 provinces across more than 17,000 islands. The table below covers the 16 largest " +
      "by population; click a column heading to sort, or type to search. Population: BPS 2024; GDP share: BPS " +
      "regional accounts 2024; unemployment: BPS Sakernas, August 2024.") +
    '<div class="toolbar"><label class="search-box">Search provinces ' +
    '<input type="search" id="province-search" placeholder="e.g. Jawa" value="' + provinceQuery + '"></label></div>' +
    '<section class="chart-block"><table class="data-table" id="province-table">' +
    '<thead><tr><th><button type="button" class="sort-btn" data-sort="name">Province' + sortArrow("name") + '</button></th>' +
    '<th><button type="button" class="sort-btn" data-sort="population">Population (million)' + sortArrow("population") + '</button></th>' +
    '<th><button type="button" class="sort-btn" data-sort="gdpShare">Share of GDP' + sortArrow("gdpShare") + '</button></th>' +
    '<th><button type="button" class="sort-btn" data-sort="unemployment">Unemployment' + sortArrow("unemployment") + '</button></th></tr></thead>' +
    '<tbody id="province-body">' + provinceRows() + '</tbody></table>' +
    '<p class="chart-note">Showing ' + NUSA.provinces.length + ' provinces. Jawa Barat is the most populous; ' +
    'DKI Jakarta, the capital region, produces the largest share of GDP at 16.9%.</p></section>' +
    '<section class="chart-block"><h2>Java vs the rest</h2><p>Java\'s six provinces hold about 56% of the population ' +
    'on about 7% of the land, and produce close to 57% of GDP. The government\'s new capital, Nusantara, ' +
    'is being built in Kalimantan Timur to spread growth beyond Java.</p></section>';
}

function renderMethodology() {
  const rows = NUSA.sources.map(function (s) {
    return '<tr><td>' + s.figure + '</td><td>' + s.source + '</td><td>' + s.year + '</td><td>' + s.note + '</td></tr>';
  }).join("");
  return pageHead("Methodology &amp; Sources",
      "Every figure on NusaStat comes from a published official source. This page lists each figure, " +
      "where it came from, the year it refers to, and how it should be read.") +
    '<section class="chart-block"><table class="data-table"><thead><tr><th>Figure</th><th>Source</th><th>Year</th><th>Notes</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></section>' +
    '<section class="chart-block"><h2>How to read the numbers</h2><ul class="fact-list">' +
    '<li>Figures are headline published values, rounded as shown; small differences from other publications come from rounding and revision rounds.</li>' +
    '<li>Years refer to the year the figure describes, not the year it was published.</li>' +
    '<li>Provincial figures cover the 16 largest provinces by population; Indonesia has 38 provinces in total.</li>' +
    '<li>Nothing on this site is fetched from the internet: all figures are stored in this site\'s own files and the site works offline.</li>' +
    '<li>NusaStat is an independent project and is not affiliated with Statistics Indonesia (BPS) or the World Bank.</li></ul></section>';
}

const PAGES = {
  "": renderOverview,
  "population": renderPopulation,
  "economy": renderEconomy,
  "health-education": renderHealthEducation,
  "regions": renderRegions,
  "methodology": renderMethodology
};

function drawPageCharts(route) {
  const years = NUSA.years.map(String);
  if (route === "" || route === "population") {
    const pop = document.getElementById("chart-pop");
    if (pop) drawBarChart(pop, years, NUSA.populationSeries, { formatValue: function (v) { return fmt(v, 0); } });
  }
  if (route === "") {
    const gdp = document.getElementById("chart-gdp");
    if (gdp) {
      const vals = NUSA.years.map(function (y) { return NUSA.indicators.gdpGrowth.values[y]; });
      drawLineChart(gdp, years, vals, { formatValue: function (v) { return fmt(v, 1) + "%"; } });
    }
  }
  if (route === "population") {
    const age = document.getElementById("chart-age");
    if (age) drawDonut(age, NUSA.ageGroups2024.map(function (g) { return { label: g.group, value: g.share }; }), "68.3%");
  }
  if (route === "economy") {
    drawEconomyChart();
    const sectors = document.getElementById("chart-sectors");
    if (sectors) {
      drawHBarChart(sectors, NUSA.sectors2024.map(function (s) { return { label: s.sector, value: s.share }; }),
        { formatValue: function (v) { return fmt(v, 1) + "%"; } });
    }
  }
  if (route === "health-education") {
    const life = document.getElementById("chart-life");
    if (life) {
      const vals = NUSA.years.map(function (y) { return NUSA.indicators.lifeExpectancy.values[y]; });
      drawLineChart(life, years, vals, { formatValue: function (v) { return fmt(v, 1); } });
    }
  }
}

function drawEconomyChart() {
  const canvas = document.getElementById("chart-economy");
  if (!canvas) return;
  const years = NUSA.years.map(String);
  const ind = NUSA.indicators[economyMetric];
  const vals = NUSA.years.map(function (y) { return ind.values[y]; });
  const title = document.getElementById("economy-chart-title");
  const note = document.getElementById("economy-chart-note");
  if (economyMetric === "gdpGrowth") {
    if (title) title.textContent = "GDP growth, 2019-2024";
    if (note) note.textContent = "Percent change year on year. Source: BPS national accounts.";
    drawLineChart(canvas, years, vals, { formatValue: function (v) { return fmt(v, 1) + "%"; } });
  } else if (economyMetric === "inflation") {
    if (title) title.textContent = "Inflation (CPI), 2019-2024";
    if (note) note.textContent = "December year-on-year change. Source: BPS consumer price index.";
    drawLineChart(canvas, years, vals, { formatValue: function (v) { return fmt(v, 1) + "%"; } });
  } else {
    if (title) title.textContent = "GDP per capita, 2019-2024";
    if (note) note.textContent = "Current US dollars. Source: World Bank, World Development Indicators.";
    drawBarChart(canvas, years, vals, { formatValue: function (v) { return "$" + fmt(v, 0); } });
  }
}

function bindPageEvents(route) {
  const yearSelect = document.getElementById("year-select");
  if (yearSelect) {
    yearSelect.addEventListener("change", function () {
      currentYear = Number(yearSelect.value);
      render();
    });
  }
  document.querySelectorAll(".metric-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      economyMetric = btn.getAttribute("data-metric");
      render();
    });
  });
  const search = document.getElementById("province-search");
  if (search) {
    search.addEventListener("input", function () {
      provinceQuery = search.value;
      const body = document.getElementById("province-body");
      if (body) body.innerHTML = provinceRows();
      const note = document.querySelector("#province-table + .chart-note");
      if (note) note.textContent = "Type to filter the table; click a column heading to sort.";
    });
  }
  document.querySelectorAll(".sort-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.getAttribute("data-sort");
      if (provinceSort.key === key) provinceSort.dir = -provinceSort.dir;
      else provinceSort = { key: key, dir: key === "name" ? 1 : -1 };
      render();
    });
  });
}

function setActiveNav(route) {
  document.querySelectorAll("nav a").forEach(function (a) {
    const target = a.getAttribute("href").slice(2);
    a.classList.toggle("active", target === route);
    if (target === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function render() {
  const hash = window.location.hash || "#/";
  const route = hash.replace(/^#\/?/, "").split("/")[0];
  const page = PAGES[route] || PAGES[""];
  const view = document.getElementById("view");
  view.innerHTML = page();
  setActiveNav(PAGES[route] ? route : "");
  drawPageCharts(PAGES[route] ? route : "");
  bindPageEvents(route);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
