"""QA de densidad del deck: palabras fuera de tablas, fuentes mínimas, filas y celdas de tablas, notas. Falla (exit 1) si se exceden los límites."""
import sys, re
from pptx import Presentation
sys.stdout.reconfigure(encoding="utf-8")
PATH = sys.argv[1] if len(sys.argv) > 1 else "entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx"
MAX_WORDS, MIN_BODY, MIN_TABLE, MAX_ROWS, MAX_CELL = 140, 11, 10, 5, 12
ROWS_EXC = {5: 6}            # slide 5: monitoreo ≤ 6 filas
CELL_EXC = {3: 15}           # slide 3: lectura crítica ≤ 15 palabras
N_MAIN, N_TOTAL = 6, 7
words = lambda t: len([w for w in re.split(r"\s+", t) if re.search(r"[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", w)])
def sizes(tf):
    for p in tf.paragraphs:
        for r in p.runs:
            if r.font.size is not None and r.text.strip(): yield r.font.size.pt
prs = Presentation(PATH); fails = []
slides = list(prs.slides)
if len(slides) != N_TOTAL: fails.append(f"deck con {len(slides)} slides, esperado {N_TOTAL}")
print(f"{'slide':>5} {'palabras':>8} {'min_cuerpo':>10} {'min_tabla':>9} {'tablas(filas)':>14} notas")
for i, sl in enumerate(slides, 1):
    main = i <= N_MAIN; w = 0; fb = []; ft = []; tabs = []
    for sh in sl.shapes:
        if sh.has_table:
            t = sh.table; nrows = len(t.rows) - 1; tabs.append(nrows)
            lim = ROWS_EXC.get(i, MAX_ROWS)
            if main and nrows > lim: fails.append(f"slide {i}: tabla con {nrows} filas > {lim}")
            for r in t.rows:
                for c in r.cells:
                    ft += list(sizes(c.text_frame)); cw = words(c.text)
                    if main and cw > CELL_EXC.get(i, MAX_CELL): fails.append(f"slide {i}: celda de {cw} palabras > {CELL_EXC.get(i, MAX_CELL)}: «{c.text[:50]}»")
        elif sh.has_text_frame:
            if sh.is_placeholder and sh.placeholder_format.type is not None and any(k in str(sh.placeholder_format.type) for k in ("TITLE", "SLIDE_NUMBER", "FOOTER")): continue
            w += words(sh.text_frame.text); fb += list(sizes(sh.text_frame))
    notes = sl.has_notes_slide and sl.notes_slide.notes_text_frame.text.strip() != ""
    if not notes: fails.append(f"slide {i}: sin notas del orador")
    mb = min(fb) if fb else None; mt = min(ft) if ft else None
    if main and w > MAX_WORDS: fails.append(f"slide {i}: {w} palabras fuera de tablas > {MAX_WORDS}")
    if main and mb is not None and mb < MIN_BODY: fails.append(f"slide {i}: fuente de cuerpo {mb} pt < {MIN_BODY}")
    if main and mt is not None and mt < MIN_TABLE: fails.append(f"slide {i}: fuente de tabla {mt} pt < {MIN_TABLE}")
    print(f"{i:>5} {w:>8} {str(mb):>10} {str(mt):>9} {str(tabs):>14} {'sí' if notes else 'NO'}")
if fails:
    print("\nFALLA:"); [print(" -", f) for f in fails]; sys.exit(1)
print("\nQA OK: límites cumplidos en las 6 slides principales; anexo sin restricción.")
