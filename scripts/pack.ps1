$dest = "d:\Publication\ezra-pharmacy\ezra-pharmacy-source.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }

$items = Get-ChildItem -Path "d:\Publication\ezra-pharmacy" | Where-Object {
    $_.Name -notin @("node_modules", ".git", "dist", "ezra-pharmacy-production.zip", "ezra-pharmacy-source.zip") -and
    $_.Name -notmatch '^\.env($|\.(?!example$))'
}

Compress-Archive -Path $items.FullName -DestinationPath $dest -Force
Write-Host "Source zip created successfully at $dest"
