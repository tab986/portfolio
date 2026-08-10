"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/Aurora"), {
  ssr: false,
});

/**
 * Delay Aurora so the welcome 3D room can claim a WebGL context first.
 * Demount while the welcome viewport is dominant to avoid fighting the
 * room canvas; re-enable on the portfolio section for atmosphere.
 */
export default function AuroraClient() {
  const [ready, setReady] = useState(false);
  const [showAurora, setShowAurora] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const welcome = document.getElementById("welcome");
    if (!welcome) {
      setShowAurora(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const welcomeDominant =
          entry.isIntersecting && entry.intersectionRatio >= 0.4;
        setShowAurora(!welcomeDominant);
      },
      { threshold: [0, 0.4, 0.75, 1] },
    );

    observer.observe(welcome);
    return () => observer.disconnect();
  }, []);

  if (!ready || !showAurora) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    >
      <Aurora
        colorStops={["#1A1A1A", "#363636", "#1A1A1A"]}
        blend={0.47}
        amplitude={1.0}
        speed={0.5}
      />
    </div>
  );
}
