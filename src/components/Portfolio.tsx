"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { achievements, certificates, projectKinds, projects, stack } from "@/data/portfolio";
import TechIcon from "./TechIcon";
import ProjectImage from "./ProjectImage";
import ProjectLinks from "./ProjectLinks";

/**
 * All projects as a horizontal slider: drag / swipe, scroll-snap, prev/next arrows,
 * keyboard arrows, a progress bar and dots. Category filters re-fill the slider.
 */
export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState<"projects" | "certificates" | "achievements" | "stack">("projects");
  const { t, lang } = useLang();
  const pin = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const kinds = useMemo(() => projectKinds.filter((k) => projects.some((p) => p.kind === k)), []);
  const list = filter === "All" ? projects : projects.filter((p) => p.kind === filter);

  useGSAP(
    () => {
      gsap.from(".pf-head", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } });
    },
    { scope: ref }
  );

  const cardStep = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".pf-card");
    return card ? card.offsetWidth + 20 : 400;
  };

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setIndex(Math.round(el.scrollLeft / cardStep()));
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(list.length - 1, i));
    const left = clamped * cardStep();
    const st = pin.current;
    if (st) {
      // pinned (desktop): move the page, the scroll drives the slider
      const max = el.scrollWidth - el.clientWidth || 1;
      scrollToTarget(st.start + Math.min(1, left / max) * (st.end - st.start));
    } else el.scrollTo({ left, behavior: "smooth" });
  };

  // desktop: pin the section and turn vertical scroll into horizontal movement
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // scroll-driven, so it also runs when the OS asks for less motion (it only moves with the visitor's own scrolling)
      if (tab !== "projects") return () => mm.revert();
      mm.add("(min-width: 768px) and (pointer: fine)", () => {
        const el = track.current!;
        el.style.scrollSnapType = "none";
        el.style.scrollBehavior = "auto";
        const distance = () => el.scrollWidth - el.clientWidth;
        // each card grows in and fades up as it enters from the right edge
        const cards = Array.from(el.querySelectorAll<HTMLElement>(".pf-card"));
        const reveal = () => {
          const vw = window.innerWidth;
          cards.forEach((c) => {
            const left = c.getBoundingClientRect().left;
            const k = Math.min(1, Math.max(0, (vw - left) / (vw * 0.3)));
            c.style.opacity = String(0.25 + 0.75 * k);
            c.style.transform = `translateY(${(1 - k) * 40}px) scale(${0.86 + 0.14 * k})`;
          });
        };
        pin.current = ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            el.scrollLeft = self.progress * distance();
            reveal();
          },
          onRefresh: reveal,
        });
        return () => {
          pin.current = null;
          cards.forEach((c) => { c.style.opacity = ""; c.style.transform = ""; });
          el.style.scrollSnapType = "";
          el.style.scrollBehavior = "";
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [filter, tab], revertOnUpdate: true }
  );

  // re-fill on filter change: back to the first card and animate the cards in
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollLeft = 0;
    onScroll();
    if (window.innerWidth < 768) gsap.fromTo(el.querySelectorAll(".pf-card"), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power3.out", clearProps: "transform,opacity" });
  }, [filter, onScroll]);

  // mouse drag to scroll (touch already swipes natively)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, moved = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = 0; startX = e.clientX; startLeft = el.scrollLeft;
      el.style.scrollSnapType = "none";
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      moved = Math.abs(e.clientX - startX);
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const pu = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
      go(Math.round(el.scrollLeft / cardStep()));
    };
    // a drag shouldn't click the link under the pointer
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      el.removeEventListener("click", click, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };

  return (
    <section id="portfolio" ref={ref} className="flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-surface py-20 md:py-24">
      <div className="pf-head px-site flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-display text-3xl font-bold uppercase md:text-[42px]">
            <span className="text-accent">✸</span> {t.allProjects} <span className="text-accent">{t.allProjectsAccent}</span>
          </h2>
          <p className="mt-3 text-muted">{t.allProjectsHint(projects.length)}</p>
        </div>
        <div className="flex gap-3">
          <button aria-label="Previous project" onClick={() => go(index - 1)} disabled={index <= 0} className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-xl transition hover:border-accent hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent">
            ←
          </button>
          <button aria-label="Next project" onClick={() => go(index + 1)} disabled={progress >= 0.999} className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-xl transition hover:border-accent hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent">
            →
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Portfolio" className="px-site mt-8 flex flex-wrap gap-2">
        {([
          ["projects", t.tabProjects, projects.length],
          ...(certificates.length ? [["certificates", t.tabCertificates, certificates.length]] : []),
          ...(achievements.length ? [["achievements", t.tabAchievements, achievements.length]] : []),
          ["stack", t.tabStack, stack.reduce((n, g) => n + g.items.length, 0)],
        ] as [typeof tab, string, number][]).map(([id, label, n]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === id ? "bg-accent text-white shadow-[0_0_24px_rgba(139,92,246,.5)]" : "border border-line text-muted hover:text-fg"}`}
          >
            {label} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>

      {tab === "stack" && (
        <div className="px-site mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stack.flatMap((g) => g.items).map((it) => (
            <div key={it.name} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-bold" dir="ltr">
              <TechIcon name={it.name} icon={it.icon} size={20} /> {it.name}
            </div>
          ))}
        </div>
      )}
      {tab === "achievements" && (
        <div className="px-site mt-10 grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <div key={a.title} className="rounded-2xl border border-line bg-bg/60 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">{a.year}</p>
              <p className="mt-2 font-display text-xl font-semibold">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.detail}</p>
            </div>
          ))}
        </div>
      )}

      <div className={tab === "projects" ? "" : "hidden"}>
      <div className="px-site mt-10 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects">
        {["All", ...kinds].map((k) => {
          const n = k === "All" ? projects.length : projects.filter((p) => p.kind === k).length;
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === k ? "border-accent bg-accent/20 text-fg" : "border-line text-muted hover:border-accent/60 hover:text-fg"}`}
            >
              {k === "All" ? t.all : k} <span className="text-xs opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        onKeyDown={onKey}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        dir="ltr"
        className="mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[5%] pb-6 outline-none [scrollbar-width:none] active:cursor-grabbing sm:px-[3%] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((p, i) => (
          <article
            key={p.slug}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="pf-card group flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-line bg-bg/70 transition-[border-color,box-shadow] duration-500 will-change-transform hover:border-accent/50 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] sm:w-[440px]"
          >
            <Link href={`/projects/${p.slug}`} draggable={false} className="relative block aspect-[16/10] overflow-hidden">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                <ProjectImage project={p} index={i} />
              </div>
              <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 font-display text-sm font-bold backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-soft">{p.kind}</span>
                {p.country && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{p.country}</span>}
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</span>
                ))}
              </div>
              <Link href={`/projects/${p.slug}`} draggable={false}>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight transition group-hover:text-accent-soft">{p.title}</h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{p.description}</p>
              <div className="mt-auto pt-5">
                <ProjectLinks project={p} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* progress + dots */}
      <div className="px-site mt-6 flex items-center gap-6">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>
        <div className="hidden gap-1.5 md:flex">
          {list.map((p, i) => (
            <button key={p.slug} aria-label={`Go to ${p.title}`} onClick={() => go(i)} className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"}`} />
          ))}
        </div>
        <span className="font-display text-sm tabular-nums text-muted">
          {String(Math.min(index + 1, list.length)).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
        </span>
      </div>

      </div>

      {tab === "certificates" && certificates.length > 0 && (
        <div className="px-site mt-16 grid gap-4 md:grid-cols-2">
          {certificates.map((c) => (
            <a key={c.title} href={c.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-line bg-bg/60 p-6 transition hover:border-accent">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">{c.issuer} · {c.year}</p>
              <p className="mt-2 font-display text-xl font-semibold">{c.title}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
