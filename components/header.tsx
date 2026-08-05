// components/header.tsx
"use client";

import {
  ArrowUpRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { primaryNav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="container flex h-20 items-center justify-between gap-8">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="VerifAir home"
        >
          <Image
            src="/assets/verifair-logo.webp"
            alt=""
            width={150}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-10 text-base font-semibold text-slate-900 lg:flex"
          aria-label="Primary navigation"
        >
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-2 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:flex">
          <Link
            href="/contact#project-enquiry"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
          >
            Book a free site assessment
            <ArrowUpRightIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:hidden"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white lg:hidden"
        >
          <nav
            className="container grid gap-1 py-5"
            aria-label="Mobile navigation"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact#project-enquiry"
              className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              onClick={() => setOpen(false)}
            >
              Book a free site assessment
              <ArrowUpRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
