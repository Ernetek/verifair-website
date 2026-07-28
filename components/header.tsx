"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { primaryNav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3" aria-label="VerifAir home">
          <Image src="/assets/verifair-logo.png" alt="" width={46} height={31} className="h-9 w-auto object-contain" priority />
          <span className="text-xl font-black tracking-normal">VerifAir</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-700 lg:flex" aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link className="btn btn-secondary" href="/contact#overview">
            Watch overview
          </Link>
          <Link className="btn btn-primary" href="/contact">
            Book demonstration
          </Link>
        </div>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 lg:hidden"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container grid gap-2 py-5" aria-label="Mobile navigation">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-2 py-3 font-bold" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="btn btn-primary mt-2" href="/contact" onClick={() => setOpen(false)}>
              Book demonstration
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
