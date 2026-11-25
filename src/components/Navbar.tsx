"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, prefersReduced } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { profile } from "@/data/portfolio";

type Item = { label: string; href: string; bg: string; icon: React.ReactNode; external?: boolean };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const items: Item[] = [
  { label: "Home", href: "#top", bg: "from-violet-400 to-violet-700", icon: <path {...stroke} d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /> },
  { label: "Projects", href: "#projects", bg: "from-fuchsia-400 to-purple-700", icon: <path {...stroke} d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { label: "Services", href: "#services", bg: "from-indigo-400 to-indigo-700", icon: <path {...stroke} d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" /> },
  { label: "About", href: "#about", bg: "from-pink-400 to-rose-600", icon: <><circle {...stroke} cx="12" cy="8" r="4" /><path {...stroke} d="M4 21a8 8 0 0 1 16 0" /></> },
  { label: "Contact", href: "#contact", bg: "from-sky-400 to-blue-700", icon: <><rect {...stroke} x="3" y="5" width="18" height="14" rx="2" /><path {...stroke} d="M3 7l9 6 9-6" /></> },
  {
    label: "WhatsApp",
    href: profile.whatsapp,
    external: true,
    bg: "from-emerald-400 to-green-600",
    icon: <path {...stroke} d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4.5 4.5 0 0 1-2.3-2.3l.8-1-1-2z" />,
  },
];

/** Floating app-style dock: a sticky dark pill with colourful icon buttons that magnify like the macOS dock. */
export default function Navbar() {
  const dock = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const isHome = usePathname() === "/";

  // tuck the dock away while scrolling down quickly, bring it back on scroll up
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

  // mac-dock magnify: icons grow by their distance to the pointer
  useEffect(() => {
    const el = dock.current;
    if (!el || prefersReduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const icons = Array.from(el.querySelectorAll<HTMLElement>(".dock-icon"));
    const sc = icons.map((i) => gsap.quickTo(i, "scale", { duration: 0.25, ease: "power3" }));
    const ty = icons.map((i) => gsap.quickTo(i, "y", { duration: 0.25, ease: "power3" }));
    const move = (e: PointerEvent) => {
      icons.forEach((icon, k) => {
        const r = icon.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const f = Math.max(0, 1 - d / 140); // influence radius 140px
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

  const go = (e: React.MouseEvent, it: Item) => {
    if (it.external || !isHome) return; // let the link navigate (new tab, or /#section)
    e.preventDefault();
    scrollToTarget(it.href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] md:top-5 ${
        hidden ? "-translate-y-[140%]" : "translate-y-0"
      }`}
    >
      <nav
        ref={dock}
        aria-label="Main"
        className="flex items-end gap-1.5 rounded-[22px] border border-white/10 bg-[#120f1c]/80 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,.55),0_0_0_1px_rgba(139,92,246,.12),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl md:gap-2 md:px-3"
      >
        <Link
          href="/"
          onClick={(e) => { if (isHome) { e.preventDefault(); scrollToTarget("#top"); } }}
          className="mr-1 hidden items-center self-center whitespace-nowrap rounded-full px-3 font-display text-sm font-bold md:flex"
        >
          <span className="text-accent">&lt;</span>&nbsp;{profile.shortName}&nbsp;<span className="text-accent">/&gt;</span>
        </Link>
        <span aria-hidden className="mr-1 hidden h-8 w-px self-center bg-white/10 md:block" />
        {items.map((it) => (
          <a
            key={it.label}
            href={it.external ? it.href : isHome ? it.href : `/${it.href}`}
            target={it.external ? "_blank" : undefined}
            rel={it.external ? "noreferrer" : undefined}
            onClick={(e) => go(e, it)}
            aria-label={it.label}
            className="group relative"
          >
            <span
              className={`dock-icon flex h-10 w-10 origin-bottom items-center justify-center rounded-[12px] bg-gradient-to-br ${it.bg} text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_6px_14px_rgba(0,0,0,.35)] will-change-transform md:h-11 md:w-11`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,.25)]" aria-hidden>
                {it.icon}
              </svg>
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-[#120f1c] px-2.5 py-1 text-xs font-semibold opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              {it.label}
            </span>
          </a>
        ))}
      </nav>
    </header>
  );
}
