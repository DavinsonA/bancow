"""QA de solapes sobre un PDF exportado (PowerPoint o LibreOffice): palabras que se pisan o salen de la página. Exit 1 si falla.
Uso: python work/deck/qa_pdf.py deck.pdf [deck2.pdf ...]"""
import sys, fitz
sys.stdout.reconfigure(encoding="utf-8")
fails = []
for path in sys.argv[1:]:
    doc = fitz.open(path)
    for pg in doc:
        W, H = pg.rect.width, pg.rect.height
        words = [w for w in pg.get_text("words") if w[4].strip()]
        for x0, y0, x1, y1, t, *_ in words:
            if x0 < -1 or y0 < -1 or x1 > W + 1 or y1 > H + 1: fails.append(f"{path.split('/')[-1]} p{pg.number + 1}: «{t}» sale de la página")
        for i, a in enumerate(words):
            for b in words[i + 1:]:
                if (a[5], a[6]) == (b[5], b[6]): continue                       # misma línea de texto
                w = min(a[2], b[2]) - max(a[0], b[0]); h = min(a[3], b[3]) - max(a[1], b[1])
                small = min((a[2] - a[0]) * (a[3] - a[1]), (b[2] - b[0]) * (b[3] - b[1]))
                if w > 0 and h > 0 and w * h > 0.2 * small: fails.append(f"{path.split('/')[-1]} p{pg.number + 1}: «{a[4]}» pisa «{b[4]}»")
    fonts = sorted({f[3].split("+")[-1] for pg in doc for f in pg.get_fonts()})
    print(f"{path.split('/')[-1]}: {doc.page_count} páginas; fuentes {fonts}")
if fails:
    print("FALLA:"); [print(" -", f) for f in fails[:40]]; sys.exit(1)
print("QA PDF OK: sin palabras superpuestas ni fuera de página.")
