"use client";

import dynamic from "next/dynamic";
import { RoomPlaceholder } from "@/components/hero-3d/ScenePlaceholder";

const HeroExperience = dynamic(
  () => import("@/components/hero-3d/HeroExperience"),
  {
    ssr: false,
    loading: () => <RoomPlaceholder />,
  },
);

export default function HeroExperienceClient() {
  return <HeroExperience />;
}
