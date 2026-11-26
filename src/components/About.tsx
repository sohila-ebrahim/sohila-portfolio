"use client";
import { useRef } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { profile, stats } from "@/data/portfolio";
import IdBadge from "./IdBadge";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // scroll-stretched headline: each line starts wide and squashed, then settles while the words light up
      if (window.innerWidth >= 768) gsap.utils.toArray<HTMLElement>(".ab-line").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 1.35, scaleY: 0.55, letterSpacing: "0.08em" },
          { scaleX: 1, scaleY: 1, letterSpacing: "0em", ease: "none", scrollTrigger: { trigger: line, start: "top 95%", end: "top 45%", scrub: true } }
        );
      });
      gsap.fromTo(".ab-word", { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".ab-head", start: "top 80%", end: "bottom 50%", scrub: true } });
      gsap.from(".ab-fade", { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".ab-body", start: "top 80%" } });

      // count-up stats
      gsap.utils.toArray<HTMLElement>(".ab-count").forEach((el) => {
        const end = Number(el.dataset.value);
        if (prefersReduced()) return;
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => { el.textContent = String(Math.round(o.v)); },
        });
      });
    },
    { scope: ref }
  );

  const lines = [
    { text: `${profile.roles[0]},`, accent: false },
    { text: `${profile.roles[1]},`, accent: false },
    { text: `${profile.roles[2]}/`, accent: true },
  ];

  return (
    <section id="about" ref={ref} className="px-site relative z-10 overflow-hidden rounded-b-3xl bg-bg py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-[auto_1fr]">
        <span aria-hidden className="hidden text-7xl font-light text-fg/70 md:block">↘</span>
        <h2 className="ab-head font-display text-[9vw] font-extrabold uppercase leading-[0.95] md:text-[6.4vw]">
          {lines.map((l) => (
            <span key={l.text} className={`ab-line block origin-left md:whitespace-nowrap ${l.accent ? "text-accent" : ""}`}>
              {l.text.split(" ").map((w, i) => (
                <span key={i} className="ab-word inline-block pr-[0.25em]">{w}</span>
              ))}
            </span>
          ))}
        </h2>
      </div>

      <div className="ab-body mt-20 grid items-start gap-14 lg:grid-cols-[minmax(280px,0.9fr)_1.4fr]">
        <div className="ab-fade order-2 lg:order-1">
          <IdBadge />
          <p className="-mt-6 text-center text-xs uppercase tracking-[0.3em] text-muted">Drag the badge</p>
        </div>
        <div className="order-1 lg:order-2">
          <p className="ab-fade font-display text-2xl font-semibold leading-snug md:text-[32px]">{profile.intro}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-[auto_1fr]">
            <p className="ab-fade text-xs font-semibold uppercase tracking-[0.2em] text-muted">( About me )</p>
            <div className="space-y-5 text-fg/75">
              {profile.bio.map((b) => (
                <p key={b} className="ab-fade leading-relaxed">{b}</p>
              ))}
            </div>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-line pt-10">
            {stats.map((s) => (
              <div key={s.label} className="ab-fade">
                <p className="font-display text-5xl font-bold text-accent md:text-7xl">
                  <span className="ab-count" data-value={s.value}>{s.value}</span>
                  {s.suffix}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
