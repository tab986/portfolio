"use client";

import dynamic from "next/dynamic";

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

export default function LanyardCardClient() {
  return <LanyardCard />;
}
