import Image from "next/image";
import Link from "next/link";

import { footerGroups, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Image
              src="/assets/verifair_erne_tech_footer.webp"
              alt="VerifAir by ERNE Tech"
              width={480}
              height={160}
              className="h-auto !w-[13.44rem] !max-w-[13.44rem] bg-slate-950 object-contain"
            />
            <p className="mt-3 text-sm text-slate-400">
              Powered by Dustlight sensing technology
              <br />
              Engineered by ERNE Tech
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Dustlight measures particulate conditions. VerifAir coordinates monitoring data, alerts, reporting and operational visibility for dust-sensitive environments.
            </p>
            <Link
              href="/contact"
              className="btn mt-7 min-h-12 !bg-white px-6 !text-slate-950 shadow-sm hover:!bg-slate-100 hover:!text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Discuss Your Project
            </Link>
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
          <p>Copyright 2026 VerifAir. Developed by Erne Tech.</p>
          <p>
            <a className="hover:text-white" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
