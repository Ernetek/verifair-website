$ErrorActionPreference = "Continue"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogDir = Join-Path $Root "verification-logs"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$script:StepExitCode = 0
$script:StepLog = ""

function Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Run-Step {
    param(
        [string]$Name,
        [string]$Command
    )

    Section $Name

    $SafeName = $Name -replace '[^A-Za-z0-9_-]', '-'
    $LogFile = Join-Path $LogDir "$Timestamp-$SafeName.log"

    $script:StepLog = $LogFile
    $script:StepExitCode = 0

    Write-Host "> $Command"
    Write-Host ""

    & cmd.exe /d /s /c "$Command 2>&1" |
        ForEach-Object {
            $Line = [string]$_
            Write-Host $Line
            Add-Content -Path $LogFile -Value $Line
        }

    $script:StepExitCode = [int]$LASTEXITCODE

    Write-Host ""

    if ($script:StepExitCode -eq 0) {
        Write-Host "PASS: $Name" -ForegroundColor Green
    }
    else {
        Write-Host "FAIL: $Name (exit code $script:StepExitCode)" -ForegroundColor Red
        Write-Host "Log: $LogFile" -ForegroundColor Yellow
    }
}

function Show-SourceMatches {
    param(
        [string]$Pattern,
        [string]$Title
    )

    Section $Title

    $Roots = @(
        "app",
        "components",
        "lib"
    )

    $Files = @()

    foreach ($SearchRoot in $Roots) {
        $FullRoot = Join-Path $Root $SearchRoot

        if (Test-Path $FullRoot) {
            $Files += Get-ChildItem `
                -Path $FullRoot `
                -Recurse `
                -File `
                -Include *.ts,*.tsx,*.js,*.jsx,*.json `
                -ErrorAction SilentlyContinue
        }
    }

    $Matches = $Files |
        Select-String `
            -Pattern $Pattern `
            -ErrorAction SilentlyContinue |
        Select-Object -First 40

    if ($Matches) {
        $Matches | ForEach-Object {
            Write-Host "$($_.Path):$($_.LineNumber)"
            Write-Host "  $($_.Line.Trim())"
        }
    }
    else {
        Write-Host "No matches found."
    }
}

Section "VerifAir E2E repair and triage"

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Run this script from the verifair-github repository root." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------
# 1. Repair deterministic public-demo label
# ------------------------------------------------------------

Section "Repair simulated-data label"

$ProductPath = Join-Path `
    $Root `
    "components/demonstration/ProductDemonstration.tsx"

if (-not (Test-Path $ProductPath)) {
    Write-Host "ERROR: ProductDemonstration.tsx not found." -ForegroundColor Red
    exit 1
}

$Backup = "$ProductPath.e2e-$Timestamp.bak"
Copy-Item $ProductPath $Backup -Force

Write-Host "Backup: $Backup" -ForegroundColor DarkGray

$Product = Get-Content $ProductPath -Raw

$RequiredLabel = "Simulated demonstration data"

if ($Product.Contains($RequiredLabel)) {
    Write-Host "PASS: required simulated-data label already exists." -ForegroundColor Green
}
else {
    $Candidates = @(
        "Simulated product demonstration",
        "Simulated demonstration",
        "Demonstration data"
    )

    $Repaired = $false

    foreach ($Candidate in $Candidates) {
        if ($Product.Contains($Candidate)) {
            Write-Host "Replacing '$Candidate' with '$RequiredLabel'"

            $Product = $Product.Replace(
                $Candidate,
                $RequiredLabel
            )

            $Repaired = $true
            break
        }
    }

    if ($Repaired) {
        Set-Content `
            -Path $ProductPath `
            -Value $Product `
            -Encoding UTF8

        Write-Host "FIX: public demo now explicitly states '$RequiredLabel'." -ForegroundColor Green
    }
    else {
        Write-Host "WARNING: no safe existing label was found to replace." -ForegroundColor Yellow
        Write-Host "The script will not invent a UI insertion point." -ForegroundColor Yellow
    }
}

# ------------------------------------------------------------
# 2. TypeScript regression check
# ------------------------------------------------------------

Run-Step `
    -Name "TypeScript after label repair" `
    -Command "npm run typecheck"

if ($script:StepExitCode -ne 0) {
    Write-Host ""
    Write-Host "STOP: label repair introduced or exposed a TypeScript problem." -ForegroundColor Red
    exit $script:StepExitCode
}

# ------------------------------------------------------------
# 3. Replay E2E in isolation
#
# Both browsers failed the same exact assertion previously.
# Running serially determines whether the label fix resolves it.
# ------------------------------------------------------------

Run-Step `
    -Name "Replay E2E serial" `
    -Command "npx playwright test tests/e2e/replay-demonstration.spec.ts --workers=1"

$ReplayExit = $script:StepExitCode

if ($ReplayExit -ne 0) {
    Section "Replay E2E still failing"

    Write-Host "The demonstration failure is reproducible even without parallel workers." -ForegroundColor Red
    Write-Host ""
    Write-Host "Do not change additional domain logic yet."
    Write-Host "Inspect:"
    Write-Host $script:StepLog

    Show-SourceMatches `
        -Pattern "Simulated demonstration data|Simulated product demonstration|Respirable dust|PM4" `
        -Title "Relevant demonstration source"

    exit $ReplayExit
}

# ------------------------------------------------------------
# 4. Homepage tests serially
#
# Previous failures:
# - mobile navigation only failed Desktop Chrome
# - /resources only failed Mobile Safari
#
# Serial execution helps distinguish deterministic defects from
# worker/concurrency flakiness.
# ------------------------------------------------------------

Run-Step `
    -Name "Homepage E2E serial" `
    -Command "npx playwright test tests/e2e/home.spec.ts --workers=1"

$HomeSerialExit = $script:StepExitCode

if ($HomeSerialExit -ne 0) {

    Section "Homepage serial diagnostics"

    Write-Host "Homepage E2E fails even with one worker." -ForegroundColor Yellow

    Show-SourceMatches `
        -Pattern "mobile-navigation|Open navigation" `
        -Title "Mobile navigation source matches"

    Show-SourceMatches `
        -Pattern "JSON\.parse|/resources|resources" `
        -Title "Resources and JSON source matches"

    Write-Host ""
    Write-Host "Serial homepage log:" -ForegroundColor Yellow
    Write-Host $script:StepLog

    exit $HomeSerialExit
}

# ------------------------------------------------------------
# 5. Full E2E using normal project configuration
#
# If serial tests pass but this fails, we have evidence of
# concurrency/flakiness rather than a basic deterministic defect.
# ------------------------------------------------------------

Run-Step `
    -Name "Full E2E normal workers" `
    -Command "npm run test:e2e"

$FullE2EExit = $script:StepExitCode

if ($FullE2EExit -ne 0) {

    Section "Parallel E2E instability detected"

    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "The relevant specs passed serially but failed under the normal parallel E2E configuration." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "That indicates a concurrency/race/flakiness problem rather than a simple deterministic UI failure." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Do not weaken the tests to make this green."
    Write-Host ""
    Write-Host "Full E2E log:"
    Write-Host $script:StepLog

    Show-SourceMatches `
        -Pattern "JSON\.parse" `
        -Title "JSON.parse source matches"

    exit $FullE2EExit
}

# ------------------------------------------------------------
# 6. Full repository verification
# ------------------------------------------------------------

Section "All E2E tests passed"

Write-Host "Replay E2E: PASS" -ForegroundColor Green
Write-Host "Homepage serial E2E: PASS" -ForegroundColor Green
Write-Host "Full configured E2E: PASS" -ForegroundColor Green

$Verifier = Join-Path $Root "verify-demonstration.ps1"

if (Test-Path $Verifier) {

    Section "Final repository verification"

    & $Verifier -KillPort3000

    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "verify-demonstration.ps1 was not found." -ForegroundColor Yellow
Write-Host "Run the remaining Cloudflare gate manually:"
Write-Host ""
Write-Host "npm run cf:build"

exit 0