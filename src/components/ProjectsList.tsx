"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { projects, type Project } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";

/** "01. Project — category ↗" rows; on desktop a preview of the project follows the cursor. */
export default function ProjectsList() {
  const ref = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      quick.current = {
        x: gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" }),
        y: gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" }),
      };
      // never leave the preview floating while the page scrolls under a still mouse
      const onScroll = () => gsap.to(preview.current, { scale: 0, opacity: 0, duration: 0.2, overwrite: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      gsap.utils.toArray<HTMLElement>(".pl-row").forEach((r) => {
        gsap.from(r, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 92%" } });
      });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: ref }
  );

  const show = (p: Project, e: React.MouseEvent) => {
    setHovered(p);
    quick.current?.x(e.clientX);
    quick.current?.y(e.clientY);
    gsap.to(preview.current, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
  };
  const hide = () => gsap.to(preview.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" });

  return (
    <section ref={ref} className="px-site py-20 md:py-28" onMouseLeave={hide} onMouseMove={(e) => { quick.current?.x(e.clientX); quick.current?.y(e.clientY); }}>
      <h2 className="flex items-center gap-3 font-display text-3xl font-bold uppercase md:text-[42px]">
        <span className="text-accent">✸</span> {t.projectsList}
      </h2>
      <div className="mt-10 border-t border-line">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={p.liveUrl ?? `/projects/${p.slug}`}
            target={p.liveUrl ? "_blank" : undefined}
            rel={p.liveUrl ? "noreferrer" : undefined}
            onMouseEnter={(e) => show(p, e)}
            onMouseLeave={hide}
            className="pl-row group grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 border-b border-line py-6 md:grid-cols-[60px_1fr_auto] md:py-7"
          >
            <span className="font-display text-sm text-muted md:text-base">{String(i + 1).padStart(2, "0")}.</span>
            <span className="font-display text-xl font-semibold transition-transform duration-500 group-hover:translate-x-3 group-hover:text-accent-soft rtl:group-hover:-translate-x-3 md:text-3xl">
              {p.title} <span className="text-base font-normal text-muted">— {p.category}{p.country ? ` · ${p.country}` : ""}</span> <span className="inline-block text-base opacity-60 rtl:-scale-x-100">↗</span>
            </span>
            <span className="col-start-2 text-sm text-muted md:col-start-auto md:text-end" dir="ltr">{p.tags.slice(0, 4).join(" · ")}</span>
          </Link>
        ))}
      </div>
      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[360px] overflow-hidden rounded-2xl border border-white/15 bg-bg shadow-[0_30px_80px_rgba(0,0,0,.6)] lg:block">
        <div className="aspect-[16/10]">{hovered && <ProjectImage project={hovered} />}</div>
      </div>
    </section>
  );
}
