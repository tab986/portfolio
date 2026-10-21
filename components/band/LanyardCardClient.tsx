"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CardPlaceholder } from "@/components/hero-3d/ScenePlaceholder";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";

const LanyardCard = dynamic(() => import("@/components/band/LanyardCard"), {
  ssr: false,
  loading: () => <CardPlaceholder />,
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
