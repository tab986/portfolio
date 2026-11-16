"use client";

import dynamic from "next/dynamic";
import { RoomPlaceholder } from "@/components/hero-3d/ScenePlaceholder";
import { useMediaQueryAfterHydration } from "@/components/hero-3d/useMediaQuery";

const HeroExperience = dynamic(
  () => import("@/components/hero-3d/HeroExperience"),
  {
    ssr: false,
    loading: () => <RoomPlaceholder />,
  },
);

/**
 * The live 3D room is desktop only. Below 1024px the welcome section shows a
 * still render instead, so phones never download three.js or the room model.
 */
export default function HeroExperienceClient() {
  const isDesktop = useMediaQueryAfterHydration("(min-width: 1024px)");
  if (!isDesktop) return null;
  return <HeroExperience />;
}
