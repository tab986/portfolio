"use client";

import dynamic from "next/dynamic";

const HeroExperience = dynamic(
  () => import("@/components/hero-3d/HeroExperience"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-dim">
          Loading scene…
        </span>
      </div>
    ),
  },
);

export default function HeroExperienceClient() {
  return <HeroExperience />;
}
