"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { projects, type Project } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";

/**
 * "01. Project — category ↗" rows. On desktop, hovering a row shows a large preview in a
 * fixed layer on <body> (so no transformed parent can shift it): centered over the list,
 * level with the hovered row, drifting slightly with the cursor and never leaving the screen.
 */
export default function ProjectsList() {
  const ref = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  const anchor = useRef({ x: 0, y: 0 });
  const { t } = useLang();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches);
  }, []);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.85, opacity: 0 });
    quick.current = {
      x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
    };
    const onScroll = () => gsap.to(el, { scale: 0.85, opacity: 0, duration: 0.2, overwrite: "auto" });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, canHover]);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".pl-row").forEach((r) => {
        gsap.from(r, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 92%" } });
      });
    },
    { scope: ref }
  );

  // where the preview sits: horizontally centered on the list, vertically on the row, kept inside the viewport
  const place = (rowRect: DOMRect, mouseX?: number, mouseY?: number) => {
    const list = ref.current!.getBoundingClientRect();
    const W = 480, H = 300, pad = 24;
    const cx = list.left + list.width / 2;
    const cy = rowRect.top + rowRect.height / 2;
    anchor.current = { x: cx, y: cy };
    const drift = (v: number | undefined, base: number, range: number) => (v === undefined ? 0 : gsap.utils.clamp(-range, range, (v - base) * 0.08));
    const x = gsap.utils.clamp(W / 2 + pad, window.innerWidth - W / 2 - pad, cx + drift(mouseX, cx, 40));
    const y = gsap.utils.clamp(H / 2 + 90, window.innerHeight - H / 2 - pad, cy + drift(mouseY, cy, 20));
    quick.current?.x(x);
    quick.current?.y(y);
  };

  const show = (p: Project, e: React.MouseEvent<HTMLElement>) => {
    if (!canHover) return;
    setHovered(p);
    const r = e.currentTarget.getBoundingClientRect();
    if (gsap.getProperty(preview.current, "opacity") === 0) {
      // first appearance: jump to place, then fade/scale in
      const list = ref.current!.getBoundingClientRect();
      gsap.set(preview.current, { x: list.left + list.width / 2, y: gsap.utils.clamp(240, window.innerHeight - 174, r.top + r.height / 2) });
    }
    place(r, e.clientX, e.clientY);
    gsap.to(preview.current, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    document.documentElement.classList.add("previewing");
  };
  const hide = () => {
    gsap.to(preview.current, { scale: 0.85, opacity: 0, duration: 0.3, ease: "power3.in", overwrite: "auto" });
    document.documentElement.classList.remove("previewing");
  };

  return (
    <section ref={ref} className="px-site py-20 md:py-28" onMouseLeave={hide}>
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
            onMouseMove={(e) => canHover && place(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY)}
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
      {mounted &&
        canHover &&
        createPortal(
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[95] w-[480px] overflow-hidden rounded-2xl border border-white/15 bg-bg shadow-[0_30px_80px_rgba(0,0,0,.6)]"
            style={{ opacity: 0 }}
          >
            <div className="aspect-[16/10]">{hovered && <ProjectImage project={hovered} />}</div>
          </div>,
          document.body
        )}
    </section>
  );
}
