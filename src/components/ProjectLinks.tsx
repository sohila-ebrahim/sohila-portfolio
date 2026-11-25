"use client";
import Link from "next/link";
import type { Project } from "@/data/portfolio";
import { useLang } from "@/lib/lang";

/** "Project details" + "Visit live site ↗" (or a private badge) for a project. */
export default function ProjectLinks({ project: p, details = true }: { project: Project; details?: boolean }) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {details && (
        <Link href={`/projects/${p.slug}`} className="pill pill-dark">
          {t.projectDetails}
        </Link>
      )}
      {p.liveUrl ? (
        <a href={p.liveUrl} target="_blank" rel="noreferrer" data-mood="happy" className="pill pill-accent">
          {t.visitLive} <span aria-hidden>↗</span>
        </a>
      ) : (
        <span className="pill border border-dashed border-white/20 text-muted" title="Built for a client; not publicly accessible">
          <span aria-hidden>🔒</span> {t.privateProject}
        </span>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="pill pill-dark">
          GitHub <span aria-hidden>↗</span>
        </a>
      )}
    </div>
  );
}
