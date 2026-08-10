"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/Aurora"), {
  ssr: false,
});

/** Delay Aurora so the 3D card can claim a stable WebGL context first. */
export default function AuroraClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

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
