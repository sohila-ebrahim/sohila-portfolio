"use client";
import { useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { projects } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";
import ProjectLinks from "./ProjectLinks";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

/**
 * Top featured projects as big numbered cards that stack on top of each other while
 * scrolling: each card sticks a little lower than the previous one, and the cards
 * underneath shrink and dim as the next one slides over them.
 */
export default function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);
  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const { t } = useLang();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".fp-card");
      cards.forEach((card, i) => {
        const inner = card.querySelector(".fp-inner");
        if (i < cards.length - 1) {
          gsap.to(inner, {
            scale: 0.9 + i * 0.015,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
          });
        }
        gsap.from(card.querySelector(".fp-num"), { yPercent: 60, opacity: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: card, start: "top 75%" } });
      });
    },
    { scope: ref }
  );

  return (
    <section id="projects" ref={ref} className="px-site relative bg-surface pb-24 pt-28">
      <SectionTitle text={t.selected} accent={t.selectedAccent} />
      <Reveal className="mt-10 md:ms-[50%]">
        <p className="max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">{t.selectedIntro}</p>
      </Reveal>

      <div className="mt-16">
        {featured.map((p, i) => (
          <div key={p.slug} className="fp-card sticky pb-8" style={{ top: `calc(90px + ${i * 22}px)` }}>
            <article className="fp-inner grid origin-top items-center gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1b1630] to-[#100d1a] p-5 shadow-[0_-20px_60px_rgba(0,0,0,.45)] md:grid-cols-[0.8fr_1.4fr] md:gap-10 md:p-10">
              <div className="flex flex-col justify-between gap-6 md:h-full">
                <p className="fp-num font-heavy text-[22vw] leading-[0.85] text-brand md:text-[11vw] xl:text-[170px]">{String(i + 1).padStart(2, "0")}.</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">{p.category} · {p.year}{p.country && <span className="ms-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-fg">{p.country}</span>}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-snug md:text-[32px]">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5" dir="ltr">
                    {p.tags.slice(0, 5).map((tg) => <span key={tg} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tg}</span>)}
                  </div>
                  <div className="mt-5"><ProjectLinks project={p} /></div>
                </div>
              </div>
              <Link href={`/projects/${p.slug}`} data-cursor className="block aspect-[16/10] overflow-hidden rounded-3xl border border-line">
                <div className="h-full w-full transition-transform duration-700 hover:scale-105">
                  <ProjectImage project={p} index={i} />
                </div>
              </Link>
            </article>
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollToTarget("#portfolio")}
        className="group mt-16 flex w-full items-center justify-center gap-3 rounded-3xl border border-line bg-bg/60 py-12 font-display text-2xl font-semibold transition hover:border-accent md:text-4xl"
      >
        {t.viewAll(projects.length)}
        <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
      </button>
    </section>
  );
}
