"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // phones: keep the floating Ask/WhatsApp buttons out of the way while the hero (and its CTAs) is on screen
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.classList.toggle("at-hero", window.scrollY < window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); root.classList.remove("at-hero"); };
  }, []);

  useEffect(() => {
    // phones and tablets keep native scrolling: smoother and lighter than smooth-scroll emulation
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
