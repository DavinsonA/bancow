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
  slide.addText(overline, { ...TB, x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.3, fontSize: 10, bold: true, color: ink, charSpacing: 1.5 });
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

// ============================================================ PORTADA (no cuenta como slide de contenido? -> sí cuenta; por eso la decisión va en la slide 1 y no hay portada separada)
// Nota: el enunciado limita a 6 slides + 1 anexo. No se agrega portada: la slide 1 es la decisión.

// ============================================================ SLIDE 1
pres.addSection({ title: "Decisión" });
let s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Decisión" });
s.addText("1 · Decidir a quién contactar con 8.000 cupos al mes, no solo predecir quién renueva", { placeholder: "title" });
kicker(s, "EL PROBLEMA EN CIFRAS (ENUNCIADO Y ANEXO)", 0.5, 1.35, 8);
card(s, { x: 0.5, y: 1.7, w: 2.95, h: 1.75, fill: HEX.mint, overline: "CAPACIDAD", value: "8.000 de 25.000", valueSize: 24, foot: "Solo 32 % de los elegibles recibe gestión. La restricción es la capacidad, no la demanda." });
card(s, { x: 3.6, y: 1.7, w: 2.95, h: 1.75, overline: "HOY", value: "3,6 % = 288", foot: "Renovaciones/mes sobre los 8.000 gestionados por la herramienta actual (mora 30+: 5,1 %)." });
card(s, { x: 6.7, y: 1.7, w: 2.95, h: 1.75, overline: "ASPIRACIÓN 12 %", value: "960 o 3.000", foot: "960 si es sobre 8.000; 3.000 si es sobre 25.000 (exigiría 37,5 % por contacto). El denominador no está definido." });
card(s, { x: 9.8, y: 1.7, w: 3.03, h: 1.75, overline: "MORA DE EQUILIBRIO", value: "23,3 %", foot: "420.000 / 1.800.000. Cada renovación con mora 30+ borra 4,3 renovaciones sanas." });

heading(s, "Qué debe resolver Ciencia de Datos", 0.5, 3.7, 6);
bullets(s, [
  [{ text: "Una decisión de asignación bajo capacidad, ", bold: true }, { text: "no un modelo de propensión: elegir los 8.000 contactos que maximizan valor incremental neto de riesgo, respetando la capacidad de cada regional." }],
  [{ text: "Combinación: ", bold: true }, { text: "propensión calibrada × filtro de riesgo (mora 30+) × valor por renovación, optimizados contra la capacidad. La incrementalidad (uplift) es el objetivo de mediano plazo: hoy no hay datos para estimarla con confianza." }],
  [{ text: "Qué validar antes de adoptar el 12 %: ", bold: true }, { text: "denominador y ventana, si incluye renovaciones orgánicas (en la base, 2,3 % de los no contactados renovó solo), y si es por contacto, por lista o por elegible." }],
  [{ text: "La única pregunta al negocio: ", bold: true }, { text: "¿cómo se eligió hasta hoy a quién contactar y qué pasó con los no contactados? Define si el histórico permite medir efecto del contacto o solo describe la política vigente." }],
], { x: 0.5, y: 4.05, w: 7.3, h: 2.9, size: 12 });

heading(s, "KPI de decisión y guardrails", 8.1, 3.7, 4.7);
s.addShape(pres.ShapeType.roundRect, { x: 8.1, y: 4.05, w: 4.73, h: 0.85, fill: { color: HEX.posSoft }, line: { color: HEX.posSoft }, rectRadius: 0.1 });
s.addText([{ text: "KPI principal: ", options: { bold: true } }, { text: "valor incremental neto por contacto (COP) = renovaciones incrementales vs. control × (420.000 − mora × 1.800.000), medido sobre los 8.000 asignados." }],
  { ...TB, x: 8.25, y: 4.1, w: 4.45, h: 0.78, fontSize: 11.5, color: HEX.ink, valign: "middle" });
bullets(s, [
  "Riesgo: mora 30+ de renovados por cohorte ≤ 5,1 % + 1 pp (veto).",
  "Experiencia: quejas y opt-out por 1.000 contactos no inferiores al control (veto).",
  "Equidad y cobertura: tasa de selección por regional y grupo ≥ 0,8 de la referencia (alerta).",
  "Operación: ≥ 90 % de la lista ejecutada por regional (alerta).",
  "Confiabilidad: SRM y chequeos de datos del corte (bloqueo).",
], { x: 8.1, y: 5.0, w: 4.73, h: 2.0, size: 11, gap: 3 });
s.addNotes("Mensaje: la restricción es la capacidad, así que el problema es decidir a quién contactar, no predecir. KPI incremental neto de riesgo. 12 % sin denominador no es una meta. La pregunta única define si podemos medir causalidad con el histórico.");

// ============================================================ SLIDE 2
pres.addSection({ title: "Datos" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Datos" });
s.addText("2 · La base no sirve para medir riesgo ni incrementalidad, y dos variables filtran el resultado", { placeholder: "title" });
kicker(s, "HALLAZGOS MATERIALES EN BASE_CLIENTES (1.800 FILAS, 8 CORTES) Y DICCIONARIO", 0.5, 1.35, 10);
const sev = (t, f, i) => tcell(t, { bold: true, fill: { color: f }, color: i, align: "center" });
const rowsD = [
  [thead("Hallazgo"), thead("Evidencia en la base"), thead("Qué implica para la decisión"), thead("Nivel", { align: "center" })],
  [tcell("Fuga de información (dos variables)", { bold: true }), tcell("resultado_gestion_30d: 78 % de «Acepta» renueva (AUC univariado 0,83). dias_hasta_renovacion: nulo exactamente en los 1.436 no renovados (AUC 1,00)."), tcell("No existen al momento de priorizar. Cualquier modelo que las use infla métricas y es inviable en producción."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("La base no es el universo", { bold: true }), tcell("Renovación 20,2 % (364/1.800) frente a 3,6 % declarado; 1.800 filas frente a 25.000/mes. «Top 8k» no es calculable desde esta base."), tcell("Las conversiones de la hoja de modelos vienen de otra población o de otra regla. No se pueden extrapolar sin conocer el origen."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Riesgo no modelable aquí", { bold: true }), tcell("3 moras 30+ en 364 renovados (0,8 %) frente a 4,6 % a 7,2 % reportados. Mora = 0 en no renovados por construcción."), tcell("El componente de riesgo debe venir de Riesgos (score o política), no de esta base."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Calidad y temporalidad", { bold: true }), tcell("1 duplicado (C01199). max_mora_6m = −4; ahorro −350.000; 25 endeudamientos > 1; 7 scores de buró fuera de 400–850; 1 contacto fechado después del corte (2026-09-15); dias_ultimo_contacto redundante (r = 0,99)."), tcell("Corregibles con reglas de validación en el pipeline. Muestran que el corte no está garantizado point-in-time."), sev("Moderado", HEX.warnSoft, HEX.warn)],
  [tcell("Variables con sesgo o sin señal", { bold: true }), tcell("contactabilidad_score no predice el contacto: 32 % de no contactados en todos los cuartiles. recibe_remesas: proxy socioeconómico, sin señal (r = −0,01)."), tcell("Excluidas del ranking: la primera reproduciría la política pasada; la segunda es un riesgo de uso responsable sin beneficio."), sev("Moderado", HEX.warnSoft, HEX.warn)],
  [tcell("Dónde está la señal real", { bold: true }), tcell("score_buro (AUC 0,81) y respondio_oferta_previa (0,69). Las otras 18 variables ex ante: AUC < 0,57."), tcell("Un modelo simple y auditable captura casi todo. Verificar permisos y finalidad del uso del score de buró (Ley 1266/2157)."), sev("Útil", HEX.posSoft, HEX.pos)],
];
s.addTable(rowsD, { x: 0.5, y: 1.7, w: 12.33, colW: [2.3, 4.9, 4.0, 1.13], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.45, autoPage: false, fontSize: 10 });

heading(s, "Decisiones de tratamiento", 0.5, 5.45, 6, 13);
bullets(s, [
  [{ text: "Excluidas del modelo: ", bold: true }, { text: "resultado_gestion_30d y dias_hasta_renovacion (fuga); mora30_post_renovacion (es resultado); cliente_id; contactabilidad_score (sesgo operacional); recibe_remesas (uso responsable); regional se usa para capacidad, no para rankear." }],
  [{ text: "Partición: ", bold: true }, { text: "rolling-origin por mes_corte (entrenar con cortes < t, validar en t, t = abril a agosto), con gap de 30 a 60 días por maduración del target y de la mora. Un cliente nunca en dos particiones del mismo corte." }],
  [{ text: "Desbalance: ", bold: true }, { text: "no remuestrear (daña la calibración); evaluar en el punto de operación (conversión top-32 %, lift, Brier). Accuracy trivial: 79,8 % en la base y 96,4 % en producción sin acertar un renovador." }],
], { x: 0.5, y: 5.78, w: 12.33, h: 1.2, size: 10.5, gap: 2 });
s.addNotes("La base sirve para rankear propensión con pocas variables, no para riesgo ni incrementalidad. Dos variables de fuga explican el AUC de C (ver slide 3). Partición temporal con gap; sin remuestreo.");

// ============================================================ SLIDE 3
pres.addSection({ title: "Alternativas" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Alternativas" });
s.addText("3 · De cuatro alternativas, C se descarta por fuga y B es la única lista para piloto", { placeholder: "title" });
const rowsM = [
  [thead("Alt."), thead("Tipo"), thead("AUC"), thead("Conv. top 8k"), thead("Mora 30+"), thead("Lectura crítica"), thead("Veredicto", { align: "center" })],
  [tcell("Actual", { bold: true }), tcell("Regla"), tcell("—"), tcell("3,6 %"), tcell("5,1 %"), tcell("Línea base de la decisión; única con conversión observada en producción."), sev("Champion", HEX.surface, HEX.ink)],
  [tcell("C", { bold: true }), tcell("LightGBM"), tcell("0,94"), tcell("14,8 %"), tcell("6,4 %"), tcell("«Incluye todas las variables». Replicado: con resultado_gestion_30d el AUC fuera de tiempo es 0,95; sin fuga, 0,80. Inviable en producción."), sev("Descartar", HEX.negSoft, HEX.neg)],
  [tcell("A", { bold: true }), tcell("XGBoost"), tcell("0,86"), tcell("9,4 %"), tcell("7,2 %"), tcell("Variables «supuestamente» disponibles; 0,86 supera el techo limpio (0,82) y su mora es la peor: selección adversa. Mantener solo tras auditoría point-in-time."), sev("Auditar", HEX.warnSoft, HEX.warn)],
  [tcell("B", { bold: true }), tcell("Logística"), tcell("0,79"), tcell("8,8 %"), tcell("4,6 %"), tcell("Coherente con la réplica limpia fuera de tiempo (0,79–0,85), calibrado, estable, auditable y con la menor mora."), sev("Piloto", HEX.posSoft, HEX.pos)],
  [tcell("D", { bold: true }), tcell("Uplift"), tcell("Qini 0,12"), tcell("7,9 %"), tcell("+3,1 pp*"), tcell("Único que mide efecto del contacto, pero con unidades mezcladas y campaña «parcialmente» aleatorizada sin detalle. Evaluar en el holdout del piloto."), sev("Aprender", HEX.butter, HEX.ink)],
];
s.addTable(rowsM, { x: 0.5, y: 1.4, w: 7.6, colW: [0.55, 0.8, 0.6, 0.85, 0.7, 3.1, 1.0], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.5, autoPage: false, fontSize: 10 });
s.addText("* La hoja reporta «+3,1 pp incremental» en la columna de mora y Qini en la de PR-AUC: no es comparable con A, B y C sin aclarar unidades.", { ...TB, x: 0.5, y: 5.3, w: 7.6, h: 0.3, fontSize: 9.5, color: HEX.muted, italic: true });

heading(s, "Réplica: el AUC de C se explica por la fuga", 8.4, 1.4, 4.4, 13);
s.addText("AUC fuera de tiempo (entrenar < t, probar en t, abril a agosto) sobre la base entregada", { ...TB, x: 8.4, y: 1.72, w: 4.4, h: 0.35, fontSize: 10, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "AUC", labels: ["18 variables ex ante", "+ resultado_gestion_30d", "+ dias_hasta_renovacion"], values: [0.82, 0.95, 1.0] }], {
  x: 8.4, y: 2.05, w: 4.43, h: 2.6, barDir: "bar", chartColors: [HEX.viz1, HEX.viz3, HEX.neg], invertedColors: [HEX.viz1],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
  valAxisMinVal: 0.5, valAxisMaxVal: 1.05, valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 },
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 60,
});
s.addText("Reportado por C: 0,94. Reportado por B: 0,79. Un k-fold aleatorio da 0,82: no esconde la fuga, la temporalidad sí la revela al comparar con el techo limpio.", { ...TB, x: 8.4, y: 4.7, w: 4.43, h: 0.75, fontSize: 10.5, color: HEX.ink });

heading(s, "Por qué más AUC puede ser peor decisión", 0.5, 5.75, 6, 13);
bullets(s, [
  "Mide el orden completo; la decisión usa solo el 32 % superior y pondera igual un renovador sano que uno en mora.",
  "Si lo inflan variables post-contacto, el ranking real en producción será otro.",
  "Propensión alta no es efecto del contacto: llamar a quien renovaría igual consume cupos sin crear valor.",
], { x: 0.5, y: 6.08, w: 6.2, h: 0.9, size: 10, gap: 1 });
heading(s, "Para comparar propensión vs. uplift necesito", 7.0, 5.75, 5.8, 13);
bullets(s, [
  "Indicador de tratamiento y control con la regla de asignación de la campaña de D (fracción aleatorizada, unidad, cumplimiento).",
  "Un mismo holdout aleatorizado donde se mida uplift@8k de cada modelo, en renovaciones y COP netos de mora, con intervalos.",
], { x: 7.0, y: 6.08, w: 5.83, h: 0.9, size: 10, gap: 1 });
s.addNotes("Repliqué con la base: el AUC de C solo se obtiene incluyendo el resultado de gestión. A supera el techo limpio y tiene la peor mora. B es coherente y calibrado. D es el único que mide incrementalidad pero su evidencia es incompleta.");

// ============================================================ SLIDE 4
pres.addSection({ title: "Valor" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Valor" });
s.addText("4 · B genera más valor que A pese a convertir menos, y la capacidad regional decide cómo repartirlo", { placeholder: "title" });
heading(s, "Valor esperado mensual neto de mora sobre 8.000 contactos", 0.5, 1.4, 7, 13);
s.addText("COP millones. Renovaciones × (420.000 − mora × 1.800.000). D con mora supuesta 5,1 %. C mostrada solo como referencia: no es confiable.", { ...TB, x: 0.5, y: 1.72, w: 7.2, h: 0.4, fontSize: 10, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "VE neto", labels: ["Actual", "A XGBoost", "B Logística", "D Uplift", "C (fuga)"], values: [94.5, 218.4, 237.4, 207.4, 360.9] }], {
  x: 0.5, y: 2.1, w: 7.2, h: 2.4, barDir: "col", chartColors: [HEX.lineStrong, HEX.viz3, HEX.viz1, HEX.viz2, HEX.line],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0",
  valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 }, valAxisMaxVal: 400,
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 70,
});
card(s, { x: 7.95, y: 1.4, w: 2.35, h: 1.6, fill: HEX.mint, overline: "B vs. actual", value: "+143 M", valueSize: 26, foot: "al mes, si las conversiones «top 8k» se sostienen en producción." });
card(s, { x: 10.48, y: 1.4, w: 2.35, h: 1.6, overline: "Valor por renovación", value: "337 k vs 290 k", valueSize: 20, foot: "B frente a A: la mora 4,6 % vs 7,2 % vale más que 0,6 pp de conversión." });
heading(s, "Lo que el cálculo no prueba", 7.95, 3.15, 4.9, 13);
bullets(s, [
  "No es incremental: si la mitad de las 704 renovaciones de B ocurriría sin contacto, el valor baja a 119 M.",
  "A supera a B solo si su mora real es < 5,8 %; con pérdida de 3,5 M por mora, B 182 M vs. A 126 M.",
  "Faltan costo de contacto, LGD real y el origen de las conversiones «top 8k» (no salen de esta base).",
], { x: 7.95, y: 3.5, w: 4.88, h: 1.4, size: 10.5, gap: 2 });

heading(s, "De score a lista operativa: cuotas por regional con transferencia por valor marginal", 0.5, 4.65, 10, 13);
const rowsC = [
  [thead("Regional"), thead("Capacidad"), thead("Si ranking global"), thead("Exceso / ocio"), thead("Mora hist."), thead("Regla operativa")],
  [tcell("Suroccidente"), tcell("2.600"), tcell("2.332"), tcell("−268 ociosos", { color: HEX.warn }), tcell("5,4 %"), tcell("Cuota llena con su propio ranking; cede cupos sobrantes")],
  [tcell("Centro"), tcell("1.900"), tcell("2.117"), tcell("+217 sin gestor", { color: HEX.neg }), tcell("4,7 %"), tcell("Corte por cuota; lista semanal para evitar saturación de cierre de mes")],
  [tcell("Norte"), tcell("1.200"), tcell("1.435"), tcell("+235 sin gestor", { color: HEX.neg }), tcell("6,8 %"), tcell("Mayor valor marginal (93 k por último contacto): recibe cupos transferidos")],
  [tcell("Eje Cafetero"), tcell("1.000"), tcell("1.148"), tcell("+148 sin gestor", { color: HEX.neg }), tcell("4,9 %"), tcell("Corte por cuota; segundo en valor marginal (90 k)")],
  [tcell("Oriente"), tcell("1.300"), tcell("969"), tcell("−331 ociosos", { color: HEX.warn }), tcell("5,5 %"), tcell("Menor valor marginal (60 k): transfiere hasta 10 % de su cuota")],
];
s.addTable(rowsC, { x: 0.5, y: 5.0, w: 12.33, colW: [1.5, 1.1, 1.5, 1.6, 1.0, 5.63], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.26, autoPage: false, fontSize: 9.5 });
s.addText("Simulación con un modelo logístico limpio sobre los cortes junio a agosto (n = 696), VE = p × (420.000 − mora regional × 1.800.000). Con cuotas, la conversión del top 32 % cae de 43,5 % a 41,9 % en muestra, pero la lista es ejecutable.", { ...TB, x: 0.5, y: 6.72, w: 12.33, h: 0.3, fontSize: 9, color: HEX.muted, italic: true });
s.addNotes("B gana por riesgo, no por conversión. El valor no es incremental: por eso el piloto. Capacidad: ranking global sobrecarga tres regionales; cuotas con transferencia por valor marginal.");

// ============================================================ SLIDE 5
pres.addSection({ title: "Piloto" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Piloto" });
s.addText("5 · Un piloto de dos meses con tres brazos prueba la incrementalidad; el riesgo se controla por política, no por el piloto", { placeholder: "title" });
heading(s, "Diseño: aleatorización por cliente, estratificada por regional", 0.5, 1.45, 7, 13);
const arms = [
  ["CHAMPION", "Herramienta actual", "4.000 contactos/mes", HEX.surface],
  ["CHALLENGER", "B + filtro de riesgo + cuotas regionales", "4.000 contactos/mes", HEX.mint],
  ["HOLDOUT", "Sin contacto comercial (top de B)", "≈ 800 clientes/mes", HEX.lavender],
];
arms.forEach((a, i) => {
  const x = 0.5 + i * 2.5;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: 2.35, h: 1.45, fill: { color: a[3] }, line: { color: a[3] }, rectRadius: 0.12 });
  s.addText(a[0], { ...TB, x: x + 0.15, y: 1.95, w: 2.05, h: 0.28, fontSize: 10, bold: true, color: HEX.ink, charSpacing: 1.5 });
  s.addText(a[1], { ...TB, x: x + 0.15, y: 2.25, w: 2.05, h: 0.6, fontSize: 12, bold: true, color: HEX.ink, valign: "top" });
  s.addText(a[2], { ...TB, x: x + 0.15, y: 2.88, w: 2.05, h: 0.3, fontSize: 10.5, color: HEX.ink });
});
bullets(s, [
  [{ text: "Potencia: ", bold: true }, { text: "pasar de 3,6 % a 5,4 % se detecta con 2.081 clientes por brazo (un mes); de 3,6 % a 4,5 % exige 7.530 (dos meses). El holdout de 800 detecta un uplift de 2,3 % a 5 %." }],
  [{ text: "Riesgo: ", bold: true }, { text: "probar mora 5,1 % vs. 7,2 % exigiría 2.053 renovados por brazo (meses). Por eso el riesgo entra como política dura (corte de score de buró y max_mora acordado con Riesgos) y se vigila por vintage." }],
  [{ text: "Duración: ", bold: true }, { text: "30 días de ventana de renovación + 30 a 60 de maduración de mora. Decisión ship/no-ship pre-registrada a los 90 días. Unidad por cliente; un gestor no atiende dos brazos del mismo cliente." }],
], { x: 0.5, y: 3.45, w: 7.3, h: 1.5, size: 10.5, gap: 2 });

heading(s, "Reglas de salida (pre-registradas)", 8.1, 1.45, 4.7, 13);
const rowsS = [
  [thead("Criterio"), thead("Ship si")],
  [tcell("Uplift challenger vs. champion"), tcell("IC 95 % excluye 0 y ≥ +1,5 pp")],
  [tcell("Mora 30+ de renovados"), tcell("No inferior: ≤ champion + 1 pp")],
  [tcell("Quejas y opt-out por 1.000"), tcell("No inferiores al champion")],
  [tcell("Lista ejecutada por regional"), tcell("≥ 90 % en las 5 regionales")],
  [tcell("SRM y calidad del corte"), tcell("χ² p > 0,001; 0 violaciones de esquema")],
];
s.addTable(rowsS, { x: 8.1, y: 1.85, w: 4.73, colW: [2.3, 2.43], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.3, autoPage: false });

heading(s, "Monitoreo de los primeros tres meses", 0.5, 4.85, 6, 13);
const rowsMon = [
  [thead("Dimensión"), thead("Métrica y frecuencia"), thead("Acción")],
  [tcell("Datos"), tcell("Esquema, nulos, rangos, fechas posteriores al corte; cada corte"), tcell("Bloqueo: no se puntúa")],
  [tcell("Drift"), tcell("PSI del score y CSI por variable; mensual, umbral por percentil (n ≈ 250)"), tcell("Investigar; revalidar")],
  [tcell("Performance"), tcell("AUC, calibración y conversión top-k con labels a 30 a 60 días"), tcell("Recalibrar o rollback")],
  [tcell("Riesgo"), tcell("Vintage de mora 30+ por cohorte y brazo; mensual"), tcell("Subir corte; pausa")],
  [tcell("Operación y experiencia"), tcell("% de lista contactada por regional y semana; quejas, opt-out, frecuencia"), tcell("Reasignar cupos; pausa")],
];
s.addTable(rowsMon, { x: 0.5, y: 5.18, w: 7.3, colW: [1.55, 4.15, 1.6], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.24, autoPage: false, fontSize: 9 });
heading(s, "No libero aunque las métricas offline sean buenas si", 8.1, 4.85, 4.7, 13);
bullets(s, [
  "Alguna variable no existe point-in-time en producción o el split no fue temporal.",
  "No hay calibración verificada, validación independiente ni plan de rollback.",
  "No hay holdout para medir incrementalidad ni dueño por guardrail.",
  "La selección excluye a una regional o grupo sin explicación de negocio.",
], { x: 8.1, y: 5.18, w: 4.73, h: 1.5, size: 10, gap: 1 });
s.addNotes("Tres brazos: champion, challenger (B), holdout. Potencia calculada con 3,6 % base. Riesgo por política, no por piloto. Reglas pre-registradas y monitoreo con acciones.");

// ============================================================ SLIDE 6
pres.addSection({ title: "Recomendación" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Recomendación" });
s.addText("6 · Recomendación: pilotear B con holdout desde el próximo corte, no liberar C y auditar A y D", { placeholder: "title" });
kicker(s, "TRES DECISIONES QUE PEDIMOS HOY AL COMITÉ", 0.5, 1.35, 8);
const dec = [
  ["1", "Aprobar el piloto", "Dos meses, tres brazos, 8.000 contactos/mes. Challenger = B + política de riesgo + cuotas regionales. Dueños: Comercial (ejecución), Riesgos (corte), Datos (medición).", HEX.mint],
  ["2", "No liberar C; condicionar A y D", "C usa el resultado de la gestión: inviable. A pasa a producción solo si supera la auditoría point-in-time. D se reevalúa con los datos del holdout.", HEX.sky],
  ["3", "Fijar KPI y guardrails con dueño", "Valor incremental neto por contacto como KPI; cinco guardrails con umbral, ventana y responsable firmados por Riesgos, Comercial, Tecnología y Datos antes del primer corte.", HEX.lavender],
];
dec.forEach((d, i) => {
  const x = 0.5 + i * 4.15;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.7, w: 4.0, h: 1.9, fill: { color: d[3] }, line: { color: d[3] }, rectRadius: 0.12 });
  s.addText(d[0], { ...TB, x: x + 0.2, y: 1.8, w: 0.6, h: 0.55, fontSize: 30, bold: true, color: HEX.ink });
  s.addText(d[1], { ...TB, x: x + 0.8, y: 1.85, w: 3.05, h: 0.5, fontSize: 14, bold: true, color: HEX.ink, valign: "middle" });
  s.addText(d[2], { ...TB, x: x + 0.2, y: 2.4, w: 3.6, h: 1.3, fontSize: 11, color: HEX.ink, valign: "top" });
});

heading(s, "Ruta de 90 días", 0.5, 3.9, 6, 13);
const steps = [
  ["Semanas 1 a 2", "Aclarar denominador del 12 %, regla histórica de contacto y origen de las conversiones «top 8k». Validar permisos del score de buró (Ley 1266/2157, Ley 1581)."],
  ["Semanas 3 a 4", "Pipeline point-in-time con validaciones de esquema; reentrenar B con partición temporal; política de riesgo con Riesgos; cuotas y transferencia por regional."],
  ["Meses 2 a 3", "Piloto en producción con holdout; monitoreo semanal; lectura de mora a 60 días; decisión ship/no-ship pre-registrada."],
  ["Mes 4+", "Si hay uplift: escalar y reentrenar uplift con los datos aleatorizados del piloto. Si no: mantener champion y revisar la hipótesis de contacto."],
];
steps.forEach((st, i) => {
  const y = 4.3 + i * 0.62;
  s.addShape(pres.ShapeType.ellipse, { x: 0.5, y: y + 0.08, w: 0.32, h: 0.32, fill: { color: HEX.mint }, line: { color: HEX.mint } });
  s.addText(String(i + 1), { ...TB, x: 0.5, y: y + 0.08, w: 0.32, h: 0.32, fontSize: 11, bold: true, color: HEX.ink, align: "center", valign: "middle" });
  s.addText([{ text: st[0] + "  ", options: { bold: true } }, { text: st[1] }], { ...TB, x: 0.95, y, w: 6.9, h: 0.55, fontSize: 10.5, color: HEX.ink, valign: "middle" });
});

heading(s, "Gobierno y uso responsable", 8.1, 3.9, 4.7, 13);
bullets(s, [
  [{ text: "Exclusión sistemática: ", bold: true }, { text: "tasas de selección y conversión por regional, remesas, contactabilidad y tercil de buró cada corte (regla 0,8). El modelo limpio ya concentra el 80 % de la lista en el tercil alto de buró: la política de riesgo debe fijar ese piso de forma explícita, no el algoritmo." }],
  [{ text: "Auditable: ", bold: true }, { text: "model card, datasheet de la base, ficha de fuga por variable (timestamp y fuente), partición y semillas, plan de monitoreo con dueños y bitácora de decisiones (RACI)." }],
  [{ text: "SHAP no es causa: ", bold: true }, { text: "muestra qué acompaña la renovación en el histórico, no qué la provoca; el score de buró pesa porque a quien lo tiene alto se le ofrece más. Solo el holdout dice si llamar cambia el resultado." }],
], { x: 8.1, y: 4.25, w: 4.73, h: 2.7, size: 10.5, gap: 3 });
s.addNotes("Pedimos tres decisiones. Ruta 90 días. Gobierno: equidad medida por corte, documentación auditable, SHAP es correlación.");

// ============================================================ ANEXO
pres.addSection({ title: "Anexo" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Anexo" });
s.addText("Anexo · Soporte técnico: réplica, economía, tamaños de muestra y variables", { placeholder: "title" });
heading(s, "Réplica fuera de tiempo (train < t, test = t, t = abril a agosto)", 0.5, 1.35, 6, 12);
const rowsR = [
  [thead("Conjunto de variables"), thead("Modelo"), thead("AUC"), thead("Rango"), thead("PR-AUC"), thead("Conv. top 32 %"), thead("Brier")],
  [tcell("18 ex ante limpias"), tcell("Logística"), tcell("0,820"), tcell("0,79–0,85"), tcell("0,52"), tcell("44,6 %"), tcell("0,128")],
  [tcell("18 ex ante limpias"), tcell("LightGBM"), tcell("0,797"), tcell("0,76–0,83"), tcell("0,49"), tcell("42,3 %"), tcell("0,134")],
  [tcell("+ remesas, contactabilidad, regional"), tcell("Logística"), tcell("0,822"), tcell("0,79–0,85"), tcell("0,52"), tcell("44,6 %"), tcell("0,127")],
  [tcell("+ resultado_gestion_30d"), tcell("Logística"), tcell("0,949"), tcell("0,93–0,97"), tcell("0,86"), tcell("58,9 %"), tcell("0,062")],
  [tcell("+ dias_hasta_renovacion"), tcell("LightGBM"), tcell("1,000"), tcell("1,00–1,00"), tcell("1,00"), tcell("63,4 %"), tcell("0,000")],
];
s.addTable(rowsR, { x: 0.5, y: 1.7, w: 7.3, colW: [2.4, 0.9, 0.7, 0.95, 0.75, 1.0, 0.6], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.27, autoPage: false, fontSize: 9.5 });
s.addText("Prevalencia de la base 20,2 %; top 32 % = 8.000/25.000. k-fold aleatorio con variables limpias: 0,82. Coeficientes estandarizados del modelo limpio: score_buro 1,30; max_mora_6m −0,56; respondio_oferta_previa 0,26; el resto < 0,15.", { ...TB, x: 0.5, y: 3.45, w: 7.3, h: 0.55, fontSize: 9.5, color: HEX.muted });

heading(s, "Valor esperado mensual (COP millones, 8.000 contactos)", 8.1, 1.35, 4.7, 12);
const rowsV = [
  [thead("Alt."), thead("Renov."), thead("Mora"), thead("Bruto"), thead("Costo mora"), thead("Neto")],
  [tcell("Actual"), tcell("288"), tcell("5,1 %"), tcell("121,0"), tcell("26,4"), tcell("94,5")],
  [tcell("A"), tcell("752"), tcell("7,2 %"), tcell("315,8"), tcell("97,5"), tcell("218,4")],
  [tcell("B"), tcell("704"), tcell("4,6 %"), tcell("295,7"), tcell("58,3"), tcell("237,4")],
  [tcell("D"), tcell("632"), tcell("5,1 %*"), tcell("265,4"), tcell("58,0"), tcell("207,4")],
  [tcell("C"), tcell("1.184"), tcell("6,4 %"), tcell("497,3"), tcell("136,4"), tcell("360,9 (no confiable)")],
];
s.addTable(rowsV, { x: 8.1, y: 1.7, w: 4.73, colW: [0.55, 0.65, 0.65, 0.65, 0.9, 1.33], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.27, autoPage: false, fontSize: 9.5 });
s.addText("* Mora no reportada para D; se asume la de la herramienta actual. Valor incremental de D si +3,1 pp es uplift de conversión: 248 × 328 k = 81 M/mes. Sensibilidad B vs. A con pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: 263/237/215/182 vs. 262/218/181/126.", { ...TB, x: 8.1, y: 3.45, w: 4.73, h: 0.7, fontSize: 9.5, color: HEX.muted });

heading(s, "Tamaño por brazo (α 5 %, potencia 80 %)", 0.5, 4.2, 6, 12);
const rowsN = [
  [thead("Hipótesis"), thead("n por brazo")],
  [tcell("Conversión 3,6 % a 4,5 % (+25 % relativo)"), tcell("7.530")],
  [tcell("Conversión 3,6 % a 5,4 % (+50 % relativo)"), tcell("2.081")],
  [tcell("Conversión 3,6 % a 7,2 % (×2)"), tcell("618")],
  [tcell("Mora 5,1 % a 7,2 % entre renovados"), tcell("2.053 renovados")],
  [tcell("Holdout: orgánico 2,3 % a 5 % con contacto"), tcell("756")],
];
s.addTable(rowsN, { x: 0.5, y: 4.55, w: 5.2, colW: [3.9, 1.3], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.27, autoPage: false, fontSize: 9.5 });

heading(s, "Variables excluidas del ranking, por motivo", 6.0, 4.2, 6.8, 12);
const rowsX = [
  [thead("Motivo"), thead("Variables"), thead("Tratamiento")],
  [tcell("Fuga / resultado"), tcell("resultado_gestion_30d, dias_hasta_renovacion, mora30_post_renovacion, renovo_30d"), tcell("Solo como target o para evaluación")],
  [tcell("Disponibilidad temporal"), tcell("fecha_ultimo_contacto (1 fecha > corte), cuotas_pagadas_pct y monto_preaprobado sin timestamp"), tcell("Reconstruir point-in-time; validar antes de usar")],
  [tcell("Calidad"), tcell("max_mora_6m < 0, saldo_ahorros < 0, endeudamiento > 1, score_buro fuera de rango, duplicado C01199"), tcell("Reglas de validación; corregir o imputar con registro")],
  [tcell("Uso responsable y sesgo"), tcell("recibe_remesas (proxy), contactabilidad_score (política pasada), regional (solo capacidad), cliente_id"), tcell("Fuera del score; monitoreadas como grupos de equidad")],
];
s.addTable(rowsX, { x: 6.0, y: 4.55, w: 6.83, colW: [1.45, 3.5, 1.88], border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.42, autoPage: false, fontSize: 9 });
s.addText("Código y cálculos: work/01_diagnostico.py, work/02_modelos_fuga.py y work/03_economia_capacidad_piloto.py, sobre una copia del anexo. El original no se modificó (hash verificado).", { ...TB, x: 0.5, y: 6.25, w: 5.2, h: 0.7, fontSize: 9, color: HEX.muted, italic: true, valign: "top" });
s.addNotes("Anexo de soporte para preguntas técnicas.");

(async () => {
  const out = "C:/Users/Davinson/Desktop/banco w/entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("written", out);
})();
