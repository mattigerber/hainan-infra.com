import type { ReactNode } from "react";
import Header from "@/components/Header/Header";

/**
 * Layout for the (main) route group — pages with the site header.
 * Legal pages (terms, privacy, risks, downloads) are outside this group
 * and render without the header.
 */
export default function MainGroupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
