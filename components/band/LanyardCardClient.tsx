"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";

const LanyardCard = dynamic(() => import("@/components/band/LanyardCard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(80dvh,34rem)] min-h-[min(500px,80dvh)] w-full max-w-[100vw] items-center justify-center overflow-hidden md:h-[min(82vh,700px)] md:min-h-0 md:max-w-none lg:min-h-[480px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-dim">
        Loading card…
      </span>
    </div>
  ),
});

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function LanyardCardClient() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Phones and tablets never mount the card, so three.js / rapier stay unloaded.
  if (!mounted || !isDesktop) return null;

  return <LanyardCard />;
}
