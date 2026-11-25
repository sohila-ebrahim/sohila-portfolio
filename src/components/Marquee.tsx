"use client";
import { useRef } from "react";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/portfolio";

/** Big role marquee; speed and direction follow the scroll velocity. */
export default function Marquee() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const loop = gsap.to(".mq-track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-5, 5, self.getVelocity() / 250);
          gsap.to(loop, { timeScale: v || 1, duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.3 });
        },
      });
    },
    { scope: ref }
  );
  const items = [...profile.roles, ...profile.roles];
  return (
    <section ref={ref} aria-hidden className="flex w-full overflow-hidden bg-bg py-10 sm:py-16">
      <div className="mq-track flex w-max shrink-0 items-center whitespace-nowrap font-display text-5xl font-bold text-fg/85 md:text-[90px]">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            {items.map((r, i) => (
              <span key={i} className="flex items-center">
                <span className="px-8">{r}</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
