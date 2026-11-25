"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/portfolio";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

const shapes = ["✦", "◆", "●", "▲", "✸"];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".svc-body", { height: 0 });
      gsap.set(".svc-body-0", { height: "auto" });
      gsap.utils.toArray<HTMLElement>(".svc-shape").forEach((s) => {
        gsap.to(s, { rotate: 360, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: ref }
  );

  const toggle = contextSafe((i: number) => {
    const next = active === i ? -1 : i;
    gsap.to(".svc-body", { height: 0, duration: 0.6, ease: "power3.inOut" });
    if (next >= 0) gsap.to(`.svc-body-${next}`, { height: "auto", duration: 0.6, ease: "power3.inOut" });
    setActive(next);
  });

  return (
    <section id="services" ref={ref} className="px-site relative bg-surface pb-24 pt-28 md:pb-32">
      <SectionTitle text="What I" accent="Do /" />
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1fr]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted md:text-center">( Services )</p>
        <Reveal>
          <p className="max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">
            I build digital experiences with thoughtful design, solid engineering and real-world performance, from websites to full web and mobile products.
          </p>
        </Reveal>
      </div>

      <Reveal childrenStagger className="mt-20 border-t border-line">
        {services.map((s, i) => (
          <div key={s.title} className="border-b border-line">
            <button
              onClick={() => toggle(i)}
              aria-expanded={active === i}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-6 py-8 text-left md:grid-cols-[1fr_1fr_auto] md:py-10"
            >
              <span className="font-display text-2xl font-semibold md:text-4xl">( {String(i + 1).padStart(2, "0")} )</span>
              <span className={`font-display text-2xl font-semibold transition md:text-[3.5vw] md:leading-tight ${active === i ? "text-fg" : "text-fg/55 group-hover:text-fg"}`}>
                {s.title}
              </span>
              <span className={`svc-shape text-2xl transition-colors duration-500 md:text-3xl ${active === i ? "text-accent" : "text-muted"}`}>{shapes[i % shapes.length]}</span>
            </button>
            <div className={`svc-body svc-body-${i} overflow-hidden`}>
              <div className="grid gap-8 pb-12 md:grid-cols-2">
                <span className="hidden md:block" />
                <div>
                  <p className="max-w-lg text-muted">{s.description}</p>
                  <ul className="mt-6 divide-y divide-line border-t border-line">
                    {s.points.map((p, k) => (
                      <li key={p} className="flex items-center gap-4 py-3 text-lg font-semibold">
                        <span className="text-xs text-accent">0{k + 1}</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
