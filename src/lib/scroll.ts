"use client";
import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export function scrollToTarget(target: string | number) {
  if (instance) instance.scrollTo(target, { offset: 0, duration: 1.4 });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: target, behavior: "smooth" });
}

/** Fired once the preloader finished, so the hero can start animating. */
export const LOADED_EVENT = "portfolio:loaded";
