# Prueba técnica Banco W · Priorización de renovaciones

Solución al reto descrito en `docs/Prueba_Tecnica_Cientifico_Datos_BancoW.pdf`.

## Entregables

| Archivo | Qué es |
|---|---|
| `entregables/BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx` | Presentación ejecutiva: 6 slides + 1 anexo (entregable principal). Notas del orador en cada slide. |
| `entregables/Guia_sustentacion_19_preguntas.md` | Respuestas completas a las 19 preguntas del enunciado, con la evidencia calculada, para la sustentación y el Q&A. |
| `work/01_diagnostico.py` | Perfil de la base: rangos, duplicados, temporalidad, tablas cruzadas de fuga, AUC univariado, descriptivos de equidad. |
| `work/02_modelos_fuga.py` | Réplica de las métricas de la hoja `Resultados_Modelos` con validación temporal rolling-origin, con y sin variables de fuga; scores del modelo limpio. |
| `work/03_economia_capacidad_piloto.py` | Valor esperado por alternativa, sensibilidad, asignación con capacidad regional y tamaños de muestra del piloto. |
| `work/output/` | Salidas de los tres scripts (txt y csv). |
| `work/deck/build_deck.js` | Generador del PPT (pptxgenjs). |

## Reglas respetadas

- El Excel original en `data/` no se modificó. Todo cálculo corre sobre `work/copia_Anexo_BancoW.xlsx`. SHA-256 del original verificado antes y después: `c5b55ba57f6b2bcc2ecb74cf95dd75469d13e891e29284fbc5e4283d15a1f8fa`.
- La presentación tiene exactamente 6 slides de contenido + 1 anexo.

## Reproducir

```bash
python -I work/01_diagnostico.py
python -I work/02_modelos_fuga.py
python -I work/03_economia_capacidad_piloto.py
cd work/deck && npm install && NODE_PATH="$PWD/node_modules" node build_deck.js
```

Requisitos: Python 3.13 con pandas, scikit-learn, lightgbm, scipy, openpyxl; Node 22.

## Conclusión en una frase

La restricción es la capacidad, no la demanda: pilotear el modelo B (logístico, calibrado, menor mora) con filtro de riesgo, cuotas regionales y un grupo de control, descartar C por fuga de información y condicionar A y D a auditoría.
