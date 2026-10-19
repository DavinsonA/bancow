# QA de maquetación con PowerPoint: holgura ≥ 15 % en cada caja de texto y ningún solape entre textos, tablas y gráficos.
# Uso: powershell -File work/deck/qa_layout.ps1 [ruta.pptx]   (exit 1 si falla)
param([string]$Path = "entregables\BancoW_Priorizacion_Renovaciones_DavinsonArteaga.pptx")
$Path = (Resolve-Path $Path).Path; $fails = @()
$app = New-Object -ComObject PowerPoint.Application
$p = $app.Presentations.Open($Path, $true, $false, $false)
foreach ($sl in $p.Slides) {
  $boxes = @()
  foreach ($sh in $sl.Shapes) {
    if ($sh.HasTable -eq -1 -or $sh.HasChart -eq -1) { $boxes += ,@($sh.Name, $sh.Left, $sh.Top, ($sh.Left + $sh.Width), ($sh.Top + $sh.Height)); continue }
    if ($sh.HasTextFrame -ne -1 -or $sh.TextFrame.HasText -ne -1) { continue }
    $tf = $sh.TextFrame; $r = $tf.TextRange
    $avail = $sh.Height - $tf.MarginTop - $tf.MarginBottom
    if ($avail -lt 1.15 * $r.BoundHeight) { $fails += "slide $($sl.SlideIndex): holgura $([math]::Round(100 * ($avail / $r.BoundHeight - 1)))% < 15% en «$($r.Text.Substring(0, [math]::Min(40, $r.Text.Length)))»" }
    $boxes += ,@($r.Text.Substring(0, [math]::Min(30, $r.Text.Length)), $r.BoundLeft, $r.BoundTop, ($r.BoundLeft + $r.BoundWidth), ($r.BoundTop + $r.BoundHeight))
  }
  for ($i = 0; $i -lt $boxes.Count; $i++) { for ($j = $i + 1; $j -lt $boxes.Count; $j++) {
    $a = $boxes[$i]; $b = $boxes[$j]
    $w = [math]::Min($a[3], $b[3]) - [math]::Max($a[1], $b[1]); $h = [math]::Min($a[4], $b[4]) - [math]::Max($a[2], $b[2])
    if ($w -gt 1 -and $h -gt 1) { $fails += "slide $($sl.SlideIndex): solape entre «$($a[0])» y «$($b[0])»" }
  } }
}
$n = $p.Slides.Count; $p.Close(); $app.Quit(); [Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
if ($fails.Count) { "FALLA:"; $fails | ForEach-Object { " - $_" }; exit 1 }
"QA layout OK: holgura >= 15 % en todas las cajas de texto y sin solapes ($n slides)."
