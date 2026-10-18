# Guía de sustentación: respuestas a las 19 preguntas

Banco W · Prueba técnica Científico de Datos · Davinson Arteaga · Data Scientist · AI Engineer

Este documento acompaña la presentación de 6 slides + anexo. Contiene las respuestas completas a cada pregunta del enunciado, con la evidencia calculada sobre una copia del anexo (`work/copia_Anexo_BancoW.xlsx`). El archivo original no se modificó (SHA-256 `c5b55ba5…f8fa`, verificado antes y después del trabajo).

Convención: **[E]** dato del enunciado o anexo · **[C]** cálculo propio reproducible en `work/` · **[S]** supuesto declarado.

---

## Bloque 1 · Definición del problema y criterio de negocio

### P1. ¿Qué problema debería resolver Ciencia de Datos?

Una **decisión de asignación bajo capacidad**, no un problema de predicción aislado. Hay 25.000 elegibles y 8.000 cupos [E]: el modelo no decide si un cliente renueva, decide a quién se le dedica un contacto escaso. La función objetivo es

`max Σ z_i · [ τ_i · (C − m_i · L) − c ]  sujeto a  Σ_{i∈r} z_i ≤ K_r por regional`

donde τ_i es el aumento de probabilidad de renovar causado por el contacto (uplift), m_i la probabilidad de mora 30+ si renueva, C = 420.000, L = 1.800.000 [E] y c el costo de contacto (no entregado).

Es una **combinación**:

- **Propensión** (P(renueva | X)) como aproximación disponible hoy de τ_i, calibrada y con pocas variables.
- **Riesgo** (m_i) como filtro o penalización: una renovación con mora 30+ borra la contribución de 4,3 renovaciones sanas (1.800.000 / 420.000); la mora de equilibrio es C/L = 23,3 % [C]; con moras de 4,6 % a 7,2 % el costo de riesgo pesa entre 20 % y 31 % de la contribución.
- **Valor** por renovación (C − m·L), que hoy es constante por supuesto simplificado [E] pero debería depender del monto y la tasa.
- **Optimización** contra la capacidad regional (knapsack con cuotas).
- **Uplift** como objetivo de mediano plazo: hoy no hay datos para estimarlo con confianza (la base no tiene indicador de tratamiento aleatorizado; la campaña de D es «parcialmente aleatorizada» sin detalle [E]). El piloto genera esos datos.

Por qué no basta propensión: en la base, 13 de 556 no contactados renovaron solos (2,3 %) [C]. Contactar a quien renovaría igual consume capacidad sin crear valor.

### P2. KPI principal y guardrails

**KPI principal: valor incremental neto de riesgo por contacto (COP)** = (renovaciones del brazo tratado − renovaciones del control, por contacto) × (420.000 − mora × 1.800.000), medido sobre los 8.000 asignados por mes. Razones: incorpora la restricción (por contacto), el riesgo (neto de mora) y la causalidad (incremental). Como proxy operativo mensual mientras madura la mora: renovaciones incrementales por 1.000 contactos.

Guardrails (máximo cinco), cada uno con definición, denominador, ventana y acción:

| # | Guardrail | Definición | Umbral y acción |
|---|---|---|---|
| 1 | Riesgo | Mora esperada de la lista asignada (según score y política de Riesgos), verificada antes de ejecutar; vintage de mora 30+ a 60 días por cohorte como confirmación | Lista con mora esperada > umbral pactado: veto previo. Vintage por encima del umbral: alarma y pausa |
| 2 | Experiencia | Quejas y opt-out por 1.000 contactos, 30 días | No inferior al champion; veto |
| 3 | Equidad y cobertura | Tasa de selección por regional y grupo (remesas, contactabilidad, tercil de buró) | ≥ 0,8 de la referencia; alerta y revisión |
| 4 | Operación | % de la lista ejecutada por regional por semana | ≥ 90 %; alerta y reasignación |
| 5 | Confiabilidad | Sample ratio mismatch y validaciones de esquema del corte | χ² p > 0,001 y 0 violaciones; bloqueo |

### P3. Qué validar antes de adoptar el 12 %

1. **Denominador**: 12 % de 8.000 son 960 renovaciones; 12 % de 25.000 son 3.000, que con 8.000 contactos exigiría 37,5 % por contacto [C]. El LEEME admite que el denominador no está cerrado [E].
2. **Numerador y ventana**: ¿renovación a 30 días como el target, o cualquier renovación posterior? ¿Incluye retanqueos parciales?
3. **Orgánico vs. incremental**: ¿el 3,6 % incluye clientes que habrían renovado sin contacto? En la base, 2,3 % de los no contactados renovó [C].
4. **Comparabilidad**: 3,6 % es una tasa observada en producción; 9,4 % / 8,8 % / 14,8 % son «top 8k» offline en una población que no es esta base (la base tiene 20,2 % de renovación) [C]. No se pueden restar.
5. **Costo del 12 %**: si se alcanza relajando riesgo, cada punto de mora adicional cuesta 18.000 COP por renovación; la meta debe ser neta de riesgo.

### P4. La única pregunta al negocio

**«¿Cómo se eligió hasta hoy a quién contactar, y qué pasó con los que no se contactaron?»**

Es la pregunta que más incertidumbre reduce: define si el histórico permite estimar el efecto del contacto (si hubo alguna aleatoriedad o reglas conocidas) o solo describe la política vigente (en cuyo caso el label `renovo_30d` está confundido con la selección y necesitamos holdout desde el primer día). También resuelve de un golpe el origen del 3,6 %, la interpretación de «No contactado» (¿no asignado o no localizado?) y la validez de la campaña de D.

---

## Bloque 2 · Diagnóstico de datos

### P5. Riesgos, errores e inconsistencias materiales [C]

1. **Fuga de información en dos variables «declaradas como disponibles»**: `resultado_gestion_30d` (78 % de «Acepta» renueva, 2,3 % de «No contactado»; AUC univariado 0,83) y `dias_hasta_renovacion` (nulo exactamente en los 1.436 no renovados; AUC 1,00). Son consecuencias del resultado, no predictores.
2. **La base no es el universo**: 20,2 % de renovación frente a 3,6 % declarado; 1.800 filas en 8 cortes (204 a 254 por mes) frente a 25.000 por mes. «Conversión top 8k» no es calculable desde esta base: el top 32 % de la muestra son 576 filas.
3. **Riesgo no modelable**: 3 moras en 364 renovados (0,8 %) frente a 4,6 % a 7,2 % en la hoja de modelos y 4,7 % a 6,8 % por regional. Además `mora30_post_renovacion` = 0 por construcción en no renovados (outcome observado solo bajo tratamiento).
4. **Calidad y rangos**: 1 fila duplicada exacta (C01199, 2026-04); `max_mora_6m` = −4; `saldo_ahorros` = −350.000; 25 valores de `endeudamiento_proxy` > 1 (máx. 1,4); `score_buro` 352–912, dentro de la escala DataCrédito (150–950); pendiente confirmar qué central y versión de score es, porque las escalas difieren, y su vigencia; 164 clientes con rentabilidad negativa (plausible pero revisar).
5. **Temporalidad**: 1 `fecha_ultimo_contacto` posterior al corte (2026-09-15 con corte 2026-08) y 51 dentro del mes de corte; `dias_ultimo_contacto` es redundante con la fecha (r = 0,99). El corte no está garantizado point-in-time; `cuotas_pagadas_pct` y `monto_preaprobado` no tienen timestamp y quedan fuera del set limpio.
6. **Contactabilidad sin señal y con sesgo**: `contactabilidad_score` no predice el contacto efectivo (32 % de «No contactado» en todos los cuartiles) ni la renovación (AUC 0,52). Usarla reproduciría la política pasada sin aportar información.
7. **Hoja de modelos con unidades mezcladas**: D reporta Qini en la columna PR-AUC y «+3,1 pp incremental» en la columna de mora. Sin intervalos, sin periodo de evaluación, sin definición de «estabilidad».
8. **Señal concentrada**: `score_buro` (AUC 0,81) y `respondio_oferta_previa` (0,69) explican casi todo; las demás variables ex ante tienen AUC < 0,57. Un modelo complejo no tiene de dónde ganar.

### P6. Variables que NO usaría como predictor, por categoría

| Categoría | Variables | Motivo y tratamiento |
|---|---|---|
| **Fuga / resultado** | `resultado_gestion_30d`, `dias_hasta_renovacion`, `mora30_post_renovacion`, `renovo_30d` | Codifican el resultado; solo como target o para evaluación |
| **Disponibilidad temporal** | `fecha_ultimo_contacto` (1 fecha > corte), `cuotas_pagadas_pct` y `monto_preaprobado` sin timestamp | Fuera del set limpio. Excluirlas no cuesta señal (AUC univariado 0,52–0,53); se reincorporan cuando Tecnología certifique su timestamp |
| **Calidad** | `max_mora_6m` < 0, `saldo_ahorros` < 0, `endeudamiento_proxy` > 1, duplicado. `score_buro` 352–912 está dentro de DataCrédito 150–950 | Reglas de validación en el pipeline; corregir o imputar con registro; `dias_ultimo_contacto` se deriva de la fecha, no se usa doble; confirmar central, versión y vigencia del score de buró |
| **Uso responsable y sesgo** | `recibe_remesas` (proxy socioeconómico, r = −0,01 con el target: riesgo sin beneficio), `contactabilidad_score` (sesgo operacional), `regional` (solo para capacidad), `cliente_id` | Fuera del score; monitoreadas como grupos de equidad |
| **Con condición** | `score_buro` | Es la variable dominante; verificar vigencia, rango y que la autorización del titular cubra la finalidad comercial (Ley 1266/2008 y Ley 2157/2021: uso limitado al análisis de riesgo crediticio) |

### P7. Partición train / validation / test

El modelo se usará cada mes para puntuar un corte nuevo, así que la validación debe reproducir eso:

- **Rolling-origin por `mes_corte`**: entrenar con los cortes ≤ t−2, validar en t, para t = 2026-05 … 2026-08 (cuatro ventanas, mínimo tres cortes de entrenamiento). Se reporta media y rango de las ventanas, no un solo número.
- **Gap de un corte completo** (≈ 30 días) entre el último corte de entrenamiento y el de prueba: el target madura a 30 días y la mora 30+ post-renovación necesita 30 a 60 días más. En producción, el modelo de un corte solo puede haberse entrenado con cortes cuyo label ya esté maduro. La versión sin gap se conserva como sensibilidad en `work/output/replica_modelos_oot.csv` (`gap = 0`).
- **Cifra comunicada**: la media y el rango de las ventanas rolling; no se ajustaron hiperparámetros sobre ellas.
- **Por cliente**: deduplicar (C01199); si un cliente apareciera en varios cortes, agrupar por `cliente_id` (en esta base cada cliente aparece una sola vez).
- Resultado [C]: AUC fuera de tiempo 0,82 (rango 0,78–0,85) con regresión logística limpia de 16 variables; sin gap 0,82 (0,79–0,85); k-fold aleatorio da 0,82 también en este caso, pero el temporal es el que habilita comparar con las cifras reportadas y detecta inestabilidad entre meses.

### P8. Desbalance y el error de evaluar con accuracy

- Prevalencia: 20,2 % en la base y ~3,6 % en el universo gestionado [E, C]. Es un desbalance moderado; **no remuestrearía** (SMOTE o undersampling distorsionan la calibración y no mejoran el ranking). Usaría el modelo con pesos de clase moderados o sin ajuste, con **calibración verificada** (curva, Brier) porque el valor esperado depende de probabilidades, no solo de orden.
- Evaluaría en el **punto de operación**: conversión y lift en el top 32 % (8.000 de 25.000), precision@k, ganancia acumulada y valor esperado por contacto, además de PR-AUC (línea base = prevalencia).
- **Error de accuracy**: predecir «no renueva» para todos da 79,8 % de accuracy en la base y 96,4 % en producción sin identificar un solo renovador [C]. Un modelo con 96 % de accuracy puede ser inútil; uno con 80 % puede ser excelente para rankear el top 8.000.

---

## Bloque 3 · Modelos y decisión

### P9. Comparación de A, B, C y D

| Alt. | Evidencia | Veredicto |
|---|---|---|
| **C** LightGBM, AUC 0,94, conv. 14,8 %, mora 6,4 % | «Incluye todas las variables porque mejoraron la precisión» [E]. Réplica [C]: con las 16 variables ex ante el AUC fuera de tiempo es 0,79 (LightGBM) y 0,82 (logística); al agregar `resultado_gestion_30d` sube a 0,93–0,94; con `dias_hasta_renovacion`, 1,00. El 0,94 reportado es exactamente lo que produce la fuga. Esa información no existe cuando se prioriza. | **Descartar** |
| **A** XGBoost, AUC 0,86, conv. 9,4 %, mora 7,2 % | Variables «supuestamente» disponibles [E]. 0,86 supera lo que esta base permite replicar (0,82; 0,85 en el mejor corte), pero la hoja viene de otra población, así que no es concluyente. Su mora reportada 7,2 % es la peor de todas y peor que la actual (5,1 %); de ser real, convierte a A en la alternativa de menor valor entre los modelos. Ambas cosas exigen auditoría variable por variable (fuente, timestamp, disponibilidad al puntuar). Estabilidad «media». | **Mantener en banca, condicionado a la ficha de fuga variable por variable** |
| **B** Logística, AUC 0,79, conv. 8,8 %, mora 4,6 % | Coherente con la réplica limpia (0,78–0,85), «simple y calibrado», estabilidad alta, la menor mora. Auditable y explicable ante Riesgos. | **Piloto como challenger, tras la misma ficha de fuga variable por variable que se exige a A** |
| **D** Uplift, Qini 0,12, conv. 7,9 %, «+3,1 pp incremental» | Único que mide efecto del contacto, que es lo que de verdad importa. Pero: unidades mezcladas en la hoja, campaña «parcialmente aleatorizada» sin fracción, unidad ni cumplimiento conocidos, sin intervalos. | **Mantener como brazo de aprendizaje**: evaluarlo en el holdout aleatorizado del piloto y reentrenarlo con esos datos |

Nota de comparabilidad: las conversiones «top 8k» de la hoja (9,4 %, 8,8 %, 14,8 %) y la «conversión top 32 %» de la réplica (≈ 45 %) no son comparables: distinta población (prevalencia 3,6 % vs. 20,2 %), distinta regla de contacto y distinto periodo. Por eso el anexo reporta calibración (pendiente y Brier) y no esa columna.

Desde negocio: B entrega más valor neto que A (ver P10), es explicable ante un comité de Riesgos, puede estar en producción en semanas y no depende de variables dudosas. C sería el modelo que mejor luce en una tabla y peor funciona el primer mes.

### P10. Valor esperado con los supuestos entregados [C]

Sobre 8.000 contactos al mes: VE = 8.000 × conv × (420.000 − mora × 1.800.000).

| Alt. | Renovaciones | Mora | Contribución bruta | Costo de riesgo | **VE neto (M COP/mes)** | Δ vs. actual |
|---|---|---|---|---|---|---|
| Actual | 288 | 5,1 % | 121,0 | 26,4 | **94,5** | — |
| A | 752 | 7,2 % | 315,8 | 97,5 | **218,4** | +123,9 |
| B | 704 | 4,6 % | 295,7 | 58,3 | **237,4** | +142,9 |
| D | 632 | 5,1 % [S] | 265,4 | 58,0 | **207,4** | +112,9 |
| C | 1.184 | 6,4 % | 497,3 | 136,4 | 360,9 | no confiable |

Lecturas: B supera a A pese a convertir menos porque cada renovación de B vale 337.200 frente a 290.400 de A. A solo superaría a B si su mora real fuera < 5,8 %. Incertidumbre [C] (`work/output/incertidumbre_AB.csv`, supuesto: 8.000 contactos por alternativa y 752 / 704 renovados): la ventaja de B sobre A en conversión no es distinguible (0,6 pp, z ≈ 1,3, p = 0,19); la ventaja en mora lo es apenas (2,6 pp, z ≈ 2,1, p = 0,03). B gana por robustez, estabilidad y auditabilidad, y en valor es al menos equivalente dentro de la incertidumbre. Sensibilidad a la pérdida por mora (1,0 / 1,8 / 2,5 / 3,5 M): B 263 / 237 / 215 / 182 vs. A 262 / 218 / 181 / 126. D, si «+3,1 pp» es uplift de conversión, aporta 248 renovaciones incrementales × 328.200 = 81 M al mes atribuibles al contacto; no es comparable con las cifras brutas de A y B.

Limitaciones del cálculo:

1. **No es incremental**: las conversiones «top 8k» incluyen renovaciones que ocurrirían sin contacto. Si la mitad de las 704 de B son orgánicas, el valor baja a 119 M; si tres cuartos, a 59 M.
2. Las conversiones «top 8k» **no salen de esta base** (20,2 % de prevalencia; el top 32 % de un modelo limpio da 45 % en muestra) y no sabemos con qué población, periodo ni política de contacto se calcularon.
3. La **mora por alternativa no es verificable** (3 eventos en la base) y mora 30 no es pérdida: falta LGD, exposición y horizonte.
4. **Costo de contacto omitido** (igual para todas, no cambia el orden pero sí el nivel), C y L constantes pese a heterogeneidad de monto y tasa, mezcla regional ignorada, sin intervalos de confianza.
5. Las cifras de Actual son observadas; las demás, estimadas offline: comparar ambas es comparar producción con laboratorio.

### P11. Por qué un mayor AUC puede ser peor decisión

1. **Global vs. top-k**: el AUC resume el orden en toda la población; la decisión usa solo el 32 % superior. Dos modelos con el mismo AUC pueden diferir mucho en el top 8.000.
2. **Ignora el riesgo y el valor**: pondera igual a un renovador sano y a uno que cae en mora, que destruye 4,3 renovaciones sanas. A tiene más AUC que B y menos valor.
3. **Inflado por fuga**: variables post-contacto suben el AUC offline y desaparecen en producción (C).
4. **Propensión no es efecto**: el modelo con mejor AUC puede concentrar la lista en quienes renovarían igual («sure things»), con cero incrementalidad.
5. **Calibración e inestabilidad**: un buen orden con probabilidades distorsionadas sesga el VE; un AUC alto en un corte y bajo en otros (estabilidad «media») es peor que 0,79 estable.

### P12. Información necesaria para comparar propensión vs. uplift

1. **Datos de la campaña de D**: fracción aleatorizada, unidad de aleatorización (cliente, gestor, oficina), cómo se eligió la parte no aleatorizada (y sus propensity scores), cumplimiento (asignado vs. contactado efectivo), periodo y población.
2. **Un holdout común aleatorizado** no usado en entrenamiento, donde se ordene con cada modelo y se mida uplift@8k (tasa en tratados menos tasa en control dentro del mismo top-k) y curvas Qini, con intervalos.
3. **La misma unidad de negocio**: renovaciones incrementales y COP netos de mora por contacto para ambos; mora de los renovadores incrementales, no solo de los renovados.
4. Definición exacta de «+3,1 pp» (¿sobre qué base, qué ventana, qué intervalo?) y del Qini (¿solo en la parte aleatorizada?).
5. Costo de contacto y efectos adversos (sleeping dogs: clientes que reaccionan peor al contacto).

---

## Bloque 4 · Del modelo a una decisión operable

### P13. Diseño del piloto

- **Mecánica**: cada mes el universo elegible (≈ 25.000, ya filtrado por el mismo piso de riesgo) se parte **al azar en dos pools** por cliente, estratificando por regional y tercil de score. Capacidad total intacta: 8.000 contactos.
  - *Champion*: la herramienta actual selecciona sus 4.000 dentro de su pool.
  - *Challenger*: B rankea su pool (con cuotas regionales), toma su top 4.800, **retiene al azar 800 como holdout sin contacto** y contacta 4.000.
  - *Holdout*: los 800 retenidos conservan su derecho a solicitar crédito; documentado con Riesgos y Cumplimiento. Mide el efecto del contacto dentro de la lista de B.
- **Mismo piso de riesgo en los dos brazos** (corte de buró y `max_mora_6m` pactados con Riesgos), para que la comparación aísle el modelo y no el filtro.
- **Dos preguntas, dos reglas separadas**:
  1. *Calidad de lista*: conversión por contacto challenger − champion ≥ +1,5 pp con IC 95 % que excluya 0.
  2. *Efecto del contacto*: conversión challenger contactado − holdout > 0 con IC 95 % que excluya 0.
- **Potencia de la calidad de lista** (α 5 %, 80 %) [C]: 3,6 % a 5,4 % se detecta con 2.081 por brazo (un mes); 3,6 % a 4,5 % exige 7.530 (dos meses de 4.000).
- **Potencia y costo del holdout** [C] (`work/output/potencia_holdout.csv`; 800 de holdout frente a 4.000 contactados; costo = 800 × uplift × 337.200):

| Uplift (orgánico 2,3 % →) | n holdout | Meses a 800/mes | Costo de oportunidad |
|---|---|---|---|
| 3,5 % (+1,2 pp) | 1.932 | 2,4 | 3,2 M/mes |
| 4,0 % (+1,7 pp) | 1.056 | 1,3 | 4,6 M/mes |
| 4,5 % (+2,2 pp) | 685 | 0,9 | 5,9 M/mes |
| 5,0 % (+2,7 pp) | 491 | 0,6 | 7,3 M/mes |

  Uplift plausible: +1,7 pp, la mitad de los +3,1 pp que reporta D (cuya evidencia es incompleta). Dos meses de asignación lo detectan con margen; si el uplift real fuera de +1,2 pp, haría falta un tercer mes. El costo (≤ 2 % del VE mensual de B) es el precio de saber si el contacto crea renovaciones.
- **Limitación explícita**: sin holdout en el champion no se compara la incrementalidad de las dos políticas, solo la del challenger. Opción: retener también 400 al azar del champion (3.600 contactados en ese brazo); cuesta ≈ 400 × 1,7 % × 337.200 ≈ 2,3 M/mes y necesitaría más meses para la misma potencia.
- **El riesgo no se prueba en el piloto**: distinguir mora 5,1 % de 7,2 % exige 2.053 renovados por brazo (varios meses). Por eso el riesgo entra como **política dura** y se vigila con curvas vintage.
- **Duración**: dos meses de asignación + 30 días de ventana + 30 a 60 de maduración de mora; decisión a los 90 días. Reglas ship/no-ship pre-registradas (slide 5). Chequeo de SRM semanal; un gestor no atiende dos brazos del mismo cliente; CUPED con la tasa histórica del cliente para reducir varianza.
- **Guardrails de salida**: mora no inferior (+1 pp), quejas no inferiores, ≥ 90 % de lista ejecutada por regional, aleatorización cumplida (SRM) y datos del corte sin fallos.

### P14. De score a lista operativa con capacidad regional [C]

Simulación con el modelo limpio sobre los cortes junio–agosto (n = 696), VE_i = p_i × (420.000 − mora regional × 1.800.000):

| Regional | Capacidad | Contactos si ranking global | Diferencia | VE marginal (último que entra) |
|---|---|---|---|---|
| Suroccidente | 2.600 | ≈ 2.400 | ≈ −200 ociosos | 61 k |
| Centro | 1.900 | ≈ 2.100 | ≈ +200 sin gestor | 80 k |
| Norte | 1.200 | ≈ 1.300 | ≈ +100 sin gestor | 86 k |
| Eje Cafetero | 1.000 | ≈ 1.100 | ≈ +100 sin gestor | 81 k |
| Oriente | 1.300 | ≈ 1.100 | ≈ −200 ociosos | 61 k |

Cifras redondeadas a centenas: aproximación que asume que la mezcla regional de la muestra de test (n = 696) es la del universo. Un ranking global con corte único sobrecarga tres regionales y deja ociosos ≈ 400 cupos en otras dos. Propuesta:

1. **Score de valor, no de propensión**: VE_i con mora y contactabilidad históricas de la regional.
2. **Cuotas por regional**: cada regional llena su capacidad con su propio ranking de VE.
3. **Transferencia por valor marginal**: cupos de la regional con menor VE marginal (Oriente, 61 k) a la de mayor (Norte, 86 k), con un tope de transferencia a pactar con Comercial (p. ej., 10 % de la cuota), si la operación lo permite (Norte tiene menor contactabilidad y mayor dispersión [E]).
4. **Lista semanal, no mensual**, en Centro para evitar la saturación de cierre de mes [E]; reasignación de la capacidad no ejecutada a mitad de mes.
5. **Piso de cobertura** por regional como restricción de negocio explícita, y umbral mínimo de VE por contacto (no contactar si VE < costo de contacto).

Dato ilustrativo, no evidencia: en muestra la conversión del top 32 % es equivalente con y sin cuotas (43,2 % vs. 42,6 %, una renovación de diferencia en 222 seleccionados, dentro del ruido). Lo que cambia es que la lista con cuotas es ejecutable; el ranking global «gana» en papel y pierde en la calle.

### P15. Monitoreo de los primeros tres meses

| Dimensión | Métrica | Frecuencia | Umbral / acción |
|---|---|---|---|
| Datos | Esquema, nulos, rangos (mora ≥ 0, ahorro ≥ 0, endeudamiento ≤ 1, score de buró en la escala de la central que aplique: DataCrédito 150–950, vigencia ≤ N días), fechas posteriores al corte, duplicados | Cada corte | Violación = bloqueo: no se puntúa |
| Drift | PSI del score calculado sobre el universo mensual puntuado (25.000), no sobre la muestra; CSI por variable | Mensual | 0,10 investigar; 0,25 revalidar (mismos umbrales para el CSI) |
| Performance | AUC, calibración (pendiente, Brier) y conversión top-k con labels a 30–60 días | Mensual con rezago | Caída material vs. OOT: recalibrar o rollback |
| Riesgo | Vintage de mora 30+ por cohorte, brazo y regional | Mensual | Límite pactado con Riesgos: subir corte o pausar |
| Negocio | Renovaciones incrementales vs. control, VE neto | Mensual | IC del uplift: ship, continuar o rollback |
| Operación | % de lista contactada por regional y semana, uso de capacidad, tiempo a primer contacto | Semanal | < 90 %: reasignar |
| Experiencia | Quejas, opt-out, frecuencia de contacto por cliente | Semanal | No inferioridad vs. control: pausa |
| Equidad | Tasa de selección y conversión por grupo (regional, remesas, contactabilidad, buró) | Mensual | AIR < 0,8: revisión de gobierno |
| Confiabilidad | SRM, cumplimiento de asignación | Semanal | p < 0,001: detener análisis |

### P16. Condiciones para NO liberar aunque las métricas offline sean buenas

1. Alguna variable no existe point-in-time en producción o no se puede reconstruir con su timestamp (hoy aplica a `resultado_gestion_30d`, `dias_hasta_renovacion` y, hasta auditarlo, a las de A).
2. Las métricas vienen de un split no temporal o se seleccionaron variables «porque mejoraron la precisión» en el test.
3. No hay calibración verificada, ni validación independiente (effective challenge), ni reproducibilidad del pipeline (versiones, semillas).
4. No hay holdout ni diseño para medir incrementalidad: liberar sin control es renunciar a saber si funciona.
5. Guardrails sin línea base, umbral o dueño; sin plan de rollback.
6. La selección excluye a una regional o grupo sin explicación de negocio, o usa variables sin autorización de finalidad (score de buró en oferta comercial, remesas).
7. Capacidad operativa incapaz de ejecutar la lista (si no se contacta el 90 %, el modelo no se está probando).

---

## Bloque 5 · Gobierno, explicabilidad y uso responsable

### P17. Evaluar que la priorización no excluya sistemáticamente

- **Tasa de selección por grupo** en cada corte: regional, `recibe_remesas`, cuartil de `contactabilidad_score`, tercil de `score_buro`, antigüedad, rural/urbano si existe. Regla de referencia 0,8 (adverse impact ratio) y comparación de conversión y calibración por grupo.
- Sin cuotas, el modelo limpio queda en el límite de la regla 0,8 por regional (AIR ≈ 0,80 entre Oriente y Centro; 0,67 en la partición sin gap). Con cuotas, la selección por regional la fija la capacidad, así que la equidad se vigila en **conversión y calibración por grupo dentro de cada regional**, no en la tasa de selección entre regionales.
- Hallazgo propio [C]: el modelo limpio selecciona 28 % en Oriente vs. 35 % en Centro, 35 % con remesas vs. 31 % sin, 29 % vs. 34 % entre cuartiles extremos de contactabilidad, y **79 % del tercil alto de buró frente a 0 % del bajo**. Esto último es una decisión de política de riesgo que debe fijarse de forma explícita con Riesgos (piso de acceso), no quedar escondida en el algoritmo.
- **Contactabilidad**: no usarla en el score y medir, por brazo, qué fracción de la lista no se logra contactar por grupo; si el no contacto se concentra, ajustar canal (oficina, campo) antes que excluir.
- **Feedback loop**: el holdout y la aleatorización dentro del top-k evitan que el modelo aprenda solo de quienes la política pasada contactó.
- **Análisis de proxies**: intentar predecir el atributo sensible desde las features; si se puede, documentar y mitigar.

### P18. Qué documentar para que Riesgos, Comercial, Tecnología y Datos puedan auditar

| Artefacto | Contenido | Dueño principal |
|---|---|---|
| Model card | Uso previsto y no previsto, población, variables, métricas desagregadas (por corte, regional, grupo), limitaciones, versión | Datos |
| Datasheet de la base | Origen, cortes, definiciones, tasa base vs. universo, incidencias de calidad y su tratamiento | Datos |
| Ficha de fuga (model info sheet) | Para cada variable de A y de B: fuente, timestamp de cálculo, disponibilidad en el momento de scoring, evidencia. Exigida antes del piloto (semanas 3 a 4 de la ruta) | Datos y Tecnología |
| Documento de desarrollo | Formulación, supuestos, partición temporal, calibración, validación independiente (effective challenge), pruebas de estabilidad. Alineado con el marco de riesgo de modelo de la SFC (SARC, Capítulo II de la Circular Básica Contable y Financiera) y, como referencia internacional, SR 11-7 | Datos y Riesgos |
| Política de riesgo y guardrails | Cortes de buró y mora, umbrales, ventanas, dueños, acciones y escalamiento | Riesgos |
| Diseño del piloto pre-registrado | Brazos, aleatorización, potencia, reglas ship/no-ship, SRM | Datos y Comercial |
| Plan de monitoreo y runbook | Matriz de P15, alertas, rollback, responsables | Tecnología |
| Linaje y reproducibilidad | Versiones de datos, código y semillas; feature store point-in-time; logs de puntuación | Tecnología |
| Bitácora de decisiones y RACI | Variables excluidas y por qué, cambios de umbral, aprobaciones, consentimiento y finalidad (Ley 1581, Ley 1266/2157) | Las cuatro áreas |

### P19. «Si SHAP demuestra las variables importantes, ya sabemos qué causa la renovación»

No estoy de acuerdo. SHAP explica **qué usa el modelo** para predecir, no **qué provoca** la renovación. El modelo aprendió de un histórico donde a los clientes con buen score de buró se les ofreció más y se les contactó más (en la base, 37 % del tercil bajo de buró quedó sin contactar frente a 22 % del tercil alto [C], `work/output/contacto_por_buro.csv`); SHAP dirá que el score «importa», pero eso mezcla tres cosas: que el cliente quería renovar, que el banco lo buscó y que se le aprobó. Ninguna de las tres es «la causa», y mover la variable (por ejemplo, contactar más a quienes tienen score medio) no garantiza mover el resultado.

Dos consecuencias prácticas: primero, SHAP sirve para auditar y explicar el ranking (y para detectar fugas, como `resultado_gestion_30d`), no para diseñar palancas. Segundo, la única forma de saber si **nuestra llamada** cambia la renovación es compararla contra no llamar en un grupo equivalente: eso es el holdout del piloto. Un modelo puede ser muy útil para decidir sin ser causal, siempre que lo validemos con un experimento y no con su propia explicación.

---

## Bloque 6 · Storytelling

La presentación responde las seis preguntas en orden: decisión (slide 1), datos (2), alternativas (3), valor y capacidad (4), piloto y control (5), recomendación (6), con un anexo técnico. Frase para Presidencia: **«La restricción es la capacidad, no la demanda: pilotemos un modelo simple y calibrado con un grupo de control, no el modelo que mejor luce en la tabla.»**

### Respuestas de 30 segundos por área

- **Presidencia**: pedimos aprobar un piloto de dos meses cuyo grupo de control cuesta unos 4,6 M al mes en renovaciones no buscadas y puede confirmar más de 140 M mensuales; sin control no sabremos si el valor es real.
- **Comercial**: la lista será ejecutable por regional, semanal en Centro; el 12 % se redefine sobre contactos y neto de riesgo.
- **Riesgos**: la mora entra como política dura y vintage; el modelo C no se libera; el score de buró requiere confirmar finalidad y autorización.
- **Tecnología**: variables point-in-time, validaciones de esquema que bloquean, rollback y monitoreo con dueños desde el primer corte.
