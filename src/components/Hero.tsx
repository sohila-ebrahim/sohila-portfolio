"use client";
import { useRef } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { LOADED_EVENT, scrollToTarget } from "@/lib/scroll";
import { profile, stats } from "@/data/portfolio";
import SplitText from "./SplitText";
import Avatar from "./Avatar";
import TechIcon from "./TechIcon";

const socialIcons: Record<string, string> = { GitHub: "siGithub", WhatsApp: "siWhatsapp", Email: "siGmail" };

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const intro = gsap.timeline({ paused: true });
      intro
        .from(".hero-card", { scale: 0.92, opacity: 0, duration: 1.6, ease: "expo.out" })
        .from(".hero-name .char", { yPercent: 120, duration: 1.2, stagger: 0.04, ease: "power4.out" }, 0.1)
        .fromTo(".hero-sign", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut" }, 0.4)
        .from(".hero-fade", { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.7)
        .from(".hero-avatar", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.6);
      if (prefersReduced()) intro.progress(1);

      const play = () => intro.play();
      if (!document.documentElement.classList.contains("is-loading") && !document.querySelector(".pl-char")) play();
      else window.addEventListener(LOADED_EVENT, play, { once: true });

      // scroll: card sinks and the content fades
      gsap.to(".hero-bg", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-content", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "20% top", end: "bottom top", scrub: true } });

      if (!prefersReduced()) {
        gsap.utils.toArray<HTMLElement>(".orb").forEach((o, i) => {
          gsap.to(o, { x: "random(-80, 80)", y: "random(-60, 60)", duration: 6 + i * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
      }

      return () => window.removeEventListener(LOADED_EVENT, play);
    },
    { scope: ref }
  );

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden pt-24 lg:h-[100svh] lg:min-h-[720px]">
      {/* rounded card background */}
      <div className="hero-card absolute inset-x-[4%] bottom-[7%] top-[96px] overflow-hidden rounded-3xl border border-white/5 lg:left-[11%] lg:right-[24%] lg:top-[108px] lg:bottom-[12%]">
        <div className="hero-bg absolute inset-0 will-change-transform">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,#3b1d78_0%,#1a1033_45%,#0d0a18_100%)]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
          <div className="orb absolute left-[12%] top-[20%] h-72 w-72 rounded-full bg-accent/40 blur-[110px]" />
          <div className="orb absolute right-[8%] top-[10%] h-80 w-80 rounded-full bg-fuchsia-600/25 blur-[120px]" />
          <div className="orb absolute bottom-[0%] left-[40%] h-72 w-72 rounded-full bg-indigo-500/30 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,rgba(9,8,15,0.7))]" />
        </div>
      </div>

      <div className="hero-content relative z-10 flex min-h-[calc(100svh-6rem)] flex-col px-[6%] pb-24 lg:h-full lg:min-h-0 lg:flex-row lg:items-center lg:px-0 lg:pb-0">
        {/* mobile avatar */}
        <div className="hero-avatar mx-auto mt-2 w-44 lg:hidden">
          <Avatar className="h-auto w-full" />
        </div>

        {/* left column: signature, socials, stats */}
        <div className="order-2 mt-12 flex flex-col items-center gap-8 lg:order-1 lg:mt-0 lg:ml-[4%] lg:w-[30%] lg:items-start">
          <p className="hero-sign hidden whitespace-nowrap font-sign text-[5.6vw] leading-none text-white/95 lg:block xl:text-[84px]">
            {profile.signature}
          </p>
          <div className="hero-fade flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 backdrop-blur lg:ml-[14%]">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                data-mood="happy"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-bg/60 transition hover:scale-110 hover:border-accent"
              >
                <TechIcon name={s.label} icon={socialIcons[s.label]} size={18} mono />
              </a>
            ))}
          </div>
          <div className="hero-fade flex lg:ml-[6%]">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-3 text-center ${i ? "border-l border-white/15" : ""}`}>
                <p className="font-display text-3xl font-bold md:text-4xl">+{s.value}</p>
                <p className="mt-1 max-w-[90px] text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* right column: name, role, actions */}
        <div className="order-1 mt-4 text-center lg:order-2 lg:mt-[-4%] lg:ml-[2%] lg:text-left">
          <h1 className="hero-name font-display text-[17vw] font-normal uppercase leading-[0.82] tracking-tight lg:text-[10vw] xl:text-[150px]">
            <SplitText text={profile.firstName} />
            <br />
            <SplitText text={profile.lastName} />
          </h1>
          <p className="hero-fade mt-6 text-xl tracking-wide md:text-2xl">{profile.role}</p>
          <p className="hero-fade mt-1 flex items-center justify-center gap-2 text-sm text-white/60 lg:justify-start">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> {profile.availability}
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              data-mood="happy"
              onClick={() => scrollToTarget("#contact")}
              className="btn-glow rounded-full px-10 py-4 text-xs font-extrabold uppercase tracking-[0.25em]"
            >
              Let&apos;s talk
            </button>
            <button
              data-mood="wink"
              onClick={() => scrollToTarget("#projects")}
              className="rounded-full border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] transition hover:border-accent hover:text-accent-soft"
            >
              View work
            </button>
            {profile.cvUrl && (
              <a href={profile.cvUrl} data-mood="happy" className="text-xs font-bold uppercase tracking-[0.25em] link-underline">
                Download CV ↓
              </a>
            )}
          </div>
        </div>

        {/* desktop avatar, outside the card on the right */}
        <div className="hero-avatar absolute bottom-[8%] right-[1%] hidden w-[18vw] max-w-[320px] lg:block">
          <Avatar className="h-auto w-full" />
        </div>
      </div>

      <button
        onClick={() => scrollToTarget("#services")}
        className="hero-fade absolute bottom-[3%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] lg:left-[45%]"
      >
        <span aria-hidden className="relative h-5 w-px overflow-hidden bg-fg/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollLine_1.6s_ease-in-out_infinite] bg-fg" />
        </span>
        Scroll
      </button>
    </section>
  );
}
