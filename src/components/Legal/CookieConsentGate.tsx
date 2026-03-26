"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CookieConsentBanner = dynamic(
  () => import("@/components/Legal/CookieConsentBanner"),
  { ssr: false }
);

type CookieConsentGateProps = {
  initialHasConsent?: boolean;
};

export default function CookieConsentGate({ initialHasConsent = false }: CookieConsentGateProps) {
  const [shouldMountBanner, setShouldMountBanner] = useState(false);

  useEffect(() => {
    if (initialHasConsent) {
      return;
    }

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const mount = () => {
      if (!cancelled) {
        setShouldMountBanner(true);
      }
    };

    const scheduleIdleMount = () => {
      idleTimer = setTimeout(mount, 1200);
      return () => {
        if (idleTimer) {
          clearTimeout(idleTimer);
        }
      };
    };

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    const onFirstInteraction = () => {
      mount();
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, onFirstInteraction, { passive: true, once: true });
    });

    const cancelIdle = scheduleIdleMount();

    return () => {
      cancelled = true;
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onFirstInteraction);
      });
      cancelIdle();
    };
  }, [initialHasConsent]);

  if (!shouldMountBanner && !initialHasConsent) {
    return null;
  }

  return <CookieConsentBanner initialHasConsent={initialHasConsent} />;
}
