import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <p className="eyebrow">404</p>
        <h1 className="h1 mt-4 font-black">This page is outside the monitored zone.</h1>
        <p className="lead mt-6">The page may have moved, or the address may be incorrect.</p>
        <Link className="btn btn-primary mt-8" href="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
