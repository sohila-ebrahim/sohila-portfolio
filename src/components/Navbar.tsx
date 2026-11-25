"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import { navLinks, profile } from "@/data/portfolio";

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const isHome = usePathname() === "/";

  // hide on scroll down, show on scroll up, add a backdrop after the hero
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > last && y > 300;
      gsap.to(ref.current, { yPercent: hide ? -120 : 0, duration: 0.5, ease: "power3.out" });
      setSolid(y > 80);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (!isHome) return; // let the link navigate to /#section
    e.preventDefault();
    scrollToTarget(href);
  };

  return (
    <>
      <header ref={ref} className="fixed inset-x-0 top-0 z-50">
        <nav
          className={`px-site flex items-center justify-between py-5 transition-colors duration-500 ${
            solid && !open ? "bg-bg/70 backdrop-blur-md" : ""
          }`}
        >
          <Link href="/" className="font-display text-xl font-bold tracking-tight md:text-2xl" onClick={(e) => go(e, "#top")}>
            <span className="text-accent">&lt;</span> {profile.shortName} <span className="text-accent">/&gt;</span>
          </Link>
          <ul className="hidden items-center gap-1 text-[15px] font-semibold xl:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={isHome ? l.href : `/${l.href}`}
                  onClick={(e) => go(e, l.href)}
                  className="group relative block overflow-hidden rounded-full px-4 py-2"
                >
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] group-hover:-translate-y-full">{l.label}</span>
                  <span aria-hidden className="absolute inset-x-4 top-full block text-accent-soft transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] group-hover:-translate-y-full">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a
              href={isHome ? "#contact" : "/#contact"}
              onClick={(e) => go(e, "#contact")}
              className="hidden rounded-full border border-accent/70 px-5 py-2 text-sm font-semibold transition-colors hover:bg-accent sm:inline-block"
            >
              Let&apos;s talk
            </a>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-surface/80 xl:hidden"
            >
              <span className={`h-px w-5 bg-fg transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-fg transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-4 bg-bg px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(.77,0,.18,1)] xl:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div aria-hidden className="absolute right-[-20%] top-[10%] h-96 w-96 rounded-full bg-accent/25 blur-[120px]" />
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={isHome ? l.href : `/${l.href}`}
            onClick={(e) => go(e, l.href)}
            className="relative flex items-baseline gap-4 font-display text-5xl font-bold uppercase"
          >
            <span className="text-sm text-accent">0{i + 1}</span>
            {l.label}
          </a>
        ))}
        <div className="relative mt-8 flex gap-6 text-sm text-muted">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
          ))}
        </div>
      </div>
    </>
  );
}
