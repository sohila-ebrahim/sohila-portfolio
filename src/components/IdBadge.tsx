"use client";
import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import Avatar from "./Avatar";

const ROPE = 230; // lanyard length in px
const W = 250; // badge width

/**
 * Developer ID badge hanging on a lanyard. Simple verlet pendulum:
 * it swings in, sways with gravity and can be grabbed and thrown.
 */
export default function IdBadge() {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const strap = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = box.current!;
    const reduce = prefersReduced();
    let raf = 0;
    let visible = false;
    let anchorX = el.clientWidth / 2;
    // position of the badge's top clip, previous position (verlet), drag state
    let p = { x: anchorX + (reduce ? 0 : 160), y: reduce ? ROPE : ROPE * 0.6 };
    let pp = { ...p };
    let drag: { id: number; dx: number; dy: number } | null = null;
    let target = { ...p };

    const draw = () => {
      const angle = Math.atan2(p.x - anchorX, p.y);
      card.current!.style.transform = `translate(${p.x - W / 2}px, ${p.y}px) rotate(${(-angle * 180) / Math.PI}deg)`;
      const midX = (anchorX + p.x) / 2;
      strap.current!.setAttribute("d", `M${anchorX - 14} 0 Q${midX} ${p.y / 2} ${p.x - 6} ${p.y + 4} M${anchorX + 14} 0 Q${midX} ${p.y / 2} ${p.x + 6} ${p.y + 4}`);
    };

    const step = () => {
      if (drag) {
        pp = { ...p };
        p = { x: p.x + (target.x - p.x) * 0.5, y: p.y + (target.y - p.y) * 0.5 };
      } else {
        const vx = (p.x - pp.x) * 0.985;
        const vy = (p.y - pp.y) * 0.985;
        pp = { ...p };
        p = { x: p.x + vx, y: p.y + vy + 0.9 };
      }
      // keep the lanyard length (it can't stretch)
      const dx = p.x - anchorX;
      const dy = p.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > ROPE || !drag) {
        p = { x: anchorX + (dx / d) * ROPE, y: (dy / d) * ROPE };
      }
      draw();
      if (visible || drag) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(step);
    });
    io.observe(el);

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      if (reduce) return;
      const l = local(e);
      drag = { id: e.pointerId, dx: l.x - p.x, dy: l.y - p.y };
      target = { ...p };
      card.current!.setPointerCapture(e.pointerId);
      card.current!.style.cursor = "grabbing";
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const l = local(e);
      target = { x: l.x - drag.dx, y: l.y - drag.dy };
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      card.current!.style.cursor = "grab";
    };
    const resize = () => {
      const old = anchorX;
      anchorX = el.clientWidth / 2;
      p.x += anchorX - old;
      pp.x += anchorX - old;
      draw();
    };

    const c = card.current!;
    c.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      c.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={box} className="relative h-[560px] w-full touch-pan-y select-none">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path ref={strap} fill="none" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      </svg>
      <div
        ref={card}
        data-cursor
        style={{ width: W, transformOrigin: `${W / 2}px 0px`, cursor: "grab", touchAction: "none" }}
        className="absolute left-0 top-0 will-change-transform"
        aria-label={`ID badge: ${profile.firstName} ${profile.lastName}, ${profile.role}`}
      >
        {/* metal clip */}
        <div className="mx-auto h-6 w-10 rounded-b-md rounded-t-sm bg-gradient-to-b from-zinc-200 to-zinc-500 shadow" />
        <div className="-mt-1 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#1d1830] to-[#110e1c] shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(139,92,246,0.25)]">
          <div className="flex items-center justify-between bg-accent px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em]">
            <span>Developer</span>
            <span>{profile.year}</span>
          </div>
          <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-black/50" />
          <div className="mx-auto mt-3 w-36 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-accent/30 to-transparent">
            <Avatar className="h-auto w-full" />
          </div>
          <div className="px-5 pb-5 pt-4 text-center">
            <p className="font-display text-xl font-extrabold uppercase leading-tight">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">{profile.role}</p>
            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3 text-left text-[10px] uppercase tracking-widest text-muted">
              <span>
                ID
                <br />
                <span className="text-fg">SE-{profile.year}</span>
              </span>
              <span aria-hidden className="flex h-7 items-end gap-[2px]">
                {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
                  <span key={i} className="h-full bg-fg/80" style={{ width: w }} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
