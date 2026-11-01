# LinkLytics Automated Cloud Deployment Helper
param(
    [string]$GitHubRepoUrl,
    [string]$BackendUrl,
    [string]$FrontendUrl
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         LinkLytics Cloud Deployment Helper              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Step 1: Push to GitHub
if ($GitHubRepoUrl) {
    Write-Host "`n[1/3] Configuring Git Remote & Pushing to GitHub..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin $GitHubRepoUrl
    git branch -M main
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed to $GitHubRepoUrl!" -ForegroundColor Green
    } else {
        Write-Host "Push failed. Please check your credentials or personal access token." -ForegroundColor Red
    }
}

# Step 2: Verification if URLs are supplied
if ($BackendUrl) {
    Write-Host "`n[2/3] Verifying Backend Health Check at $BackendUrl..." -ForegroundColor Yellow
    try {
        $healthUrl = "$BackendUrl/api/health"
        $response = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 15
        Write-Host "Backend is LIVE! Health response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
    } catch {
        Write-Host "Backend health check failed or still spinning up: $_" -ForegroundColor Red
    }
}

if ($FrontendUrl) {
    Write-Host "`n[3/3] Verifying Frontend Availability at $FrontendUrl..." -ForegroundColor Yellow
    try {
        $feResponse = Invoke-WebRequest -Uri $FrontendUrl -Method Get -TimeoutSec 15
        Write-Host "Frontend is LIVE! Status code: $($feResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Frontend check failed: $_" -ForegroundColor Red
    }
}

Write-Host "`nReady for live demonstration!" -ForegroundColor Cyan
