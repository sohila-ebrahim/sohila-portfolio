"use client";
import { useEffect, useState } from "react";
import { scrollToTarget } from "@/lib/scroll";
import { profile } from "@/data/portfolio";
import TechIcon from "./TechIcon";

/** WhatsApp bubble + back-to-top, fixed bottom-right like the reference. */
export default function FloatingButtons() {
  const [up, setUp] = useState(false);
  useEffect(() => {
    const on = () => setUp(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div data-floating className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 md:bottom-8 md:right-8">
      <button
        aria-label="Back to top"
        onClick={() => scrollToTarget(0)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_20px_rgba(139,92,246,.6)] transition-all duration-500 ${up ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        ↑
      </button>
      <a
        href={profile.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] md:h-14 md:w-14 shadow-[0_0_0_8px_rgba(37,211,102,.12),0_10px_30px_rgba(37,211,102,.35)] transition hover:scale-110"
      >
        <TechIcon name="WhatsApp" icon="siWhatsapp" size={28} mono />
      </a>
    </div>
  );
}
