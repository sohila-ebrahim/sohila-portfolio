"use client";
import { useRef, useState } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { getLenis, LOADED_EVENT } from "@/lib/scroll";
import { profile } from "@/data/portfolio";

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      document.documentElement.classList.add("is-loading");
      getLenis()?.stop();
      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        getLenis()?.start();
        window.dispatchEvent(new Event(LOADED_EVENT));
        setDone(true);
      };
      if (prefersReduced()) {
        gsap.to(ref.current, { opacity: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }
      const counter = { v: 0 };
      const count = ref.current!.querySelector(".pl-count")!;
      const tl = gsap.timeline({ onComplete: finish });
      tl.from(".pl-char", { yPercent: 120, stagger: 0.04, duration: 0.9, ease: "power4.out" })
        .from(".pl-glow", { scale: 0.4, opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
        .to(counter, {
          v: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: () => { count.textContent = `${Math.round(counter.v)}%`; },
        }, 0)
        .to(".pl-bar", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
        .to(".pl-char", { yPercent: -120, stagger: 0.03, duration: 0.6, ease: "power3.in" })
        .to(".pl-meta", { opacity: 0, duration: 0.3 }, "<")
        .to(".pl-glow", { scale: 2.2, opacity: 0, duration: 0.9, ease: "power2.in" }, "<")
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: ref }
  );

  if (done) return null;
  const name = `${profile.firstName} ${profile.lastName}`;
  return (
    <div
      ref={ref}
      style={{ clipPath: "inset(0 0 0% 0)" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#09080f] text-fg"
    >
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#12101c_0%,#09080f_60%)]" />
      <div
        aria-hidden
        className="pl-glow absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.45)_0%,rgba(139,92,246,0.12)_40%,transparent_70%)] blur-2xl"
      />
      <h1 className="relative overflow-hidden font-display text-4xl font-bold uppercase tracking-wide md:text-6xl">
        {name.split("").map((c, i) => (
          <span key={i} className="pl-char inline-block whitespace-pre">
            {c}
          </span>
        ))}
      </h1>
      <div className="pl-meta absolute bottom-10 left-6 right-6 flex items-end justify-between gap-6 md:left-12 md:right-12">
        <span className="text-xs uppercase tracking-[0.3em] text-fg/60">{profile.role}</span>
        <div className="mx-6 hidden h-px flex-1 bg-fg/10 md:block">
          <div className="pl-bar h-px origin-left scale-x-0 bg-accent shadow-[0_0_12px_#8b5cf6]" />
        </div>
        <span className="pl-count font-display text-5xl font-bold tabular-nums text-accent md:text-7xl">0%</span>
      </div>
    </div>
  );
}
