"""Replica/cuestiona Resultados_Modelos: ¿qué AUC se obtiene con y sin variables de fuga, con validación temporal?"""
import sys, pandas as pd, numpy as np, warnings
sys.stdout.reconfigure(encoding="utf-8")
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss
from sklearn.calibration import calibration_curve
import lightgbm as lgb
warnings.filterwarnings("ignore")
df = pd.read_excel("work/copia_Anexo_BancoW.xlsx", sheet_name="Base_Clientes").drop_duplicates()
df["acepta"] = (df.resultado_gestion_30d=="Acepta").astype(int)
df["interesado"] = (df.resultado_gestion_30d=="Interesado").astype(int)
df["no_contactado"] = (df.resultado_gestion_30d=="No contactado").astype(int)
df["dhr"] = df.dias_hasta_renovacion.fillna(-1)
df["reg"] = df.regional.astype("category").cat.codes
EXANTE = ["antiguedad_meses","saldo_actual","max_mora_6m","productos_activos","saldo_ahorros",
          "ticket_promedio","tasa_actual_ea","score_buro","consultas_buro_3m","endeudamiento_proxy",
          "rentabilidad_12m","respondio_oferta_previa","dias_ultimo_contacto","uso_digital_score","quejas_90d","visitas_oficina_90d"]
# excluidas del set limpio: recibe_remesas (uso responsable), contactabilidad_score (sesgo operacional), regional (capacidad, no ranking),
# cuotas_pagadas_pct y monto_preaprobado (timestamp sin certificar; AUC univariado 0,52-0,53)
CLEAN = f"Limpio ex ante ({len(EXANTE)} vars)"
SETS = {
 CLEAN: EXANTE,
 "Ex ante + remesas + contactabilidad + regional": EXANTE+["recibe_remesas","contactabilidad_score","reg"],
 "+ resultado_gestion_30d (fuga)": EXANTE+["acepta","interesado","no_contactado"],
 "+ todas (incl. dias_hasta_renovacion)": EXANTE+["acepta","interesado","no_contactado","dhr","recibe_remesas","contactabilidad_score","reg"],
}
months = sorted(df.mes_corte.unique())
def models():
    return {"LogReg": make_pipeline(StandardScaler(), LogisticRegression(C=0.5, max_iter=2000)),
            "LightGBM": lgb.LGBMClassifier(n_estimators=300, learning_rate=0.03, num_leaves=7, min_child_samples=25, subsample=0.8, colsample_bytree=0.8, verbose=-1, random_state=7)}
rows=[]
# Rolling-origin con gap: train = cortes <= t-2 (un corte completo de maduración), test = t, t = 2026-05..08 (>= 3 cortes de entrenamiento).
# gap=0 (train < t, t = 2026-04..08) se conserva como sensibilidad.
for gap, ts in [(1, months[4:]), (0, months[3:])]:
  for sname, cols in SETS.items():
    for mname in ["LogReg","LightGBM"]:
        aucs=[]; prs=[]; p32=[]; briers=[]; yhat_all=[]; y_all=[]
        for t in ts:
            i = months.index(t); tr = df[df.mes_corte <= months[i-1-gap]]; te = df[df.mes_corte == t]
            m = models()[mname]; m.fit(tr[cols], tr.renovo_30d)
            p = m.predict_proba(te[cols])[:,1]
            aucs.append(roc_auc_score(te.renovo_30d, p)); prs.append(average_precision_score(te.renovo_30d, p))
            k = int(round(0.32*len(te))); top = te.assign(p=p).nlargest(k,"p"); p32.append(top.renovo_30d.mean())
            briers.append(brier_score_loss(te.renovo_30d, p)); yhat_all+=list(p); y_all+=list(te.renovo_30d)
        ya=np.array(y_all); pa=np.array(yhat_all); slope=np.polyfit(pa, ya, 1)[0]
        rows.append(dict(gap=gap, conjunto=sname, modelo=mname, auc_oot=np.mean(aucs), auc_min=np.min(aucs), auc_max=np.max(aucs),
                         pr_auc=np.mean(prs), conv_top32=np.mean(p32), pend_calib=slope, brier=np.mean(briers)))
        if sname==CLEAN and gap==1:
            fr, mp = calibration_curve(y_all, yhat_all, n_bins=8, strategy="quantile")
            pd.DataFrame({"pred":mp,"obs":fr}).to_csv(f"work/output/calibracion_{mname}.csv", index=False)
            print(f"Calibración {mname} (gap=1, ventanas 05-08): pendiente obs~pred = {slope:.2f}, media pred = {pa.mean():.3f}, media obs = {ya.mean():.3f}, Brier = {brier_score_loss(ya,pa):.3f}")
res = pd.DataFrame(rows).round(3)
print("\n=== Validación out-of-time rolling. gap=1: train <= t-2, test = t, t = 2026-05..08 (publicada). gap=0: train < t, t = 2026-04..08 (sensibilidad). Prevalencia 20,2 %; top32 = 8k/25k ===")
print(res.to_string(index=False)); res.to_csv("work/output/replica_modelos_oot.csv", index=False)
# Comparación split aleatorio vs temporal con el set limpio (para P7)
from sklearn.model_selection import cross_val_score, StratifiedKFold
for mname in ["LogReg","LightGBM"]:
    cv = cross_val_score(models()[mname], df[EXANTE], df.renovo_30d, cv=StratifiedKFold(5, shuffle=True, random_state=1), scoring="roc_auc")
    print(f"{mname} k-fold aleatorio AUC = {cv.mean():.3f} (vs OOT arriba)")
# Importancia (coeficientes) del modelo limpio
m = models()["LogReg"].fit(df[EXANTE], df.renovo_30d)
coef = pd.Series(m[-1].coef_[0], index=EXANTE).sort_values(key=abs, ascending=False).round(3)
print("\nCoeficientes estandarizados LogReg limpio:"); print(coef.head(8).to_string())
coef.to_csv("work/output/coef_logreg_limpio.csv")
# Scores finales (modelo limpio, logreg) para análisis de capacidad: entrena en 01-04, mayo = gap, puntúa 06-08
tr = df[df.mes_corte<="2026-04"]; te = df[df.mes_corte>="2026-06"].copy()
m = models()["LogReg"].fit(tr[EXANTE], tr.renovo_30d); te["p_renov"] = m.predict_proba(te[EXANTE])[:,1]
te[["cliente_id","mes_corte","regional","score_buro","max_mora_6m","recibe_remesas","contactabilidad_score","renovo_30d","p_renov"]].to_csv("work/output/scores_test_06_08.csv", index=False)
print("\nTest 06-08: n=",len(te),"AUC=",round(roc_auc_score(te.renovo_30d, te.p_renov),3))
# Sesgo potencial del modelo limpio: tasa de selección top-32% por grupo
te["sel"] = te.p_renov >= te.p_renov.quantile(0.68)
sr = te.groupby("regional").sel.mean().round(3)
print("\nTasa de selección top-32% por regional:"); print(sr.to_string()); print(f"AIR regional (min/max) = {sr.min()/sr.max():.2f} ({sr.idxmin()} vs {sr.idxmax()})")
print("por recibe_remesas:"); print(te.groupby("recibe_remesas").sel.mean().round(3).to_string())
print("por cuartil contactabilidad:"); print(te.groupby(pd.qcut(te.contactabilidad_score,4)).sel.mean().round(3).to_string())
print("por tercil score_buro:"); print(te.groupby(pd.qcut(te.score_buro,3)).sel.mean().round(3).to_string())
