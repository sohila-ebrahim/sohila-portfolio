"use client";
import { useState } from "react";
import type { Project } from "@/data/portfolio";
import ProjectImage from "./ProjectImage";

/**
 * Browser frame with the real site inside an iframe (lazy loaded).
 * Sites that refuse to be framed (embeddable: false) show the screenshot
 * with an "Open live site" button instead.
 */
export default function LivePreview({ project: p }: { project: Project }) {
  const [mode, setMode] = useState<"live" | "shot">(p.embeddable ? "live" : "shot");
  const [loaded, setLoaded] = useState(false);
  const host = p.liveUrl!.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="overflow-hidden rounded-3xl border border-white/15 bg-card shadow-[0_40px_120px_rgba(0,0,0,.5),0_0_60px_rgba(139,92,246,.15)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </span>
        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-bg/70 px-4 py-1.5 text-xs text-muted hover:text-fg">
          <span aria-hidden>🔒</span>
          <span className="truncate">{host}</span>
        </a>
        {p.embeddable && (
          <div className="hidden rounded-full border border-line p-0.5 text-xs sm:flex">
            {(["live", "shot"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-full px-3 py-1 ${mode === m ? "bg-accent text-white" : "text-muted"}`}>
                {m === "live" ? "Live" : "Screenshot"}
              </button>
            ))}
          </div>
        )}
        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="pill pill-accent hidden sm:inline-flex">
          Open ↗
        </a>
      </div>
      <div className="relative aspect-[16/10] w-full bg-bg">
        {mode === "live" ? (
          <>
            {!loaded && (
              <div className="absolute inset-0">
                <ProjectImage project={p} />
                <div className="absolute inset-0 flex items-center justify-center bg-bg/50 text-sm text-fg/80 backdrop-blur-sm">Loading live site…</div>
              </div>
            )}
            <iframe
              src={p.liveUrl}
              title={`${p.title} — live preview`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="absolute inset-0 h-full w-full"
            />
          </>
        ) : (
          <>
            <ProjectImage project={p} />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-bg/80 via-transparent p-8">
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-glow rounded-full px-8 py-4 text-xs font-extrabold uppercase tracking-[0.25em]">
                Open live site ↗
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
