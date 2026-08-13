$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Backup-File {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        throw "File not found: $Path"
    }

    $Backup = "$Path.pre-repair-$Timestamp.bak"
    Copy-Item $Path $Backup
    Write-Host "Backup: $Backup" -ForegroundColor DarkGray
}

function Replace-Required {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Replacement,
        [string]$Description
    )

    $Text = Get-Content $Path -Raw
    $NewText = [regex]::Replace(
        $Text,
        $Pattern,
        $Replacement,
        [System.Text.RegularExpressions.RegexOptions]::Multiline
    )

    if ($NewText -eq $Text) {
        Write-Host "SKIP: $Description - pattern not found/already fixed" -ForegroundColor Yellow
        return
    }

    Set-Content -Path $Path -Value $NewText -Encoding UTF8
    Write-Host "FIX:  $Description" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "VerifAir TypeScript Repair - Pass 1" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    throw "Run this script from the verifair-github repository root."
}

$Session = Join-Path $Root "lib/demonstration/session.ts"
$ProductDemo = Join-Path $Root "components/demonstration/ProductDemonstration.tsx"
$Dashboards = Join-Path $Root "components/demonstration/ClinicalDashboards.tsx"

Backup-File $Session
Backup-File $ProductDemo
Backup-File $Dashboards

# ------------------------------------------------------------
# FIX 1
# Omit<IncidentEvent, ...> is not distributive over a union.
#
# This is why variant-specific properties such as:
# acknowledgedBy
# assignee
# startedBy
# status
# escalatedBy
# verifier
# category
# evidenceId
#
# are currently rejected.
# ------------------------------------------------------------

$SessionText = Get-Content $Session -Raw

if ($SessionText -notmatch 'type\s+IncidentEventInput\s*=') {

    $TypeDefinition = @'

type IncidentEventInput =
  IncidentEvent extends infer Event
    ? Event extends IncidentEvent
      ? Omit<Event, "incidentId" | "sequence" | "timestampMs"> & {
          incidentId?: string;
          timestampMs?: number;
        }
      : never
    : never;

'@

    $FirstExport = [regex]::Match(
        $SessionText,
        '(?m)^export\s+'
    )

    if (-not $FirstExport.Success) {
        throw "Could not find an export declaration in session.ts."
    }

    $SessionText =
        $SessionText.Substring(0, $FirstExport.Index) +
        $TypeDefinition +
        $SessionText.Substring($FirstExport.Index)

    Set-Content -Path $Session -Value $SessionText -Encoding UTF8

    Write-Host "FIX:  Added distributive IncidentEventInput type" -ForegroundColor Green
}
else {
    Write-Host "SKIP: IncidentEventInput already exists" -ForegroundColor Yellow
}

$SessionText = Get-Content $Session -Raw

# Replace multiline or single-line versions of the broken type.
$BrokenDispatchType = 'Omit<IncidentEvent,\s*"incidentId"\s*\|\s*"sequence"\s*\|\s*"timestampMs">\s*&\s*\{\s*timestampMs\?:\s*number;\s*incidentId\?:\s*string;\s*\}'

$FixedSessionText = [regex]::Replace(
    $SessionText,
    $BrokenDispatchType,
    'IncidentEventInput',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

# Also support reversed field order.
$BrokenDispatchType2 = 'Omit<IncidentEvent,\s*"incidentId"\s*\|\s*"sequence"\s*\|\s*"timestampMs">\s*&\s*\{\s*incidentId\?:\s*string;\s*timestampMs\?:\s*number;\s*\}'

$FixedSessionText = [regex]::Replace(
    $FixedSessionText,
    $BrokenDispatchType2,
    'IncidentEventInput',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

if ($FixedSessionText -ne $SessionText) {
    Set-Content -Path $Session -Value $FixedSessionText -Encoding UTF8
    Write-Host "FIX:  Replaced non-distributive IncidentEvent Omit" -ForegroundColor Green
}
else {
    Write-Host "CHECK: broken Omit signature was not found verbatim." -ForegroundColor Yellow
}

# ------------------------------------------------------------
# FIX 2
# ClinicalDashboards imports CANONICAL_WORKFLOW_PHASES but
# ProductDemonstration currently declares it privately.
# ------------------------------------------------------------

Replace-Required `
    -Path $ProductDemo `
    -Pattern '(?m)^const\s+CANONICAL_WORKFLOW_PHASES\s*=' `
    -Replacement 'export const CANONICAL_WORKFLOW_PHASES =' `
    -Description "Export CANONICAL_WORKFLOW_PHASES"

# ------------------------------------------------------------
# FIX 3
# locationDescription is not part of the canonical Monitor model.
# Monitor.name is already the canonical human-readable location label.
# ------------------------------------------------------------

$FilesUsingLocationDescription = @(
    $Dashboards,
    $ProductDemo
)

foreach ($File in $FilesUsingLocationDescription) {

    $Text = Get-Content $File -Raw

    if ($Text.Contains(".locationDescription")) {
        $Text = $Text.Replace(".locationDescription", ".name")
        Set-Content -Path $File -Value $Text -Encoding UTF8

        Write-Host "FIX:  Replaced non-domain Monitor.locationDescription in $(Split-Path $File -Leaf)" -ForegroundColor Green
    }
    else {
        Write-Host "SKIP: no locationDescription in $(Split-Path $File -Leaf)" -ForegroundColor Yellow
    }
}

# ------------------------------------------------------------
# FIX 4
# Preserve compatibility for renamed ClinicalDashboard exports
# where the replacement component definitely exists.
# ------------------------------------------------------------

$DashboardText = Get-Content $Dashboards -Raw
$AliasesToAppend = @()

if (
    $DashboardText -match '\bMonitoringRoomDisplay\b' -and
    $DashboardText -notmatch '\bMonitoringRoomDisplayPage\s*='
) {
    $AliasesToAppend += 'export const MonitoringRoomDisplayPage = MonitoringRoomDisplay;'
}

if (
    $DashboardText -match '\bSharedDashboard\b' -and
    $DashboardText -notmatch '\bSharedDashboardPage\s*='
) {
    $AliasesToAppend += 'export const SharedDashboardPage = SharedDashboard;'
}

if (
    $DashboardText -match '\bMonitoringRoomHeroPreview\b' -and
    $DashboardText -notmatch '\bMonitoringRoomPreview\s*='
) {
    $AliasesToAppend += 'export const MonitoringRoomPreview = MonitoringRoomHeroPreview;'
}

if ($AliasesToAppend.Count -gt 0) {

    $AppendText = "`r`n`r`n// Compatibility exports retained for existing routes/home sections.`r`n"
    $AppendText += ($AliasesToAppend -join "`r`n")
    $AppendText += "`r`n"

    Add-Content -Path $Dashboards -Value $AppendText

    foreach ($Alias in $AliasesToAppend) {
        Write-Host "FIX:  $Alias" -ForegroundColor Green
    }
}
else {
    Write-Host "SKIP: no safe ClinicalDashboard compatibility aliases required" -ForegroundColor Yellow
}

# ------------------------------------------------------------
# Basic source sanity
# ------------------------------------------------------------

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Git diff check" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

git diff --check

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: git diff --check found whitespace/source issues." -ForegroundColor Yellow
}

# ------------------------------------------------------------
# Typecheck
# ------------------------------------------------------------

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Re-running TypeScript" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$TypecheckLog = Join-Path $Root "typecheck-after-pass1.txt"

cmd.exe /d /s /c "npm run typecheck 2>&1" |
    ForEach-Object {
        $Line = [string]$_
        Write-Host $Line
        Add-Content -Path $TypecheckLog -Value $Line
    }

$ExitCode = [int]$LASTEXITCODE

Write-Host ""

if ($ExitCode -eq 0) {

    Write-Host "PASS: TypeScript is now clean." -ForegroundColor Green
    Write-Host ""
    Write-Host "Run:"
    Write-Host "  .\verify-demonstration.ps1 -KillPort3000" -ForegroundColor Cyan

    exit 0
}

Write-Host "TypeScript still has remaining integration errors." -ForegroundColor Yellow
Write-Host ""
Write-Host "Remaining errors:" -ForegroundColor Yellow

$Remaining = Select-String `
    -Path $TypecheckLog `
    -Pattern 'error TS[0-9]+' `
    -ErrorAction SilentlyContinue

if ($Remaining) {
    $Remaining | ForEach-Object {
        Write-Host $_.Line -ForegroundColor Red
    }
}
else {
    Write-Host "No TSxxxx lines extracted. Inspect $TypecheckLog"
}

Write-Host ""
Write-Host "Full log:"
Write-Host $TypecheckLog

exit $ExitCode