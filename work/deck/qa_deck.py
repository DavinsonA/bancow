"""QA del deck: palabras fuera de tablas, fuentes mínimas, filas y celdas de tablas, notas y jerga en el texto visible. Falla (exit 1) si se exceden los límites."""
import sys, re
from pptx import Presentation
sys.stdout.reconfigure(encoding="utf-8")
PATH = sys.argv[1] if len(sys.argv) > 1 else "entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx"
MAX_WORDS, MIN_BODY, MIN_TABLE, MAX_ROWS, MAX_CELL = 170, 11, 10, 5, 20
ROWS_EXC = {6: 6}            # slide del piloto: monitoreo ≤ 6 filas
MAIN, N_TOTAL = set(range(2, 8)), 9   # portada (1), seis slides principales (2-7), cierre (8), anexo (9)
FONTS_OK = {"Segoe UI", "Segoe UI Semibold"}  # texto y display; cualquier otra fuente explícita es un error
# Jerga prohibida en el texto visible de las slides 1-6 (se conserva en notas y anexo). Excepciones: (slide, patrón) -> texto permitido en el mismo cuadro o celda.
JARGON = [r"\bholdout\b", r"\bchampion\b", r"\bchallenger\b", r"\bvintage\b", r"point[- ]in[- ]time", r"ficha de fuga", r"\buplift\b", r"\borgánic\w*",
          r"\bship\b", r"\brollback\b", r"\bLGD\b", r"z\s*≈", r"IC\s*95", r"\bPSI\b", r"\bSRM\b", r"\bCUPED\b"]
JARGON_EXC = {(6, r"\bchampion\b"): r"\(champion\)",                    # primera tarjeta del slide 5: «Lista actual (champion)»
              (4, r"\buplift\b"): r"^Uplift$",                          # fila de D en la tabla: tipo de modelo
              (5, r"\buplift\b"): r"^D Uplift$",                        # etiqueta de la barra de D en el gráfico (mismo uso)
              (6, r"\bPSI\b"): r"población"}                            # explicado en la misma celda
words = lambda t: len([w for w in re.split(r"\s+", t) if re.search(r"[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", w)])
def fonts(tf):
    for p in tf.paragraphs:
        for r in p.runs:
            if r.font.name and r.text.strip(): yield r.font.name
def sizes(tf):
    for p in tf.paragraphs:
        for r in p.runs:
            if r.font.size is not None and r.text.strip(): yield r.font.size.pt
def jargon(i, text):
    for pat in JARGON:
        if re.search(pat, text, re.I):
            exc = JARGON_EXC.get((i, pat))
            if exc and re.search(exc, text, re.I): continue
            yield pat, text.strip()[:60]
prs = Presentation(PATH); fails = []; jargon_hits = []
slides = list(prs.slides)
if len(slides) != N_TOTAL: fails.append(f"deck con {len(slides)} slides, esperado {N_TOTAL}")
print(f"{'slide':>5} {'palabras':>8} {'min_cuerpo':>10} {'min_tabla':>9} {'tablas(filas)':>14} notas")
for i, sl in enumerate(slides, 1):
    main = i in MAIN; w = 0; fb = []; ft = []; tabs = []; texts = []
    for sh in sl.shapes:
        if sh.has_table:
            t = sh.table; nrows = len(t.rows) - 1; tabs.append(nrows)
            lim = ROWS_EXC.get(i, MAX_ROWS)
            if main and nrows > lim: fails.append(f"slide {i}: tabla con {nrows} filas > {lim}")
            for r in t.rows:
                for c in r.cells:
                    ft += list(sizes(c.text_frame)); cw = words(c.text); texts.append(c.text)
                    if main and cw > MAX_CELL: fails.append(f"slide {i}: celda de {cw} palabras > {MAX_CELL}: «{c.text[:50]}»")
        elif sh.has_chart:
            for pl in sh.chart.plots: texts += list(pl.categories)
        elif sh.has_text_frame:
            if sh.is_placeholder and sh.placeholder_format.type is not None and any(k in str(sh.placeholder_format.type) for k in ("TITLE", "SLIDE_NUMBER", "FOOTER")): continue
            w += words(sh.text_frame.text); fb += list(sizes(sh.text_frame)); texts.append(sh.text_frame.text)
    if main:
        for tx in texts: jargon_hits += [(i, p, s) for p, s in jargon(i, tx)]
    bad = set()
    for sh in sl.shapes:
        if sh.has_text_frame: bad |= set(fonts(sh.text_frame)) - FONTS_OK
        if sh.has_table: bad |= {f for r in sh.table.rows for c in r.cells for f in fonts(c.text_frame)} - FONTS_OK
    if bad: fails.append(f"slide {i}: fuentes fuera del sistema {sorted(bad)}")
    notes = sl.has_notes_slide and sl.notes_slide.notes_text_frame.text.strip() != ""
    if not notes: fails.append(f"slide {i}: sin notas del orador")
    mb = min(fb) if fb else None; mt = min(ft) if ft else None
    if main and w > MAX_WORDS: fails.append(f"slide {i}: {w} palabras fuera de tablas > {MAX_WORDS}")
    if main and mb is not None and mb < MIN_BODY: fails.append(f"slide {i}: fuente de cuerpo {mb} pt < {MIN_BODY}")
    if main and mt is not None and mt < MIN_TABLE: fails.append(f"slide {i}: fuente de tabla {mt} pt < {MIN_TABLE}")
    print(f"{i:>5} {w:>8} {str(mb):>10} {str(mt):>9} {str(tabs):>14} {'sí' if notes else 'NO'}")
for i, p, s in jargon_hits: fails.append(f"slide {i}: jerga «{p}» en «{s}»")
if fails:
    print("\nFALLA:"); [print(" -", f) for f in fails]; sys.exit(1)
print("\nQA OK: límites cumplidos en las 6 slides principales (incl. jerga); portada, cierre y anexo sin restricción.")
