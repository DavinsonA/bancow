// Deck ejecutivo Banco W - 6 slides + 1 anexo. Sistema "documento interno": paleta naranja + teal de Banco W, retícula de 12 columnas.
// Investigación y paleta: docs_privados/investigacion_buenas_practicas_ppt.md y docs_privados/propuesta_visual.md (no versionados).
// Uso: NODE_PATH=$PWD/node_modules node build_deck.js   (DECK_FONT y DECK_OUT permiten comparar fuentes sin tocar el entregable)
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("C:/Users/Davinson/.claude/skills/synced/ce2ca63a-6da1-4b29-b559-5cf82e86a0ed_08922b1b-3ba5-474d-802d-4ad0bb25fd8d/pptx/scripts/apply_theme.js");

// ---------- tokens ----------
const C = {
  teal: "00A2AF",     // Teal W (isotipo): marcas, reglas, segmentos. 3,1:1, no para texto
  tealDeep: "005C63", // Teal profundo: banda de respuesta, panel, barra destacada, encabezados de tabla. Blanco encima 7,8:1
  orange: "FE6A00",   // Naranja W (isotipo): marcadores de alerta, segmento de control. 2,9:1, no para texto
  orangeFig: "E35A00",// Naranja cifra: cifras ≥ 24 pt y barras de alerta. 3,7:1
  ink: "2E2E2E",      // Tinta (13,6:1)
  gray: "656365",     // Gris texto del informe del banco (6,0:1)
  line: "DAD7D2",     // Hairline
  mute: "C9C5BF",     // Barras neutras
  peach: "FFF1EA",    // Melocotón del informe
};
const FONT = process.env.DECK_FONT || "Segoe UI";            // texto, tablas y gráficos: humanista, legible en proyección
const FONT_D = process.env.DECK_FONT_DISPLAY || "Bahnschrift"; // títulos y cifras: DIN geométrica, cercana a la Geomanist de la marca
const OUT = process.env.DECK_OUT || "C:/Users/Davinson/Desktop/banco w/entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx";
// Isotipo de Banco W (región visible del SVG entregado). Material del proceso de selección: vive fuera del repo público.
const LOGO = "C:/Users/Davinson/Desktop/banco w/docs_privados/assets/logo_bancow_isotipo.png";
const THEME = { name: "Banco W documento", headFontFace: FONT_D, bodyFontFace: FONT,
  colors: { dk1: C.ink, lt1: "FFFFFF", dk2: C.tealDeep, lt2: C.peach, accent1: C.tealDeep, accent2: C.orangeFig, accent3: C.teal, accent4: C.orange, accent5: C.gray, accent6: C.mute, hlink: C.tealDeep, folHlink: C.tealDeep } };

// Retícula: 13,333 x 7,5 in; márgenes 0,5; 12 columnas de 0,844 con medianil 0,2. Bandas fijas: título, respuesta, contenido, pie.
const X0 = 0.5, COL = 0.8444, GUT = 0.2, FULL = 12.333;
const cx = i => X0 + i * (COL + GUT);
const cw = n => n * COL + (n - 1) * GUT;
const Y = { title: 0.38, band: 0.95, bandH: 0.8, body: 2.0, foot: 7.08 };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: FONT_D, bodyFontFace: FONT };
pres.author = "Davinson Arteaga"; pres.title = "Banco W - Priorizacion de renovaciones";

const FOOT = "Prueba técnica Científico de Datos · Davinson Arteaga";
const hasLogo = fs.existsSync(LOGO);
pres.defineSlideMaster({
  title: "DOC", background: { color: "FFFFFF" },
  objects: [
    ...(hasLogo ? [{ image: { x: X0, y: Y.foot - 0.04, w: 0.31 * 329 / 350, h: 0.31, path: LOGO, altText: "Banco W" } }] : []),
    { text: { text: FOOT, options: { x: hasLogo ? X0 + 0.42 : X0, y: Y.foot, w: 8, h: 0.25, fontSize: 9, color: C.gray, fontFace: FONT, margin: 0, valign: "middle" } } },
    { placeholder: { options: { name: "title", type: "title", x: X0, y: Y.title, w: FULL, h: 0.48, fontSize: 24, bold: false, color: C.ink, fontFace: FONT_D, margin: 0, valign: "top", align: "left" } } },
  ],
  slideNumber: { x: 12.33, y: Y.foot, w: 0.5, h: 0.25, fontSize: 9, color: C.gray, fontFace: FONT, align: "right" },
});

// ---------- helpers ----------
// Espacio duro entre cifra y unidad (57 %, 103 M, 85 k) y tras ≈, para que un salto de línea no las separe.
const nb = t => typeof t === "string" ? t.replace(/(\d) (%|M\b|k\b|pp\b)/g, "$1\u00A0$2").replace(/≈ /g, "≈\u00A0")
  : Array.isArray(t) ? t.map(r => ({ ...r, text: nb(r.text) })) : t;
const newSlide = opts => {
  const sl = pres.addSlide(opts), at = sl.addText.bind(sl), ab = sl.addTable.bind(sl);
  sl.addText = (t, o) => at(nb(t), o);
  sl.addTable = (rows, o) => ab(rows.map(r => r.map(c => ({ ...c, text: nb(c.text) }))), o);
  return sl;
};
const TB = { isTextBox: true, margin: 0, fontFace: FONT, color: C.ink, lineSpacingMultiple: 1.15, valign: "top" };
// Respuesta a la pregunta del enunciado: banda teal profunda a todo el ancho, texto blanco.
const answer = (s, t) => {
  s.addShape(pres.ShapeType.rect, { x: X0, y: Y.band, w: FULL, h: Y.bandH, fill: { color: C.tealDeep }, line: { type: "none" }, objectName: "Respuesta" });
  s.addText(t, { ...TB, x: X0 + 0.24, y: Y.band, w: FULL - 0.48, h: Y.bandH, fontSize: 12.5, color: "FFFFFF", valign: "middle" });
};
const sub = (s, t, x, y, w, color = C.ink) => s.addText(t, { ...TB, x, y, w, h: 0.28, fontSize: 12, bold: true, color });
const figure = (s, x, w, y, num, txt) => {
  s.addText(num, { ...TB, fontFace: FONT_D, x, y, w, h: 0.55, fontSize: 32, color: C.orangeFig, lineSpacingMultiple: 1.0, valign: "bottom" });
  s.addText(txt, { ...TB, x, y: y + 0.6, w, h: 0.6, fontSize: 11 });
};
const hair = (s, y, x = X0, w = FULL) => s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color: C.line, width: 0.75 } });
const mark = (s, x, y, color) => s.addShape(pres.ShapeType.rect, { x, y, w: 0.09, h: 0.09, fill: { color }, line: { type: "none" } });
function bullets(s, items, { x, y, w, h, size = 11, gap = 4, color = C.ink }) {
  const b = { bullet: { code: "25AA", indent: 12 } };
  const runs = items.map((t, i) => {
    const last = i === items.length - 1, base = { fontSize: size, color, paraSpaceAfter: gap };
    if (Array.isArray(t)) return t.map((r, j) => ({ text: r.text, options: { ...base, bold: !!r.bold, ...(j === 0 ? b : {}), breakLine: j === t.length - 1 && !last } }));
    return { text: t, options: { ...base, ...b, breakLine: !last } };
  }).flat();
  s.addText(runs, { ...TB, x, y, w, h });
}
// Tablas: sin relleno, encabezado teal profundo con regla Teal W, hairlines horizontales, sin bordes verticales.
const NB = { type: "none" };
const th = (t, o = {}) => ({ text: t, options: { bold: true, fontSize: 10.5, color: C.tealDeep, fontFace: FONT, valign: "bottom", margin: [2, 8, 3, 0], border: [NB, NB, { type: "solid", pt: 1.25, color: C.teal }, NB], ...o } });
const td = (t, o = {}) => ({ text: t, options: { fontSize: 10.5, color: C.ink, fontFace: FONT, valign: "middle", margin: [1, 8, 1, 0], border: [NB, NB, { type: "solid", pt: 0.5, color: C.line }, NB], ...o } });
// Veredicto o nivel: marcador cuadrado de color + palabra en tinta (el significado no depende solo del color).
const verdict = (word, color, bold = true) => ({ text: [{ text: "■  ", options: { color, fontSize: 10 } }, { text: word, options: { bold, color: C.ink } }], options: { ...td("").options } });
const R = { align: "right" };
const tbl = (s, rows, o) => s.addTable(rows, { autoPage: false, ...o });
const chartBase = { showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: C.ink, dataLabelFontFace: FONT,
  valAxisLabelFontSize: 9, valAxisLabelColor: C.gray, valAxisLabelFontFace: FONT, valAxisLineShow: false, valGridLine: { style: "none" },
  catAxisLabelFontSize: 10.5, catAxisLabelColor: C.ink, catAxisLabelFontFace: FONT, catAxisLineColor: C.line, catGridLine: { style: "none" }, showLegend: false };

// Límites (qa_deck.py): ≤ 170 palabras fuera de tablas (sin título), cuerpo ≥ 11 pt, tablas ≥ 10 pt y ≤ 5 filas (monitoreo ≤ 6), celdas ≤ 20 palabras, sin jerga visible.
// El enunciado limita a 6 slides + 1 anexo. No se agrega portada: la slide 1 es la decisión.

// ============================================================ SLIDE 1 · ¿Qué decisión debemos tomar y por qué importa?
pres.addSection({ title: "Decisión" });
let s = newSlide({ masterName: "DOC", sectionTitle: "Decisión" });
s.addText("Contactar a los 8.000 que más valor dejan, netos de riesgo", { placeholder: "title" });
answer(s, "Debemos elegir cada mes a cuáles 8.000 de los 25.000 elegibles contactar, por valor neto de riesgo y no por probabilidad de renovar. Importa porque una renovación que cae en mora 30+ borra lo que aportan 4,3 sanas.");
figure(s, cx(0), cw(4), Y.body, "8.000 de 25.000", "La restricción es la capacidad, no la demanda.");
figure(s, cx(4), cw(4), Y.body, "3,6 % = 288", "Meta 12 %: 960 renovaciones sobre contactados o 3.000 sobre elegibles.");
figure(s, cx(8), cw(4), Y.body, "1 mora = 4,3 sanas", "Una renovación sana aporta 420.000; una en mora 30+ cuesta 1.800.000.");
hair(s, 3.35);
sub(s, "Qué falta antes de escalar", cx(0), 3.55, cw(5));
bullets(s, [
  "Medir el efecto del contacto exige un grupo de control que hoy no existe: 2,3 % de los no contactados renovó solo.",
  "El 12 % se adopta solo cuando se fije sobre qué se mide y en qué ventana.",
  "Pregunta clave al negocio: ¿cómo se elige hoy a quién contactar?",
], { x: cx(0), y: 3.89, w: cw(5), h: 1.7, gap: 8 });
sub(s, "KPI", cx(0), 5.62, cw(5));
s.addText("Pesos ganados por contacto, netos de mora, frente a un grupo de control. Mientras no exista: renovaciones por cada 1.000 contactos.", { ...TB, x: cx(0), y: 5.92, w: cw(5), h: 0.9, fontSize: 11 });
sub(s, "Guardrails: cinco límites que la lista debe respetar", cx(5), 3.55, cw(7));
tbl(s, [
  [th("Guardrail"), th("Límite"), th("Si se rompe")],
  [td("Riesgo", { bold: true }), td("La mora esperada de la lista no supera el umbral de Riesgos"), td("No se ejecuta")],
  [td("Experiencia", { bold: true }), td("Quejas y bajas por 1.000 contactos no peores que hoy"), td("Se detiene")],
  [td("Equidad", { bold: true }), td("Ninguna regional ni grupo bajo el 80 % de la tasa de selección de los demás"), td("Se revisa")],
  [td("Operación", { bold: true }), td("Al menos 90 % de la lista ejecutada en cada regional"), td("Se reasignan cupos")],
  [td("Confiabilidad", { bold: true }), td("Datos y aleatorización válidos en cada corte"), td("No se puntúa")],
], { x: cx(5), y: 3.89, w: cw(7), colW: [1.35, 4.06, cw(7) - 5.41], rowH: [0.3, 0.42, 0.42, 0.42, 0.42, 0.42] });
s.addNotes("Pregunta del enunciado: ¿Qué decisión debemos tomar y por qué importa? Mensaje: la restricción es la capacidad, así que el problema es decidir a quién contactar, no predecir. KPI incremental neto de riesgo; el proxy mensual (incrementales por 1.000 contactos) sirve mientras madura la mora. 12 % sin denominador no es una meta: 960 si es sobre 8.000, 3.000 si es sobre 25.000 (37,5 % por contacto). Punto de equilibrio: una renovación deja de aportar si la mora supera 23,3 % (420.000 / 1.800.000). Guardrail de riesgo: la mora esperada de la lista (score y política de Riesgos) se verifica antes de ejecutar; el vintage de mora 30+ a 60 días por cohorte confirma (alarma y pausa). La pregunta única define si el histórico permite medir causalidad o solo describe la política vigente; hoy podemos ordenar por propensión, filtrar riesgo con la política de Riesgos y valorar cada renovación.");

// ============================================================ SLIDE 2 · ¿Qué descubrimos en los datos y qué no deberíamos confiar?
pres.addSection({ title: "Datos" });
s = newSlide({ masterName: "DOC", sectionTitle: "Datos" });
s.addText("Los datos sirven para ordenar clientes, no para medir riesgo ni efecto", { placeholder: "title" });
answer(s, "La base sirve para ordenar clientes por propensión, pero no para medir riesgo ni el efecto del contacto. No deberíamos confiar en dos variables que ya contienen el resultado, ni en las conversiones de la hoja de modelos como si salieran de esta base.");
sub(s, "Cinco hallazgos en la base de clientes (1.800 filas, 8 cortes mensuales)", cx(0), Y.body, FULL);
tbl(s, [
  [th("Hallazgo"), th("Cifra"), th("Qué implica"), th("Nivel")],
  [td("Fuga en dos variables", { bold: true }), td("resultado_gestion_30d AUC 0,83; dias_hasta_renovacion AUC 1,00"), td("Se conocen después de gestionar; cualquier modelo que las use se verá mejor de lo que será."), verdict("Crítico", C.orange)],
  [td("La base no es el universo", { bold: true }), td("Renovación 20,2 % vs. 3,6 %; 1.800 filas vs. 25.000 al mes"), td("Las conversiones de la hoja vienen de otra población y no se comparan con esta base."), verdict("Crítico", C.orange)],
  [td("Riesgo no modelable", { bold: true }), td("3 moras en 364 renovados (0,8 %) vs. 4,6–7,2 % reportado"), td("Hay 3 moras: el riesgo tiene que venir de la política de Riesgos."), verdict("Crítico", C.orange)],
  [td("Calidad y fechas", { bold: true }), td("1 duplicado; 1 contacto posterior al corte; 25 endeudamientos > 1"), td("La base no garantiza que cada dato existiera en la fecha de corte; hacen falta reglas de validación."), verdict("Moderado", C.mute)],
  [td("Señal concentrada", { bold: true }), td("score_buro AUC 0,81; respondio_oferta 0,69; resto < 0,57"), td("Dos variables explican casi toda la señal; un modelo simple basta."), verdict("Útil", C.teal)],
], { x: cx(0), y: 2.32, w: FULL, colW: [2.05, 4.45, 4.533, 1.3], rowH: [0.3, 0.44, 0.44, 0.44, 0.44, 0.44] });
sub(s, "Qué decidimos hacer con los datos", cx(0), 5.05, FULL);
bullets(s, [
  [{ text: "Variables: ", bold: true }, { text: "quedan 15. Fuera las que contienen el resultado, las de contacto sin fecha certificada, y la contactabilidad y las remesas, que reproducirían la política pasada." }],
  [{ text: "Validación: ", bold: true }, { text: "como se va a usar. Entrenamos con meses cuyo resultado ya maduró, dejamos un mes de espera y probamos en el siguiente, cuatro veces." }],
  [{ text: "Desbalance: ", bold: true }, { text: "sin remuestreo. Evaluamos en el 32 % superior, lo que cabe en la capacidad; el accuracy engaña (79,8 % sin acertar un renovador)." }],
], { x: cx(0), y: 5.38, w: FULL, h: 1.6, gap: 5 });
s.addNotes("Pregunta del enunciado: ¿Qué descubrimos en los datos y qué no deberíamos confiar? Detalle de cada hallazgo en la guía P5 y P6. Fuga: 78 % de «Acepta» renueva; dias_hasta_renovacion es nulo exactamente en los 1.436 no renovados. Calidad: max_mora_6m = −4, ahorro −350.000, contacto fechado 2026-09-15 con corte agosto; score de buró 352–912 está dentro de la escala DataCrédito 150–950 (confirmar central, versión y vigencia). contactabilidad_score no predice el contacto (entre 29 % y 32 % de no contactados en los cuatro cuartiles). cuotas_pagadas_pct, monto_preaprobado y dias_ultimo_contacto quedan fuera del set limpio hasta certificar su timestamp (51 contactos fechados dentro del mes de corte y 1 después): no cuesta señal (AUC univariado 0,50–0,53); en producción se recalcula a la fecha de corte. Partición rolling-origin con un corte de gap (entrenar ≤ t−2, probar en t, mayo a agosto); deduplicar por cliente. Evaluación con probabilidades calibradas. Accuracy trivial: 79,8 % en la base, 96,4 % en producción sin acertar un renovador.");

// ============================================================ SLIDE 3 · ¿Qué alternativas de modelo tenemos y cuáles sobreviven al análisis?
pres.addSection({ title: "Alternativas" });
s = newSlide({ masterName: "DOC", sectionTitle: "Alternativas" });
s.addText("B pasa a piloto, A se verifica antes y C se descarta", { placeholder: "title" });
answer(s, "Sobreviven dos: B, que va a piloto, y A, solo si pasa una verificación variable por variable. C no sobrevive porque su AUC viene de información que no existe al priorizar. D se evalúa en el piloto.");
tbl(s, [
  [th("Alt."), th("Tipo"), th("AUC", R), th("Conversión reportada", R), th("Mora", R), th("Lectura crítica"), th("Veredicto")],
  [td("Actual", { bold: true }), td("Regla"), td("—", R), td("3,6 %", R), td("5,1 %", R), td("Es la referencia: la única conversión observada en producción."), verdict("Referencia", C.mute)],
  [td("C", { bold: true }), td("LightGBM"), td("0,94", R), td("14,8 %", R), td("6,4 %", R), td("Repliqué su 0,94: solo aparece con el resultado de la gestión; con variables legítimas da 0,82."), verdict("Descartar", C.orange)],
  [td("A", { bold: true }), td("XGBoost"), td("0,86", R), td("9,4 %", R), td("7,2 %", R), td("Su 0,86 no se confirma con esta base y su mora es la más alta: verificar cada variable antes."), verdict("Verificar", C.mute)],
  [td("B", { bold: true }), td("Logística"), td("0,79", R), td("8,8 %", R), td("4,6 %", R), td("Su 0,79 coincide con la réplica, está calibrado y tiene la menor mora; también se verifica antes."), verdict("Piloto", C.teal)],
  [td("D", { bold: true }), td("Uplift"), td("Qini 0,12", R), td("7,9 %", R), td("+3,1 pp", R), td("Único que mide el efecto del contacto, pero sus cifras no son comparables y no se sabe cómo se aleatorizó."), verdict("Evaluar en piloto", C.mute)],
], { x: cx(0), y: Y.body, w: cw(8), colW: [0.6, 0.85, 0.75, 1.0, 0.7, 2.755, 1.5], rowH: [0.42, 0.56, 0.56, 0.56, 0.56, 0.56] });

sub(s, "Réplica: el 0,94 de C solo aparece con la fuga", cx(8), Y.body, cw(4));
s.addText("Validación en el tiempo: entrenar con meses pasados, esperar un mes y probar en el siguiente.", { ...TB, x: cx(8), y: 2.32, w: cw(4), h: 0.45, fontSize: 11, color: C.gray });
s.addChart(pres.ChartType.bar, [{ name: "AUC", labels: ["15 variables al corte", "+ resultado_gestion_30d", "+ dias_hasta_renovacion"], values: [0.82, 0.944, 0.997] }], {
  ...chartBase, x: cx(8) - 0.05, y: 2.85, w: cw(4) + 0.05, h: 1.75, barDir: "bar", chartColors: [C.tealDeep, C.orangeFig, C.orangeFig],
  dataLabelFormatCode: "0.00", valAxisMinVal: 0.5, valAxisMaxVal: 1.1, valAxisHidden: true, catAxisLabelFontSize: 10, barGapWidthPct: 55,
});
s.addText("Una validación aleatoria (0,82) no habría revelado la fuga; la temporal sí.", { ...TB, x: cx(8), y: 4.68, w: cw(4), h: 0.45, fontSize: 11 });

hair(s, 5.4);
sub(s, "Por qué más AUC puede ser peor decisión", cx(0), 5.55, cw(6));
bullets(s, [
  "El AUC ordena a todos, pero solo contactamos el 32 % superior, y no distingue una renovación sana de una en mora.",
  "Propensión alta no es efecto: llamar a quien renovaría igual gasta cupos.",
], { x: cx(0), y: 5.87, w: cw(6), h: 1.1, gap: 3 });
sub(s, "Para comparar D con A y B hace falta", cx(6), 5.55, cw(6));
bullets(s, [
  "Saber qué parte de la campaña de D fue al azar y cómo se cumplió.",
  "Medir los tres en un mismo grupo de control, en pesos netos de mora.",
], { x: cx(6), y: 5.87, w: cw(6), h: 1.1, gap: 3 });
s.addNotes("Pregunta del enunciado: ¿Qué alternativas de modelo tenemos y cuáles sobreviven al análisis? Repliqué con la base: el AUC de C (0,94) solo se obtiene incluyendo el resultado de gestión; con dias_hasta_renovacion llega a 1,00. Validación temporal: entrenar ≤ t−2, probar en t, mayo a agosto; k-fold aleatorio da 0,82 y no revela la fuga. A: 0,86 supera lo que esta base permite replicar (0,82), pero la hoja viene de otra población, así que no es concluyente; su mora 7,2 % es la peor y, de ser real, lo convierte en la alternativa de menor valor; ambas cosas exigen auditoría variable por variable. B: coherente con la réplica, calibrado (pendiente 0,91), estable; pasa a piloto tras la misma ficha de fuga. D: la hoja reporta «+3,1 pp incremental» en la columna de mora y Qini en la de PR-AUC; no es comparable con A, B y C sin aclarar unidades. Las conversiones «top 8k» de la hoja y la conversión top 32 % de la réplica (≈ 45 %) no son comparables: otra población y otra regla de contacto. Para comparar propensión vs. uplift: la regla de asignación de la campaña de D (fracción aleatorizada, unidad, cumplimiento) y un mismo holdout donde medir uplift@8k de cada modelo en COP netos de mora, con intervalos.");

// ============================================================ SLIDE 4 · ¿Cuál genera mayor valor bajo riesgo y capacidad real?
pres.addSection({ title: "Valor" });
s = newSlide({ masterName: "DOC", sectionTitle: "Valor" });
s.addText("B deja más valor que A: 237 frente a 218 millones al mes", { placeholder: "title" });
answer(s, "B gana por riesgo, no por conversión: cada renovación de B vale 337.200 y una de A, 290.400. Ese valor solo se captura si la lista respeta la capacidad de cada regional, y cerca de la mitad podría ocurrir sin contacto.");
sub(s, "Valor esperado mensual neto de mora (COP millones)", cx(0), Y.body, cw(5));
s.addText("8.000 contactos × conversión × (420.000 − mora × 1.800.000). D con la mora actual; C fuera por la fuga.", { ...TB, x: cx(0), y: 2.3, w: cw(5), h: 0.45, fontSize: 11, color: C.gray });
s.addChart(pres.ChartType.bar, [{ name: "VE neto", labels: ["Actual", "A XGBoost", "B Logística", "D Uplift"], values: [94.5, 218.4, 237.4, 207.4] }], {
  ...chartBase, x: cx(0) - 0.08, y: 2.85, w: cw(5) + 0.08, h: 1.9, barDir: "col", chartColors: [C.mute, C.mute, C.tealDeep, C.mute],
  dataLabelFormatCode: "0", valAxisMinVal: 0, valAxisMaxVal: 300, valAxisMajorUnit: 300, barGapWidthPct: 80,
});
figure(s, cx(5), cw(3), Y.body, "+143 M", "al mes frente a hoy, si las conversiones reportadas se cumplen.");
figure(s, cx(8), cw(4), Y.body, "≈ 103 M", "valor creado por el contacto si, como sugiere la base, el 57 % de las renovaciones de B ocurriría igual.");
sub(s, "Lo que el cálculo no prueba", cx(5), 3.3, cw(7));
bullets(s, [
  "En conversión, la ventaja de B no se distingue del azar; en mora, apenas. B gana por ser más seguro y auditable.",
  "A superaría a B solo con mora real menor que 5,8 %; faltan costo de contacto y pérdida real por mora.",
], { x: cx(5), y: 3.62, w: cw(7), h: 1.1, gap: 4 });
sub(s, "Cada regional llena su cuota y los cupos sobrantes van donde más valen", cx(0), 4.9, FULL);
const REG = [
  ["Suroccidente", "2.600", "≈ 2.400", "≈ 200 cupos sin usar", "5,4 %", "Llena su cuota con su propio ranking y cede los cupos que no use.", false],
  ["Centro", "1.900", "≈ 2.100", "≈ 200 clientes sin gestor", "4,7 %", "Lista semanal para evitar la saturación de fin de mes.", true],
  ["Norte", "1.200", "≈ 1.300", "≈ 100 clientes sin gestor", "6,8 %", "El último contacto vale 85 k: recibe los cupos transferidos.", true],
  ["Eje Cafetero", "1.000", "≈ 1.100", "≈ 100 clientes sin gestor", "4,9 %", "Segundo en valor del último contacto (82 k).", true],
  ["Oriente", "1.300", "≈ 1.100", "≈ 200 cupos sin usar", "5,5 %", "El último contacto vale 65 k: cede cupos, con un tope a pactar.", false],
];
tbl(s, [
  [th("Regional"), th("Capacidad", R), th("Con un ranking único", R), th("Frente a la capacidad"), th("Mora histórica", R), th("Regla")],
  ...REG.map(r => [td(r[0]), td(r[1], R), td(r[2], R), r[6] ? verdict(r[3], C.orange, false) : td(r[3]), td(r[4], R), td(r[5])].map(c => ({ ...c, options: { ...c.options, fontSize: 10 } }))),
], { x: cx(0), y: 5.22, w: FULL, colW: [1.3, 1.0, 1.75, 2.35, 1.3, 4.633], rowH: 0.215 });
s.addText("Modelo simple, junio a agosto (696 clientes); proyección aproximada.", { ...TB, x: cx(0), y: 6.66, w: FULL, h: 0.25, fontSize: 11, color: C.gray });
s.addNotes("Pregunta del enunciado: ¿Cuál genera mayor valor bajo riesgo y capacidad real? B gana por riesgo, no por conversión: 237 M netos al mes frente a 218 M de A; cada renovación de B vale 337.200 frente a 290.400 de A. Incertidumbre (supuesto 8.000 contactos por alternativa, 752 y 704 renovados): conversión z = 1,32 (p 0,19), mora z = 2,11 (p 0,03); en valor B es al menos equivalente dentro de la incertidumbre. El valor no es incremental: el orgánico del tercil alto de buró (de donde sale el top de B) es ≈ 5 % (7 de 129 no contactados renovaron solos; IC 2,7–10,8 %), así que ≈ 57 % de las renovaciones de B serían orgánicas y el valor incremental ≈ 103 M (129 M con orgánico 4 %, 76 M con 6 %). Por eso el piloto. Faltan el costo de contacto, la LGD real y el origen del «top 8k». Capacidad: un ranking global sobrecarga Centro, Norte y Eje y deja ≈ 400 cupos ociosos en Suroccidente y Oriente; cuotas por regional con transferencia por valor marginal (tope a pactar con Comercial, 10 % como referencia). Proyección a centenas con la mezcla regional de la muestra de test. La conversión en muestra con y sin cuotas es equivalente (41,9 % vs. 43,5 %, cuatro renovaciones de diferencia, dentro del ruido). Sensibilidad a la pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: B 263 / 237 / 215 / 182 vs. A 262 / 218 / 181 / 126.");

// ============================================================ SLIDE 5 · ¿Cómo probaríamos que funciona y cómo controlamos el riesgo?
pres.addSection({ title: "Piloto" });
s = newSlide({ masterName: "DOC", sectionTitle: "Piloto" });
s.addText("Un piloto de dos meses mide si llamar crea renovaciones", { placeholder: "title" });
answer(s, "Partimos el universo al azar: la herramienta actual elige en una mitad y B en la otra; 800 clientes del top de B no se llaman. El riesgo no se prueba aquí: mismo corte de Riesgos en ambos brazos y mora vigilada por cosecha.");
// Diagrama del piloto: los anchos son proporcionales a 4.000 / 4.000 / 800 clientes al mes.
const LW = cw(7), GAP = 0.06, U = (LW - GAP) / 8800, wA = 4000 * U, wN = 4000 * U, wC = 800 * U, BY = 2.34, BH = 0.46;
sub(s, "Clientes al mes en cada brazo", cx(0), Y.body, LW);
s.addShape(pres.ShapeType.rect, { x: cx(0), y: BY, w: wA, h: BH, fill: { color: C.peach }, line: { color: C.mute, width: 0.75 }, objectName: "Lista actual" });
s.addShape(pres.ShapeType.rect, { x: cx(0) + wA + GAP, y: BY, w: wN, h: BH, fill: { color: C.tealDeep }, line: { type: "none" }, objectName: "Lista nueva" });
s.addShape(pres.ShapeType.rect, { x: cx(0) + wA + GAP + wN, y: BY, w: wC, h: BH, fill: { color: C.orange }, line: { type: "none" }, objectName: "Grupo de control" });
s.addText("Lista actual (champion) · 4.000 llamados", { ...TB, x: cx(0) + 0.12, y: BY, w: wA - 0.2, h: BH, fontSize: 11, bold: true, valign: "middle" });
s.addText("Lista nueva (B) · 4.000 llamados", { ...TB, x: cx(0) + wA + GAP + 0.12, y: BY, w: wN - 0.2, h: BH, fontSize: 11, bold: true, color: "FFFFFF", valign: "middle" });
s.addText("800", { ...TB, x: cx(0) + wA + GAP + wN, y: BY, w: wC, h: BH, fontSize: 11, bold: true, align: "center", valign: "middle" });
bullets(s, [
  [{ text: "Calidad de la lista: ", bold: true }, { text: "una mejora de 3,6 % a 5,4 % se detecta en un mes." }],
  [{ text: "Efecto del contacto: ", bold: true }, { text: "+3,8 puntos sobre el 5 % que renueva solo se ven en menos de un mes; +1,7, en poco más de dos." }],
  [{ text: "Límite: ", bold: true }, { text: "la herramienta actual queda sin grupo de control." }],
], { x: cx(0), y: 3.02, w: LW, h: 1.2, gap: 3 });
sub(s, "Monitoreo durante los tres meses", cx(0), 4.3, LW);
tbl(s, [
  [th("Dimensión"), th("Qué se vigila"), th("Acción")],
  [td("Datos"), td("Validación de cada corte: formatos, rangos y fechas"), td("Si falla, no se puntúa")],
  [td("Población"), td("Cambios en la población (PSI del score y de cada variable)"), td("Investigar desde 0,10; revalidar desde 0,25")],
  [td("Desempeño"), td("Resultado real del modelo cuando el dato madura (30 a 60 días)"), td("Recalibrar o volver a la herramienta actual")],
  [td("Riesgo"), td("Mora 30+ de cada cosecha mensual, por brazo y regional"), td("Endurecer el corte o pausar")],
  [td("Operación"), td("Lista contactada por regional y semana"), td("Reasignar cupos")],
  [td("Experiencia"), td("Quejas y bajas por 1.000 contactos"), td("Pausar")],
], { x: cx(0), y: 4.62, w: LW, colW: [1.05, 3.85, LW - 4.9], rowH: 0.24 });

const RX = cx(7) + 0.2, RW = X0 + FULL - RX;
sub(s, "Reglas de decisión, escritas antes del piloto", RX, Y.body, RW);
tbl(s, [
  [th("Criterio"), th("Se adopta si")],
  [td("La lista nueva convierte más que la actual"), td("al menos 1,5 puntos más, con diferencia estadísticamente clara")],
  [td("Contactar crea renovaciones frente al grupo de control"), td("diferencia estadísticamente clara")],
  [td("Mora 30+ de renovados"), td("no supera la actual en más de 1 punto")],
  [td("Quejas y bajas por 1.000"), td("no peores que hoy")],
  [td("La lista se ejecutó y la asignación al azar se cumplió"), td("al menos 90 % por regional; sin sesgo de asignación")],
], { x: RX, y: 2.32, w: RW, colW: [2.42, RW - 2.42], rowH: [0.3, 0.42, 0.42, 0.42, 0.42, 0.42] });
sub(s, "No se libera si", RX, 4.9, RW);
bullets(s, [
  "Alguna variable no existe al puntuar o la validación no respetó el tiempo.",
  "Falta calibración, control, plan de vuelta atrás o dueño de cada alerta.",
  "Se ejecuta menos del 90 % de la lista.",
  "Se excluye un grupo o regional sin razón de negocio.",
], { x: RX, y: 5.22, w: RW, h: 1.75, gap: 3 });
s.addNotes("Pregunta del enunciado: ¿Cómo probaríamos que funciona y cómo controlamos el riesgo? Mecánica: el universo elegible del mes (filtrado por el mismo piso de riesgo: corte de buró y max_mora pactados con Riesgos) se parte al azar en dos pools por cliente, estratificando por regional y tercil de score. El champion elige sus 4.000 en su pool; el challenger rankea el suyo con cuotas por regional, toma su top 4.800, retiene 800 al azar como holdout sin contacto y contacta 4.000. Capacidad intacta: 8.000. Dos reglas separadas: calidad de lista (challenger vs. champion) y efecto del contacto (challenger contactado vs. holdout). Calidad: 3,6 % a 5,4 % se detecta con 2.081 por brazo, es decir en un mes con 4.000. Baseline del holdout: no el 2,3 % global, sino el orgánico del tercil alto de buró (≈ 5 %, 7 de 129, IC 2,7–10,8 %), porque el holdout sale del top de B. Potencia (800 vs. 4.000, baseline 5 %): conservador +1,7 pp exige 1.856 en holdout, 2,3 meses, 4,6 M/mes de costo; plausible +3,8 pp (el uplift implícito si B convierte 8,8 % sobre un orgánico de 5 %) exige 444, 0,6 meses, 10,3 M/mes. Dos meses detectan el escenario plausible con margen; el conservador necesita un tercer mes. El costo es cerca del 4 % del VE de B (10,3 de 237 M). Limitación: sin holdout en el champion no comparamos la incrementalidad de las dos políticas; la opción de 400 de holdout en el champion cuesta ≈ 2,3 M/mes y deja ese brazo en 3.600. Probar mora 5,1 % vs. 7,2 % exigiría 2.053 renovados por brazo: el riesgo entra por política y se vigila por vintage. Reglas de salida pre-registradas: calidad ≥ +1,5 pp con IC 95 % que excluye 0; efecto > 0 con IC 95 % que excluye 0; mora ≤ champion + 1 pp. Duración: dos meses de asignación + 30 días de ventana + 30 a 60 de maduración; decisión a los 90 días. Jerga (SRM, CSI, Brier, CUPED) en el anexo y la guía. Condiciones completas de no liberación en la guía P16.");

// ============================================================ SLIDE 6 · ¿Qué recomienda hacer ahora?
pres.addSection({ title: "Recomendación" });
s = newSlide({ masterName: "DOC", sectionTitle: "Recomendación" });
s.addText("Aprobar hoy el piloto de B y no liberar C", { placeholder: "title" });
answer(s, "Pedimos tres decisiones hoy: aprobar desde el próximo corte el piloto de B con grupo de control, no liberar C y fijar el KPI y los guardrails con su responsable.");
const DEC = [
  ["1", "Aprobar el piloto", "Dos meses, tres brazos, 8.000 contactos al mes."],
  ["2", "No liberar C; condicionar A y D", "A, tras verificar sus variables; D, con datos del grupo de control."],
  ["3", "Fijar KPI y guardrails", "Pesos netos de mora por contacto; cinco límites con umbral y responsable."],
];
sub(s, "Tres decisiones para hoy", cx(0), Y.body, cw(7));
DEC.forEach((d, i) => {
  const y = 2.42 + i * 0.78;
  s.addText(d[0], { ...TB, fontFace: FONT_D, x: cx(0), y: y - 0.06, w: 0.5, h: 0.6, fontSize: 32, color: C.orangeFig, lineSpacingMultiple: 1.0 });
  s.addText([{ text: d[1], options: { bold: true, breakLine: true } }, { text: d[2] }], { ...TB, x: cx(0) + 0.6, y, w: cw(7) - 0.6, h: 0.66, fontSize: 11 });
  if (i < 2) hair(s, y + 0.7, cx(0), cw(7));
});
sub(s, "Gobierno", cx(0), 4.95, cw(7));
bullets(s, [
  [{ text: "Equidad: ", bold: true }, { text: "selección y conversión por regional, remesas y buró." }],
  "Importancia no es causa: solo el grupo de control prueba si llamar cambia el resultado.",
], { x: cx(0), y: 5.27, w: cw(7), h: 1.4, gap: 4 });
// Panel lateral teal profundo con la ruta de 90 días (ritmo de cierre).
const PX = cx(8) - 0.1, PW = X0 + FULL - PX;
s.addShape(pres.ShapeType.rect, { x: PX, y: Y.body, w: PW, h: 6.92 - Y.body, fill: { color: C.tealDeep }, line: { type: "none" }, objectName: "Ruta 90 días" });
sub(s, "Ruta de 90 días", PX + 0.28, Y.body + 0.24, PW - 0.56, "FFFFFF");
const STEPS = [
  ["Semanas 1 a 2", "Definir el 12 %, la regla de contacto y el uso del buró."],
  ["Semanas 3 a 4", "Verificar A y B variable por variable; datos fechados al corte; cuotas."],
  ["Meses 2 a 3", "Piloto con grupo de control y monitoreo semanal."],
  ["Mes 4", "Si llamar crea renovaciones, escalar; si no, mantener la herramienta actual."],
];
STEPS.forEach((st, i) => {
  const y = Y.body + 0.72 + i * 1.02;
  mark(s, PX + 0.28, y + 0.07, C.orange);
  s.addText([{ text: st[0], options: { bold: true, breakLine: true } }, { text: st[1] }], { ...TB, x: PX + 0.5, y, w: PW - 0.78, h: 0.92, fontSize: 11, color: "FFFFFF" });
});
s.addNotes("Pregunta del enunciado: ¿Qué recomienda hacer ahora? Pedimos tres decisiones; A queda condicionada a la verificación de sus variables y D a los datos del piloto. Ruta de 90 días con la ficha de fuga variable por variable para A y B en las semanas 3 a 4 (fuente, timestamp, disponibilidad al puntuar); pipeline point-in-time. Gobierno: sin cuotas, el modelo limpio selecciona 28 % en Oriente frente a 35 % en Centro (AIR ≈ 0,80 puntual, pero con 100 a 200 clientes por regional el intervalo bootstrap es 0,49–0,88: el 0,80 no informa; la regla está pensada para el universo mensual de 25.000, donde el intervalo se estrecha unas seis veces); con cuotas, la selección por regional la fija la capacidad, así que la equidad se vigila en conversión y calibración por grupo dentro de cada regional. El 79 % de la lista cae en el tercil alto de buró: ese piso lo fija la política de riesgo, no el algoritmo. Auditable: model card, datasheet, ficha de fuga, plan de monitoreo, RACI. SHAP es correlación: en la base, 37 % del tercil bajo de buró quedó sin contactar frente a 22 % del alto; solo el holdout prueba causalidad.");

// ============================================================ ANEXO (misma retícula, mayor densidad)
pres.addSection({ title: "Anexo" });
s = newSlide({ masterName: "DOC", sectionTitle: "Anexo" });
s.addText("Anexo · Soporte técnico: réplica, economía, tamaños de muestra y variables", { placeholder: "title" });
const ah = (t, o = {}) => th(t, { fontSize: 9.5, ...o }), ad = (t, o = {}) => td(t, { fontSize: 9.5, ...o });
const ah8 = (t, o = {}) => th(t, { fontSize: 8.5, ...o }), ad8 = (t, o = {}) => td(t, { fontSize: 8.5, ...o });
sub(s, "Réplica fuera de tiempo (train ≤ t−2, un corte de gap, test = t, t = mayo a agosto)", cx(0), 1.15, cw(7));
tbl(s, [
  [ah("Conjunto de variables"), ah("Modelo"), ah("AUC", R), ah("Rango", R), ah("PR-AUC", R), ah("Calibración (pend.)", R), ah("Brier", R)],
  [ad("15 ex ante limpias"), ad("Logística"), ad("0,820", R), ad("0,78–0,85", R), ad("0,53", R), ad("0,91", R), ad("0,129", R)],
  [ad("15 ex ante limpias"), ad("LightGBM"), ad("0,791", R), ad("0,77–0,82", R), ad("0,49", R), ad("0,78", R), ad("0,137", R)],
  [ad("+ remesas, contactabilidad, regional"), ad("Logística"), ad("0,821", R), ad("0,79–0,85", R), ad("0,53", R), ad("0,91", R), ad("0,128", R)],
  [ad("+ resultado_gestion_30d"), ad("Logística"), ad("0,944", R), ad("0,93–0,97", R), ad("0,85", R), ad("0,99", R), ad("0,067", R)],
  [ad("+ dias_hasta_renovacion"), ad("LightGBM"), ad("1,000", R), ad("1,00–1,00", R), ad("1,00", R), ad("1,00", R), ad("0,000", R)],
], { x: cx(0), y: 1.47, w: cw(7), colW: [2.3, 0.85, 0.65, 0.95, 0.7, 1.161, 0.5], rowH: 0.25 });
s.addText("Prevalencia de la base 20,2 %. Calibración: pendiente de observado sobre predicho (1 = perfecta); media predicha 0,197 vs. observada 0,207. Las conversiones «top 8k» de la hoja no son comparables con esta base. Sin gap (train < t, abril a agosto): 0,82 / 0,80; k-fold aleatorio: 0,82. Coeficientes estandarizados del modelo limpio: score_buro 1,29; max_mora_6m −0,56; respondio_oferta_previa 0,27; el resto < 0,15. Orgánico por tercil de buró (no contactados): alto 5,4 % (7/129, IC 2,7–10,8 %), contactados del tercil alto 53 %: parte del valor de B es orgánica y el holdout lo mide.", { ...TB, x: cx(0), y: 3.2, w: cw(7), h: 0.88, fontSize: 8.5, color: C.gray, lineSpacingMultiple: 1.05 });

const AX = cx(7) + 0.2, AW = X0 + FULL - AX;
sub(s, "Valor esperado mensual (COP millones, 8.000 contactos)", AX, 1.15, AW);
tbl(s, [
  [ah("Alt."), ah("Renov.", R), ah("Mora", R), ah("Bruto", R), ah("Costo mora", R), ah("Neto", R)],
  [ad("Actual"), ad("288", R), ad("5,1 %", R), ad("121,0", R), ad("26,4", R), ad("94,5", R)],
  [ad("A"), ad("752", R), ad("7,2 %", R), ad("315,8", R), ad("97,5", R), ad("218,4", R)],
  [ad("B", { bold: true }), ad("704", R), ad("4,6 %", R), ad("295,7", R), ad("58,3", R), ad("237,4", { ...R, bold: true })],
  [ad("D"), ad("632", R), ad("5,1 %*", R), ad("265,4", R), ad("58,0", R), ad("207,4", R)],
  [ad("C"), ad("1.184", R), ad("6,4 %", R), ad("497,3", R), ad("136,4", R), ad("360,9 (no confiable)", R)],
], { x: AX, y: 1.47, w: AW, colW: [0.6, 0.65, 0.65, 0.7, 0.85, AW - 3.45], rowH: 0.25 });
s.addText("* Mora no reportada para D; se asume la de la herramienta actual. Valor incremental de D si +3,1 pp es uplift de conversión: 248 × 328 k = 81 M/mes. Sensibilidad B vs. A con pérdida por mora de 1,0 / 1,8 / 2,5 / 3,5 M: 263/237/215/182 vs. 262/218/181/126.", { ...TB, x: AX, y: 3.12, w: AW, h: 0.8, fontSize: 8.5, color: C.gray, lineSpacingMultiple: 1.05 });

hair(s, 4.1);
sub(s, "Tamaños de muestra (α 5 %, potencia 80 %) y costo del holdout", cx(0), 4.22, cw(6));
tbl(s, [
  [ah8("Hipótesis"), ah8("n"), ah8("Meses · costo")],
  [ad8("Conv. 3,6 % a 4,5 / 5,4 / 7,2 %"), ad8("7.530 / 2.081 / 618 / brazo"), ad8("2 / 1 / 1 meses")],
  [ad8("Mora 5,1 % a 7,2 % (renovados)"), ad8("2.053 renovados por brazo"), ad8("fuera del piloto")],
  [ad8("Holdout 5 %, +1,7 pp (conservador)"), ad8("1.856 en holdout"), ad8("2,3 meses · 4,6 M/mes")],
  [ad8("Holdout 5 %, +3,8 pp (plausible, B)"), ad8("444 en holdout"), ad8("0,6 meses · 10,3 M/mes")],
  [ad8("Holdout 4 / 6 %, +2,5 pp"), ad8("790 / 1.053 en holdout"), ad8("1,0 / 1,3 m · 6,7 M/mes")],
  [ad8("A − B reportada (8.000 c/u)"), ad8("conv. z 1,32 (p 0,19)"), ad8("mora z 2,11 (p 0,03)")],
], { x: cx(0), y: 4.52, w: cw(6), colW: [2.55, 1.85, cw(6) - 4.4], rowH: 0.24 });
s.addText("Código y cálculos: work/01_diagnostico.py, 02_modelos_fuga.py y 03_economia_capacidad_piloto.py sobre una copia del anexo; el original no se modificó (hash verificado). Jerga: SRM = sample ratio mismatch; CSI = índice de estabilidad por variable; CUPED = ajuste por covariable pre-periodo.", { ...TB, x: cx(0), y: 6.38, w: cw(6), h: 0.55, fontSize: 8, color: C.gray, lineSpacingMultiple: 1.05 });

sub(s, "Variables excluidas del ranking, por motivo", cx(6), 4.22, cw(6));
tbl(s, [
  [ah8("Motivo"), ah8("Variables"), ah8("Tratamiento")],
  [ad8("Fuga / resultado"), ad8("resultado_gestion_30d, dias_hasta_renovacion, mora30_post_renovacion, renovo_30d"), ad8("Solo como target o evaluación")],
  [ad8("Disponibilidad temporal"), ad8("fecha_ultimo_contacto / dias_ultimo_contacto (51 en el mes, 1 > corte); cuotas_pagadas_pct, monto_preaprobado"), ad8("Fuera del set; sin costo (AUC 0,50–0,53); vuelven con timestamp")],
  [ad8("Calidad"), ad8("max_mora_6m < 0, saldo_ahorros < 0, endeudamiento > 1, duplicado; buró dentro de 150–950"), ad8("Validar y corregir con registro; confirmar central y vigencia")],
  [ad8("Uso responsable y sesgo"), ad8("recibe_remesas, contactabilidad_score, regional (solo capacidad), cliente_id"), ad8("Fuera del score; grupos de equidad")],
], { x: cx(6), y: 4.52, w: cw(6), colW: [1.2, 3.25, cw(6) - 4.45], rowH: [0.24, 0.42, 0.42, 0.42, 0.42] });
s.addNotes("Anexo de soporte para preguntas técnicas. Detalle completo en la guía de sustentación (19 preguntas).");

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("written", OUT, "fonts", FONT, "/", FONT_D, hasLogo ? "con logo" : "sin logo");
})();
