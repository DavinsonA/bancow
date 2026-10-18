"""Valor esperado por alternativa, sensibilidad, asignación por capacidad regional y tamaño del piloto."""
import pandas as pd, numpy as np
from scipy.stats import norm
K=8000; C=420_000; L=1_800_000
alts = pd.DataFrame([
 ("Actual",0.036,0.051),("A XGBoost",0.094,0.072),("B LogReg",0.088,0.046),("C LightGBM (fuga)",0.148,0.064),("D Uplift",0.079,np.nan)],
 columns=["alt","conv_top8k","mora_renov"])
alts["renovaciones"]=K*alts.conv_top8k
alts["mora_usada"]=alts.mora_renov.fillna(0.051)  # D: mora no reportada -> supuesto = herramienta actual
alts["contrib_bruta_M"]=alts.renovaciones*C/1e6
alts["costo_riesgo_M"]=alts.renovaciones*alts.mora_usada*L/1e6
alts["VE_neto_M"]=alts.contrib_bruta_M-alts.costo_riesgo_M
alts["VE_por_renov"]=(C-alts.mora_usada*L)
alts["delta_vs_actual_M"]=alts.VE_neto_M-alts.VE_neto_M.iloc[0]
print("=== Valor esperado mensual sobre 8.000 contactos (COP millones). m*=C/L =", round(C/L,3)); print(alts.round(2).to_string(index=False))
alts.to_csv("work/output/valor_esperado.csv", index=False)
# D incremental: +3.1 pp sobre 8000 = 248 renovaciones incrementales
inc_D = K*0.031*(C-0.051*L)/1e6
print(f"\nD: valor INCREMENTAL atribuible al contacto si +3,1 pp es uplift de conversión: 248 renov x {(C-0.051*L)/1e3:.0f}k = {inc_D:.1f} M COP/mes")
# Sensibilidad A vs B: ¿con qué mora A supera a B?  VE_A = VE_B  -> 752*(C - mA*L) = 704*(C-0.046L)
mA_be = (C - (704/752)*(C-0.046*L))/L
print(f"A supera a B solo si su mora entre renovados < {mA_be:.3%} (reportada 7,2 %)")
# Sensibilidad a L (pérdida por mora) y a la mora
sens=[]
for Lx in [1_000_000,1_800_000,2_500_000,3_500_000]:
    for name,p,m in [("A",0.094,0.072),("B",0.088,0.046)]:
        sens.append((Lx/1e6,name,round(K*p*(C-m*Lx)/1e6,1)))
print("\nSensibilidad VE (M COP) a L:"); print(pd.DataFrame(sens,columns=["L_M","alt","VE_M"]).pivot(index="L_M",columns="alt",values="VE_M"))
# Si la conversión 'top 8k' no es incremental: escenario donde x% de las renovaciones del modelo habrían ocurrido igual
print("\nEscenario de no incrementalidad (B): valor neto si una fracción de las 704 renovaciones era orgánica")
for org in [0,0.25,0.5,0.75]:
    print(f"  organicas={org:.0%}: VE_incremental = {704*(1-org)*(C-0.046*L)/1e6:.1f} M")
# ---------- Capacidad regional ----------
cap = pd.DataFrame({"regional":["Suroccidente","Centro","Norte","Eje Cafetero","Oriente"],"cap":[2600,1900,1200,1000,1300],
                    "conv_hist":[.042,.035,.026,.038,.031],"mora_hist":[.054,.047,.068,.049,.055]})
cap["share_cap"]=cap.cap/8000
sc = pd.read_csv("work/output/scores_test_06_08.csv")
sc["share_muestra"]=1; sh = sc.regional.value_counts(normalize=True).rename("share_muestra")
cap = cap.merge(sh, left_on="regional", right_index=True)
# Universo simulado: escalar la muestra test (n~700) a 25.000 por mes de corte -> usar proporciones
cap["universo_est"]=(cap.share_muestra*25000).round(0)
cap["cobertura_cap"]=cap.cap/cap.universo_est
print("\n=== Capacidad vs universo estimado por regional ==="); print(cap.round(3).to_string(index=False))
# Ranking global top 32% vs cuotas por regional, sobre la muestra test
sc["VE"] = sc.p_renov*(C - sc.regional.map(dict(zip(cap.regional,cap.mora_hist)))*L)
n=len(sc); kk=int(round(0.32*n))
glob = sc.nlargest(kk,"VE"); 
quota = pd.concat([g.nlargest(int(round(0.32*len(g)*(r.cap/8000)/(r.share_muestra))),"VE") for r,g in [(cap[cap.regional==x].iloc[0], sc[sc.regional==x]) for x in cap.regional]])
def summar(sel,name):
    return dict(esquema=name, n=len(sel), renov_obs=int(sel.renovo_30d.sum()), conv=round(sel.renovo_30d.mean(),3), VE_medio_k=round(sel.VE.mean()/1e3,1),
                **{f"n_{r}":int((sel.regional==r).sum()) for r in cap.regional})
comp = pd.DataFrame([summar(glob,"Ranking global top 32%"), summar(quota,"Cuotas por capacidad regional")])
print("\n=== Lista operativa: ranking global vs cuotas (muestra test 06-08) ==="); print(comp.to_string(index=False))
# exceso/defecto de demanda por regional con ranking global
dem = glob.regional.value_counts(normalize=True).rename("share_lista_global"); 
cap2 = cap.merge(dem, left_on="regional", right_index=True)
cap2["contactos_si_global"] = (cap2.share_lista_global*8000).round(0); cap2["exceso_vs_cap"]=cap2.contactos_si_global-cap2.cap
print(cap2[["regional","cap","contactos_si_global","exceso_vs_cap"]].to_string(index=False))
# valor marginal (VE del último seleccionado) por regional bajo cuotas -> indica dónde transferir capacidad
marg = quota.groupby("regional").VE.min().div(1e3).round(1).rename("VE_marginal_k")
print("\nVE marginal (k COP) del último cliente que entra por regional bajo cuotas:"); print(marg.to_string())
cap2.to_csv("work/output/capacidad_regional.csv", index=False); comp.to_csv("work/output/lista_global_vs_cuotas.csv", index=False)
# ---------- Piloto: tamaño de muestra ----------
def n_two_prop(p1,p2,alpha=0.05,power=0.8):
    z1=norm.ppf(1-alpha/2); z2=norm.ppf(power); pb=(p1+p2)/2
    return (z1*np.sqrt(2*pb*(1-pb))+z2*np.sqrt(p1*(1-p1)+p2*(1-p2)))**2/(p2-p1)**2
print("\n=== Tamaño por brazo (alpha 5%, potencia 80%) ===")
for p1,p2,lab in [(0.036,0.045,"3,6% -> 4,5% (+25% rel)"),(0.036,0.054,"3,6% -> 5,4% (+50% rel)"),(0.036,0.072,"3,6% -> 7,2% (x2)"),(0.036,0.088,"3,6% -> 8,8% (B reportado)"),(0.051,0.072,"mora 5,1% -> 7,2% (entre renovados)"),(0.023,0.05,"holdout: organico 2,3% -> 5% contactados")]:
    print(f"  {lab}: n/brazo = {n_two_prop(p1,p2):,.0f}")
