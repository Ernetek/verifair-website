export function PageDisclaimer() {
  return (
    <aside
      className="border-t border-slate-200 bg-white"
      aria-label="Important monitoring information"
    >
      <div className="container max-w-5xl py-6 text-xs leading-5 text-slate-500 sm:text-[13px]">
        <p>
          <strong className="font-semibold text-slate-600">
            Important information:
          </strong>{" "}
          VerifAir provides project-level environmental particulate monitoring,
          alerting and operational reporting support. Readings show measured
          particle-size fractions and changing conditions; they do not identify
          material composition or independently establish personal exposure to
          silica, asbestos or another specific substance.
        </p>
        <p className="mt-2">
          Real-time optical monitoring can make short-duration changes and
          task-related peaks visible while work is occurring. Gravimetric
          sampling remains important for validated time-weighted or
          material-specific exposure assessment. The two methods are
          complementary rather than interchangeable. See Dustlight’s overview of{" "}
          <a
            href="https://dustlight.com/blog/news/gravimetrische-oder-echtzeit-staubmessung-warum-sicherheitsteams-beides-brauchen/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-slate-600 underline underline-offset-2 hover:text-blue-700"
          >
            gravimetric and real-time dust measurement
          </a>
          .
        </p>
        <p className="mt-2">
          VerifAir does not replace personal exposure assessment,
          occupational-hygiene advice, specialist sampling, risk assessment,
          material-specific controls or duties under applicable laws. Monitoring
          locations, settings and response procedures should be determined for
          each project by appropriately competent personnel.
        </p>
      </div>
    </aside>
  );
}
