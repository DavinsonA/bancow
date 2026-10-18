"""Valor esperado por alternativa, sensibilidad, asignación por capacidad regional y tamaño del piloto."""
import sys, pandas as pd, numpy as np
sys.stdout.reconfigure(encoding="utf-8")
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
cap2["contactos_si_global"] = (cap2.share_lista_global*8000/100).round(0)*100; cap2["exceso_vs_cap"]=cap2.contactos_si_global-cap2.cap
print(f"Aproximación (redondeada a centenas): asume que la mezcla regional de la muestra de test (n = {n}) es la del universo")
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
for p1,p2,lab in [(0.036,0.045,"3,6% -> 4,5% (+25% rel)"),(0.036,0.054,"3,6% -> 5,4% (+50% rel)"),(0.036,0.072,"3,6% -> 7,2% (x2)"),(0.036,0.088,"3,6% -> 8,8% (B reportado)"),(0.051,0.072,"mora 5,1% -> 7,2% (entre renovados)")]:
    print(f"  {lab}: n/brazo = {n_two_prop(p1,p2):,.0f}")

# ---------- Incertidumbre de las cifras reportadas en la hoja (A vs B) ----------
def z_two_prop(p1,n1,p2,n2):
    se=np.sqrt(p1*(1-p1)/n1+p2*(1-p2)/n2); return se,(p1-p2)/se
inc=[]
se,z=z_two_prop(0.094,8000,0.088,8000); inc.append(dict(metrica="conversion_top8k",A=0.094,B=0.088,n_A=8000,n_B=8000,dif_pp=0.6,se_pp=round(se*100,2),z=round(z,2),p_valor=round(2*(1-norm.cdf(abs(z))),3)))
se,z=z_two_prop(0.072,752,0.046,704); inc.append(dict(metrica="mora_renovados",A=0.072,B=0.046,n_A=752,n_B=704,dif_pp=2.6,se_pp=round(se*100,2),z=round(z,2),p_valor=round(2*(1-norm.cdf(abs(z))),3)))
inc=pd.DataFrame(inc); print("\n=== Incertidumbre A-B (supuesto: 8.000 contactos por alternativa; renovados 752 y 704) ==="); print(inc.to_string(index=False)); inc.to_csv("work/output/incertidumbre_AB.csv", index=False)
# ---------- Holdout: potencia con uplifts realistas y costo de oportunidad ----------
H=800; MORA_B=0.046; ve_renov=C-MORA_B*L
def n_unequal(p1,p2,r,alpha=0.05,power=0.8):
    # n1 = tamaño del brazo chico (holdout) cuando el otro brazo tiene r*n1
    z1=norm.ppf(1-alpha/2); z2=norm.ppf(power); pb=(p1+r*p2)/(1+r)
    return (z1*np.sqrt(pb*(1-pb)*(1+1/r))+z2*np.sqrt(p1*(1-p1)+p2*(1-p2)/r))**2/(p2-p1)**2
# Baseline del holdout: el holdout sale del top de B (tercil alto de buró), donde el orgánico es ~5 % (ver organico_por_buro.csv), no el 2,3 % global
ph=[]
for b in [0.04,0.05,0.06]:
    for u in [0.017,0.025,0.038]:
        n_h=n_unequal(b,b+u,5); esc = "conservador" if (b,u)==(0.05,0.017) else ("plausible" if (b,u)==(0.05,0.038) else "")
        ph.append(dict(baseline=b,uplift_pp=round(u*100,1),contactado=round(b+u,3),n_holdout=int(np.ceil(n_h)),meses_a_800=round(n_h/H,1),costo_oportunidad_M_mes=round(H*u*ve_renov/1e6,2),escenario=esc))
ph=pd.DataFrame(ph); print(f"\n=== Holdout {H}/mes vs. 4.000 contactados: malla baseline x uplift (alpha 5 %, potencia 80 %; costo = 800 x uplift x VE/renov B {ve_renov/1e3:.0f}k) ===")
print(ph.to_string(index=False)); ph.to_csv("work/output/potencia_holdout.csv", index=False)
# Fracción orgánica implícita de B: si B convierte 8,8 % entre contactados y su orgánico es ~5 %, el uplift implícito es 3,8 pp y ~57 % de sus renovaciones serían orgánicas
oi=[]
for b in [0.04,0.05,0.06]:
    frac=b/0.088; oi.append(dict(organico_supuesto=b,conv_B=0.088,uplift_implicito_pp=round((0.088-b)*100,1),fraccion_organica=round(frac,3),renov_incrementales=round(704*(1-frac)),VE_incremental_B_M=round(704*(1-frac)*ve_renov/1e6,1)))
oi=pd.DataFrame(oi); print("\n=== Fracción orgánica implícita de B y VE incremental (704 renovaciones, VE/renov 337k) ==="); print(oi.to_string(index=False)); oi.to_csv("work/output/organico_implicito.csv", index=False)
