$folderPath = "public/FinalAllProductsZali"
$batchSize = 100

Write-Host "Finding files to upload..."
$allFiles = Get-ChildItem -Path $folderPath -File -Recurse | Select-Object -ExpandProperty FullName
$basePath = (Get-Location).Path + "\"
$relativePaths = $allFiles | ForEach-Object { $_.Replace($basePath, "").Replace("\", "/") }

$totalFiles = $relativePaths.Count
$totalBatches = [Math]::Ceiling($totalFiles / $batchSize)

Write-Host "Total files to upload: $totalFiles"
Write-Host "Total batches: $totalBatches"

for ($i = 0; $i -lt $totalBatches; $i++) {
    Write-Host "Processing batch $($i + 1) of $totalBatches..."
    $batch = $relativePaths | Select-Object -Skip ($i * $batchSize) -First $batchSize
    
    foreach ($file in $batch) {
        git add "$file"
    }
    
    git commit -m "Upload product images batch $($i + 1) of $totalBatches"
    Write-Host "Pushing batch $($i + 1)..."
    git push
}

Write-Host "All files uploaded successfully!"
