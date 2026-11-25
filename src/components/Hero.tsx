"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { LOADED_EVENT, scrollToTarget } from "@/lib/scroll";
import { useLang } from "@/lib/lang";
import HeroCards from "./HeroCards";
import IdBadge from "./IdBadge";
import Signature from "./Signature";

/**
 * Reference-style hero: one big rounded violet card, the name split on both sides
 * of Sohila's background-removed portrait (bottom-anchored, glowing outline),
 * a white pill CTA, and four cards underneath.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  // badge size follows the viewport so card + strap is ~60% of the screen height
  const [badge, setBadge] = useState({ w: 300, rope: 140 });
  useEffect(() => {
    const fit = () => {
      const mobile = window.innerWidth < 768;
      const w = Math.round(Math.min(mobile ? 210 : 360, window.innerHeight * (mobile ? 0.26 : 0.4)));
      setBadge({ w, rope: Math.round(window.innerHeight * (mobile ? 0.2 : 0.1)) });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useGSAP(
    () => {
      const reduce = prefersReduced();
      const intro = gsap.timeline({ paused: true });
      intro
        .from(".h-card", { scale: 0.94, opacity: 0, duration: 1.4, ease: "expo.out" })
        .from(".h-first", { xPercent: -25, opacity: 0, duration: 1.3, ease: "power4.out" }, 0.15)
        .from(".h-last", { xPercent: 25, opacity: 0, duration: 1.3, ease: "power4.out" }, 0.2)
        .from(".h-portrait", { yPercent: -60, opacity: 0, duration: 1.6, ease: "elastic.out(1, 0.6)" }, 0.3)
        .from(".h-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.7)
        .from(".hc-card", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.8);
      if (reduce) intro.progress(1);

      const play = () => intro.play();
      if (!document.documentElement.classList.contains("is-loading") && !document.querySelector(".pl-char")) play();
      else window.addEventListener(LOADED_EVENT, play, { once: true });

      if (!reduce) {
        const card = ref.current!.querySelector<HTMLElement>(".h-card")!;
        const fx = gsap.quickTo(".h-first", "x", { duration: 1, ease: "power3" });
        const lx = gsap.quickTo(".h-last", "x", { duration: 1, ease: "power3" });
        const gx = gsap.quickTo(".h-glow", "x", { duration: 1.4, ease: "power3" });
        const gy = gsap.quickTo(".h-glow", "y", { duration: 1.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          fx(-dx * 30);
          lx(-dx * 30);
          gx(dx * 80);
          gy(dy * 60);
        };
        card.addEventListener("pointermove", move);
        return () => {
          card.removeEventListener("pointermove", move);
          window.removeEventListener(LOADED_EVENT, play);
        };
      }
      return () => window.removeEventListener(LOADED_EVENT, play);
    },
    { scope: ref }
  );

  const nameFont = lang === "ar" ? "font-ar font-black" : "font-heavy font-normal tracking-tight";

  return (
    <section id="top" ref={ref} className="relative px-3 pb-10 pt-[76px] md:px-4 md:pt-[96px]">
      <div className="h-card relative h-[78svh] min-h-[560px] overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#120b24] md:h-[calc(100svh-120px)] md:max-h-[860px] md:min-h-[600px]">
        {/* violet spotlight */}
        <div aria-hidden className="h-glow pointer-events-none absolute left-1/2 top-[60%] h-[120%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.55),rgba(91,33,182,0.25)_55%,transparent_80%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(236,72,153,0.18),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(9,8,15,0.75))]" />

        <p className="h-fade absolute left-1/2 top-[5%] z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 md:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> {t.role}
        </p>

        {/* name: first on one side, last on the other, a bit lower */}
        <p className={`h-first pointer-events-none absolute inset-x-0 top-[7%] z-10 text-center md:inset-x-auto md:start-[4%] md:text-start select-none whitespace-nowrap ${nameFont} text-[19vw] leading-[1.05] text-brand md:top-[16%] md:text-[10vw] xl:text-[160px]`}>
          {t.firstName}
        </p>
        <p className={`h-last pointer-events-none absolute inset-x-0 bottom-[16%] z-10 text-center md:inset-x-auto md:bottom-auto md:end-[4%] md:text-end select-none whitespace-nowrap ${nameFont} text-[19vw] leading-[1.05] text-brand md:top-[50%] md:text-[10vw] xl:text-[160px]`}>
          {t.lastName}
        </p>

        {/* hanging ID badge with her photo, swinging between the two names */}
        <div className="h-portrait absolute inset-x-0 top-0 z-20 mx-auto h-full w-full max-w-[560px]">
          <IdBadge width={badge.w} rope={badge.rope} height="100%" swing glow />
        </div>

        {/* handwritten signature under the first name (desktop) */}
        <Signature className="pointer-events-none absolute start-[5%] top-[40%] z-20 hidden w-[22vw] max-w-[340px] md:block" />

        {/* CTA pill */}
        <div className="h-fade absolute bottom-[5%] left-0 right-0 z-30 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollToTarget("#contact")}
            className="group flex items-center gap-3 rounded-full bg-white py-2 pe-2 ps-6 text-base font-bold text-[#140f22] shadow-[0_15px_40px_rgba(0,0,0,.35)] transition-transform hover:scale-105"
          >
            {t.startProject}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#140f22] text-white transition-transform duration-500 group-hover:-rotate-45 rtl:-scale-x-100">
              →
            </span>
          </button>
          <a
            href={lang === "ar" ? "/cv/Sohila-Ebrahim-CV-ar.pdf" : "/cv/Sohila-Ebrahim-CV.pdf"}
            download
            className="rounded-full border border-white/40 bg-white/10 px-5 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white hover:text-[#140f22]"
          >
            {t.downloadCv} ↓
          </a>
        </div>
      </div>

      <HeroCards />
    </section>
  );
}
