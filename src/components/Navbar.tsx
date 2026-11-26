"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, prefersReduced } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import { useLang } from "@/lib/lang";
import { profile } from "@/data/portfolio";
import type { Dict } from "@/data/i18n";

type Key = keyof Dict["nav"];
type Item = { key: Key; href: string; bg: string; icon: React.ReactNode; external?: boolean };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const items: Item[] = [
  { key: "top", href: "#top", bg: "from-violet-400 to-violet-700", icon: <path {...stroke} d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /> },
  { key: "projects", href: "#projects", bg: "from-fuchsia-400 to-purple-700", icon: <path {...stroke} d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { key: "services", href: "#services", bg: "from-indigo-400 to-indigo-700", icon: <path {...stroke} d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" /> },
  { key: "about", href: "#about", bg: "from-pink-400 to-rose-600", icon: <><circle {...stroke} cx="12" cy="8" r="4" /><path {...stroke} d="M4 21a8 8 0 0 1 16 0" /></> },
  { key: "contact", href: "#contact", bg: "from-sky-400 to-blue-700", icon: <><rect {...stroke} x="3" y="5" width="18" height="14" rx="2" /><path {...stroke} d="M3 7l9 6 9-6" /></> },
  {
    key: "whatsapp",
    href: profile.whatsapp,
    external: true,
    bg: "from-emerald-400 to-green-600",
    icon: <path {...stroke} d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4.5 4.5 0 0 1-2.3-2.3l.8-1-1-2z" />,
  },
];

const menuLinks: { key: Key; href: string }[] = [
  { key: "top", href: "#top" },
  { key: "services", href: "#services" },
  { key: "experience", href: "#experience" },
  { key: "stack", href: "#stack" },
  { key: "projects", href: "#projects" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

/**
 * Header: a floating app-style dock in the middle (desktop) that magnifies like the macOS dock,
 * plus a language pill and a round menu button on the side that opens a full-screen menu.
 */
export default function Navbar() {
  const dock = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = usePathname() === "/";
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last + 4 && y > 600);
      if (y < last) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  // mac-dock magnify
  useEffect(() => {
    const el = dock.current;
    if (!el || prefersReduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const icons = Array.from(el.querySelectorAll<HTMLElement>(".dock-icon"));
    const sx = icons.map((i) => gsap.quickTo(i, "scaleX", { duration: 0.25, ease: "power3" }));
    const sy = icons.map((i) => gsap.quickTo(i, "scaleY", { duration: 0.25, ease: "power3" }));
    const sc = icons.map((_, k) => (v: number) => { sx[k](v); sy[k](v); });
    const ty = icons.map((i) => gsap.quickTo(i, "y", { duration: 0.25, ease: "power3" }));
    const move = (e: PointerEvent) => {
      icons.forEach((icon, k) => {
        const r = icon.getBoundingClientRect();
        const f = Math.max(0, 1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 140);
        sc[k](1 + f * 0.55);
        ty[k](-f * 10);
      });
    };
    const leave = () => { sc.forEach((f) => f(1)); ty.forEach((f) => f(0)); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const go = (e: React.MouseEvent, href: string, external?: boolean) => {
    setOpen(false);
    if (external || !isHome) return;
    e.preventDefault();
    scrollToTarget(href);
  };

  const controls = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
        className="h-11 rounded-full border border-accent/60 bg-[#120f1c]/80 px-4 text-sm font-bold backdrop-blur-xl transition hover:bg-accent"
      >
        {lang === "en" ? <span className="font-ar">العربية</span> : "EN"}
      </button>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.close : t.menu}
        aria-expanded={open}
        className="relative z-[61] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 bg-[#120f1c]/80 backdrop-blur-xl transition hover:border-accent"
      >
        <span className={`h-px w-5 bg-fg transition duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
        <span className={`h-px w-5 bg-fg transition duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
      </button>
    </div>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-3 z-[60] flex items-start justify-between px-3 transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] md:top-5 md:px-5 ${
          hidden && !open ? "-translate-y-[140%]" : "translate-y-0"
        }`}
      >
        <Link
          href="/"
          onClick={(e) => go(e, "#top")}
          className="flex h-11 items-center whitespace-nowrap rounded-full border border-white/10 bg-[#120f1c]/80 px-4 font-display text-sm font-bold backdrop-blur-xl xl:invisible"
          dir="ltr"
        >
          <span className="text-accent">&lt;</span>&nbsp;{profile.shortName}&nbsp;<span className="text-accent">/&gt;</span>
        </Link>

        <nav
          ref={dock}
          aria-label="Main"
          className="absolute left-1/2 top-0 hidden -translate-x-1/2 items-end gap-2 rounded-[22px] border border-white/10 bg-[#120f1c]/80 px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,.55),0_0_0_1px_rgba(139,92,246,.12),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl md:flex"
        >
          <Link href="/" onClick={(e) => go(e, "#top")} dir="ltr" className="mr-1 hidden items-center self-center whitespace-nowrap rounded-full px-3 font-display text-sm font-bold xl:flex">
            <span className="text-accent">&lt;</span>&nbsp;{profile.shortName}&nbsp;<span className="text-accent">/&gt;</span>
          </Link>
          <span aria-hidden className="mr-1 hidden h-8 w-px self-center bg-white/10 xl:block" />
          {items.map((it) => (
            <a
              key={it.key}
              href={it.external ? it.href : isHome ? it.href : `/${it.href}`}
              target={it.external ? "_blank" : undefined}
              rel={it.external ? "noreferrer" : undefined}
              onClick={(e) => go(e, it.href, it.external)}
              aria-label={t.nav[it.key]}
              className="group relative"
            >
              <span className={`dock-icon flex h-11 w-11 origin-bottom items-center justify-center rounded-[12px] bg-gradient-to-br ${it.bg} text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_6px_14px_rgba(0,0,0,.35)] will-change-transform`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,.25)]" aria-hidden>{it.icon}</svg>
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-[#120f1c] px-2.5 py-1 text-xs font-semibold opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                {t.nav[it.key]}
              </span>
            </a>
          ))}
        </nav>

        {controls}
      </header>

      {/* full-screen menu */}
      <div
        className={`fixed inset-0 z-[55] flex flex-col justify-center overflow-y-auto overflow-x-hidden bg-[#0b0914] px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(.77,0,.18,1)] md:px-20 ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <div aria-hidden className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-[140px]" />
        <div aria-hidden className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[140px]" />
        <ul className="relative space-y-1">
          {menuLinks.map((l, i) => (
            <li key={l.key} className="overflow-hidden">
              <a
                href={isHome ? l.href : `/${l.href}`}
                onClick={(e) => go(e, l.href)}
                tabIndex={open ? 0 : -1}
                className={`group flex items-baseline gap-4 font-display text-[9vw] font-bold uppercase transition duration-700 sm:text-5xl md:text-7xl ${open ? "translate-y-0" : "translate-y-full"}`}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
              >
                <span className="text-sm text-accent">0{i + 1}</span>
                <span className="transition group-hover:translate-x-3 group-hover:text-accent-soft">{t.nav[l.key]}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="relative mt-12 flex flex-wrap gap-6 text-sm text-muted">
          <a href={lang === "ar" ? "/cv/Sohila-Ebrahim-CV-ar.pdf" : "/cv/Sohila-Ebrahim-CV.pdf"} download tabIndex={open ? 0 : -1} className="rounded-full border border-accent px-4 py-1.5 font-semibold text-fg hover:bg-accent">{t.downloadCv} ↓</a>
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="hover:text-fg">{profile.email}</a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-fg" dir="ltr">{profile.phone}</a>
          {profile.socials.filter((s) => s.label === "GitHub").map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-fg">{s.label}</a>
          ))}
        </div>
      </div>
    </>
  );
}
