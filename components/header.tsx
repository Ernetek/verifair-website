"use client";

import { ArrowUpRightIcon, Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { productNav, resourcesNav, solutionsNav } from "@/lib/site";

type DropdownName = "product" | "solutions" | "resources";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isWorkflowSurface(pathname: string) {
  return pathname === "/workflow" || pathname.startsWith("/workflow/") || pathname === "/demonstration";
}

function ProductPanel({ pathname, close }: { pathname: string; close: () => void }) {
  return (
    <div id="product-navigation-panel" className="absolute left-1/2 top-full z-50 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 border border-slate-200 bg-white p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">The VerifAir product</p>
        <p className="text-xs font-bold text-slate-500">ASSESS <span aria-hidden="true">→</span> ACT <span aria-hidden="true">→</span> REPORT</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {productNav.map((item) => (
          <Link key={item.href} href={item.href} onClick={close} className={`border p-4 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${(isActive(pathname, item.href) || (item.href === "/workflow" && isWorkflowSurface(pathname))) ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}>
            <span className="block text-sm font-black uppercase tracking-[0.08em] text-slate-950">{item.label}</span>
            <span className="mt-1 block text-xs font-black uppercase tracking-[0.14em] text-blue-700">{item.stage}</span>
            <span className="mt-4 block text-sm leading-6 text-slate-600">{item.description}</span>
            <span className="mt-4 block text-sm font-black text-blue-700" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LinkPanel({ name, pathname, close }: { name: "solutions" | "resources"; pathname: string; close: () => void }) {
  const items = name === "solutions" ? solutionsNav : resourcesNav;
  return (
    <div id={`${name}-navigation-panel`} className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 border border-slate-200 bg-white p-3 shadow-2xl">
      <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">{name === "solutions" ? "Industries VerifAir serves" : "Knowledge and guidance"}</p>
      <div className="grid gap-1">
        {items.map((item) => <Link key={`${name}-${item.label}`} href={item.href} onClick={close} className={`rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive(pathname, item.href) ? "bg-blue-50 text-blue-700" : "text-slate-900"}`}>{item.label}</Link>)}
      </div>
    </div>
  );
}

function MobileGroup({ label, expanded, active, onToggle, children }: { label: string; expanded: boolean; active?: boolean; onToggle: () => void; children: React.ReactNode }) {
  return <div><button type="button" aria-expanded={expanded} onClick={onToggle} className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-3 text-base font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${active ? "text-blue-700" : "text-slate-900"}`}>{label}<ChevronDownIcon className={`size-5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" /></button>{expanded ? <div className="pb-1 pt-1">{children}</div> : null}</div>;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const productActive = isActive(pathname, "/monitoring") || isWorkflowSurface(pathname) || isActive(pathname, "/reporting");

  useEffect(() => {
    if (!mobileOpen && !openDropdown) return;
    const originalOverflow = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    if (mobileOpen) window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("button, a")?.focus());
    const onPointerDown = (event: PointerEvent) => {
      if (openDropdown && headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenDropdown(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenDropdown(null);
        if (mobileOpen) { setMobileOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }
      }
      if (event.key === "Tab" && mobileOpen && menuRef.current) {
        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (first && last && event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (first && last && !event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = originalOverflow; document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [mobileOpen, openDropdown]);

  function closeAll() { setOpenDropdown(null); setMobileOpen(false); }

  const desktopItems = [
    { label: "PRODUCT", href: "/monitoring", dropdown: "product" as const },
    { label: "INDUSTRIES", href: "/solutions", dropdown: "solutions" as const },
    { label: "HOW IT WORKS", href: "/how-it-works" },
    { label: "RESOURCES", href: "/resources", dropdown: "resources" as const },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" }
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex h-18 items-center justify-between gap-6 sm:h-20">
        <Link href="/" className="flex max-w-[9rem] shrink-0 items-center sm:max-w-[11rem] lg:max-w-[13rem]" aria-label="VerifAir home"><Image src="/assets/verifair_erne_tech__light_logo.webp" alt="VerifAir by ERNE Tech" width={520} height={160} className="h-auto w-[9rem] max-w-full object-contain sm:w-[11rem] lg:w-[13rem]" priority /></Link>
        <nav className="hidden flex-1 items-center justify-center gap-5 text-[0.9rem] font-semibold text-slate-900 lg:flex" aria-label="Primary navigation">
          {desktopItems.map((item) => {
            const dropdown = "dropdown" in item ? item.dropdown : undefined;
            const active = dropdown === "product" ? productActive : isActive(pathname, item.href);
            if (!dropdown) return <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`rounded-md px-1 py-2 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 ${active ? "text-blue-700" : ""}`}>{item.label}</Link>;
            return <div key={item.label} className="relative"><button type="button" aria-expanded={openDropdown === dropdown} aria-controls={`${dropdown}-navigation-panel`} onClick={() => setOpenDropdown((current) => current === dropdown ? null : dropdown)} className={`inline-flex items-center gap-1 rounded-md px-1 py-2 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 ${active ? "text-blue-700" : ""}`}>{item.label}<ChevronDownIcon className={`size-4 transition-transform ${openDropdown === dropdown ? "rotate-180" : ""}`} aria-hidden="true" /></button>{openDropdown === dropdown ? (dropdown === "product" ? <ProductPanel pathname={pathname} close={closeAll} /> : <LinkPanel name={dropdown} pathname={pathname} close={closeAll} />) : null}</div>;
          })}
        </nav>
        <Link href="/contact#project-enquiry" className="cta-primary hidden min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 lg:inline-flex">Discuss Your Project<ArrowUpRightIcon className="h-5 w-5" aria-hidden="true" /></Link>
        <button ref={triggerRef} className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:hidden" type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <XMarkIcon className="h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="h-6 w-6" aria-hidden="true" />}</button>
      </div>
      {mobileOpen ? <div ref={menuRef} id="mobile-navigation" className="fixed inset-x-0 top-[4.5rem] z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-slate-200 bg-white shadow-xl sm:top-20 lg:hidden"><nav className="container grid gap-1 py-5" aria-label="Mobile navigation">
        <MobileGroup label="PRODUCT" expanded={mobileProductOpen} active={productActive} onToggle={() => setMobileProductOpen((value) => !value)}><div className="grid gap-1 border-l-2 border-blue-200 pl-3">{productNav.map((item) => <Link key={item.href} href={item.href} onClick={closeAll} className={`rounded-md px-3 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${(isActive(pathname, item.href) || (item.href === "/workflow" && isWorkflowSurface(pathname))) ? "bg-blue-50 text-blue-700" : "text-slate-900"}`}><span className="block">{item.label}</span><span className="block text-xs font-black uppercase tracking-[0.12em] text-blue-700">{item.stage}</span></Link>)}</div></MobileGroup>
        <MobileGroup label="INDUSTRIES" expanded={mobileSolutionsOpen} onToggle={() => setMobileSolutionsOpen((value) => !value)}><div className="grid gap-1 border-l-2 border-slate-200 pl-3">{solutionsNav.map((item) => <Link key={item.href} href={item.href} onClick={closeAll} className="rounded-md px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">{item.label}</Link>)}</div></MobileGroup>
        <Link href="/how-it-works" onClick={closeAll} className="rounded-lg px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">HOW IT WORKS</Link>
        <MobileGroup label="RESOURCES" expanded={mobileResourcesOpen} onToggle={() => setMobileResourcesOpen((value) => !value)}><div className="grid gap-1 border-l-2 border-slate-200 pl-3">{resourcesNav.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} onClick={closeAll} className="rounded-md px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">{item.label}</Link>)}</div></MobileGroup>
        <Link href="/about" onClick={closeAll} className="rounded-lg px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">ABOUT</Link>
        <Link href="/contact" onClick={closeAll} className={`rounded-lg px-3 py-3 text-base font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive(pathname, "/contact") ? "text-blue-700" : "text-slate-900"}`}>CONTACT</Link>
        <Link href="/contact#project-enquiry" onClick={closeAll} className="cta-primary mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Discuss Your Project<ArrowUpRightIcon className="h-5 w-5" aria-hidden="true" /></Link>
      </nav></div> : null}
    </header>
  );
}
