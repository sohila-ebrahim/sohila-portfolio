import { Fragment } from "react";

/** Splits text into masked characters (.char) grouped by words, for GSAP reveals. */
export default function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  // Arabic letters join, so animate whole words instead of single characters
  const joined = /[؀-ۿ]/.test(text);
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span aria-hidden className="inline-block overflow-hidden whitespace-nowrap align-bottom pb-[0.08em]">
            {(joined ? [word] : word.split("")).map((c, ci) => (
              <span key={ci} className="char inline-block will-change-transform">
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
