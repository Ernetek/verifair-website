import Link from "next/link";
import { footerGroups, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <p className="text-3xl font-black">VerifAir</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Dustlight provides the monitoring. VerifAir provides the intelligence, reporting and operational awareness for dust-sensitive environments.
            </p>
            <form className="mt-7 flex max-w-md gap-2" aria-label="Newsletter signup">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input id="newsletter-email" type="email" placeholder="Work email" className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-white placeholder:text-slate-400" />
              <button className="btn bg-white text-slate-950" type="submit">
                Subscribe
              </button>
            </form>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-black uppercase text-slate-400">{group.title}</h2>
                <ul className="mt-4 grid gap-3 text-sm text-slate-200">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 VerifAir. Developed by Erne Tech Solutions.</p>
          <p>
            {siteConfig.email} | Customer portal: app.verifair.com.au
          </p>
        </div>
      </div>
    </footer>
  );
}
