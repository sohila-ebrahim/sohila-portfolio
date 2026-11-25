"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { certificates, projectKinds, projects, stack, type Project } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";
import ProjectLinks from "./ProjectLinks";
import TechIcon from "./TechIcon";

type Tab = "projects" | "stack" | "certificates";

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>("projects");
  const [filter, setFilter] = useState<string>("All");
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "projects", label: "Projects", count: projects.length },
    { id: "stack", label: "Tech Stack", count: stack.reduce((n, g) => n + g.items.length, 0) },
    ...(certificates.length ? [{ id: "certificates" as Tab, label: "Certificates", count: certificates.length }] : []),
  ];

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".pf-head", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } });
    },
    { scope: ref }
  );

  // animate the panel content each time the tab or filter changes
  const animateIn = contextSafe(() => {
    requestAnimationFrame(() => gsap.fromTo(".pf-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: "power3.out" }));
  });
  const pickTab = (t: Tab) => { setTab(t); animateIn(); };
  const pickFilter = (f: string) => { setFilter(f); animateIn(); };

  return (
    <section id="portfolio" ref={ref} className="px-site w-full bg-surface py-20 md:py-28">
      <div className="pf-head flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="flex items-center gap-3 font-display text-3xl font-bold uppercase md:text-[42px]">
          <span className="text-accent">✸</span> Portfolio <span className="text-accent">showcase</span>
        </h2>
        <div role="tablist" aria-label="Portfolio" className="flex w-full gap-1 rounded-full border border-line bg-bg/70 p-1.5 md:w-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => pickTab(t.id)}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition md:flex-none ${tab === t.id ? "bg-accent text-white shadow-[0_0_24px_rgba(139,92,246,.5)]" : "text-muted hover:text-fg"}`}
            >
              {t.label} <span className="opacity-60">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "projects" && <ProjectsPanel filter={filter} onFilter={pickFilter} />}
      {tab === "stack" && <StackPanel />}
      {tab === "certificates" && (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {certificates.map((c) => (
            <a key={c.title} href={c.url} target="_blank" rel="noreferrer" className="pf-item rounded-2xl border border-line bg-bg/60 p-6 transition hover:border-accent">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">{c.issuer} · {c.year}</p>
              <p className="mt-2 font-display text-xl font-semibold">{c.title}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectsPanel({ filter, onFilter }: { filter: string; onFilter: (f: string) => void }) {
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  const kinds = useMemo(() => projectKinds.filter((k) => projects.some((p) => p.kind === k)), []);
  const list = filter === "All" ? projects : projects.filter((p) => p.kind === filter);

  useGSAP(() => {
    gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    quick.current = {
      x: gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" }),
      y: gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" }),
    };
  });

  const show = (p: Project) => {
    setHovered(p);
    gsap.to(preview.current, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
  };
  const hide = () => gsap.to(preview.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" });

  return (
    <div onMouseMove={(e) => { quick.current?.x(e.clientX); quick.current?.y(e.clientY); }}>
      <div className="mt-12 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects">
        {["All", ...kinds].map((k) => {
          const n = k === "All" ? projects.length : projects.filter((p) => p.kind === k).length;
          return (
            <button
              key={k}
              onClick={() => onFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === k ? "border-accent bg-accent/20 text-fg" : "border-line text-muted hover:border-accent/60 hover:text-fg"}`}
            >
              {k} <span className="text-xs opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 border-t border-line">
        {list.map((p, i) => (
          <article
            key={p.slug}
            onMouseEnter={() => show(p)}
            onMouseLeave={hide}
            className="pf-item group grid gap-4 border-b border-line py-8 md:grid-cols-[60px_1fr_auto] md:items-start md:gap-8"
          >
            <span className="font-display text-xl font-semibold text-muted">{String(i + 1).padStart(2, "0")}.</span>
            <div className="grid gap-4 sm:grid-cols-[120px_1fr] md:block">
              <Link href={`/projects/${p.slug}`} className="block aspect-[16/10] overflow-hidden rounded-xl border border-line md:hidden">
                <ProjectImage project={p} index={i} />
              </Link>
              <div>
                <Link href={`/projects/${p.slug}`}>
                  <h3 className="font-display text-2xl font-bold leading-tight transition duration-500 group-hover:translate-x-3 group-hover:text-accent-soft md:text-[40px]">
                    {p.title}
                  </h3>
                </Link>
                <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">{p.description}</p>
                <div className="mt-4">
                  <ProjectLinks project={p} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:max-w-[240px] md:justify-end">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-soft">{p.kind}</span>
              {p.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* cursor-following preview: the screenshot slowly scrolls inside a browser frame */}
      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[380px] overflow-hidden rounded-xl border border-white/15 bg-bg shadow-[0_30px_80px_rgba(0,0,0,.6)] lg:block">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-card px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 truncate text-[10px] text-muted">{hovered?.liveUrl?.replace(/^https?:\/\//, "") ?? "private project"}</span>
        </div>
        <div className="aspect-[16/10]">{hovered && <ProjectImage project={hovered} />}</div>
      </div>
    </div>
  );
}

function StackPanel() {
  return (
    <div className="mt-12 border-t border-line">
      {stack.map((g) => (
        <div key={g.group} className="pf-item grid gap-6 border-b border-line py-10 md:grid-cols-[260px_1fr]">
          <h3 className="font-display text-lg font-semibold uppercase text-muted">{g.group}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {g.items.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 rounded-xl border border-line bg-bg/50 px-4 py-3 text-sm font-semibold transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_rgba(139,92,246,.2)]"
              >
                <TechIcon name={t.name} icon={t.icon} size={22} />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
