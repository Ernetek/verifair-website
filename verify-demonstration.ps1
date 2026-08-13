param(
    [switch]$SkipE2E,
    [switch]$SkipCloudflare,
    [switch]$KillPort3000
)

$ErrorActionPreference = "Continue"

if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = (Get-Location).Path
$LogDir = Join-Path $RepoRoot "verification-logs"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SummaryFile = Join-Path $LogDir "summary-$Timestamp.txt"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$script:LastStepExitCode = 0
$script:LastStepLog = ""

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Invoke-QualityGate {
    param(
        [string]$Name,
        [string]$Command
    )

    Write-Section $Name

    $SafeName = $Name -replace '[^A-Za-z0-9_-]', '-'
    $LogFile = Join-Path $LogDir "$Timestamp-$SafeName.log"

    $script:LastStepLog = $LogFile
    $script:LastStepExitCode = 0

    Write-Host "> $Command"
    Write-Host ""

    & cmd.exe /d /s /c "$Command 2>&1" |
        ForEach-Object {
            $Line = [string]$_
            Write-Host $Line
            Add-Content -Path $LogFile -Value $Line
        }

    $script:LastStepExitCode = [int]$LASTEXITCODE

    Write-Host ""

    if ($script:LastStepExitCode -eq 0) {
        Write-Host "PASS: $Name" -ForegroundColor Green
    }
    else {
        Write-Host "FAIL: $Name (exit code $script:LastStepExitCode)" -ForegroundColor Red
        Write-Host "Log: $LogFile" -ForegroundColor Yellow
    }
}

function Stop-IfFailed {
    param([string]$Name)

    if ($script:LastStepExitCode -eq 0) {
        return
    }

    Write-Section "Verification stopped"

    Write-Host "First failing gate: $Name" -ForegroundColor Red
    Write-Host "Exit code: $script:LastStepExitCode" -ForegroundColor Red
    Write-Host "Log: $script:LastStepLog" -ForegroundColor Yellow

    if ($Name -eq "TypeScript" -and (Test-Path $script:LastStepLog)) {
        Write-Host ""
        Write-Host "TypeScript error summary:" -ForegroundColor Yellow

        $TypeScriptErrors = Select-String `
            -Path $script:LastStepLog `
            -Pattern "error TS[0-9]+" `
            -ErrorAction SilentlyContinue

        if ($TypeScriptErrors) {
            $TypeScriptErrors | ForEach-Object {
                Write-Host $_.Line -ForegroundColor Red
            }
        }
        else {
            Write-Host "No TSxxxx lines were extracted. Inspect the log above." -ForegroundColor Yellow
        }
    }

    exit $script:LastStepExitCode
}

Write-Section "VerifAir Unified Demonstration Verification"

if (-not (Test-Path (Join-Path $RepoRoot "package.json"))) {
    Write-Host "ERROR: package.json not found." -ForegroundColor Red
    Write-Host "Run this script from the verifair-github repository root." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
    Write-Host "ERROR: .git not found. This is not the repository root." -ForegroundColor Red
    exit 1
}

Write-Host "Repository: $RepoRoot"
Write-Host "Started:    $(Get-Date)"

# ------------------------------------------------------------
# Git state
# ------------------------------------------------------------

Write-Section "Git state"

git branch --show-current
git status --short

Write-Host ""
Write-Host "Working tree diff:"
git diff --stat

Write-Host ""
Write-Host "Staged diff:"
git diff --cached --stat

# ------------------------------------------------------------
# Architecture checks
# ------------------------------------------------------------

Write-Section "Architecture checks"

$ArchitectureFailure = $false

$RequiredFiles = @(
    "lib/demonstration/incident-domain.ts",
    "lib/demonstration/session.ts",
    "components/demonstration/ProductDemonstration.tsx",
    "components/demonstration/ClinicalDashboards.tsx",
    "components/demonstration/ReplayControls.tsx",
    "tests/incident-domain.test.ts",
    "tests/demonstration-session.test.ts"
)

foreach ($File in $RequiredFiles) {
    if (Test-Path (Join-Path $RepoRoot $File)) {
        Write-Host "PASS: $File" -ForegroundColor Green
    }
    else {
        Write-Host "MISSING: $File" -ForegroundColor Red
        $ArchitectureFailure = $true
    }
}

$LegacyChecks = @(
    @{
        Path = "components/demonstration/ProductDemonstration.tsx"
        Pattern = "guidedSteps"
    },
    @{
        Path = "components/demonstration/ProductDemonstration.tsx"
        Pattern = "next * 80_000"
    },
    @{
        Path = "components/demonstration/ReplayControls.tsx"
        Pattern = "durationMs / 4"
    },
    @{
        Path = "components/demonstration/ClinicalDashboards.tsx"
        Pattern = "workflowForState"
    }
)

foreach ($Check in $LegacyChecks) {
    $CheckPath = Join-Path $RepoRoot $Check.Path

    if (Test-Path $CheckPath) {
        $Matches = Select-String `
            -Path $CheckPath `
            -Pattern $Check.Pattern `
            -SimpleMatch `
            -ErrorAction SilentlyContinue

        if ($Matches) {
            Write-Host ""
            Write-Host "WARNING: legacy pattern '$($Check.Pattern)' remains in $($Check.Path)" -ForegroundColor Yellow

            $Matches | ForEach-Object {
                Write-Host "  line $($_.LineNumber): $($_.Line.Trim())"
            }
        }
    }
}

$ProductDemoPath = Join-Path $RepoRoot "components/demonstration/ProductDemonstration.tsx"

if (Test-Path $ProductDemoPath) {
    $SeekMatches = Select-String `
        -Path $ProductDemoPath `
        -Pattern "controller.seek" `
        -SimpleMatch `
        -ErrorAction SilentlyContinue

    if ($SeekMatches) {
        Write-Host ""
        Write-Host "WARNING: ProductDemonstration.tsx still contains controller.seek()." -ForegroundColor Yellow
        Write-Host "Confirm workflow actions are not advancing environmental replay time." -ForegroundColor Yellow

        $SeekMatches | ForEach-Object {
            Write-Host "  line $($_.LineNumber): $($_.Line.Trim())"
        }
    }
}

# ------------------------------------------------------------
# Port 3000
# ------------------------------------------------------------

Write-Section "Port 3000"

$Listener = Get-NetTCPConnection `
    -LocalPort 3000 `
    -State Listen `
    -ErrorAction SilentlyContinue |
    Select-Object -First 1

if ($Listener) {
    $PidToKill = $Listener.OwningProcess
    $Proc = Get-Process -Id $PidToKill -ErrorAction SilentlyContinue

    if ($Proc) {
        $ProcName = $Proc.ProcessName
    }
    else {
        $ProcName = "unknown"
    }

    Write-Host "Port 3000 is occupied by PID $PidToKill ($ProcName)." -ForegroundColor Yellow

    if ($KillPort3000) {
        Write-Host "Stopping process..."

        Stop-Process `
            -Id $PidToKill `
            -Force `
            -ErrorAction SilentlyContinue

        Start-Sleep -Seconds 2

        $StillListening = Get-NetTCPConnection `
            -LocalPort 3000 `
            -State Listen `
            -ErrorAction SilentlyContinue |
            Select-Object -First 1

        if ($StillListening) {
            Write-Host "WARNING: Port 3000 is still occupied." -ForegroundColor Yellow
        }
        else {
            Write-Host "PASS: Port 3000 is now free." -ForegroundColor Green
        }
    }
}
else {
    Write-Host "PASS: Port 3000 is free." -ForegroundColor Green
}

# ------------------------------------------------------------
# Quality gates
# ------------------------------------------------------------

Invoke-QualityGate `
    -Name "Unit tests" `
    -Command "npm test"

Stop-IfFailed -Name "Unit tests"

Invoke-QualityGate `
    -Name "TypeScript" `
    -Command "npm run typecheck"

Stop-IfFailed -Name "TypeScript"

Invoke-QualityGate `
    -Name "Lint" `
    -Command "npm run lint"

Stop-IfFailed -Name "Lint"

Invoke-QualityGate `
    -Name "Next production build" `
    -Command "npm run build"

Stop-IfFailed -Name "Next production build"

if ($SkipE2E) {
    Write-Host ""
    Write-Host "SKIP: Playwright E2E" -ForegroundColor Yellow
}
else {
    Invoke-QualityGate `
        -Name "Playwright E2E" `
        -Command "npm run test:e2e"

    Stop-IfFailed -Name "Playwright E2E"
}

if ($SkipCloudflare) {
    Write-Host ""
    Write-Host "SKIP: Cloudflare build" -ForegroundColor Yellow
}
else {
    Invoke-QualityGate `
        -Name "Cloudflare build" `
        -Command "npm run cf:build"

    Stop-IfFailed -Name "Cloudflare build"
}

# ------------------------------------------------------------
# Final git state
# ------------------------------------------------------------

Write-Section "Final git state"

git status --short

Write-Host ""
Write-Host "Final working tree diff:"
git diff --stat

Write-Host ""
Write-Host "Final staged diff:"
git diff --cached --stat

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------

$SummaryLines = @(
    "VerifAir unified demonstration verification",
    "",
    "Run: $(Get-Date)",
    "Repository: $RepoRoot",
    "",
    "PASS - npm test",
    "PASS - npm run typecheck",
    "PASS - npm run lint",
    "PASS - npm run build"
)

if ($SkipE2E) {
    $SummaryLines += "SKIP - npm run test:e2e"
}
else {
    $SummaryLines += "PASS - npm run test:e2e"
}

if ($SkipCloudflare) {
    $SummaryLines += "SKIP - npm run cf:build"
}
else {
    $SummaryLines += "PASS - npm run cf:build"
}

$SummaryLines += ""
$SummaryLines += "Architecture required-file failure: $ArchitectureFailure"
$SummaryLines += ""
$SummaryLines += "A passing run verifies tests, typecheck, lint and builds."
$SummaryLines += "A final architecture/diff review is still required before merge."

Set-Content `
    -Path $SummaryFile `
    -Value $SummaryLines

Write-Section "RESULT"

if ($ArchitectureFailure) {
    Write-Host "QUALITY GATES PASSED, BUT REQUIRED ARCHITECTURE FILES ARE MISSING." -ForegroundColor Yellow
    Write-Host "Summary: $SummaryFile"
    exit 2
}

Write-Host "ALL EXECUTED QUALITY GATES PASSED." -ForegroundColor Green
Write-Host ""
Write-Host "Summary: $SummaryFile"
Write-Host "Logs:    $LogDir"
Write-Host ""
Write-Host "Next gate: final architecture/diff review before merge."

exit 0