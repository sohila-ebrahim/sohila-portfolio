"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { LOADED_EVENT, scrollToTarget } from "@/lib/scroll";
import { profile } from "@/data/portfolio";
import HeroCards from "./HeroCards";

/**
 * Reference-style hero: one big rounded violet card, the name split in two
 * (سهيلة on the right, إبراهيم on the left), the portrait rising from the bottom
 * with an animated outline, a white pill CTA, and four cards underneath.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReduced();
      const intro = gsap.timeline({ paused: true });
      intro
        .from(".h-card", { scale: 0.94, opacity: 0, duration: 1.4, ease: "expo.out" })
        .from(".h-first", { xPercent: 30, opacity: 0, duration: 1.3, ease: "power4.out" }, 0.15)
        .from(".h-last", { xPercent: -30, opacity: 0, duration: 1.3, ease: "power4.out" }, 0.2)
        .from(".h-portrait", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3)
        .from(".h-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.7)
        .from(".hc-card", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.8);
      if (reduce) intro.progress(1);

      const play = () => intro.play();
      if (!document.documentElement.classList.contains("is-loading") && !document.querySelector(".pl-char")) play();
      else window.addEventListener(LOADED_EVENT, play, { once: true });

      if (!reduce) {
        gsap.to(".h-float", { y: -10, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        // mouse parallax: names drift opposite to the portrait
        const card = ref.current!.querySelector<HTMLElement>(".h-card")!;
        const fx = gsap.quickTo(".h-first", "x", { duration: 1, ease: "power3" });
        const lx = gsap.quickTo(".h-last", "x", { duration: 1, ease: "power3" });
        const px = gsap.quickTo(".h-portrait", "x", { duration: 1, ease: "power3" });
        const gx = gsap.quickTo(".h-glow", "x", { duration: 1.4, ease: "power3" });
        const gy = gsap.quickTo(".h-glow", "y", { duration: 1.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          fx(-dx * 30);
          lx(-dx * 30);
          px(dx * 14);
          gx(dx * 80);
          gy(dy * 60);
        };
        card.addEventListener("pointermove", move);
        gsap.to(".h-inner", { yPercent: 8, ease: "none", scrollTrigger: { trigger: card, start: "top top", end: "bottom top", scrub: true } });
        return () => {
          card.removeEventListener("pointermove", move);
          window.removeEventListener(LOADED_EVENT, play);
        };
      }
      return () => window.removeEventListener(LOADED_EVENT, play);
    },
    { scope: ref }
  );

  return (
    <section id="top" ref={ref} className="relative px-3 pb-10 pt-[84px] md:px-4 md:pt-[96px]">
      <div className="h-card relative h-[calc(100svh-104px)] min-h-[600px] overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#120b24] md:min-h-[640px]">
        {/* violet spotlight */}
        <div aria-hidden className="h-glow pointer-events-none absolute left-1/2 top-[55%] h-[120%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.55),rgba(91,33,182,0.25)_55%,transparent_80%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(236,72,153,0.18),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(9,8,15,0.75))]" />

        <div className="h-inner absolute inset-0" dir="rtl">
          {/* first name, right side */}
          <p
            lang="ar"
            className="h-first pointer-events-none absolute right-1/2 top-[8%] z-10 translate-x-1/2 select-none whitespace-nowrap font-ar text-[24vw] font-black leading-none tracking-tight text-[#ece4ff] md:right-[5%] md:top-[16%] md:translate-x-0 md:text-[11vw]"
          >
            سهيلة
          </p>
          {/* last name, left side, a bit lower */}
          <p
            lang="ar"
            className="h-last pointer-events-none absolute left-1/2 top-[24%] z-10 -translate-x-1/2 select-none whitespace-nowrap font-ar text-[20vw] font-black leading-none tracking-tight text-[#ece4ff] md:left-[3%] md:top-[46%] md:translate-x-0 md:text-[8.5vw]"
          >
            إبراهيم
          </p>

          <p className="h-fade absolute left-1/2 top-[5%] hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 md:flex" dir="ltr">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> {profile.role}
          </p>

          {/* portrait rising from the bottom edge, with a drawing outline */}
          <div className="h-portrait absolute bottom-0 left-1/2 z-20 w-[74vw] max-w-[400px] -translate-x-1/2 md:w-[26vw]">
            <div className="h-float relative">
              <svg aria-hidden viewBox="0 0 400 560" className="pointer-events-none absolute -inset-x-[7%] -top-[6%] h-[112%] w-[114%] overflow-visible">
                <defs>
                  <linearGradient id="hero-stroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#c4b5fd" />
                    <stop offset="0.5" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
                <path className="hero-outline" d="M20 560 V200 A180 180 0 0 1 380 200 V560" fill="none" stroke="url(#hero-stroke)" strokeWidth="3" strokeLinecap="round" strokeDasharray="140 40" opacity="0.9" />
                <path className="hero-outline-2" d="M4 560 V198 A196 196 0 0 1 396 198 V560" fill="none" stroke="url(#hero-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 14" opacity="0.6" />
              </svg>
              <div className="relative aspect-[5/6] overflow-hidden rounded-t-[999px] shadow-[0_-20px_80px_rgba(139,92,246,0.45)]">
                <Image
                  src="/avatar/sohila.webp"
                  alt="Sohila Ebrahim"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 768px) 30vw, 74vw"
                  className="object-cover object-[50%_35%]"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#120b24]/70 to-transparent" />
              </div>
            </div>
          </div>

          {/* CTA pill */}
          <div className="h-fade absolute bottom-[5%] left-0 right-0 z-30 flex justify-center">
          <button
            onClick={() => scrollToTarget("#contact")}
            className="group flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6 font-ar text-base font-bold text-[#140f22] shadow-[0_15px_40px_rgba(0,0,0,.35)] transition-transform hover:scale-105"
          >
            ابدأ مشروعك
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#140f22] text-white transition-transform duration-500 group-hover:-rotate-45">
              ←
            </span>
          </button>
          </div>
        </div>
      </div>

      <HeroCards />
    </section>
  );
}
