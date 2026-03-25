import type { ReactNode } from "react";

/**
 * LegalProse
 *
 * Provides consistent typographic styling for long-form legal content.
 * Use semantic HTML inside — h1, h2, h3, p, ul, ol, li, strong, em, hr, a —
 * and this wrapper applies the correct visual treatment for each.
 *
 * Example usage inside a content file:
 *
 *   <LegalProse>
 *     <h1>Terms of Use</h1>
 *     <p>Effective date: March 2026</p>
 *     <h2>1. Introduction</h2>
 *     <p>...</p>
 *     <ul>
 *       <li>Item one</li>
 *       <li>Item two</li>
 *     </ul>
 *   </LegalProse>
 */
export default function LegalProse({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        // h1
        "[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold sm:[&_h1]:text-4xl lg:[&_h1]:text-5xl",
        // h2
        "[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white sm:[&_h2]:text-2xl",
        // h3
        "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:text-white/50 sm:[&_h3]:text-sm",
        // paragraphs
        "[&_p]:mb-5 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-white sm:[&_p]:text-lg",
        // unordered lists
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6",
        // ordered lists
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        // list items
        "[&_li]:mb-1.5 [&_li]:text-base [&_li]:leading-relaxed [&_li]:text-white sm:[&_li]:text-lg",
        // inline emphasis
        "[&_strong]:font-semibold [&_strong]:text-white",
        "[&_em]:italic [&_em]:text-white/60",
        // dividers
        "[&_hr]:my-10 [&_hr]:border-white/10",
        // links inside prose
        "[&_a]:underline [&_a]:underline-offset-2 [&_a]:text-white/60 hover:[&_a]:text-white",
        // version/metadata line (use <small> tag)
        "[&_small]:block [&_small]:mb-8 [&_small]:mt-1 [&_small]:text-xs [&_small]:text-white/30 [&_small]:tracking-wide",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
