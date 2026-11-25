"use client";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type Mood = "idle" | "happy" | "wink";

/**
 * Animated cartoon of Sohila (hijab, white peplum blouse, crossbody bag).
 * - floats and breathes, head tilts and eyes follow the cursor
 * - blinks randomly, winks now and then
 * - smiles wide when the cursor is over a link or a button
 */
export default function Avatar({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [blinking, setBlinking] = useState(false);
  // unique gradient ids: several avatars can be on the page at once
  const uid = "av" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = (n: string) => `${uid}-${n}`;

  useEffect(() => {
    const svg = root.current!;
    const q = gsap.utils.selector(svg);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.to(q(".av-float"), { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".av-body"), { scaleY: 1.015, transformOrigin: "50% 100%", duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".av-strand"), { rotate: 3, transformOrigin: "50% 0%", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, svg);

    // eyes + head follow the cursor
    const headR = gsap.quickTo(q(".av-head")[0], "rotation", { duration: 0.6, ease: "power3" });
    const headX = gsap.quickTo(q(".av-head")[0], "x", { duration: 0.6, ease: "power3" });
    const pupils = q(".av-pupil");
    const px = pupils.map((p) => gsap.quickTo(p, "x", { duration: 0.3, ease: "power3" }));
    const py = pupils.map((p) => gsap.quickTo(p, "y", { duration: 0.3, ease: "power3" }));
    const onMove = (e: MouseEvent) => {
      if (reduce) return;
      const r = svg.getBoundingClientRect();
      const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height * 0.35)) / (window.innerHeight / 2));
      headR(dx * 6);
      headX(dx * 4);
      px.forEach((f) => f(dx * 4));
      py.forEach((f) => f(dy * 3));
      const hot = (e.target as HTMLElement).closest?.("a, button, [data-cursor]");
      setMood((m) => (m === "wink" ? m : hot ? "happy" : "idle"));
    };
    window.addEventListener("mousemove", onMove);

    // random blink / wink
    let t: ReturnType<typeof setTimeout>;
    const blink = () => {
      // eyelids are driven by CSS (see `lid` below); GSAP on SVG rects misplaced them
      setBlinking(true);
      setTimeout(() => setBlinking(false), 140);
      if (Math.random() < 0.18) {
        setMood("wink");
        setTimeout(() => setMood("idle"), 900);
      }
      t = setTimeout(blink, 2200 + Math.random() * 3000);
    };
    if (!reduce) t = setTimeout(blink, 1800);

    return () => {
      ctx.revert();
      clearTimeout(t);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const happy = mood === "happy";
  const wink = mood === "wink";
  const lid = { transformBox: "fill-box", transformOrigin: "50% 0%", transform: `scaleY(${blinking ? 1 : 0})`, transition: "transform 70ms ease-in" } as const;

  return (
    <svg ref={root} viewBox="0 0 320 400" className={className} role="img" aria-label="Cartoon of Sohila Ebrahim">
      <defs>
        <radialGradient id={gid("glow")} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gid("hijab")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8d726c" />
          <stop offset="100%" stopColor="#6b524d" />
        </linearGradient>
        <linearGradient id={gid("skin")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d3b8" />
          <stop offset="100%" stopColor="#ebbb9b" />
        </linearGradient>
        <linearGradient id={gid("top")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe3f0" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="190" r="170" fill={`url(#${gid("glow")})`} />

      <g className="av-float">
        {/* body */}
        <g className="av-body">
          <path d="M52 400 C56 320 92 290 160 284 C228 290 264 320 268 400 Z" fill={`url(#${gid("top")})`} />
          {/* peplum folds + buttons */}
          <path d="M160 300 L160 400" stroke="#cfd4e4" strokeWidth="2" />
          {[322, 348, 374].map((y) => (
            <circle key={y} cx="160" cy={y} r="3.2" fill="#c9cede" />
          ))}
          {/* bag strap */}
          <path d="M96 300 L222 400" stroke="#6a4630" strokeWidth="9" strokeLinecap="round" />
          <path d="M96 300 L222 400" stroke="#8a5d40" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* head */}
        <g className="av-head" style={{ transformOrigin: "160px 290px" }}>
          {/* hijab back + drape */}
          <path className="av-strand" d="M62 170 C58 90 104 46 160 46 C216 46 262 90 258 170 C258 230 250 270 238 300 L82 300 C70 270 62 230 62 170 Z" fill={`url(#${gid("hijab")})`} />
          {/* face */}
          <ellipse cx="160" cy="172" rx="66" ry="80" fill={`url(#${gid("skin")})`} />
          {/* hijab frame over forehead */}
          <path d="M88 150 C92 96 124 74 160 74 C196 74 228 96 232 150 C214 112 190 100 160 100 C130 100 106 112 88 150 Z" fill="#7d635e" />
          <path d="M96 128 C120 104 200 104 224 128" stroke="#9b817b" strokeWidth="3" fill="none" opacity="0.6" />

          {/* cheeks */}
          <ellipse cx="118" cy="200" rx="14" ry="8" fill="#f59ab0" opacity={happy ? 0.7 : 0.45} />
          <ellipse cx="202" cy="200" rx="14" ry="8" fill="#f59ab0" opacity={happy ? 0.7 : 0.45} />

          {/* brows */}
          <g style={{ transform: happy ? "translateY(-4px)" : "none", transition: "transform .3s" }}>
            <path d="M112 142 Q128 132 144 140" stroke="#3a2418" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M176 140 Q192 132 208 142" stroke="#3a2418" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          {/* left eye */}
          <g>
            <ellipse cx="128" cy="166" rx="15" ry={happy ? 11 : 14} fill="#fff" />
            <g className="av-pupil">
              <circle cx="128" cy="167" r="9" fill="#4a2c1d" />
              <circle cx="128" cy="167" r="4.5" fill="#160b06" />
              <circle cx="131" cy="163" r="2.6" fill="#fff" />
            </g>
            <rect className="av-lid" x="110" y="150" width="36" height="32" fill="#efc4a6" style={lid} />
            <path d="M111 160 Q128 147 146 160" stroke="#1d110b" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M144 158 L150 153" stroke="#1d110b" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* right eye (winks) */}
          <path d="M174 168 Q192 178 210 168" stroke="#1d110b" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity={wink ? 1 : 0} />
          <g opacity={wink ? 0 : 1}>
              <ellipse cx="192" cy="166" rx="15" ry={happy ? 11 : 14} fill="#fff" />
              <g className="av-pupil">
                <circle cx="192" cy="167" r="9" fill="#4a2c1d" />
                <circle cx="192" cy="167" r="4.5" fill="#160b06" />
                <circle cx="195" cy="163" r="2.6" fill="#fff" />
              </g>
              <rect className="av-lid" x="174" y="150" width="36" height="32" fill="#efc4a6" style={lid} />
              <path d="M174 160 Q192 147 209 160" stroke="#1d110b" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M208 158 L214 153" stroke="#1d110b" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* nose */}
          <path d="M160 180 Q156 196 162 200" stroke="#d39a7c" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* mouth */}
          {happy ? (
            <g>
              <path d="M136 214 Q160 246 184 214 Z" fill="#b8283a" />
              <path d="M142 216 Q160 224 178 216 L176 220 Q160 228 144 220 Z" fill="#fff" />
            </g>
          ) : wink ? (
            <path d="M140 218 Q164 234 184 212" stroke="#c8323f" strokeWidth="6" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M140 216 Q160 232 180 216" stroke="#c8323f" strokeWidth="6" strokeLinecap="round" fill="none" />
          )}

          {/* hijab wrap under chin */}
          <path d="M96 232 C116 268 204 268 224 232 C232 262 214 292 160 296 C106 292 88 262 96 232 Z" fill="#7a605b" />
          <path d="M108 262 C130 280 190 280 212 262" stroke="#947a74" strokeWidth="3" fill="none" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
}
