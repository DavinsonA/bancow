"""Diagnóstico de Base_Clientes sobre COPIA del anexo (el original no se modifica)."""
import sys, pandas as pd, numpy as np, json, warnings
sys.stdout.reconfigure(encoding="utf-8")
from sklearn.metrics import roc_auc_score
warnings.filterwarnings("ignore")
pd.set_option("display.width", 220); pd.set_option("display.max_columns", 50)
SCORE_RANGE = (150, 950)  # escala DataCrédito; pendiente confirmar central, versión y vigencia
X = pd.ExcelFile("work/copia_Anexo_BancoW.xlsx")
df = X.parse("Base_Clientes")
out = {}
print("shape", df.shape)
print("\n--- cortes:"); print(df.mes_corte.value_counts().sort_index())
print("\n--- regional:"); print(df.regional.value_counts())
print("\n--- target global:", df.renovo_30d.mean().round(4), df.renovo_30d.sum())
print("\n--- target por corte:"); print(df.groupby("mes_corte").renovo_30d.agg(["mean","sum","count"]).round(3))
print("\n--- target por regional:"); print(df.groupby("regional").renovo_30d.agg(["mean","sum","count"]).round(3))
print("\n--- mora30 entre renovados:", df.loc[df.renovo_30d==1,"mora30_post_renovacion"].agg(["mean","sum","count"]).round(4).to_dict())
print("    mora30 entre NO renovados:", df.loc[df.renovo_30d==0,"mora30_post_renovacion"].agg(["sum","count"]).to_dict())
print("\n--- duplicados exactos:", df.duplicated().sum(), "| cliente_id duplicados:", df.cliente_id.duplicated().sum())
print(df[df.cliente_id.duplicated(keep=False)][["cliente_id","mes_corte","regional","renovo_30d"]])
print("\n--- nulos:"); print(df.isna().sum()[df.isna().sum()>0])
print("\n--- rangos:"); print(df.describe().T[["min","max","mean"]].round(3))
chk = {
 "max_mora_6m<0": (df.max_mora_6m<0).sum(),
 "saldo_ahorros<0": (df.saldo_ahorros<0).sum(),
 "endeudamiento_proxy>1": (df.endeudamiento_proxy>1).sum(),
 "score_buro fuera DataCrédito 150-950": ((df.score_buro<SCORE_RANGE[0])|(df.score_buro>SCORE_RANGE[1])).sum(),
 "score_buro rango obs": (int(df.score_buro.min()), int(df.score_buro.max())),
 "cuotas_pagadas_pct fuera 0-1": ((df.cuotas_pagadas_pct<0)|(df.cuotas_pagadas_pct>1)).sum(),
 "tasa_actual_ea rango": (df.tasa_actual_ea.min(), df.tasa_actual_ea.max()),
 "rentabilidad_12m<0": (df.rentabilidad_12m<0).sum(),
 "monto_preaprobado<=0": (df.monto_preaprobado<=0).sum(),
 "antiguedad_meses<=1": (df.antiguedad_meses<=1).sum(),
}
print("\n--- checks de validez:", chk)
# temporalidad
df["inicio_corte"] = pd.to_datetime(df.mes_corte+"-01")
df["fecha_ultimo_contacto"] = pd.to_datetime(df.fecha_ultimo_contacto)
df["dif_dias"] = (df.inicio_corte - df.fecha_ultimo_contacto).dt.days
print("\n--- fecha_ultimo_contacto > inicio corte:", (df.fecha_ultimo_contacto>df.inicio_corte).sum(), "| max fecha:", df.fecha_ultimo_contacto.max().date())
print("    fecha_ultimo_contacto dentro del mes de corte (>= inicio):", (df.fecha_ultimo_contacto>=df.inicio_corte).sum())
print("    corr(dias_ultimo_contacto, inicio_corte - fecha):", np.corrcoef(df.dias_ultimo_contacto, df.dif_dias)[0,1].round(4))
# leakage crosstabs
print("\n--- resultado_gestion_30d x renovo_30d:")
ct = pd.crosstab(df.resultado_gestion_30d, df.renovo_30d, margins=True); ct["tasa"] = (ct[1]/ct["All"]).round(3); print(ct)
print("\n--- dias_hasta_renovacion nulo por clase:"); print(df.groupby("renovo_30d").dias_hasta_renovacion.apply(lambda s: s.isna().mean()).round(3))
print("    rango dias_hasta_renovacion renovados:", df.loc[df.renovo_30d==1,"dias_hasta_renovacion"].agg(["min","max"]).to_dict())
# renovación 'orgánica' entre no contactados
nc = df[df.resultado_gestion_30d=="No contactado"]; c = df[df.resultado_gestion_30d!="No contactado"]
print("\n--- renovaron sin contacto:", nc.renovo_30d.mean().round(4), f"({nc.renovo_30d.sum()}/{len(nc)})  | contactados:", c.renovo_30d.mean().round(4), f"({c.renovo_30d.sum()}/{len(c)})")
print("    % no contactados por regional:"); print(df.groupby("regional").apply(lambda g: (g.resultado_gestion_30d=="No contactado").mean()).round(3))
print("    contactabilidad media por regional:"); print(df.groupby("regional").contactabilidad_score.mean().round(3))
print("    contactabilidad por resultado_gestion:"); print(df.groupby("resultado_gestion_30d").contactabilidad_score.mean().round(3))
# AUC univariado
exante = ["antiguedad_meses","saldo_actual","cuotas_pagadas_pct","max_mora_6m","productos_activos","saldo_ahorros","recibe_remesas","ticket_promedio","tasa_actual_ea","monto_preaprobado","score_buro","consultas_buro_3m","endeudamiento_proxy","rentabilidad_12m","respondio_oferta_previa","contactabilidad_score","dias_ultimo_contacto","uso_digital_score","quejas_90d","visitas_oficina_90d"]
rows=[]
for v in exante+["dias_hasta_renovacion"]:
    s = df[v].fillna(-1)
    a = roc_auc_score(df.renovo_30d, s); rows.append((v, round(max(a,1-a),3), round(np.corrcoef(s, df.renovo_30d)[0,1],3)))
rg = pd.get_dummies(df.resultado_gestion_30d)
rows.append(("resultado_gestion_30d(Acepta)", round(roc_auc_score(df.renovo_30d, rg["Acepta"]),3), round(np.corrcoef(rg["Acepta"].astype(float), df.renovo_30d)[0,1],3)))
uni = pd.DataFrame(rows, columns=["variable","auc_univariado","corr"]).sort_values("auc_univariado", ascending=False)
print("\n--- AUC univariado:"); print(uni.to_string(index=False))
uni.to_csv("work/output/auc_univariado.csv", index=False)
# proxies / fairness descriptivo
print("\n--- renovación por recibe_remesas:"); print(df.groupby("recibe_remesas").renovo_30d.agg(["mean","count"]).round(3))
print("--- renovación por cuartil contactabilidad:"); print(df.groupby(pd.qcut(df.contactabilidad_score,4)).renovo_30d.agg(["mean","count"]).round(3))
print("--- no contactado por cuartil contactabilidad:"); print(df.groupby(pd.qcut(df.contactabilidad_score,4)).apply(lambda g:(g.resultado_gestion_30d=="No contactado").mean()).round(3))
print("--- score_buro medio por renovo:", df.groupby("renovo_30d").score_buro.mean().round(1).to_dict())
cb = df.groupby(pd.qcut(df.score_buro,3,labels=["bajo","medio","alto"])).apply(lambda g: pd.Series({"n":len(g),"score_min":g.score_buro.min(),"score_max":g.score_buro.max(),"tasa_no_contactado":(g.resultado_gestion_30d=="No contactado").mean(),"tasa_renovacion":g.renovo_30d.mean()})).round(3)
print("--- contacto y renovación por tercil de score_buro:"); print(cb.to_string()); cb.to_csv("work/output/contacto_por_buro.csv")
print("--- mora30 por score_buro tercil (renovados):"); r=df[df.renovo_30d==1]; print(r.groupby(pd.qcut(r.score_buro,3)).mora30_post_renovacion.agg(["mean","sum","count"]).round(3))
# economía muestra: ¿qué implica 'Top 8k'?
print("\n--- 8000/25000 =", 8000/25000, "| top 32% de la muestra =", int(0.32*len(df)))
