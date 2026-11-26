// NusaStat charts: hand-drawn canvas charts, no libraries.
// Every function takes a canvas element, data and options, and draws
// axes, labels and values so the chart reads without any other text.

const CHART_COLORS = {
  teal: "#0e6b62",
  tealLight: "#3aa79a",
  amber: "#e8a33d",
  rust: "#c25e3a",
  ink: "#1d2a28",
  muted: "#6b7a76",
  grid: "#dfe6e2",
  bar: "#0e6b62",
  barAlt: "#e8a33d"
};

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = canvas.clientWidth || 560;
  const height = canvas.clientHeight || 260;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceMax(value) {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

function drawAxes(ctx, pad, width, height, max, formatValue) {
  ctx.strokeStyle = CHART_COLORS.grid;
  ctx.fillStyle = CHART_COLORS.muted;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const value = (max * i) / steps;
    const y = pad.top + (height - pad.top - pad.bottom) * (1 - i / steps);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatValue(value), pad.left - 8, y);
  }
  ctx.strokeStyle = "#b9c4bf";
  ctx.beginPath();
  ctx.moveTo(pad.left, height - pad.bottom);
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.stroke();
}

// Vertical bar chart. labels: string[], values: number[].
function drawBarChart(canvas, labels, values, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { top: 26, right: 12, bottom: 30, left: 56 };
  const rawMax = Math.max.apply(null, values.concat([0]));
  const max = niceMax(rawMax * 1.08);
  const formatValue = opts.formatValue || function (v) { return String(Math.round(v)); };
  drawAxes(ctx, pad, width, height, max, formatValue);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const slot = plotW / values.length;
  const barW = Math.min(46, slot * 0.58);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < values.length; i++) {
    const x = pad.left + slot * i + (slot - barW) / 2;
    const barH = (values[i] / max) * plotH;
    const y = pad.top + plotH - barH;
    ctx.fillStyle = opts.highlightIndex === i ? CHART_COLORS.amber : CHART_COLORS.bar;
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = CHART_COLORS.ink;
    ctx.textBaseline = "bottom";
    ctx.fillText(formatValue(values[i]), x + barW / 2, y - 4);
    ctx.fillStyle = CHART_COLORS.muted;
    ctx.textBaseline = "top";
    ctx.fillText(labels[i], x + barW / 2, height - pad.bottom + 6);
  }
}

// Line chart with points and value labels. labels: string[], values: number[].
function drawLineChart(canvas, labels, values, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { top: 26, right: 16, bottom: 30, left: 56 };
  const min = Math.min.apply(null, values.concat([0]));
  const maxRaw = Math.max.apply(null, values);
  const lo = min < 0 ? min * 1.15 : 0;
  const hi = niceMax(maxRaw * 1.08);
  const formatValue = opts.formatValue || function (v) { return String(Math.round(v)); };
  drawAxes(ctx, pad, width, height, hi, formatValue);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xAt = function (i) { return pad.left + (plotW * i) / (values.length - 1); };
  const yAt = function (v) { return pad.top + plotH * (1 - (v - lo) / (hi - lo)); };
  ctx.strokeStyle = CHART_COLORS.teal;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach(function (v, i) {
    if (i === 0) ctx.moveTo(xAt(i), yAt(v));
    else ctx.lineTo(xAt(i), yAt(v));
  });
  ctx.stroke();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  values.forEach(function (v, i) {
    ctx.fillStyle = CHART_COLORS.teal;
    ctx.beginPath();
    ctx.arc(xAt(i), yAt(v), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CHART_COLORS.ink;
    ctx.textBaseline = "bottom";
    ctx.fillText(formatValue(v), xAt(i), yAt(v) - 8);
    ctx.fillStyle = CHART_COLORS.muted;
    ctx.textBaseline = "top";
    ctx.fillText(labels[i], xAt(i), height - pad.bottom + 6);
  });
  ctx.lineWidth = 1;
}

// Horizontal bar chart for ranked lists (sectors, provinces).
// items: [{ label, value }], sorted largest first by the caller.
function drawHBarChart(canvas, items, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas);
  const formatValue = opts.formatValue || function (v) { return v + "%"; };
  const max = niceMax(Math.max.apply(null, items.map(function (d) { return d.value; })) * 1.1);
  const labelW = 190;
  const rowH = (height - 16) / items.length;
  ctx.font = "12px system-ui, sans-serif";
  items.forEach(function (d, i) {
    const y = 8 + rowH * i;
    const barX = labelW;
    const barW = (width - labelW - 64) * (d.value / max);
    ctx.fillStyle = CHART_COLORS.ink;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(d.label, 4, y + rowH / 2);
    ctx.fillStyle = i % 2 === 0 ? CHART_COLORS.teal : CHART_COLORS.tealLight;
    ctx.fillRect(barX, y + 5, Math.max(2, barW), rowH - 10);
    ctx.fillStyle = CHART_COLORS.ink;
    ctx.fillText(formatValue(d.value), barX + barW + 8, y + rowH / 2);
  });
}

// Donut chart with a centre label. items: [{ label, value }].
function drawDonut(canvas, items, centreLabel) {
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 14;
  const inner = radius * 0.58;
  const total = items.reduce(function (s, d) { return s + d.value; }, 0);
  const palette = [CHART_COLORS.teal, CHART_COLORS.amber, CHART_COLORS.tealLight, CHART_COLORS.rust, "#7a9e8f"];
  let angle = -Math.PI / 2;
  items.forEach(function (d, i) {
    const sweep = (d.value / total) * Math.PI * 2;
    ctx.fillStyle = palette[i % palette.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fill();
    angle += sweep;
  });
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = CHART_COLORS.ink;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(centreLabel, cx, cy);
}
