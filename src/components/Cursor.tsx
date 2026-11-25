"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Purple dot that follows the mouse and grows over links/buttons. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.2 });
      const hover = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      gsap.to(el, { scale: hover ? 3.2 : 1, duration: 0.3, ease: "power3" });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      data-floating
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-4 w-4 rounded-full bg-accent mix-blend-difference md:block"
    />
  );
}
