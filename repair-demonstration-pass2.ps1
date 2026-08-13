$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$ProductPath = Join-Path $Root "components/demonstration/ProductDemonstration.tsx"
$DashboardPath = Join-Path $Root "components/demonstration/ClinicalDashboards.tsx"

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Backup-Source {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        throw "Required source file not found: $Path"
    }

    $Backup = "$Path.pass2-$Timestamp.bak"
    Copy-Item $Path $Backup -Force

    Write-Host "Backup: $Backup" -ForegroundColor DarkGray
}

function Add-ImportAfterUseClient {
    param(
        [string]$Text,
        [string]$Import
    )

    if ($Text.Contains($Import)) {
        return $Text
    }

    $Directive = '"use client";'

    if ($Text.Contains($Directive)) {
        return $Text.Replace(
            $Directive,
            "$Directive`r`n`r`n$Import"
        )
    }

    return "$Import`r`n$Text"
}

Write-Section "VerifAir demonstration repair - Pass 2"

if (-not (Test-Path (Join-Path $Root "package.json"))) {
    throw "Run this script from the verifair-github repository root."
}

Backup-Source $ProductPath
Backup-Source $DashboardPath

# ============================================================
# ProductDemonstration.tsx
# ============================================================

Write-Section "Repair ProductDemonstration.tsx"

$Product = Get-Content $ProductPath -Raw

# ------------------------------------------------------------
# 1. Export CANONICAL_WORKFLOW_PHASES
#
# Handles:
# const CANONICAL_WORKFLOW_PHASES =
# const CANONICAL_WORKFLOW_PHASES: SomeType =
# ------------------------------------------------------------

$OriginalProduct = $Product

$Product = [regex]::Replace(
    $Product,
    '(?m)^(\s*)const(\s+CANONICAL_WORKFLOW_PHASES\b)',
    '$1export const$2'
)

if ($Product -ne $OriginalProduct) {
    Write-Host "FIX: exported CANONICAL_WORKFLOW_PHASES" -ForegroundColor Green
}
elseif ($Product -match '(?m)^\s*export\s+const\s+CANONICAL_WORKFLOW_PHASES\b') {
    Write-Host "PASS: CANONICAL_WORKFLOW_PHASES already exported" -ForegroundColor Green
}
else {
    Write-Host "WARNING: CANONICAL_WORKFLOW_PHASES declaration was not found." -ForegroundColor Yellow
}

# ------------------------------------------------------------
# 2. Remove unsupported timezone metadata access.
#
# We deliberately do NOT invent a timezone.
# Replace the unsupported value with a neutral demonstration
# timeline label.
# ------------------------------------------------------------

if ($Product.Contains("publicDemonstrationScenario.metadata.timezone")) {
    $Product = $Product.Replace(
        "publicDemonstrationScenario.metadata.timezone",
        '"Scenario time"'
    )

    Write-Host "FIX: removed unsupported ScenarioMetadata.timezone dependency" -ForegroundColor Green
}
else {
    Write-Host "PASS: no unsupported metadata.timezone access found" -ForegroundColor Green
}

# ------------------------------------------------------------
# 3. Restore ProductDemonstrationPreview if Antigravity
# removed the previous public-homepage compatibility surface.
#
# The preview remains deterministic: it evaluates the approved
# frozen replay scenario at offset zero.
# ------------------------------------------------------------

if ($Product -notmatch '\bexport\s+function\s+ProductDemonstrationPreview\s*\(') {

    $EvaluateImport = 'import { evaluateAt } from "@/lib/replay/engine";'
    $LinkImport = 'import Link from "next/link";'

    $Product = Add-ImportAfterUseClient `
        -Text $Product `
        -Import $EvaluateImport

    if ($Product -notmatch 'import\s+Link\s+from\s+["'']next/link["'']') {
        $Product = Add-ImportAfterUseClient `
            -Text $Product `
            -Import $LinkImport
    }

    $Preview = @'

export function ProductDemonstrationPreview() {
  const initial = evaluateAt(publicDemonstrationScenario, 0);

  if (!initial.ok) {
    return null;
  }

  const state = initial.state;

  const monitor = state.monitorStates.find(
    ({ monitor: item }) => item.id === "WORK_ZONE_A",
  );

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-4 bg-slate-950 px-5 py-4 text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-300">
            Simulated product demonstration
          </p>

          <h3 className="mt-1 text-lg font-black">
            Work Zone A
          </h3>
        </div>

        <span className="text-xs font-bold text-slate-300">
          Start position
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-200">
        {DEMONSTRATION_METRICS.map((metric) => {
          const observation = monitor?.latestObservations.find(
            ({ metricId }) => metricId === metric.id,
          );

          return (
            <div
              key={metric.id}
              className="bg-white p-4"
            >
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {metric.label}
              </p>

              <p className="mt-2 text-2xl font-black text-slate-950">
                {observation?.reading.status === "available"
                  ? observation.reading.value
                  : "—"}{" "}

                <span className="text-xs font-bold text-slate-500">
                  µg/m³
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <p className="text-sm leading-5 text-slate-600">
          Includes PM1, PM2.5, respirable dust and PM10. No compliance or
          source determination is made.
        </p>

        <Link
          href="/demonstration/evidence-reporting"
          className="mt-3 inline-flex min-h-11 items-center font-black text-blue-700 hover:underline"
        >
          Open evidence-reporting demonstration →
        </Link>
      </div>
    </div>
  );
}

'@

    $Product = $Product.TrimEnd() + "`r`n`r`n" + $Preview

    Write-Host "FIX: restored ProductDemonstrationPreview compatibility component" -ForegroundColor Green
}
else {
    Write-Host "PASS: ProductDemonstrationPreview already exists" -ForegroundColor Green
}

Set-Content `
    -Path $ProductPath `
    -Value $Product `
    -Encoding UTF8

# ============================================================
# ClinicalDashboards.tsx
# ============================================================

Write-Section "Repair ClinicalDashboards.tsx"

$Dashboard = Get-Content $DashboardPath -Raw

# ------------------------------------------------------------
# 4. Explicitly type CANONICAL_WORKFLOW_PHASES map callback.
#
# This may become unnecessary once the export is fixed, but it
# makes the intended type explicit and removes the implicit-any
# failure deterministically.
# ------------------------------------------------------------

$OriginalDashboard = $Dashboard

$Dashboard = [regex]::Replace(
    $Dashboard,
    'CANONICAL_WORKFLOW_PHASES\.map\(\(\s*p\s*,\s*idx\s*\)\s*=>',
    'CANONICAL_WORKFLOW_PHASES.map((p: (typeof CANONICAL_WORKFLOW_PHASES)[number], idx: number) =>'
)

if ($Dashboard -ne $OriginalDashboard) {
    Write-Host "FIX: typed CANONICAL_WORKFLOW_PHASES map callback" -ForegroundColor Green
}
else {
    Write-Host "INFO: workflow map callback did not require direct rewrite" -ForegroundColor DarkGray
}

# ------------------------------------------------------------
# 5. Restore DashboardDemonstrationSection.
#
# This is presentation-only state: it switches between two
# canonical dashboard views. It does not create workflow truth.
# ------------------------------------------------------------

if ($Dashboard -notmatch '\bexport\s+function\s+DashboardDemonstrationSection\s*\(') {

    $DashboardSection = @'

export function DashboardDemonstrationSection() {
  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="dashboard-demonstration-title"
    >
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Product demonstration
            </p>

            <h2
              id="dashboard-demonstration-title"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              Two interfaces for two operational contexts.
            </h2>
          </div>

          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            The shared dashboard supports review of simulated readings,
            trends and incident records. The monitoring-room display keeps
            configured zone status visible in a large-format operational view.
          </p>
        </div>

        <div className="mt-8 grid gap-8">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-blue-700">
              Shared dashboard
            </p>

            <SharedDashboard compact />
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-blue-700">
              Monitoring room
            </p>

            <MonitoringRoomDisplay compact />
          </div>
        </div>
      </div>
    </section>
  );
}

'@

    $Dashboard = $Dashboard.TrimEnd() + "`r`n`r`n" + $DashboardSection

    Write-Host "FIX: restored DashboardDemonstrationSection compatibility export" -ForegroundColor Green
}
else {
    Write-Host "PASS: DashboardDemonstrationSection already exists" -ForegroundColor Green
}

Set-Content `
    -Path $DashboardPath `
    -Value $Dashboard `
    -Encoding UTF8

# ============================================================
# Source sanity
# ============================================================

Write-Section "Source sanity"

git diff --check

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "WARNING: git diff --check detected source formatting issues." -ForegroundColor Yellow
}

# ============================================================
# TypeScript
# ============================================================

Write-Section "TypeScript verification"

$TypecheckLog = Join-Path $Root "typecheck-after-pass2-$Timestamp.txt"

& cmd.exe /d /s /c "npm run typecheck 2>&1" |
    ForEach-Object {
        $Line = [string]$_

        Write-Host $Line
        Add-Content `
            -Path $TypecheckLog `
            -Value $Line
    }

$ExitCode = [int]$LASTEXITCODE

if ($ExitCode -ne 0) {
    Write-Host ""
    Write-Host "TYPECHECK STILL FAILING" -ForegroundColor Red
    Write-Host ""

    $Errors = Select-String `
        -Path $TypecheckLog `
        -Pattern "error TS[0-9]+" `
        -ErrorAction SilentlyContinue

    if ($Errors) {
        Write-Host "Remaining TypeScript errors:" -ForegroundColor Yellow

        $Errors | ForEach-Object {
            Write-Host $_.Line -ForegroundColor Red
        }
    }
    else {
        Write-Host "No TSxxxx lines extracted." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Full log:"
    Write-Host $TypecheckLog

    exit $ExitCode
}

Write-Host ""
Write-Host "PASS: TypeScript is clean." -ForegroundColor Green

# ============================================================
# Continue automatically into full verification
# ============================================================

Write-Section "Starting full verification"

$Verifier = Join-Path $Root "verify-demonstration.ps1"

if (-not (Test-Path $Verifier)) {
    Write-Host "TypeScript passed, but verify-demonstration.ps1 was not found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run manually:"
    Write-Host "npm test"
    Write-Host "npm run lint"
    Write-Host "npm run build"
    Write-Host "npm run test:e2e"
    Write-Host "npm run cf:build"

    exit 0
}

& $Verifier -KillPort3000

$VerifyExitCode = $LASTEXITCODE

exit $VerifyExitCode