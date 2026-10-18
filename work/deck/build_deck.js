// Deck ejecutivo Banco W - 6 slides + 1 anexo. Tema "Día pastel" (marca Davinson Arteaga), fuentes seguras.
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("C:/Users/Davinson/.claude/skills/synced/ce2ca63a-6da1-4b29-b559-5cf82e86a0ed_08922b1b-3ba5-474d-802d-4ad0bb25fd8d/pptx/scripts/apply_theme.js");

const THEME = {
  name: "Dia pastel",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "043F52", lt1: "FFFFFF", dk2: "4A6A72", lt2: "EEF8F7",
    accent1: "009786", accent2: "8670C0", accent3: "BA673F", accent4: "2B88C0", accent5: "B4608A", accent6: "A28218",
    hlink: "005477", folHlink: "005477",
  },
};
const HEX = { ink: "043F52", muted: "4A6A72", surface: "EEF8F7", line: "D6E8E6", lineStrong: "678A90",
  mint: "9CE0D9", sky: "A1DAFC", lavender: "D4C8FE", rose: "FABDD3", peach: "FAC3A5", butter: "F6E5A4",
  neg: "8F3A14", negSoft: "FDE9DF", warn: "6B5300", warnSoft: "FBF3D5", pos: "005477", posSoft: "E2F2FD",
  viz1: "009786", viz2: "8670C0", viz3: "BA673F", viz4: "2B88C0" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Davinson Arteaga"; pres.title = "Banco W - Priorizacion de renovaciones"; pres.company = "Davinson Arteaga";
const C = pres.SchemeColor;

const FOOT = "Banco W · Prueba técnica Científico de Datos · Davinson Arteaga · Data Scientist · AI Engineer";
pres.defineSlideMaster({
  title: "CONTENT", background: { color: "FFFFFF" },
  objects: [
    { text: { text: FOOT, options: { x: 0.5, y: 7.05, w: 10.5, h: 0.3, fontSize: 9, color: HEX.muted, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.35, w: 12.33, h: 0.95, fontSize: 24, bold: true, color: HEX.ink, margin: 0, valign: "top", align: "left" } } },
  ],
  slideNumber: { x: 12.3, y: 7.05, w: 0.6, h: 0.3, fontSize: 9, color: HEX.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "COVER", background: { color: "0E2024" },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 11.5, h: 1.6, fontSize: 40, bold: true, color: "E6F2F1", margin: 0 } } }],
});

// ---------- helpers ----------
const TB = { isTextBox: true, margin: 0, fontFace: "Calibri" };
function kicker(slide, text, x, y, w) {
  slide.addText(text, { ...TB, x, y, w, h: 0.3, fontSize: 11, bold: true, color: HEX.muted, charSpacing: 2 });
}
function card(slide, { x, y, w, h, fill = HEX.surface, overline, value, foot, valueSize = 30, ink = HEX.ink, name }) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, objectName: name || overline });
  slide.addText(overline, { ...TB, x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.3, fontSize: 11, bold: true, color: ink, charSpacing: 1.5 });
  slide.addText(value, { ...TB, x: x + 0.18, y: y + 0.42, w: w - 0.36, h: 0.6, fontSize: valueSize, bold: true, color: ink, valign: "middle" });
  if (foot) slide.addText(foot, { ...TB, x: x + 0.18, y: y + 1.05, w: w - 0.36, h: h - 1.15, fontSize: 11, color: ink, valign: "top" });
}
function bullets(slide, items, { x, y, w, h, size = 13, color = HEX.ink, gap = 5 }) {
  const runs = items.map((t, i) => {
    const last = i === items.length - 1;
    const base = { fontSize: size, color, paraSpaceAfter: gap };
    if (Array.isArray(t)) return t.map((r, j) => ({ text: r.text, options: { ...base, bold: !!r.bold, ...(j === 0 ? { bullet: { indent: 14 } } : {}), breakLine: j === t.length - 1 && !last } }));
    return { text: t, options: { ...base, bullet: { indent: 14 }, breakLine: !last } };
  }).flat();
  slide.addText(runs, { ...TB, x, y, w, h, valign: "top" });
}
function heading(slide, text, x, y, w, size = 14) {
  slide.addText(text, { ...TB, x, y, w, h: 0.35, fontSize: size, bold: true, color: HEX.ink });
}
function pill(slide, text, x, y, w, fill, ink) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.3, fill: { color: fill }, line: { color: fill }, rectRadius: 0.15 });
  slide.addText(text, { ...TB, x, y, w, h: 0.3, fontSize: 10, bold: true, color: ink, align: "center", valign: "middle" });
}
const tcell = (text, o = {}) => ({ text, options: { fontSize: 10.5, color: HEX.ink, fontFace: "Calibri", valign: "middle", margin: [2, 4, 2, 4], ...o } });
const thead = (text, o = {}) => tcell(text, { bold: true, fill: { color: HEX.surface }, color: HEX.ink, ...o });

// Slides 1-6 + anexo. Límites: ≤ 140 palabras fuera de tablas (sin título), cuerpo ≥ 11 pt, tablas ≥ 10 pt y ≤ 5 filas (monitoreo ≤ 6).
// Nota: el enunciado limita a 6 slides + 1 anexo. No se agrega portada: la slide 1 es la decisión.
const arm = (slide, x, y, w, h, fill, label, main, sub) => {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, objectName: label });
  slide.addText(label, { ...TB, x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.28, fontSize: 11, bold: true, color: HEX.ink, charSpacing: 1.5 });
  slide.addText(main, { ...TB, x: x + 0.15, y: y + 0.4, w: w - 0.3, h: 0.75, fontSize: 12, bold: true, color: HEX.ink, valign: "top" });
  slide.addText(sub, { ...TB, x: x + 0.15, y: y + h - 0.4, w: w - 0.3, h: 0.3, fontSize: 11, color: HEX.ink });
};
const sev = (t, f, i) => tcell(t, { bold: true, fill: { color: f }, color: i, align: "center" });
const tbl = (slide, rows, o) => slide.addTable(rows, { border: { type: "solid", color: HEX.line, pt: 0.75 }, autoPage: false, fontSize: 10.5, ...o });

// ============================================================ SLIDE 1
pres.addSection({ title: "Decisión" });
let s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Decisión" });
s.addText("1 · Decidir a quién contactar con 8.000 cupos al mes, no solo predecir quién renueva", { placeholder: "title" });
card(s, { x: 0.5, y: 1.45, w: 3.95, h: 1.7, fill: HEX.mint, overline: "CAPACIDAD", value: "8.000 de 25.000", valueSize: 26, foot: "La restricción es la capacidad, no la demanda." });
card(s, { x: 4.69, y: 1.45, w: 3.95, h: 1.7, overline: "HOY Y META", value: "3,6 % = 288", valueSize: 26, foot: "Meta 12 %: 960 o 3.000 según denominador." });
card(s, { x: 8.88, y: 1.45, w: 3.95, h: 1.7, overline: "RIESGO", value: "1 mora = 4,3 sanas", valueSize: 26, foot: "Cada mora 30+ borra 4,3 sanas; equilibrio 23,3 %." });

bullets(s, [
  [{ text: "Decidir a quién contactar: ", bold: true }, { text: "los 8.000 de mayor valor incremental neto." }],
  [{ text: "Combinación: ", bold: true }, { text: "propensión calibrada × riesgo × valor; uplift a mediano plazo." }],
  [{ text: "Validar el 12 %: ", bold: true }, { text: "denominador, ventana, orgánicas (2,3 % renovó solo)." }],
  [{ text: "Pregunta única: ", bold: true }, { text: "¿cómo se eligió a quién contactar y qué pasó con el resto?" }],
], { x: 0.5, y: 3.6, w: 6.6, h: 3.2, size: 12.5, gap: 8 });

s.addShape(pres.ShapeType.roundRect, { x: 7.4, y: 3.6, w: 5.43, h: 1.05, fill: { color: HEX.posSoft }, line: { color: HEX.posSoft }, rectRadius: 0.1, objectName: "KPI" });
s.addText([{ text: "KPI: ", options: { bold: true } }, { text: "valor incremental neto por contacto = incrementales vs. control × (420.000 − mora × 1.800.000). " }, { text: "Proxy: ", options: { bold: true } }, { text: "incrementales por 1.000 contactos." }],
  { ...TB, x: 7.55, y: 3.65, w: 5.15, h: 0.97, fontSize: 11, color: HEX.ink, valign: "middle" });
bullets(s, [
  [{ text: "Riesgo: ", bold: true }, { text: "mora esperada de la lista ≤ umbral pactado antes (veto)." }],
  [{ text: "Experiencia: ", bold: true }, { text: "quejas y opt-out por 1.000 no peores (veto)." }],
  [{ text: "Equidad: ", bold: true }, { text: "selección por regional y grupo ≥ 0,8 (alerta)." }],
  [{ text: "Operación: ", bold: true }, { text: "≥ 90 % de lista ejecutada (alerta)." }],
  [{ text: "Confiabilidad: ", bold: true }, { text: "aleatorización y datos válidos (bloqueo)." }],
], { x: 7.4, y: 4.85, w: 5.43, h: 2.0, size: 11.5, gap: 4 });
s.addNotes("Mensaje: la restricción es la capacidad, así que el problema es decidir a quién contactar, no predecir. KPI incremental neto de riesgo; el proxy mensual (incrementales por 1.000 contactos) sirve mientras madura la mora. 12 % sin denominador no es una meta: 960 si es sobre 8.000, 3.000 si es sobre 25.000 (37,5 % por contacto). Guardrail de riesgo: la mora esperada de la lista (score y política de Riesgos) se verifica antes de ejecutar; el vintage de mora 30+ a 60 días por cohorte confirma (alarma y pausa). La pregunta única define si el histórico permite medir causalidad o solo describe la política vigente.");

// ============================================================ SLIDE 2
pres.addSection({ title: "Datos" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Datos" });
s.addText("2 · La base no sirve para medir riesgo ni incrementalidad, y dos variables filtran el resultado", { placeholder: "title" });
kicker(s, "CINCO HALLAZGOS EN BASE_CLIENTES (1.800 FILAS, 8 CORTES)", 0.5, 1.4, 10);
tbl(s, [
  [thead("Hallazgo"), thead("Cifra"), thead("Qué implica"), thead("Nivel", { align: "center" })],
  [tcell("Fuga en dos variables", { bold: true }), tcell("resultado_gestion_30d AUC 0,83; dias_hasta_renovacion AUC 1,00"), tcell("No existen al priorizar; inflan métricas"), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("La base no es el universo", { bold: true }), tcell("Renovación 20,2 % vs. 3,6 %; 1.800 filas vs. 25.000/mes"), tcell("«Top 8k» no se calcula desde aquí"), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Riesgo no modelable", { bold: true }), tcell("3 moras en 364 renovados (0,8 %) vs. 4,6–7,2 % reportado"), tcell("La mora viene de Riesgos, no de esta base"), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Calidad y temporalidad", { bold: true }), tcell("1 duplicado; 1 contacto posterior al corte; 25 endeudamientos > 1"), tcell("Validaciones; corte no garantizado point-in-time"), sev("Moderado", HEX.warnSoft, HEX.warn)],
  [tcell("Señal concentrada", { bold: true }), tcell("score_buro AUC 0,81; respondio_oferta 0,69; resto < 0,57"), tcell("Un modelo simple captura casi todo"), sev("Útil", HEX.posSoft, HEX.pos)],
], { x: 0.5, y: 1.8, w: 12.33, colW: [2.4, 4.6, 4.0, 1.33], rowH: 0.42 });

heading(s, "Decisiones de tratamiento", 0.5, 4.6, 8);
bullets(s, [
  [{ text: "Excluidas: ", bold: true }, { text: "resultado_gestion_30d, dias_hasta_renovacion y mora30 (resultado); contactabilidad y remesas (sesgo); regional solo para capacidad." }],
  [{ text: "Partición: ", bold: true }, { text: "rolling-origin con un corte de gap (entrenar ≤ t−2, probar en t, mayo a agosto); deduplicar por cliente." }],
  [{ text: "Desbalance: ", bold: true }, { text: "sin remuestreo; evaluar en el punto de operación (top 32 %, calibración), no con accuracy." }],
], { x: 0.5, y: 5.0, w: 12.33, h: 1.9, size: 12, gap: 5 });
s.addNotes("Detalle de cada hallazgo en la guía P5 y P6. Fuga: 78 % de «Acepta» renueva; dias_hasta_renovacion es nulo exactamente en los 1.436 no renovados. Calidad: max_mora_6m = −4, ahorro −350.000, contacto fechado 2026-09-15 con corte agosto; score de buró 352–912 está dentro de la escala DataCrédito 150–950 (confirmar central, versión y vigencia). contactabilidad_score no predice el contacto (32 % de no contactados en todos los cuartiles). cuotas_pagadas_pct y monto_preaprobado quedan fuera del set limpio hasta certificar su timestamp: no cuesta señal (AUC 0,52–0,53). Accuracy trivial: 79,8 % en la base, 96,4 % en producción sin acertar un renovador.");

// ============================================================ SLIDE 3
pres.addSection({ title: "Alternativas" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Alternativas" });
s.addText("3 · De cuatro alternativas, C se descarta por fuga y B es la única lista para piloto", { placeholder: "title" });
tbl(s, [
  [thead("Alt."), thead("Tipo"), thead("AUC"), thead("Conv. 8k"), thead("Mora"), thead("Lectura crítica"), thead("Veredicto", { align: "center" })],
  [tcell("Actual", { bold: true }), tcell("Regla"), tcell("—"), tcell("3,6 %"), tcell("5,1 %"), tcell("Línea base; única conversión observada en producción."), sev("Champion", HEX.surface, HEX.ink)],
  [tcell("C", { bold: true }), tcell("LightGBM"), tcell("0,94"), tcell("14,8 %"), tcell("6,4 %"), tcell("Su 0,94 solo se replica con resultado_gestion_30d; sin fuga, 0,79–0,82. Inviable."), sev("Descartar", HEX.negSoft, HEX.neg)],
  [tcell("A", { bold: true }), tcell("XGBoost"), tcell("0,86"), tcell("9,4 %"), tcell("7,2 %"), tcell("Supera lo replicable (0,82) pero es otra población; mora, la peor. Auditar variable a variable."), sev("Auditar", HEX.warnSoft, HEX.warn)],
  [tcell("B", { bold: true }), tcell("Logística"), tcell("0,79"), tcell("8,8 %"), tcell("4,6 %"), tcell("Coherente con la réplica limpia (0,78–0,85), calibrado, menor mora. Misma ficha de fuga que A."), sev("Piloto", HEX.posSoft, HEX.pos)],
  [tcell("D", { bold: true }), tcell("Uplift"), tcell("Qini 0,12"), tcell("7,9 %"), tcell("+3,1 pp"), tcell("Único que mide efecto del contacto; unidades mezcladas y aleatorización sin detalle."), sev("Aprender", HEX.butter, HEX.ink)],
], { x: 0.5, y: 1.4, w: 7.7, colW: [0.6, 0.85, 0.7, 0.75, 0.65, 3.15, 1.0], rowH: 0.56, fontSize: 10 });

heading(s, "Réplica: el AUC de C se explica por la fuga", 8.5, 1.4, 4.33, 13);
s.addText("AUC fuera de tiempo: entrenar ≤ t−2, probar en t, mayo a agosto.", { ...TB, x: 8.5, y: 1.75, w: 4.33, h: 0.3, fontSize: 11, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "AUC", labels: ["16 variables ex ante", "+ resultado_gestion_30d", "+ dias_hasta_renovacion"], values: [0.82, 0.94, 1.0] }], {
  x: 8.5, y: 2.05, w: 4.33, h: 2.35, barDir: "bar", chartColors: [HEX.viz1, HEX.viz3, HEX.neg], invertedColors: [HEX.viz1],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
  valAxisMinVal: 0.5, valAxisMaxVal: 1.05, valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 },
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 60,
});
s.addText("Reportado: C 0,94 y B 0,79. Un k-fold aleatorio da 0,82: solo la validación temporal revela la fuga.", { ...TB, x: 8.5, y: 4.45, w: 4.33, h: 0.6, fontSize: 11, color: HEX.ink });

heading(s, "Por qué más AUC puede ser peor decisión", 0.5, 5.3, 6.2, 13);
bullets(s, [
  "Mide el orden completo; la decisión usa solo el 32 % superior y no distingue la mora.",
  "Propensión alta no es efecto del contacto: llamar a quien renovaría igual gasta cupos.",
], { x: 0.5, y: 5.65, w: 6.2, h: 1.3, size: 11, gap: 3 });
heading(s, "Para comparar propensión vs. uplift necesito", 7.0, 5.3, 5.83, 13);
bullets(s, [
  "La regla de asignación de la campaña de D: fracción aleatorizada, unidad y cumplimiento.",
  "Un mismo holdout donde medir uplift@8k de cada modelo en COP netos de mora, con intervalos.",
], { x: 7.0, y: 5.65, w: 5.83, h: 1.3, size: 11, gap: 3 });
s.addNotes("Repliqué con la base: el AUC de C (0,94) solo se obtiene incluyendo el resultado de gestión; con dias_hasta_renovacion llega a 1,00. A: 0,86 supera lo que esta base permite replicar (0,82), pero la hoja viene de otra población, así que no es concluyente; su mora 7,2 % es la peor y, de ser real, lo convierte en la alternativa de menor valor; ambas cosas exigen auditoría variable por variable. B: coherente con la réplica, calibrado (pendiente 0,90), estable; pasa a piloto tras la misma ficha de fuga. D: la hoja reporta «+3,1 pp incremental» en la columna de mora y Qini en la de PR-AUC; no es comparable con A, B y C sin aclarar unidades. Las conversiones «top 8k» de la hoja y la conversión top 32 % de la réplica (≈ 45 %) no son comparables: otra población y otra regla de contacto.");

// ============================================================ SLIDE 4
pres.addSection({ title: "Valor" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Valor" });
s.addText("4 · B genera más valor que A pese a convertir menos, y la capacidad regional decide cómo repartirlo", { placeholder: "title" });
heading(s, "Valor esperado mensual neto de mora (COP millones)", 0.5, 1.4, 7.2, 13);
s.addText("8.000 contactos × conversión × (420.000 − mora × 1.800.000). D con mora 5,1 % supuesta; C descartada por fuga.", { ...TB, x: 0.5, y: 1.75, w: 7.2, h: 0.45, fontSize: 11, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "VE neto", labels: ["Actual", "A XGBoost", "B Logística", "D Uplift"], values: [94.5, 218.4, 237.4, 207.4] }], {
  x: 0.5, y: 2.2, w: 7.2, h: 2.3, barDir: "col", chartColors: [HEX.lineStrong, HEX.viz3, HEX.viz1, HEX.viz2],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0",
  valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 }, valAxisMaxVal: 300,
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 70,
});
card(s, { x: 7.95, y: 1.4, w: 2.35, h: 1.55, fill: HEX.mint, overline: "B VS. ACTUAL", value: "+143 M", valueSize: 26, foot: "al mes si el «top 8k» se sostiene." });
card(s, { x: 10.48, y: 1.4, w: 2.35, h: 1.55, overline: "POR RENOVACIÓN", value: "337 k vs 290 k", valueSize: 20, foot: "B vs. A: la mora pesa más que 0,6 pp." });
heading(s, "Lo que el cálculo no prueba", 7.95, 3.1, 4.9, 13);
bullets(s, [
  "No incremental: si la mitad de las 704 renovaciones de B fuera orgánica, baja a 119 M.",
  "B vs. A: conversión no distinguible (z ≈ 1,3), mora apenas (z ≈ 2,1); B gana por robustez.",
  "A supera a B solo con mora < 5,8 %. Faltan costo de contacto, LGD y origen del «top 8k».",
], { x: 7.95, y: 3.45, w: 4.88, h: 1.3, size: 11, gap: 2 });

heading(s, "Lista operativa: cuotas por regional con transferencia por valor marginal", 0.5, 4.7, 10, 13);
tbl(s, [
  [thead("Regional"), thead("Capacidad"), thead("Si ranking global"), thead("Exceso / ocio"), thead("Mora hist."), thead("Regla operativa")],
  [tcell("Suroccidente"), tcell("2.600"), tcell("≈ 2.400"), tcell("≈ −200 ociosos", { color: HEX.warn }), tcell("5,4 %"), tcell("Llena su cuota con su ranking; cede sobrantes")],
  [tcell("Centro"), tcell("1.900"), tcell("≈ 2.100"), tcell("≈ +200 sin gestor", { color: HEX.neg }), tcell("4,7 %"), tcell("Corte por cuota; lista semanal contra saturación de cierre")],
  [tcell("Norte"), tcell("1.200"), tcell("≈ 1.300"), tcell("≈ +100 sin gestor", { color: HEX.neg }), tcell("6,8 %"), tcell("Mayor valor marginal (86 k): recibe cupos transferidos")],
  [tcell("Eje Cafetero"), tcell("1.000"), tcell("≈ 1.100"), tcell("≈ +100 sin gestor", { color: HEX.neg }), tcell("4,9 %"), tcell("Corte por cuota; segundo valor marginal (81 k)")],
  [tcell("Oriente"), tcell("1.300"), tcell("≈ 1.100"), tcell("≈ −200 ociosos", { color: HEX.warn }), tcell("5,5 %"), tcell("Menor valor marginal (61 k): cede cupos, tope a pactar (10 %)")],
], { x: 0.5, y: 5.05, w: 12.33, colW: [1.5, 1.1, 1.5, 1.7, 1.0, 5.53], rowH: 0.28, fontSize: 10 });
s.addText("Logística limpia, junio–agosto (n = 696); proyección a centenas con la mezcla regional de la muestra.", { ...TB, x: 0.5, y: 6.75, w: 12.33, h: 0.28, fontSize: 11, color: HEX.muted, italic: true });
s.addNotes("B gana por riesgo, no por conversión: cada renovación de B vale 337.200 frente a 290.400 de A. Incertidumbre (supuesto 8.000 contactos por alternativa, 752 y 704 renovados): conversión z = 1,32 (p 0,19), mora z = 2,11 (p 0,03); en valor B es al menos equivalente dentro de la incertidumbre. El valor no es incremental: por eso el piloto. Capacidad: un ranking global sobrecarga Centro, Norte y Eje y deja ≈ 400 cupos ociosos en Suroccidente y Oriente; cuotas por regional con transferencia por valor marginal (tope a pactar con Comercial). La conversión en muestra con y sin cuotas es equivalente (43,2 % vs. 42,6 %, dentro del ruido). Sensibilidad a la pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: B 263 / 237 / 215 / 182 vs. A 262 / 218 / 181 / 126.");

// ============================================================ SLIDE 5
pres.addSection({ title: "Piloto" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Piloto" });
s.addText("5 · Un piloto de dos meses mide si la lista nueva convierte más y si el contacto crea renovaciones; el riesgo se controla por política", { placeholder: "title" });
heading(s, "Diseño: dos pools al azar, mismo piso de riesgo", 0.5, 1.4, 7.5, 13);
arm(s, 0.5, 1.8, 2.4, 1.5, HEX.surface, "CHAMPION", "Herramienta actual elige sus 4.000 en su pool", "4.000 contactos/mes");
arm(s, 3.05, 1.8, 2.4, 1.5, HEX.mint, "CHALLENGER", "B rankea su pool con cuotas; toma su top 4.800", "4.000 contactados/mes");
arm(s, 5.6, 1.8, 2.4, 1.5, HEX.lavender, "HOLDOUT", "800 al azar del top 4.800 de B, sin contacto", "≈ 800 clientes/mes");
bullets(s, [
  [{ text: "Calidad de lista: ", bold: true }, { text: "3,6 → 5,4 % se detecta con 2.081 por brazo (un mes); 3,6 → 4,5 %, dos meses." }],
  [{ text: "Efecto del contacto: ", bold: true }, { text: "uplift plausible 2,3 → 4,0 % (mitad del +3,1 pp de D) en 1,3 meses; cuesta 4,6 M/mes." }],
  [{ text: "Riesgo: ", bold: true }, { text: "el mismo piso en ambos brazos aísla el modelo; mora vigilada por vintage." }],
  [{ text: "Límite: ", bold: true }, { text: "sin holdout en el champion no se compara su incrementalidad; opción, 400 allí (≈ 2,3 M/mes)." }],
], { x: 0.5, y: 3.45, w: 7.5, h: 1.6, size: 11, gap: 2 });

heading(s, "Reglas de salida (pre-registradas)", 8.3, 1.4, 4.53, 13);
tbl(s, [
  [thead("Criterio"), thead("Ship si")],
  [tcell("Calidad: challenger − champion"), tcell("≥ +1,5 pp, IC 95 % excluye 0")],
  [tcell("Efecto: contactado − holdout"), tcell("> 0, IC 95 % excluye 0")],
  [tcell("Mora 30+ de renovados"), tcell("≤ champion + 1 pp")],
  [tcell("Quejas y opt-out por 1.000"), tcell("No peores que el champion")],
  [tcell("Ejecución y aleatorización"), tcell("≥ 90 % por regional; sin sesgo de asignación")],
], { x: 8.3, y: 1.8, w: 4.53, colW: [2.25, 2.28], rowH: 0.3, fontSize: 10 });

heading(s, "Monitoreo, primeros tres meses", 0.5, 5.05, 7.5, 13);
tbl(s, [
  [thead("Dimensión"), thead("Métrica"), thead("Acción")],
  [tcell("Datos"), tcell("Esquema, rangos y fechas posteriores al corte; cada corte"), tcell("Bloqueo: no se puntúa")],
  [tcell("Drift"), tcell("PSI del score sobre el universo (25.000); drift por variable"), tcell("0,10 investigar; 0,25 revalidar")],
  [tcell("Performance"), tcell("AUC, calibración y conversión top-k con labels a 30–60 días"), tcell("Recalibrar o rollback")],
  [tcell("Riesgo"), tcell("Vintage de mora 30+ por cohorte, brazo y regional"), tcell("Subir corte; pausa")],
  [tcell("Operación"), tcell("% de lista contactada por regional y semana"), tcell("Reasignar cupos")],
  [tcell("Experiencia"), tcell("Quejas y opt-out por 1.000 contactos"), tcell("Pausa")],
], { x: 0.5, y: 5.4, w: 7.5, colW: [1.3, 4.1, 2.1], rowH: 0.21, fontSize: 10 });
heading(s, "No libero si", 8.3, 5.05, 4.53, 13);
bullets(s, [
  "Variable no point-in-time o split no temporal.",
  "Sin calibración verificada, holdout, rollback o dueño.",
], { x: 8.3, y: 5.4, w: 4.53, h: 1.4, size: 11, gap: 2 });
s.addNotes("Mecánica: el universo elegible del mes (filtrado por el mismo piso de riesgo: corte de buró y max_mora pactados con Riesgos) se parte al azar en dos pools por cliente, estratificando por regional y tercil de score. El champion elige sus 4.000 en su pool; el challenger rankea el suyo, toma su top 4.800, retiene 800 al azar como holdout sin contacto y contacta 4.000. Capacidad intacta: 8.000. Dos reglas separadas: calidad de lista (challenger vs. champion) y efecto del contacto (challenger contactado vs. holdout). Potencia del holdout (800 vs. 4.000): uplift +1,2 pp exige 2,4 meses; +1,7 pp, 1,3 meses; +2,2 pp, 0,9. Costo de oportunidad 3,2 / 4,6 / 5,9 / 7,3 M/mes, ≤ 2 % del VE de B. Limitación: sin holdout en el champion no comparamos la incrementalidad de las dos políticas; la opción de 400 de holdout en el champion cuesta ≈ 2,3 M/mes y deja ese brazo en 3.600. Probar mora 5,1 % vs. 7,2 % exigiría 2.053 renovados por brazo: el riesgo entra por política y se vigila por vintage. Duración: dos meses de asignación + 30 días de ventana + 30 a 60 de maduración; decisión a los 90 días. Jerga (SRM, CSI, Brier, CUPED) en el anexo y la guía. Condiciones completas de no liberación en la guía P16.");

// ============================================================ SLIDE 6
pres.addSection({ title: "Recomendación" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Recomendación" });
s.addText("6 · Recomendación: pilotear B con holdout desde el próximo corte, no liberar C y auditar A y D", { placeholder: "title" });
const dec = [
  ["1", "Aprobar el piloto", "Dos meses, tres brazos, 8.000 contactos al mes.", HEX.mint],
  ["2", "No liberar C; condicionar A y D", "C usa el resultado; A tras ficha de fuga; D al holdout.", HEX.sky],
  ["3", "Fijar KPI y guardrails", "KPI incremental neto por contacto; guardrails con dueño.", HEX.lavender],
];
dec.forEach((d, i) => {
  const x = 0.5 + i * 4.15;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.45, w: 4.0, h: 1.7, fill: { color: d[3] }, line: { color: d[3] }, rectRadius: 0.12, objectName: "Decisión " + d[0] });
  s.addText(d[0], { ...TB, x: x + 0.2, y: 1.55, w: 0.6, h: 0.55, fontSize: 30, bold: true, color: HEX.ink });
  s.addText(d[1], { ...TB, x: x + 0.8, y: 1.6, w: 3.05, h: 0.5, fontSize: 14, bold: true, color: HEX.ink, valign: "middle" });
  s.addText(d[2], { ...TB, x: x + 0.2, y: 2.15, w: 3.6, h: 0.9, fontSize: 11.5, color: HEX.ink, valign: "top" });
});

heading(s, "Ruta 90 días", 0.5, 3.45, 6, 13);
const steps = [
  ["Semanas 1 a 2", "Denominador del 12 %, regla de contacto, permisos del buró."],
  ["Semanas 3 a 4", "Ficha de fuga de A y B; pipeline point-in-time; cuotas."],
  ["Meses 2 a 3", "Piloto con holdout; monitoreo semanal; decisión pre-registrada."],
  ["Mes 4+", "Con uplift, escalar; si no, champion."],
];
steps.forEach((st, i) => {
  const y = 3.9 + i * 0.72;
  s.addShape(pres.ShapeType.ellipse, { x: 0.5, y: y + 0.1, w: 0.34, h: 0.34, fill: { color: HEX.mint }, line: { color: HEX.mint }, objectName: "Paso " + (i + 1) });
  s.addText(String(i + 1), { ...TB, x: 0.5, y: y + 0.1, w: 0.34, h: 0.34, fontSize: 11, bold: true, color: HEX.ink, align: "center", valign: "middle" });
  s.addText([{ text: st[0] + "  ", options: { bold: true } }, { text: st[1] }], { ...TB, x: 0.98, y, w: 6.9, h: 0.58, fontSize: 11.5, color: HEX.ink, valign: "middle" });
});

heading(s, "Gobierno", 8.1, 3.45, 4.73, 13);
bullets(s, [
  [{ text: "Equidad: ", bold: true }, { text: "selección y conversión por grupo; con cuotas, dentro de cada regional." }],
  [{ text: "Auditable: ", bold: true }, { text: "model card, datasheet, ficha de fuga, monitoreo, RACI." }],
  [{ text: "SHAP no es causa: ", bold: true }, { text: "al buró alto se le busca más (37 % vs. 22 %); solo el holdout lo prueba." }],
], { x: 8.1, y: 3.85, w: 4.73, h: 3.0, size: 11, gap: 4 });
s.addNotes("Pedimos tres decisiones. Ruta de 90 días con la ficha de fuga variable por variable para A y B en las semanas 3 a 4 (fuente, timestamp, disponibilidad al puntuar). Gobierno: sin cuotas, el modelo limpio selecciona 28 % en Oriente frente a 35 % en Centro (AIR ≈ 0,80, en el límite); con cuotas, la selección por regional la fija la capacidad, así que la equidad se vigila en conversión y calibración por grupo dentro de cada regional. El 79 % de la lista cae en el tercil alto de buró: ese piso lo fija la política de riesgo, no el algoritmo. SHAP es correlación: en la base, 37 % del tercil bajo de buró quedó sin contactar frente a 22 % del alto.");

// ============================================================ ANEXO
pres.addSection({ title: "Anexo" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Anexo" });
s.addText("Anexo · Soporte técnico: réplica, economía, tamaños de muestra y variables", { placeholder: "title" });
heading(s, "Réplica fuera de tiempo (train ≤ t−2, un corte de gap, test = t, t = mayo a agosto)", 0.5, 1.3, 7.3, 12);
tbl(s, [
  [thead("Conjunto de variables"), thead("Modelo"), thead("AUC"), thead("Rango"), thead("PR-AUC"), thead("Calibración (pend.)"), thead("Brier")],
  [tcell("16 ex ante limpias"), tcell("Logística"), tcell("0,817"), tcell("0,78–0,85"), tcell("0,52"), tcell("0,90"), tcell("0,130")],
  [tcell("16 ex ante limpias"), tcell("LightGBM"), tcell("0,786"), tcell("0,76–0,81"), tcell("0,49"), tcell("0,77"), tcell("0,138")],
  [tcell("+ remesas, contactabilidad, regional"), tcell("Logística"), tcell("0,819"), tcell("0,78–0,85"), tcell("0,53"), tcell("0,90"), tcell("0,129")],
  [tcell("+ resultado_gestion_30d"), tcell("Logística"), tcell("0,944"), tcell("0,93–0,96"), tcell("0,85"), tcell("0,99"), tcell("0,067")],
  [tcell("+ dias_hasta_renovacion"), tcell("LightGBM"), tcell("1,000"), tcell("1,00–1,00"), tcell("1,00"), tcell("1,00"), tcell("0,000")],
], { x: 0.5, y: 1.65, w: 7.3, colW: [2.4, 0.9, 0.7, 0.95, 0.75, 1.1, 0.5], rowH: 0.27, fontSize: 9.5 });
s.addText("Prevalencia de la base 20,2 %. Calibración: pendiente de observado sobre predicho (1 = perfecta); media predicha 0,197 vs. observada 0,207. Las conversiones «top 8k» de la hoja no son comparables con esta base. Sin gap (train < t, abril a agosto): 0,82 / 0,80; k-fold aleatorio: 0,82. Coeficientes estandarizados del modelo limpio: score_buro 1,30; max_mora_6m −0,56; respondio_oferta_previa 0,27; el resto < 0,15.", { ...TB, x: 0.5, y: 3.4, w: 7.3, h: 0.75, fontSize: 9, color: HEX.muted });

heading(s, "Valor esperado mensual (COP millones, 8.000 contactos)", 8.1, 1.3, 4.7, 12);
tbl(s, [
  [thead("Alt."), thead("Renov."), thead("Mora"), thead("Bruto"), thead("Costo mora"), thead("Neto")],
  [tcell("Actual"), tcell("288"), tcell("5,1 %"), tcell("121,0"), tcell("26,4"), tcell("94,5")],
  [tcell("A"), tcell("752"), tcell("7,2 %"), tcell("315,8"), tcell("97,5"), tcell("218,4")],
  [tcell("B"), tcell("704"), tcell("4,6 %"), tcell("295,7"), tcell("58,3"), tcell("237,4")],
  [tcell("D"), tcell("632"), tcell("5,1 %*"), tcell("265,4"), tcell("58,0"), tcell("207,4")],
  [tcell("C"), tcell("1.184"), tcell("6,4 %"), tcell("497,3"), tcell("136,4"), tcell("360,9 (no confiable)")],
], { x: 8.1, y: 1.65, w: 4.73, colW: [0.55, 0.65, 0.65, 0.65, 0.9, 1.33], rowH: 0.27, fontSize: 9.5 });
s.addText("* Mora no reportada para D; se asume la de la herramienta actual. Valor incremental de D si +3,1 pp es uplift de conversión: 248 × 328 k = 81 M/mes. Sensibilidad B vs. A con pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: 263/237/215/182 vs. 262/218/181/126.", { ...TB, x: 8.1, y: 3.4, w: 4.73, h: 0.75, fontSize: 9, color: HEX.muted });

heading(s, "Tamaños de muestra (α 5 %, potencia 80 %) y costo del holdout", 0.5, 4.2, 6, 12);
tbl(s, [
  [thead("Hipótesis"), thead("n"), thead("Meses · costo")],
  [tcell("Conv. 3,6 % a 4,5 / 5,4 / 7,2 %"), tcell("7.530 / 2.081 / 618 por brazo"), tcell("2 / 1 / 1 meses")],
  [tcell("Mora 5,1 % a 7,2 % (renovados)"), tcell("2.053 renovados por brazo"), tcell("fuera del piloto")],
  [tcell("Holdout 2,3 a 3,5 % (800 vs. 4.000)"), tcell("1.932 en holdout"), tcell("2,4 meses · 3,2 M/mes")],
  [tcell("Holdout 2,3 a 4,0 % (plausible)"), tcell("1.056 en holdout"), tcell("1,3 meses · 4,6 M/mes")],
  [tcell("Holdout 2,3 a 4,5 / 5,0 %"), tcell("685 / 491 en holdout"), tcell("0,9 / 0,6 m · 5,9 / 7,3 M")],
  [tcell("A − B reportada (8.000 c/u)"), tcell("conv. z 1,32 (p 0,19)"), tcell("mora z 2,11 (p 0,03)")],
], { x: 0.5, y: 4.55, w: 5.7, colW: [2.3, 1.85, 1.55], rowH: 0.24, fontSize: 8.5 });

heading(s, "Variables excluidas del ranking, por motivo", 6.5, 4.2, 6.3, 12);
tbl(s, [
  [thead("Motivo"), thead("Variables"), thead("Tratamiento")],
  [tcell("Fuga / resultado"), tcell("resultado_gestion_30d, dias_hasta_renovacion, mora30_post_renovacion, renovo_30d"), tcell("Solo como target o evaluación")],
  [tcell("Disponibilidad temporal"), tcell("fecha_ultimo_contacto (1 > corte); cuotas_pagadas_pct, monto_preaprobado sin timestamp"), tcell("Fuera del set; sin costo (AUC 0,52–0,53); vuelven con timestamp")],
  [tcell("Calidad"), tcell("max_mora_6m < 0, saldo_ahorros < 0, endeudamiento > 1, duplicado; buró dentro de 150–950"), tcell("Validar y corregir con registro; confirmar central y vigencia")],
  [tcell("Uso responsable y sesgo"), tcell("recibe_remesas, contactabilidad_score, regional (solo capacidad), cliente_id"), tcell("Fuera del score; grupos de equidad")],
], { x: 6.5, y: 4.55, w: 6.33, colW: [1.25, 3.4, 1.68], rowH: 0.36, fontSize: 8.5 });
s.addText("Código y cálculos: work/01_diagnostico.py, 02_modelos_fuga.py y 03_economia_capacidad_piloto.py sobre una copia del anexo; el original no se modificó (hash verificado). Jerga: SRM = sample ratio mismatch; CSI = índice de estabilidad por variable; CUPED = ajuste por covariable pre-periodo.", { ...TB, x: 0.5, y: 6.35, w: 5.7, h: 0.6, fontSize: 8, color: HEX.muted, italic: true, valign: "top" });
s.addNotes("Anexo de soporte para preguntas técnicas. Detalle completo en la guía de sustentación (19 preguntas).");

(async () => {
  const out = "C:/Users/Davinson/Desktop/banco w/entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("written", out);
})();
