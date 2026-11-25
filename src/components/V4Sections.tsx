"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { liveProjects, nowListening, projects, stack, yearsOfExperience } from "@/data/portfolio";

/* ------------------------------------------------------------------ stats */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  const items = [
    { v: projects.length, s: "+", l: t.statProjects },
    { v: liveProjects.length, s: "+", l: t.statClients },
    { v: yearsOfExperience, s: "+", l: t.statYears },
    { v: stack.reduce((n, g) => n + g.items.length, 0), s: "+", l: t.statTech },
  ];
  useGSAP(
    () => {
      gsap.from(".st-card", { y: 50, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } });
      if (prefersReduced()) return;
      gsap.utils.toArray<HTMLElement>(".st-num").forEach((el) => {
        const o = { v: 0 };
        gsap.to(o, { v: Number(el.dataset.v), duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="px-site grid grid-cols-2 gap-3 py-10 md:grid-cols-4 md:gap-4">
      {items.map((it) => (
        <div key={it.l} className="st-card rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a1530] to-[#110e1c] p-6 md:p-8">
          <p className="font-heavy text-5xl text-brand md:text-7xl">
            <span className="st-num" data-v={it.v}>{it.v}</span>
            {it.s}
          </p>
          <p className="mt-2 text-sm font-semibold text-muted">{it.l}</p>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ statement */
const inline: Record<string, React.ReactNode> = {
  "{avatar}": (
    <span className="relative inline-block h-[0.9em] w-[0.9em] overflow-hidden rounded-full align-middle ring-2 ring-accent">
      <Image src="/avatar/sohila.webp" alt="" fill sizes="60px" className="object-cover" />
    </span>
  ),
  "{spark}": <span className="inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-[0.25em] bg-gradient-to-br from-amber-300 to-pink-500 align-middle text-[0.5em]">✦</span>,
  "{code}": <span className="inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-[0.25em] bg-gradient-to-br from-violet-400 to-indigo-700 align-middle font-mono text-[0.4em] text-white">{"</>"}</span>,
  "{rocket}": <span className="inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-[0.25em] bg-gradient-to-br from-emerald-300 to-teal-600 align-middle text-[0.5em]">↗</span>,
};

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(
    () => {
      gsap.fromTo(".sm-w", { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: true } });
    },
    { scope: ref, dependencies: [t] , revertOnUpdate: true }
  );
  return (
    <section ref={ref} className="px-site bg-[#f4f2fa] py-28 text-[#140f22] md:py-40">
      <p className="mx-auto max-w-5xl text-center font-display text-[8vw] font-bold leading-[1.25] md:text-[4.6vw]">
        {t.statement.map((w, i) => (
          <span key={i} className="sm-w inline-block px-[0.12em]">{inline[w] ?? w}</span>
        ))}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ glossy 3D tiles */
const tileStyle = [
  "from-violet-400 via-violet-600 to-indigo-800",
  "from-fuchsia-400 via-purple-600 to-violet-900",
  "from-pink-400 via-rose-500 to-purple-800",
  "from-sky-400 via-indigo-500 to-violet-800",
];
const tileIcon = ["◐", "▦", "✦", "↗"];

export function Tiles() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(
    () => {
      gsap.from(".tl-card", { y: 80, opacity: 0, rotate: 3, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 75%" } });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="px-site grid gap-10 bg-[#f4f2fa] pb-28 text-[#140f22] sm:grid-cols-2 lg:grid-cols-4">
      {t.tiles.map((tile, i) => (
        <div key={tile.title} className={`tl-card ${i % 2 ? "lg:mt-16" : ""}`}>
          <div className={`relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${tileStyle[i]} text-4xl text-white shadow-[0_18px_40px_rgba(91,33,182,.35),inset_0_2px_0_rgba(255,255,255,.55),inset_0_-6px_12px_rgba(0,0,0,.25)] transition duration-500 hover:-translate-y-2 hover:rotate-[-6deg]`}>
            <span aria-hidden className="absolute inset-x-3 top-2 h-1/3 rounded-full bg-white/30 blur-[2px]" />
            <span className="relative drop-shadow">{tileIcon[i]}</span>
          </div>
          <h3 className="mt-6 text-2xl font-bold">{tile.title}</h3>
          <p className="mt-2 text-[#6b6480]">{tile.desc}</p>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ services letter tiles + background scrub */
export function ServiceLetters() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(
    () => {
      // background goes white -> gray -> near-black while you scroll through
      // text flips from dark to light halfway, so it never fades into the gray in between
      gsap.fromTo(ref.current, { backgroundColor: "#f4f2fa" }, {
        backgroundColor: "#09080f",
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: true,
          onUpdate: (self) => { ref.current!.style.color = self.progress < 0.45 ? "#140f22" : "#ece9f5"; },
        },
      });
      gsap.utils.toArray<HTMLElement>(".sl-mini").forEach((m, i) => {
        gsap.fromTo(
          m,
          { x: (i % 2 ? 1 : -1) * (60 + i * 25), y: -80 - (i % 3) * 40, rotate: (i % 2 ? 1 : -1) * 35, opacity: 0 },
          { x: 0, y: 0, rotate: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 30%", scrub: true } }
        );
      });
      gsap.utils.toArray<HTMLElement>(".sl-row").forEach((r) => {
        gsap.from(r, { x: -60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 85%" } });
      });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="px-site py-24 md:py-32" style={{ backgroundColor: "#f4f2fa", color: "#140f22" }}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl font-bold md:text-6xl">{t.lettersTitle}</h2>
        {/* the tiles' letters assemble into her name while you scroll */}
        <div className="flex gap-2 md:gap-3" dir="ltr" aria-label="SOHILA">
          {t.letters.map((s, i) => (
            <span key={i} aria-hidden className={`sl-mini flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tileStyle[i % 4]} font-heavy text-2xl text-white shadow-[0_10px_24px_rgba(91,33,182,.35),inset_0_2px_0_rgba(255,255,255,.55)] md:h-16 md:w-16 md:text-4xl`}>
              {s.l}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-14 space-y-4">
        {t.letters.map((s, i) => (
          <div key={i} className="sl-row flex items-center gap-6 rounded-3xl border border-current/10 p-4 md:gap-10 md:p-6" style={{ borderColor: "color-mix(in srgb, currentColor 12%, transparent)" }}>
            <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br ${tileStyle[i % 4]} font-heavy text-5xl text-white shadow-[0_14px_30px_rgba(91,33,182,.35),inset_0_2px_0_rgba(255,255,255,.55),inset_0_-6px_12px_rgba(0,0,0,.25)] md:h-24 md:w-24 md:text-6xl`}>
              {s.l}
            </span>
            <div>
              <h3 className="text-2xl font-bold md:text-4xl">{s.title}</h3>
              <p className="mt-1 opacity-60 md:text-lg">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ now listening */
export function NowListening() {
  const { t, lang } = useLang();
  const title = (lang === "ar" ? nowListening.titleAr : nowListening.title) || t.trackPlaceholder;
  return (
    <section className="px-site py-16">
      <div className="mx-auto grid max-w-4xl items-center gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1a1530] to-[#0f0c19] p-6 md:grid-cols-[auto_1fr] md:p-10">
        {/* generated violet "vinyl" artwork (no real cover art) */}
        <div className="relative mx-auto h-44 w-44">
          <div className="vinyl absolute inset-0 rounded-full shadow-[0_20px_50px_rgba(139,92,246,.45)]" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-400 ring-4 ring-black/40">
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f0c19]" />
          </div>
        </div>
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-soft">
            <span className="flex h-4 items-end gap-[3px]" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="eq-bar w-[3px] rounded bg-accent-soft" style={{ animationDelay: `${i * 0.13}s` }} />
              ))}
            </span>
            {t.nowListening}
          </p>
          <p className="mt-3 text-2xl font-bold md:text-3xl">{title}</p>
          {nowListening.artist && <p className="text-muted">{nowListening.artist}</p>}
          <div className="mt-6 flex items-center gap-4">
            <a
              href={nowListening.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Play ${title} on YouTube`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#140f22] transition hover:scale-110"
            >
              ▶
            </a>
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="track-progress h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400" />
              </div>
              <p className="mt-1.5 text-xs text-muted">YouTube ↗</p>
            </div>
          </div>
          <p className="mt-5 text-sm italic text-fg/60">{t.musicTagline}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why waste time? */
export function WhyWaste() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  useGSAP(
    () => {
      // the question mark stretches and multiplies as you scroll
      gsap.fromTo(".ww-q", { scaleX: 1, marginInlineEnd: "0em" }, { scaleX: 3.2, marginInlineEnd: "0.9em", transformOrigin: lang === "ar" ? "right center" : "left center", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 30%", scrub: true } });
      gsap.fromTo(".ww-extra", { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.15, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 55%", end: "bottom 40%", scrub: true } });
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true }
  );
  return (
    <section ref={ref} className="relative overflow-hidden px-site py-32 md:py-44">
      <span aria-hidden className="pointer-events-none absolute -end-[5%] top-1/2 -translate-y-1/2 select-none font-heavy text-[60vw] leading-none text-white/[0.03] md:text-[42vw]">?</span>
      <h2 className="relative whitespace-nowrap font-heavy text-[15vw] leading-none md:text-[10vw]">
        {t.whyWaste}
        <span className="ww-q inline-block text-brand">{lang === "ar" ? "؟" : "?"}</span>
        <span className="ww-extra inline-block text-accent/70">{lang === "ar" ? "؟" : "?"}</span>
        <span className="ww-extra inline-block text-accent/40">{lang === "ar" ? "؟" : "?"}</span>
        <span className="ww-extra inline-block text-accent/20">{lang === "ar" ? "؟" : "?"}</span>
      </h2>
      <p className="relative mt-8 max-w-xl text-lg text-muted md:text-xl">{t.whyWasteSub}</p>
    </section>
  );
}

