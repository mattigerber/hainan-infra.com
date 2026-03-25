"use client";

import Image from "next/image";

import styles from "./PartnerCarousel.module.css";
import { partnerLogos } from "./partnerLogos";

export default function PartnerCarousel() {
  const partnerSequence = [...partnerLogos, ...partnerLogos, ...partnerLogos] as const;

  return (
    <section className="w-full py-1 sm:py-2">
      <div className={`${styles.partnersFade} overflow-hidden pb-2`}>
        <div className={styles.partnersTrack}>
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className={styles.partnersGroup} aria-hidden={groupIndex === 1}>
              {partnerSequence.map((partner, index) => (
                <div
                  key={`${partner.name}-${groupIndex}-${index}`}
                  className="flex h-20 w-32 shrink-0 items-center justify-center p-3 sm:h-24 sm:w-40 sm:p-4 md:h-28 md:w-48 md:p-5"
                >
                  
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    width={132}
                    height={42}
                    className="h-7 w-auto object-contain opacity-95 sm:h-8 md:h-10"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
