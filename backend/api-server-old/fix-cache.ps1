# PowerShell script to fix the cache directory issue

Write-Host "Fixing Prisma cache directory issue..." -ForegroundColor Yellow

# Remove the corrupted cache file/directory
if (Test-Path "node_modules\.cache") {
    Write-Host "Removing corrupted .cache..." -ForegroundColor Cyan
    Remove-Item -Path "node_modules\.cache" -Force -Recurse -ErrorAction SilentlyContinue
}

# Create the proper directory structure
Write-Host "Creating cache directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "node_modules\.cache\prisma" -Force | Out-Null

Write-Host "Cache directory fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npx prisma generate" -ForegroundColor Yellow
