"use client";

import dynamic from "next/dynamic";

const LanyardCard = dynamic(() => import("@/components/band/LanyardCard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(70vh,520px)] w-full items-center justify-center lg:h-full lg:min-h-[480px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-dim">
        Loading card…
      </span>
    </div>
  ),
});

export default function LanyardCardClient() {
  return <LanyardCard />;
}
