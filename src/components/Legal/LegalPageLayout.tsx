import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  locale: string;
  backLabel: string;
  children: ReactNode;
};

/**
 * Shell for standalone legal pages (Terms, Privacy, Risks, Downloads).
 * Renders no site Header or Footer — only a "← Back to Homepage" link
 * at the top-left, matching the site's standard content padding.
 */
export default function LegalPageLayout({ locale, backLabel, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back navigation bar */}
      <div className="mx-auto w-full max-w-7xl px-8 pt-8 sm:px-6 md:px-10 2xl:max-w-[90rem]">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1 text-sm text-white/50 transition-colors duration-150 hover:text-white"
        >
          {backLabel}
        </Link>
      </div>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl px-8 py-10 sm:px-6 md:px-10 2xl:max-w-[90rem]">
        {children}
      </main>
    </div>
  );
}
