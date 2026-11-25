"use client";
import { useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { projects } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";
import ProjectLinks from "./ProjectLinks";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

export default function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);
  const featured = projects.filter((p) => p.featured);
  const { t } = useLang();

  useGSAP(
    () => {
      const digits = ref.current!.querySelector<HTMLElement>(".fp-digits")!;
      const cards = gsap.utils.toArray<HTMLElement>(".fp-card");
      cards.forEach((card, i) => {
        // roll the sticky big number to this card's index
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) gsap.to(digits, { yPercent: -100 * i, duration: 0.8, ease: "power4.out" });
          },
        });
        gsap.fromTo(card.querySelector(".fp-img"), { clipPath: "inset(12% 8% 12% 8% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 35%", scrub: true } });
        gsap.fromTo(card.querySelector(".fp-img-inner"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(card.querySelectorAll(".fp-anim"), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 65%" } });
      });
    },
    { scope: ref }
  );

  return (
    <section id="projects" ref={ref} className="px-site relative mb-10 bg-surface pb-24 pt-28">
      <SectionTitle text={t.selected} accent={t.selectedAccent} />
      <Reveal className="mt-10 md:ms-[50%]">
        <p className="max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">
          {t.selectedIntro}
        </p>
      </Reveal>

      <div className="mt-20 grid gap-10 md:grid-cols-[1fr_1.35fr] md:gap-16">
        {/* sticky number column */}
        <div className="relative hidden md:block">
          <div className="sticky top-[18vh] h-[16vw] max-h-[230px] overflow-hidden">
            <div className="fp-digits">
              {featured.map((_, i) => (
                <p key={i} className="font-display text-[16vw] font-bold leading-none tracking-tighter md:max-[1440px]:text-[16vw] xl:text-[230px]">
                  {String(i + 1).padStart(2, "0")}.
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-24 md:space-y-32">
          {featured.map((p, i) => (
            <article key={p.slug} className="fp-card">
              <p className="mb-4 font-display text-6xl font-bold md:hidden">{String(i + 1).padStart(2, "0")}.</p>
              <Link href={`/projects/${p.slug}`} data-cursor="View" data-mood="happy" className="fp-img block aspect-[16/10] overflow-hidden rounded-3xl border border-line">
                <div className="fp-img-inner h-full w-full">
                  <ProjectImage project={p} index={i} />
                </div>
              </Link>
              <p className="fp-anim mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
                {p.category} · {p.year}
              </p>
              <h3 className="fp-anim mt-2 font-display text-2xl font-bold uppercase leading-snug md:text-[34px]">{p.title}</h3>
              <p className="fp-anim mt-3 max-w-xl text-muted">{p.description}</p>
              <div className="fp-anim mt-5">
                <ProjectLinks project={p} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollToTarget("#portfolio")}
        data-mood="wink"
        className="group mt-24 flex w-full items-center justify-center gap-3 rounded-3xl border border-line bg-bg/60 py-12 font-display text-2xl font-semibold transition hover:border-accent md:text-4xl"
      >
        {t.viewAll(projects.length)}
        <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
      </button>
    </section>
  );
}
