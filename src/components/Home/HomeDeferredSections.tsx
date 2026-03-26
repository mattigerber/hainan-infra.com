"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const HomeWalletBackedSections = dynamic(() => import("@/components/Home/HomeWalletBackedSections"));
const TeamSection = dynamic(() => import("@/components/Team/TeamSection"));
const OurInnovationsSection = dynamic(() => import("@/components/Team/OurInnovationsSection"));

function DeferredSection({
  children,
  rootMargin = "320px 0px",
}: {
  children: ReactNode;
  rootMargin?: string;
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender || !sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldRender]);

  return <div ref={sectionRef}>{shouldRender ? children : null}</div>;
}

export default function HomeDeferredSections() {
  return (
    <>
      <DeferredSection>
        <HomeWalletBackedSections />
      </DeferredSection>
      <DeferredSection>
        <TeamSection />
      </DeferredSection>
      <DeferredSection>
        <OurInnovationsSection />
      </DeferredSection>
    </>
  );
}