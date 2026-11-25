"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/portfolio";

export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
        gsap.fromTo(item.querySelector(".exp-line"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: item, start: "top 75%", end: "bottom 60%", scrub: true } });
        gsap.from(item.querySelectorAll(".exp-anim"), {
          y: 50,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 80%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="experience" ref={ref} className="px-site mx-auto w-full py-24 md:py-32">
      <h2 className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide md:text-xl">
        <span className="text-accent">✸</span> Career &amp; <span className="text-accent">Experience</span>
      </h2>
      <div className="mt-16 space-y-6">
        {experience.map((e) => (
          <div key={e.role + e.period} className="exp-item grid gap-6 pb-16 md:grid-cols-[1fr_1fr_auto_2fr] md:gap-10">
            <div className="exp-anim">
              <h3 className="font-display text-2xl font-bold md:text-[28px]">{e.role}</h3>
              <p className="mt-1 text-muted">{e.company}</p>
            </div>
            <p className="exp-anim font-display text-3xl font-bold md:text-[40px] md:leading-none">{e.period}</p>
            <div className="relative hidden w-px bg-line md:block">
              <div className="exp-line absolute inset-0 origin-top bg-accent" />
              <span className="absolute -left-[5px] top-0 h-[11px] w-[11px] rounded-full bg-accent shadow-[0_0_14px_#8b5cf6]" />
            </div>
            <ul className="space-y-4">
              {e.points.map((p) => (
                <li key={p} className="exp-anim flex gap-3 text-fg/80">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
