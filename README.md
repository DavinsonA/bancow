# Prueba técnica Banco W · Priorización de renovaciones

Solución al reto de la prueba técnica de Científico de Datos de Banco W (priorización de clientes para renovación con capacidad limitada). El enunciado (PDF) y el anexo de datos (Excel) pertenecen a un proceso de selección y **no se versionan en este repositorio**; ver «Datos de entrada».

## Entregables

| Archivo | Qué es |
|---|---|
| `entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx` | Presentación ejecutiva: 6 slides + 1 anexo (entregable principal). Notas del orador en cada slide. |
| `entregables/Guia_sustentacion_19_preguntas.md` | Respuestas completas a las 19 preguntas del enunciado, con la evidencia calculada, para la sustentación y el Q&A. |
| `work/01_diagnostico.py` | Perfil de la base: rangos, duplicados, temporalidad, tablas cruzadas de fuga, AUC univariado, descriptivos de equidad. |
| `work/02_modelos_fuga.py` | Réplica de las métricas de la hoja `Resultados_Modelos` con validación temporal rolling-origin, con y sin variables de fuga; scores del modelo limpio. |
| `work/03_economia_capacidad_piloto.py` | Valor esperado por alternativa, sensibilidad, asignación con capacidad regional y tamaños de muestra del piloto. |
| `work/output/` | Salidas de los tres scripts (txt y csv). |
| `work/deck/build_deck.js` | Generador del PPT (pptxgenjs). Paleta naranja + teal de Banco W, Segoe UI para texto y Bahnschrift para títulos y cifras (ambas vienen con Windows 10 y 11). El isotipo del pie se lee de `docs_privados/assets/` (no versionado); sin ese archivo el deck se genera sin logo. |
| `work/deck/qa_deck.py` | QA del deck con python-pptx: ≤ 170 palabras fuera de tablas, celdas ≤ 20 palabras, cuerpo ≥ 11 pt, tablas ≥ 10 pt y ≤ 5 filas (monitoreo ≤ 6), sin jerga en el texto visible, solo Segoe UI y Bahnschrift, notas en todas las slides. |
| `requirements.txt` | Versiones fijadas de Python. |

## Datos de entrada (no versionados)

Para reproducir los cálculos hay que colocar localmente, con estos nombres exactos:

| Ruta | Archivo | Origen |
|---|---|---|
| `data/Anexo_Prueba_Cientifico_Datos_BancoW.xlsx` | Anexo de la prueba (hojas `LEEME`, `Base_Clientes`, `Diccionario`, `Resultados_Modelos`, `Capacidad_Regional`) | Entregado por Banco W con la prueba. SHA-256 esperado: `c5b55ba57f6b2bcc2ecb74cf95dd75469d13e891e29284fbc5e4283d15a1f8fa` |
| `work/copia_Anexo_BancoW.xlsx` | Copia idéntica del anexo sobre la que corren los scripts (`cp data/Anexo_Prueba_Cientifico_Datos_BancoW.xlsx work/copia_Anexo_BancoW.xlsx`) | Se crea localmente |
| `docs/Prueba_Tecnica_Cientifico_Datos_BancoW.pdf` | Enunciado con las 19 preguntas (opcional para reproducir) | Entregado por Banco W |

Las tres rutas están en `.gitignore`. Las salidas en `work/output/` sí se versionan, así que el deck y la guía se pueden regenerar sin el anexo.

## Reglas respetadas

- El Excel original no se modificó. Todo cálculo corre sobre la copia. SHA-256 del original verificado antes y después de cada ronda: `c5b55ba57f6b2bcc2ecb74cf95dd75469d13e891e29284fbc5e4283d15a1f8fa`.
- La presentación tiene exactamente 6 slides de contenido + 1 anexo.

## Reproducir

```bash
pip install -r requirements.txt
cp data/Anexo_Prueba_Cientifico_Datos_BancoW.xlsx work/copia_Anexo_BancoW.xlsx
python work/01_diagnostico.py > work/output/01_diagnostico.txt
python work/02_modelos_fuga.py > work/output/02_modelos_fuga.txt
python work/03_economia_capacidad_piloto.py > work/output/03_economia.txt
cd work/deck && npm install && NODE_PATH="$PWD/node_modules" node build_deck.js
cd ../.. && python work/deck/qa_deck.py   # palabras, jerga, fuentes, filas, notas (exit 1 si falla)
```

Opcional, en Windows con PowerPoint: incrustar las fuentes para que el deck se vea igual en cualquier equipo (el entregable versionado ya las trae).

```powershell
$f = (Resolve-Path entregables\BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx).Path; $t = "$env:TEMP\deck_fuentes.pptx"
$app = New-Object -ComObject PowerPoint.Application; $p = $app.Presentations.Open($f, $false, $false, $false)
$p.SaveAs($t, 24, -1); $p.Close(); $app.Quit(); Copy-Item $t $f -Force
```

Requisitos: Python 3.13 con las versiones fijadas en `requirements.txt`; Node 22. Las salidas se escriben en UTF-8.

## Supuestos externos y fuentes

| Supuesto | Valor usado | Fuente |
|---|---|---|
| Escala del score de buró | DataCrédito 150–950 (observado 352–912, dentro del rango). Pendiente confirmar central, versión y vigencia | DataCrédito Experian, Datablog: «DataCrédito utiliza un Puntaje de Crédito estándar, el cual arranca desde los 150 puntos y llega hasta los 950 puntos» (publicado 2024-05-16; consultado 2026-10-18): https://www.datacredito.com.co/blogs/datablog/que-es-vida-crediticia-y-puntaje-de-credito-mitos-y-verdades/ . Nota: MiDecisor (producto empresarial) publica 0–950 y algunos medios 150–999; se usa la escala estándar de la central |
| Economía por renovación | Contribución COP 420.000; pérdida por mora 30+ COP 1.800.000; horizonte 30 días | Enunciado de la prueba (PDF) |
| Universo y capacidad | 25.000 clientes/mes; 8.000 contactos; capacidad por regional de `Capacidad_Regional` | Anexo Excel |
| Baseline orgánico del holdout | 5 % (5,4 % entre no contactados del tercil alto de buró, 7 de 129, IC 2,7–10,8 %; sensibilizado a 4 % y 6 %). El 2,3 % global no aplica porque el holdout sale del top de B | `work/output/organico_por_buro.csv` |
| Fracción orgánica implícita de B | ≈ 57 % (5 % / 8,8 %); uplift implícito +3,8 pp; VE incremental ≈ 103 M/mes | `work/output/organico_implicito.csv` |
| Intervalo del AIR regional | Bootstrap de 2.000 remuestreos sobre la muestra de test (n = 696) | `work/output/air_regional.csv` |
| Tamaño de las cifras de la hoja de modelos | 8.000 contactos por alternativa; 752 y 704 renovados en A y B | Supuesto para calcular errores estándar (`incertidumbre_AB.csv`) |

## Conclusión en una frase

La restricción es la capacidad, no la demanda: pilotear el modelo B (logístico, calibrado, menor mora) con filtro de riesgo, cuotas regionales y un grupo de control, descartar C por fuga de información y condicionar A y D a auditoría.
