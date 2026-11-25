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

  const skin = `url(#${gid("skin")})`;
  const hijab = `url(#${gid("hijab")})`;

  return (
    <svg ref={root} viewBox="0 0 320 400" className={className} role="img" aria-label="Cartoon of Sohila Ebrahim">
      <defs>
        <radialGradient id={gid("glow")} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        {/* mauve-taupe hijab like in the photos */}
        <linearGradient id={gid("hijab")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#7f6a6e" />
          <stop offset="100%" stopColor="#5a464b" />
        </linearGradient>
        <radialGradient id={gid("skin")} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbe2d1" />
          <stop offset="100%" stopColor="#efc3a8" />
        </radialGradient>
        <linearGradient id={gid("top")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e4e8f2" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="190" r="170" fill={`url(#${gid("glow")})`} />

      <g className="av-float">
        {/* body: white peplum blouse with frog-knot closures, brown crossbody bag */}
        <g className="av-body">
          <path d="M44 400 C46 330 84 296 160 290 C236 296 274 330 276 400 Z" fill={`url(#${gid("top")})`} />
          <path d="M70 400 C74 360 84 336 98 322" stroke="#d6dbe8" strokeWidth="2.5" fill="none" />
          <path d="M250 400 C246 360 236 336 222 322" stroke="#d6dbe8" strokeWidth="2.5" fill="none" />
          {/* V neckline */}
          <path d="M136 292 L160 340 L184 292 Z" fill="#dfe3ee" />
          <path d="M160 340 L160 400" stroke="#cfd5e3" strokeWidth="2" />
          {/* frog knots */}
          {[352, 378].map((y) => (
            <g key={y} stroke="#f4f6fb" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d={`M146 ${y} q-7 -6 0 -9 q7 3 0 9 z`} />
              <path d={`M174 ${y} q7 -6 0 -9 q-7 3 0 9 z`} />
              <path d={`M146 ${y - 4} H174`} stroke="#d0d6e4" strokeWidth="2.5" />
            </g>
          ))}
          {/* strap across the body to the bag on the hip */}
          <path d="M104 300 L236 392" stroke="#5b3a26" strokeWidth="9" strokeLinecap="round" />
          <path d="M104 300 L236 392" stroke="#7b5136" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
          <g transform="translate(222 368) rotate(-14)">
            <rect x="0" y="0" width="48" height="34" rx="10" fill="#efe6d6" />
            <path d="M0 22 Q24 30 48 22 L48 26 Q48 34 38 34 L10 34 Q0 34 0 26 Z" fill="#6b4029" />
            <path d="M6 8 H42" stroke="#6b4029" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="8" r="2.5" fill="#d4a944" />
          </g>
        </g>

        {/* head */}
        <g className="av-head" style={{ transformOrigin: "160px 290px" }}>
          {/* hijab back and the loose end falling over the shoulder */}
          <path className="av-strand" d="M70 176 C62 96 108 52 162 52 C218 52 262 98 254 178 C250 240 244 282 230 306 L92 306 C78 282 72 236 70 176 Z" fill={hijab} />
          <path className="av-strand" d="M78 230 C66 270 64 300 76 330 C90 322 104 304 110 280 Z" fill="#5a464b" />
          {/* round face */}
          <ellipse cx="160" cy="182" rx="62" ry="70" fill={skin} />
          {/* hijab framing the forehead, sitting low like in the photos */}
          <path d="M92 168 C90 108 122 82 160 82 C200 82 232 108 230 168 C222 132 196 114 160 114 C124 114 100 132 92 168 Z" fill={hijab} />
          {/* fabric texture */}
          <g stroke="#9a8488" strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round">
            <path d="M106 104 C130 90 190 90 214 104" />
            <path d="M84 150 C80 120 92 96 112 82" />
            <path d="M236 150 C240 120 228 96 208 82" />
            <path d="M80 210 C82 240 90 262 100 280" />
            <path d="M240 210 C238 240 230 262 220 280" />
          </g>

          {/* rosy cheeks */}
          <ellipse cx="122" cy="206" rx="15" ry="9" fill="#f28b9b" opacity={happy ? 0.7 : 0.5} />
          <ellipse cx="198" cy="206" rx="15" ry="9" fill="#f28b9b" opacity={happy ? 0.7 : 0.5} />

          {/* thick dark brows */}
          <g style={{ transform: happy ? "translateY(-3px)" : "none", transition: "transform .3s" }}>
            <path d="M110 148 Q124 138 146 143 L146 148 Q126 144 112 152 Z" fill="#24150e" />
            <path d="M210 148 Q196 138 174 143 L174 148 Q194 144 208 152 Z" fill="#24150e" />
          </g>

          {/* left eye: big dark eyes with winged liner and lashes */}
          <g>
            <path d="M112 178 Q130 148 149 176 Q131 198 112 178 Z" fill="#fff" />
            <g className="av-pupil">
              <circle cx="131" cy="176" r="10" fill="#3a2215" />
              <circle cx="131" cy="176" r="5.2" fill="#110805" />
              <circle cx="134" cy="172.5" r="2.4" fill="#fff" />
            </g>
            <rect className="av-lid" x="110" y="152" width="40" height="42" fill="#f5d2bc" style={lid} />
            <path d="M150 176 Q130 146 111 177 L103 170" stroke="#120a06" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M115 167 l-5 -4 M120 162 l-3 -6 M127 159 l-1 -6" stroke="#120a06" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* right eye (winks) */}
          <path d="M173 178 Q190 186 206 176" stroke="#120a06" strokeWidth="4" strokeLinecap="round" fill="none" opacity={wink ? 1 : 0} />
          <g opacity={wink ? 0 : 1}>
            <path d="M208 178 Q190 148 171 176 Q189 198 208 178 Z" fill="#fff" />
            <g className="av-pupil">
              <circle cx="189" cy="176" r="10" fill="#3a2215" />
              <circle cx="189" cy="176" r="5.2" fill="#110805" />
              <circle cx="192" cy="172.5" r="2.4" fill="#fff" />
            </g>
            <rect className="av-lid" x="170" y="152" width="40" height="42" fill="#f5d2bc" style={lid} />
            <path d="M170 176 Q190 146 209 177 L217 170" stroke="#120a06" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M205 167 l5 -4 M200 162 l3 -6 M193 159 l1 -6" stroke="#120a06" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* small rounded nose */}
          <path d="M156 198 Q151 208 158 211 Q164 212 166 208" stroke="#d99b80" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* full red lips */}
          {happy ? (
            <g>
              <path d="M138 222 Q160 252 182 222 Q160 228 138 222 Z" fill="#c2303d" />
              <path d="M143 224 Q160 230 177 224 L175 229 Q160 234 145 229 Z" fill="#fff" />
            </g>
          ) : wink ? (
            <g>
              <path d="M142 225 Q156 219 162 222 Q170 217 182 220 Q172 238 156 236 Q146 234 142 225 Z" fill="#d23f4b" />
              <path d="M143 225 Q162 229 181 220" stroke="#a52a35" strokeWidth="1.8" fill="none" />
            </g>
          ) : (
            <g>
              <path d="M141 224 Q151 217 160 221 Q169 217 179 224 Q170 238 160 238 Q150 238 141 224 Z" fill="#d23f4b" />
              <path d="M141 224 Q160 230 179 224" stroke="#a52a35" strokeWidth="1.8" fill="none" />
              <ellipse cx="166" cy="230" rx="5" ry="2" fill="#fff" opacity="0.35" />
            </g>
          )}

          {/* hijab wrapped under the chin */}
          <path d="M98 238 C116 274 204 274 222 238 C230 270 214 300 160 304 C106 300 90 270 98 238 Z" fill={hijab} />
          <path d="M110 268 C132 288 188 288 210 268" stroke="#9a8488" strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}
