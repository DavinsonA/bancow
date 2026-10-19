// Deck ejecutivo Banco W - 6 slides + 1 anexo. Tema "Día pastel", fuentes seguras.
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

const FOOT = "Preparado para Banco W · Prueba técnica Científico de Datos · Davinson Arteaga";
pres.defineSlideMaster({
  title: "CONTENT", background: { color: "FFFFFF" },
  objects: [
    { text: { text: FOOT, options: { x: 0.5, y: 7.05, w: 10.5, h: 0.3, fontSize: 9, color: HEX.muted, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.35, w: 12.33, h: 0.55, fontSize: 24, bold: true, color: HEX.ink, margin: 0, valign: "top", align: "left" } } },
  ],
  slideNumber: { x: 12.3, y: 7.05, w: 0.6, h: 0.3, fontSize: 9, color: HEX.muted, align: "right" },
});

// ---------- helpers ----------
const TB = { isTextBox: true, margin: 0, fontFace: "Calibri" };
// Caja de respuesta bajo el título: regla vertical en el color de acento + frase completa que contesta la pregunta del enunciado.
function answer(slide, text) {
  slide.addShape(pres.ShapeType.rect, { x: 0.5, y: 0.95, w: 0.06, h: 0.72, fill: { color: HEX.viz1 }, line: { color: HEX.viz1 }, objectName: "Respuesta" });
  slide.addText(text, { ...TB, x: 0.7, y: 0.95, w: 12.13, h: 0.72, fontSize: 12.5, color: HEX.ink, valign: "middle", lineSpacingMultiple: 1.1 });
}
function card(slide, { x, y, w, h, fill = HEX.surface, overline, value, foot, valueSize = 30, ink = HEX.ink, name }) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, objectName: name || overline });
  slide.addText(overline, { ...TB, x: x + 0.18, y: y + 0.12, w: w - 0.36, h: 0.3, fontSize: 11, bold: true, color: ink, charSpacing: 1.5 });
  slide.addText(value, { ...TB, x: x + 0.18, y: y + 0.38, w: w - 0.36, h: 0.5, fontSize: valueSize, bold: true, color: ink, valign: "middle" });
  if (foot) slide.addText(foot, { ...TB, x: x + 0.18, y: y + 0.92, w: w - 0.36, h: h - 1.0, fontSize: 11, color: ink, valign: "top" });
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
function heading(slide, text, x, y, w, size = 13) {
  slide.addText(text, { ...TB, x, y, w, h: 0.32, fontSize: size, bold: true, color: HEX.ink });
}
const tcell = (text, o = {}) => ({ text, options: { fontSize: 10.5, color: HEX.ink, fontFace: "Calibri", valign: "middle", margin: [2, 4, 2, 4], ...o } });
const thead = (text, o = {}) => tcell(text, { bold: true, fill: { color: HEX.surface }, color: HEX.ink, ...o });

// Slides 1-6 + anexo. Límites (qa_deck.py): ≤ 170 palabras fuera de tablas (sin título), cuerpo ≥ 11 pt, tablas ≥ 10 pt y ≤ 5 filas (monitoreo ≤ 6), sin jerga en el texto visible.
// Nota: el enunciado limita a 6 slides + 1 anexo. No se agrega portada: la slide 1 es la decisión.
const arm = (slide, x, y, w, h, fill, label, main) => {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, objectName: label });
  slide.addText(label, { ...TB, x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.28, fontSize: 11, bold: true, color: HEX.ink });
  slide.addText(main, { ...TB, x: x + 0.15, y: y + 0.4, w: w - 0.3, h: h - 0.5, fontSize: 11.5, color: HEX.ink, valign: "top" });
};
const sev = (t, f, i) => tcell(t, { bold: true, fill: { color: f }, color: i, align: "center" });
const tbl = (slide, rows, o) => slide.addTable(rows, { border: { type: "solid", color: HEX.line, pt: 0.75 }, autoPage: false, fontSize: 10.5, ...o });

// ============================================================ SLIDE 1 · ¿Qué decisión debemos tomar y por qué importa?
pres.addSection({ title: "Decisión" });
let s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Decisión" });
s.addText("1 · Decidir a quién contactar con 8.000 cupos al mes", { placeholder: "title" });
answer(s, "Debemos decidir a cuáles 8.000 de los 25.000 clientes elegibles contactamos cada mes, y elegirlos por valor neto de riesgo, no por probabilidad de renovar. Importa porque una renovación que cae en mora 30+ borra lo que aportan 4,3 renovaciones sanas.");
card(s, { x: 0.5, y: 1.8, w: 3.95, h: 1.5, fill: HEX.mint, overline: "CAPACIDAD", value: "8.000 de 25.000", valueSize: 24, foot: "La restricción es la capacidad, no la demanda." });
card(s, { x: 4.69, y: 1.8, w: 3.95, h: 1.5, overline: "HOY Y META", value: "3,6 % = 288", valueSize: 24, foot: "Meta 12 %: 960 renovaciones si es sobre contactados, 3.000 si es sobre elegibles." });
card(s, { x: 8.88, y: 1.8, w: 3.95, h: 1.5, overline: "RIESGO", value: "1 mora = 4,3 sanas", valueSize: 24, foot: "Una mora 30+ cuesta lo que aportan 4,3 renovaciones sanas." });

bullets(s, [
  "Hoy podemos ordenar por propensión, filtrar riesgo con la política de Riesgos y valorar cada renovación; medir el efecto real del contacto exige un grupo de control que aún no existe.",
  "El 12 % no se adopta hasta fijar sobre qué se mide, en qué ventana y si cuenta a quien renueva solo (2,3 % lo hizo).",
  "Una pregunta antes de modelar: ¿cómo se elige hoy a quién contactar? Define si el histórico mide el efecto del contacto o solo la política vigente.",
], { x: 0.5, y: 3.5, w: 6.6, h: 3.4, size: 12, gap: 14 });

s.addShape(pres.ShapeType.roundRect, { x: 7.4, y: 3.5, w: 5.43, h: 1.0, fill: { color: HEX.posSoft }, line: { color: HEX.posSoft }, rectRadius: 0.1, objectName: "KPI" });
s.addText([{ text: "KPI: ", options: { bold: true } }, { text: "pesos ganados por contacto, netos de mora y medidos frente a un grupo de control. Mientras no haya control: renovaciones por cada 1.000 contactos." }],
  { ...TB, x: 7.55, y: 3.55, w: 5.15, h: 0.9, fontSize: 11.5, color: HEX.ink, valign: "middle" });
heading(s, "Guardrails: cinco límites que la lista debe respetar", 7.4, 4.6, 5.43, 12);
bullets(s, [
  [{ text: "Riesgo: ", bold: true }, { text: "la mora esperada de la lista no supera el umbral de Riesgos; si lo supera, no se ejecuta." }],
  [{ text: "Experiencia: ", bold: true }, { text: "quejas y bajas por cada 1.000 contactos no peores que hoy; si empeoran, se detiene." }],
  [{ text: "Equidad: ", bold: true }, { text: "ningún grupo ni regional queda por debajo del 80 % de la tasa de selección de los demás; si pasa, se revisa." }],
  [{ text: "Operación: ", bold: true }, { text: "se ejecuta al menos el 90 % de la lista en cada regional; si no, se reasignan cupos." }],
  [{ text: "Confiabilidad: ", bold: true }, { text: "datos y aleatorización válidos en cada corte; si fallan, no se puntúa." }],
], { x: 7.4, y: 4.95, w: 5.43, h: 2.05, size: 11, gap: 3 });
s.addNotes("Mensaje: la restricción es la capacidad, así que el problema es decidir a quién contactar, no predecir. KPI incremental neto de riesgo; el proxy mensual (incrementales por 1.000 contactos) sirve mientras madura la mora. 12 % sin denominador no es una meta: 960 si es sobre 8.000, 3.000 si es sobre 25.000 (37,5 % por contacto). Punto de equilibrio: una renovación deja de aportar si la mora supera 23,3 % (420.000 / 1.800.000). Guardrail de riesgo: la mora esperada de la lista (score y política de Riesgos) se verifica antes de ejecutar; el vintage de mora 30+ a 60 días por cohorte confirma (alarma y pausa). La pregunta única define si el histórico permite medir causalidad o solo describe la política vigente.");

// ============================================================ SLIDE 2 · ¿Qué descubrimos en los datos y qué no deberíamos confiar?
pres.addSection({ title: "Datos" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Datos" });
s.addText("2 · Qué descubrimos en los datos y en qué no deberíamos confiar", { placeholder: "title" });
answer(s, "La base sirve para ordenar clientes por propensión, pero no para medir riesgo ni el efecto del contacto. No deberíamos confiar en dos variables que ya contienen el resultado, ni en las conversiones de la hoja de modelos como si salieran de esta base.");
heading(s, "Cinco hallazgos en la base de clientes (1.800 filas, 8 cortes mensuales)", 0.5, 1.8, 10);
tbl(s, [
  [thead("Hallazgo"), thead("Cifra"), thead("Qué implica"), thead("Nivel", { align: "center" })],
  [tcell("Fuga en dos variables", { bold: true }), tcell("resultado_gestion_30d AUC 0,83; dias_hasta_renovacion AUC 1,00"), tcell("Se conocen después de gestionar; cualquier modelo que las use se verá mejor de lo que será."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("La base no es el universo", { bold: true }), tcell("Renovación 20,2 % vs. 3,6 %; 1.800 filas vs. 25.000 al mes"), tcell("Las conversiones de la hoja vienen de otra población y no se comparan con esta base."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Riesgo no modelable", { bold: true }), tcell("3 moras en 364 renovados (0,8 %) vs. 4,6–7,2 % reportado"), tcell("Hay 3 moras: el riesgo tiene que venir de la política de Riesgos."), sev("Crítico", HEX.negSoft, HEX.neg)],
  [tcell("Calidad y fechas", { bold: true }), tcell("1 duplicado; 1 contacto posterior al corte; 25 endeudamientos > 1"), tcell("La base no garantiza que cada dato existiera en la fecha de corte; hacen falta reglas de validación."), sev("Moderado", HEX.warnSoft, HEX.warn)],
  [tcell("Señal concentrada", { bold: true }), tcell("score_buro AUC 0,81; respondio_oferta 0,69; resto < 0,57"), tcell("Dos variables explican casi toda la señal; un modelo simple basta."), sev("Útil", HEX.posSoft, HEX.pos)],
], { x: 0.5, y: 2.15, w: 12.33, colW: [2.2, 4.2, 4.6, 1.33], rowH: 0.45 });

heading(s, "Qué decidimos hacer con los datos", 0.5, 5.0, 8);
bullets(s, [
  [{ text: "Variables: ", bold: true }, { text: "quedan 15. Fuera las que contienen el resultado, las de contacto sin fecha certificada, y la contactabilidad y las remesas, que reproducirían la política pasada sin aportar señal." }],
  [{ text: "Validación: ", bold: true }, { text: "validamos como se va a usar. Entrenamos con meses anteriores cuyo resultado ya maduró, dejamos un mes de espera y probamos en el siguiente, cuatro veces." }],
  [{ text: "Desbalance: ", bold: true }, { text: "sin remuestreo. Evaluamos en el 32 % superior, que es lo que cabe en la capacidad, con probabilidades calibradas; el accuracy engaña (79,8 % sin acertar un renovador)." }],
], { x: 0.5, y: 5.35, w: 12.33, h: 1.65, size: 11.5, gap: 4 });
s.addNotes("Detalle de cada hallazgo en la guía P5 y P6. Fuga: 78 % de «Acepta» renueva; dias_hasta_renovacion es nulo exactamente en los 1.436 no renovados. Calidad: max_mora_6m = −4, ahorro −350.000, contacto fechado 2026-09-15 con corte agosto; score de buró 352–912 está dentro de la escala DataCrédito 150–950 (confirmar central, versión y vigencia). contactabilidad_score no predice el contacto (entre 29 % y 32 % de no contactados en los cuatro cuartiles). cuotas_pagadas_pct, monto_preaprobado y dias_ultimo_contacto quedan fuera del set limpio hasta certificar su timestamp (51 contactos fechados dentro del mes de corte y 1 después): no cuesta señal (AUC univariado 0,50–0,53); en producción se recalcula a la fecha de corte. Partición rolling-origin con un corte de gap (entrenar ≤ t−2, probar en t, mayo a agosto); deduplicar por cliente. Accuracy trivial: 79,8 % en la base, 96,4 % en producción sin acertar un renovador.");

// ============================================================ SLIDE 3 · ¿Qué alternativas de modelo tenemos y cuáles sobreviven al análisis?
pres.addSection({ title: "Alternativas" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Alternativas" });
s.addText("3 · Qué alternativas sobreviven: B a piloto, A condicionada, C no", { placeholder: "title" });
answer(s, "Sobreviven dos: B va a piloto, y A solo si pasa una verificación variable por variable. C no sobrevive porque su AUC viene de información que no existe al priorizar. D no se puede juzgar con lo entregado y se evalúa en el piloto.");
tbl(s, [
  [thead("Alt."), thead("Tipo"), thead("AUC"), thead("Conversión reportada"), thead("Mora"), thead("Lectura crítica"), thead("Veredicto", { align: "center" })],
  [tcell("Actual", { bold: true }), tcell("Regla"), tcell("—"), tcell("3,6 %"), tcell("5,1 %"), tcell("Es la referencia: la única conversión observada en producción."), sev("Referencia", HEX.surface, HEX.ink)],
  [tcell("C", { bold: true }), tcell("LightGBM"), tcell("0,94"), tcell("14,8 %"), tcell("6,4 %"), tcell("Repliqué su 0,94: solo aparece al incluir el resultado de la gestión; con variables legítimas da 0,82."), sev("Descartar", HEX.negSoft, HEX.neg)],
  [tcell("A", { bold: true }), tcell("XGBoost"), tcell("0,86"), tcell("9,4 %"), tcell("7,2 %"), tcell("Su 0,86 no se confirma con esta base y su mora es la más alta; hay que verificar cada variable antes de usarlo."), sev("Verificar", HEX.warnSoft, HEX.warn)],
  [tcell("B", { bold: true }), tcell("Logística"), tcell("0,79"), tcell("8,8 %"), tcell("4,6 %"), tcell("Su 0,79 coincide con lo que la base permite, está calibrado y tiene la menor mora; también se verifica antes del piloto."), sev("Piloto", HEX.posSoft, HEX.pos)],
  [tcell("D", { bold: true }), tcell("Uplift"), tcell("Qini 0,12"), tcell("7,9 %"), tcell("+3,1 pp"), tcell("Único que mide el efecto del contacto, pero sus cifras no son comparables y no se sabe cómo se aleatorizó."), sev("Evaluar en piloto", HEX.butter, HEX.ink)],
], { x: 0.5, y: 1.8, w: 7.7, colW: [0.55, 0.8, 0.55, 0.95, 0.6, 3.15, 1.1], rowH: 0.58, fontSize: 10 });

heading(s, "Réplica: el 0,94 de C solo aparece con la fuga", 8.5, 1.8, 4.33, 12);
s.addText("AUC validado en el tiempo: entrenamos con meses anteriores, esperamos un mes y probamos en el siguiente, de mayo a agosto.", { ...TB, x: 8.5, y: 2.12, w: 4.33, h: 0.42, fontSize: 11, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "AUC", labels: ["15 variables disponibles al corte", "+ resultado_gestion_30d", "+ dias_hasta_renovacion"], values: [0.82, 0.944, 0.997] }], {
  x: 8.5, y: 2.55, w: 4.33, h: 2.05, barDir: "bar", chartColors: [HEX.viz1, HEX.viz3, HEX.neg], invertedColors: [HEX.viz1],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
  valAxisMinVal: 0.5, valAxisMaxVal: 1.05, valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 },
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 60,
});
s.addText("El 0,94 de la hoja es lo que produce la fuga; una validación aleatoria (0,82) no la habría revelado, la temporal sí.", { ...TB, x: 8.5, y: 4.62, w: 4.33, h: 0.6, fontSize: 11, color: HEX.ink });

heading(s, "Por qué más AUC puede ser peor decisión", 0.5, 5.4, 6.2, 12);
bullets(s, [
  "El AUC ordena a todos los clientes, pero nosotros usamos solo el 32 % superior, y el AUC no distingue una renovación sana de una que cae en mora.",
  "Una propensión alta no es efecto del contacto: llamar a quien renovaría igual gasta cupos.",
], { x: 0.5, y: 5.75, w: 6.2, h: 1.25, size: 11, gap: 3 });
heading(s, "Para comparar D con A y B hace falta", 7.0, 5.4, 5.83, 12);
bullets(s, [
  "Saber cómo se asignó la campaña con la que se entrenó D: qué parte fue al azar y cómo se cumplió.",
  "Medir los tres modelos en un mismo grupo de control, en renovaciones incrementales y pesos netos de mora.",
], { x: 7.0, y: 5.75, w: 5.83, h: 1.25, size: 11, gap: 3 });
s.addNotes("Repliqué con la base: el AUC de C (0,94) solo se obtiene incluyendo el resultado de gestión; con dias_hasta_renovacion llega a 1,00. A: 0,86 supera lo que esta base permite replicar (0,82), pero la hoja viene de otra población, así que no es concluyente; su mora 7,2 % es la peor y, de ser real, lo convierte en la alternativa de menor valor; ambas cosas exigen auditoría variable por variable. B: coherente con la réplica, calibrado (pendiente 0,91), estable; pasa a piloto tras la misma ficha de fuga. D: la hoja reporta «+3,1 pp incremental» en la columna de mora y Qini en la de PR-AUC; no es comparable con A, B y C sin aclarar unidades. Las conversiones «top 8k» de la hoja y la conversión top 32 % de la réplica (≈ 45 %) no son comparables: otra población y otra regla de contacto. Para comparar propensión vs. uplift: la regla de asignación de la campaña de D (fracción aleatorizada, unidad, cumplimiento) y un mismo holdout donde medir uplift@8k de cada modelo en COP netos de mora, con intervalos.");

// ============================================================ SLIDE 4 · ¿Cuál genera mayor valor bajo riesgo y capacidad real?
pres.addSection({ title: "Valor" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Valor" });
s.addText("4 · B genera más valor bajo riesgo y capacidad real", { placeholder: "title" });
answer(s, "B: 237 millones al mes netos de mora frente a 218 de A, porque cada renovación de B vale 337.200 y cada una de A 290.400. Ese valor solo se captura si la lista respeta la capacidad de cada regional, y cerca de la mitad podría no deberse al contacto.");
heading(s, "Valor esperado mensual neto de mora (COP millones)", 0.5, 1.8, 5.9, 12);
s.addText("Para cada alternativa: 8.000 contactos por su conversión, por 420.000 menos la mora por 1.800.000. Para D se asume la mora actual (5,1 %); C queda fuera por la fuga.", { ...TB, x: 0.5, y: 2.12, w: 5.9, h: 0.45, fontSize: 11, color: HEX.muted });
s.addChart(pres.ChartType.bar, [{ name: "VE neto", labels: ["Actual", "A XGBoost", "B Logística", "D Uplift"], values: [94.5, 218.4, 237.4, 207.4] }], {
  x: 0.5, y: 2.6, w: 5.9, h: 2.35, barDir: "col", chartColors: [HEX.lineStrong, HEX.viz3, HEX.viz1, HEX.viz2],
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0",
  valAxisLabelFontSize: 9, valAxisLabelColor: HEX.muted, valAxisLabelFontFace: "+mn-lt", valGridLine: { color: HEX.line, size: 0.5 }, valAxisMaxVal: 300,
  catAxisLabelFontSize: 10, catAxisLabelColor: HEX.ink, catAxisLabelFontFace: "+mn-lt", catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 70,
});
card(s, { x: 6.7, y: 1.8, w: 3.0, h: 1.25, fill: HEX.mint, overline: "B FRENTE A HOY", value: "+143 M al mes", valueSize: 22, foot: "frente a hoy, si las conversiones reportadas se cumplen en producción." });
card(s, { x: 9.83, y: 1.8, w: 3.0, h: 1.25, overline: "POR RENOVACIÓN", value: "B 337 k, A 290 k", valueSize: 22, foot: "la menor mora de B vale más que la mayor conversión de A." });
heading(s, "Lo que el cálculo no prueba", 6.7, 3.15, 6.13, 12);
bullets(s, [
  "No es incremental: si, como sugiere la base, el 5 % del segmento de B renueva sin contacto, el 57 % de sus renovaciones ocurriría igual y el valor creado por el contacto sería de unos 103 millones.",
  "La ventaja de B en conversión no es distinguible del azar y la de mora apenas lo es; B gana por ser más seguro y auditable.",
  "A solo superaría a B con una mora real menor que 5,8 %; faltan el costo de contacto, la pérdida real por mora y el origen de las conversiones reportadas.",
], { x: 6.7, y: 3.47, w: 6.13, h: 1.55, size: 11, gap: 2 });

heading(s, "Cómo se reparten los 8.000: cada regional llena su cuota y los cupos sobrantes van donde más valen", 0.5, 5.08, 12.33, 12);
tbl(s, [
  [thead("Regional"), thead("Capacidad"), thead("Contactos que exigiría un ranking único"), thead("Frente a la capacidad"), thead("Mora histórica"), thead("Regla")],
  [tcell("Suroccidente"), tcell("2.600"), tcell("≈ 2.400"), tcell("≈ 200 cupos sin usar", { color: HEX.warn }), tcell("5,4 %"), tcell("Llena su cuota con su propio ranking y cede los cupos que no use.")],
  [tcell("Centro"), tcell("1.900"), tcell("≈ 2.100"), tcell("≈ 200 clientes sin gestor", { color: HEX.neg }), tcell("4,7 %"), tcell("Lista semanal para evitar la saturación de fin de mes.")],
  [tcell("Norte"), tcell("1.200"), tcell("≈ 1.300"), tcell("≈ 100 clientes sin gestor", { color: HEX.neg }), tcell("6,8 %"), tcell("El último contacto vale 85 k: recibe los cupos transferidos.")],
  [tcell("Eje Cafetero"), tcell("1.000"), tcell("≈ 1.100"), tcell("≈ 100 clientes sin gestor", { color: HEX.neg }), tcell("4,9 %"), tcell("Segundo en valor del último contacto (82 k).")],
  [tcell("Oriente"), tcell("1.300"), tcell("≈ 1.100"), tcell("≈ 200 cupos sin usar", { color: HEX.warn }), tcell("5,5 %"), tcell("El último contacto vale 65 k: cede cupos, con un tope a pactar.")],
], { x: 0.5, y: 5.4, w: 12.33, colW: [1.3, 1.0, 2.5, 1.9, 1.1, 4.53], rowH: 0.235, fontSize: 10 });
s.addText("Modelo simple, junio a agosto (696 clientes); proyección aproximada a partir de la muestra.", { ...TB, x: 0.5, y: 6.83, w: 12.33, h: 0.2, fontSize: 11, color: HEX.muted, italic: true });
s.addNotes("B gana por riesgo, no por conversión: cada renovación de B vale 337.200 frente a 290.400 de A. Incertidumbre (supuesto 8.000 contactos por alternativa, 752 y 704 renovados): conversión z = 1,32 (p 0,19), mora z = 2,11 (p 0,03); en valor B es al menos equivalente dentro de la incertidumbre. El valor no es incremental: el orgánico del tercil alto de buró (de donde sale el top de B) es ≈ 5 % (7 de 129 no contactados renovaron solos; IC 2,7–10,8 %), así que ≈ 57 % de las renovaciones de B serían orgánicas y el valor incremental ≈ 103 M (129 M con orgánico 4 %, 76 M con 6 %). Por eso el piloto. Faltan el costo de contacto, la LGD real y el origen del «top 8k». Capacidad: un ranking global sobrecarga Centro, Norte y Eje y deja ≈ 400 cupos ociosos en Suroccidente y Oriente; cuotas por regional con transferencia por valor marginal (tope a pactar con Comercial, 10 % como referencia). La conversión en muestra con y sin cuotas es equivalente (41,9 % vs. 43,5 %, cuatro renovaciones de diferencia, dentro del ruido). Sensibilidad a la pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: B 263 / 237 / 215 / 182 vs. A 262 / 218 / 181 / 126.");

// ============================================================ SLIDE 5 · ¿Cómo probaríamos que funciona y cómo controlamos el riesgo?
pres.addSection({ title: "Piloto" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Piloto" });
s.addText("5 · Cómo probamos que funciona y cómo controlamos el riesgo", { placeholder: "title" });
answer(s, "Con un piloto de dos meses: partimos el universo en dos mitades al azar, la herramienta actual elige en una y B en la otra, y dejamos 800 clientes del top de B sin contactar para medir si la llamada crea renovaciones. El riesgo no se prueba en el piloto: ambos brazos usan el mismo corte de Riesgos y la mora se vigila por cosecha mensual.");
heading(s, "Diseño: el universo se parte en dos mitades al azar, con el mismo corte de Riesgos", 0.5, 1.8, 7.5, 12);
arm(s, 0.5, 2.15, 2.4, 1.15, HEX.surface, "Lista actual (champion)", "La herramienta actual elige sus 4.000 en una mitad del universo.");
arm(s, 3.05, 2.15, 2.4, 1.15, HEX.mint, "Lista nueva", "B ordena la otra mitad con cuotas por regional y toma sus 4.800 mejores.");
arm(s, 5.6, 2.15, 2.4, 1.15, HEX.lavender, "Grupo de control", "800 de esos 4.800, elegidos al azar, no se contactan: son el grupo de control.");
bullets(s, [
  [{ text: "Calidad de la lista: ", bold: true }, { text: "una mejora de 3,6 % a 5,4 % se detecta en un mes con 4.000 contactos por brazo." }],
  [{ text: "Efecto del contacto: ", bold: true }, { text: "si el contacto añade 3,8 puntos sobre el 5 % que renueva solo, el grupo de control lo muestra en menos de un mes; si añade 1,7, en poco más de dos." }],
  [{ text: "Riesgo: ", bold: true }, { text: "no se prueba aquí. Mismo corte de Riesgos en ambos brazos y seguimiento de la mora de cada cosecha." }],
  [{ text: "Límite: ", bold: true }, { text: "no mediremos si la herramienta actual crea renovaciones; añadir 400 de control allí costaría unos 2,3 millones al mes." }],
], { x: 0.5, y: 3.42, w: 7.5, h: 1.6, size: 11, gap: 2 });

heading(s, "Reglas de decisión, escritas antes del piloto", 8.3, 1.8, 4.53, 12);
tbl(s, [
  [thead("Criterio"), thead("Se adopta si")],
  [tcell("La lista nueva convierte más que la actual"), tcell("al menos 1,5 puntos más, con diferencia estadísticamente clara")],
  [tcell("Contactar crea renovaciones frente al grupo de control"), tcell("diferencia estadísticamente clara")],
  [tcell("Mora 30+ de renovados"), tcell("no supera la actual en más de 1 punto")],
  [tcell("Quejas y bajas por 1.000"), tcell("no peores que hoy")],
  [tcell("La lista se ejecutó y la asignación al azar se cumplió"), tcell("al menos 90 % por regional; sin sesgo de asignación")],
], { x: 8.3, y: 2.15, w: 4.53, colW: [2.25, 2.28], rowH: 0.36, fontSize: 10 });

heading(s, "Monitoreo durante los tres meses", 0.5, 4.75, 7.5, 12);
tbl(s, [
  [thead("Dimensión"), thead("Qué se vigila"), thead("Acción")],
  [tcell("Datos"), tcell("Validación de cada corte: formatos, rangos y fechas"), tcell("Si falla, no se puntúa")],
  [tcell("Población"), tcell("Cambios en la población (PSI del score y de cada variable)"), tcell("Investigar desde 0,10; revalidar desde 0,25")],
  [tcell("Desempeño"), tcell("Resultado real del modelo cuando el dato madura (30 a 60 días)"), tcell("Recalibrar o volver a la herramienta actual")],
  [tcell("Riesgo"), tcell("Mora 30+ de cada cosecha mensual, por brazo y regional"), tcell("Endurecer el corte o pausar")],
  [tcell("Operación"), tcell("Lista contactada por regional y semana"), tcell("Reasignar cupos")],
  [tcell("Experiencia"), tcell("Quejas y bajas por 1.000 contactos"), tcell("Pausar")],
], { x: 0.5, y: 5.07, w: 7.5, colW: [1.05, 3.65, 2.8], rowH: 0.215, fontSize: 10 });
heading(s, "No se libera si", 8.3, 4.5, 4.53, 12);
bullets(s, [
  "Alguna variable no existe en producción al momento de puntuar, o el modelo se validó sin respetar el tiempo.",
  "No hay calibración verificada, grupo de control, plan de vuelta atrás ni dueño de cada alerta.",
  "La operación no ejecuta al menos el 90 % de la lista: el modelo no se está probando.",
  "La selección excluye a un grupo o regional sin una explicación de negocio.",
], { x: 8.3, y: 4.82, w: 4.53, h: 2.2, size: 11, gap: 2 });
s.addNotes("Mecánica: el universo elegible del mes (filtrado por el mismo piso de riesgo: corte de buró y max_mora pactados con Riesgos) se parte al azar en dos pools por cliente, estratificando por regional y tercil de score. El champion elige sus 4.000 en su pool; el challenger rankea el suyo, toma su top 4.800, retiene 800 al azar como holdout sin contacto y contacta 4.000. Capacidad intacta: 8.000. Dos reglas separadas: calidad de lista (challenger vs. champion) y efecto del contacto (challenger contactado vs. holdout). Baseline del holdout: no el 2,3 % global, sino el orgánico del tercil alto de buró (≈ 5 %, 7 de 129, IC 2,7–10,8 %), porque el holdout sale del top de B. Potencia (800 vs. 4.000, baseline 5 %): conservador +1,7 pp exige 1.856 en holdout, 2,3 meses, 4,6 M/mes de costo; plausible +3,8 pp (el uplift implícito si B convierte 8,8 % sobre un orgánico de 5 %) exige 444, 0,6 meses, 10,3 M/mes. Dos meses detectan el escenario plausible con margen; el conservador necesita un tercer mes. El costo es cerca del 4 % del VE de B (10,3 de 237 M). Limitación: sin holdout en el champion no comparamos la incrementalidad de las dos políticas; la opción de 400 de holdout en el champion cuesta ≈ 2,3 M/mes y deja ese brazo en 3.600. Probar mora 5,1 % vs. 7,2 % exigiría 2.053 renovados por brazo: el riesgo entra por política y se vigila por vintage. Reglas de salida pre-registradas: calidad ≥ +1,5 pp con IC 95 % que excluye 0; efecto > 0 con IC 95 % que excluye 0; mora ≤ champion + 1 pp. Duración: dos meses de asignación + 30 días de ventana + 30 a 60 de maduración; decisión a los 90 días. Jerga (SRM, CSI, Brier, CUPED) en el anexo y la guía. Condiciones completas de no liberación en la guía P16.");

// ============================================================ SLIDE 6 · ¿Qué recomienda hacer ahora?
pres.addSection({ title: "Recomendación" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Recomendación" });
s.addText("6 · Qué recomendamos hacer ahora", { placeholder: "title" });
answer(s, "Aprobar desde el próximo corte un piloto de dos meses con B y grupo de control; no liberar C; condicionar A a la verificación de sus variables y D a los datos del piloto; y fijar hoy el KPI y los cinco guardrails con un responsable cada uno.");
const dec = [
  ["1", "Aprobar el piloto", "Dos meses, tres brazos, 8.000 contactos al mes.", HEX.mint],
  ["2", "No liberar C; condicionar A y D", "C usa información que no existe al priorizar; A solo tras verificar cada variable; D se evalúa con los datos del grupo de control.", HEX.sky],
  ["3", "Fijar KPI y guardrails", "Pesos ganados por contacto, netos de mora y frente a control; cinco guardrails con umbral y responsable.", HEX.lavender],
];
dec.forEach((d, i) => {
  const x = 0.5 + i * 4.15;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.8, w: 4.0, h: 1.55, fill: { color: d[3] }, line: { color: d[3] }, rectRadius: 0.12, objectName: "Decisión " + d[0] });
  s.addText(d[0], { ...TB, x: x + 0.2, y: 1.88, w: 0.6, h: 0.5, fontSize: 28, bold: true, color: HEX.ink });
  s.addText(d[1], { ...TB, x: x + 0.8, y: 1.9, w: 3.05, h: 0.46, fontSize: 13, bold: true, color: HEX.ink, valign: "middle" });
  s.addText(d[2], { ...TB, x: x + 0.2, y: 2.42, w: 3.6, h: 0.88, fontSize: 11, color: HEX.ink, valign: "top" });
});

heading(s, "Ruta de 90 días", 0.5, 3.55, 6, 12);
const steps = [
  ["Semanas 1 a 2", "Definir sobre qué se mide el 12 %, cómo se contacta hoy y qué permite el uso del buró."],
  ["Semanas 3 a 4", "Verificar variable por variable A y B; montar el flujo de datos con fechas garantizadas; fijar cuotas."],
  ["Meses 2 a 3", "Piloto con grupo de control; monitoreo semanal; decisión con reglas escritas de antemano."],
  ["Mes 4 en adelante", "Si el contacto crea renovaciones, escalar; si no, mantener la herramienta actual."],
];
steps.forEach((st, i) => {
  const y = 3.95 + i * 0.74;
  s.addShape(pres.ShapeType.ellipse, { x: 0.5, y: y + 0.12, w: 0.34, h: 0.34, fill: { color: HEX.mint }, line: { color: HEX.mint }, objectName: "Paso " + (i + 1) });
  s.addText(String(i + 1), { ...TB, x: 0.5, y: y + 0.12, w: 0.34, h: 0.34, fontSize: 11, bold: true, color: HEX.ink, align: "center", valign: "middle" });
  s.addText([{ text: st[0] + ". ", options: { bold: true } }, { text: st[1] }], { ...TB, x: 0.98, y, w: 6.9, h: 0.6, fontSize: 11.5, color: HEX.ink, valign: "middle" });
});

heading(s, "Gobierno", 8.1, 3.55, 4.73, 12);
bullets(s, [
  [{ text: "Equidad: ", bold: true }, { text: "tasas de selección y conversión por regional, remesas y buró en cada corte." }],
  [{ text: "Auditable: ", bold: true }, { text: "ficha del modelo, ficha de la base, verificación de variables, plan de monitoreo y responsables por área." }],
  "La importancia de una variable no es su causa: al buró alto se le contactó más (37 % frente a 22 % sin contactar); solo el grupo de control prueba si llamar cambia el resultado.",
], { x: 8.1, y: 3.95, w: 4.73, h: 3.0, size: 11, gap: 4 });
s.addNotes("Pedimos tres decisiones. Ruta de 90 días con la ficha de fuga variable por variable para A y B en las semanas 3 a 4 (fuente, timestamp, disponibilidad al puntuar); pipeline point-in-time. Gobierno: sin cuotas, el modelo limpio selecciona 28 % en Oriente frente a 35 % en Centro (AIR ≈ 0,80 puntual, pero con 100 a 200 clientes por regional el intervalo bootstrap es 0,49–0,88: el 0,80 no informa; la regla está pensada para el universo mensual de 25.000, donde el intervalo se estrecha unas seis veces); con cuotas, la selección por regional la fija la capacidad, así que la equidad se vigila en conversión y calibración por grupo dentro de cada regional. El 79 % de la lista cae en el tercil alto de buró: ese piso lo fija la política de riesgo, no el algoritmo. Auditable: model card, datasheet, ficha de fuga, plan de monitoreo, RACI. SHAP es correlación: en la base, 37 % del tercil bajo de buró quedó sin contactar frente a 22 % del alto; solo el holdout prueba causalidad.");

// ============================================================ ANEXO
pres.addSection({ title: "Anexo" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Anexo" });
s.addText("Anexo · Soporte técnico: réplica, economía, tamaños de muestra y variables", { placeholder: "title" });
heading(s, "Réplica fuera de tiempo (train ≤ t−2, un corte de gap, test = t, t = mayo a agosto)", 0.5, 1.3, 7.3, 12);
tbl(s, [
  [thead("Conjunto de variables"), thead("Modelo"), thead("AUC"), thead("Rango"), thead("PR-AUC"), thead("Calibración (pend.)"), thead("Brier")],
  [tcell("15 ex ante limpias"), tcell("Logística"), tcell("0,820"), tcell("0,78–0,85"), tcell("0,53"), tcell("0,91"), tcell("0,129")],
  [tcell("15 ex ante limpias"), tcell("LightGBM"), tcell("0,791"), tcell("0,77–0,82"), tcell("0,49"), tcell("0,78"), tcell("0,137")],
  [tcell("+ remesas, contactabilidad, regional"), tcell("Logística"), tcell("0,821"), tcell("0,79–0,85"), tcell("0,53"), tcell("0,91"), tcell("0,128")],
  [tcell("+ resultado_gestion_30d"), tcell("Logística"), tcell("0,944"), tcell("0,93–0,97"), tcell("0,85"), tcell("0,99"), tcell("0,067")],
  [tcell("+ dias_hasta_renovacion"), tcell("LightGBM"), tcell("1,000"), tcell("1,00–1,00"), tcell("1,00"), tcell("1,00"), tcell("0,000")],
], { x: 0.5, y: 1.65, w: 7.3, colW: [2.4, 0.9, 0.7, 0.95, 0.75, 1.1, 0.5], rowH: 0.27, fontSize: 9.5 });
s.addText("Prevalencia de la base 20,2 %. Calibración: pendiente de observado sobre predicho (1 = perfecta); media predicha 0,197 vs. observada 0,207. Las conversiones «top 8k» de la hoja no son comparables con esta base. Sin gap (train < t, abril a agosto): 0,82 / 0,80; k-fold aleatorio: 0,82. Coeficientes estandarizados del modelo limpio: score_buro 1,29; max_mora_6m −0,56; respondio_oferta_previa 0,27; el resto < 0,15. Orgánico por tercil de buró (no contactados): alto 5,4 % (7/129, IC 2,7–10,8 %), contactados del tercil alto 53 %: parte del valor de B es orgánica y el holdout lo mide.", { ...TB, x: 0.5, y: 3.33, w: 7.3, h: 0.85, fontSize: 8.5, color: HEX.muted });

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
  [tcell("Conv. 3,6 % a 4,5 / 5,4 / 7,2 %"), tcell("7.530 / 2.081 / 618 / brazo"), tcell("2 / 1 / 1 meses")],
  [tcell("Mora 5,1 % a 7,2 % (renovados)"), tcell("2.053 renovados por brazo"), tcell("fuera del piloto")],
  [tcell("Holdout 5 %, +1,7 pp (conservador)"), tcell("1.856 en holdout"), tcell("2,3 meses · 4,6 M/mes")],
  [tcell("Holdout 5 %, +3,8 pp (plausible, B)"), tcell("444 en holdout"), tcell("0,6 meses · 10,3 M/mes")],
  [tcell("Holdout 4 / 6 %, +2,5 pp"), tcell("790 / 1.053 en holdout"), tcell("1,0 / 1,3 m · 6,7 M/mes")],
  [tcell("A − B reportada (8.000 c/u)"), tcell("conv. z 1,32 (p 0,19)"), tcell("mora z 2,11 (p 0,03)")],
], { x: 0.5, y: 4.55, w: 5.7, colW: [2.45, 1.7, 1.55], rowH: 0.24, fontSize: 8.5 });

heading(s, "Variables excluidas del ranking, por motivo", 6.5, 4.2, 6.3, 12);
tbl(s, [
  [thead("Motivo"), thead("Variables"), thead("Tratamiento")],
  [tcell("Fuga / resultado"), tcell("resultado_gestion_30d, dias_hasta_renovacion, mora30_post_renovacion, renovo_30d"), tcell("Solo como target o evaluación")],
  [tcell("Disponibilidad temporal"), tcell("fecha_ultimo_contacto / dias_ultimo_contacto (51 en el mes, 1 > corte); cuotas_pagadas_pct, monto_preaprobado"), tcell("Fuera del set; sin costo (AUC 0,50–0,53); vuelven con timestamp")],
  [tcell("Calidad"), tcell("max_mora_6m < 0, saldo_ahorros < 0, endeudamiento > 1, duplicado; buró dentro de 150–950"), tcell("Validar y corregir con registro; confirmar central y vigencia")],
  [tcell("Uso responsable y sesgo"), tcell("recibe_remesas, contactabilidad_score, regional (solo capacidad), cliente_id"), tcell("Fuera del score; grupos de equidad")],
], { x: 6.5, y: 4.55, w: 6.33, colW: [1.25, 3.4, 1.68], rowH: 0.36, fontSize: 8.5 });
s.addText("Código y cálculos: work/01_diagnostico.py, 02_modelos_fuga.py y 03_economia_capacidad_piloto.py sobre una copia del anexo; el original no se modificó (hash verificado). Jerga: SRM = sample ratio mismatch; CSI = índice de estabilidad por variable; CUPED = ajuste por covariable pre-periodo.", { ...TB, x: 0.5, y: 6.42, w: 5.7, h: 0.55, fontSize: 8, color: HEX.muted, italic: true, valign: "top" });
s.addNotes("Anexo de soporte para preguntas técnicas. Detalle completo en la guía de sustentación (19 preguntas).");

(async () => {
  const out = "C:/Users/Davinson/Desktop/banco w/entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("written", out);
})();
