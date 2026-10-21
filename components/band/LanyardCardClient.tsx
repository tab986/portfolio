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
  const [nearPortfolio, setNearPortfolio] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const portfolio = document.getElementById("portfolio");
    if (!portfolio) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNearPortfolio(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(portfolio);
    return () => observer.disconnect();
  }, []);

  // Phones and tablets never mount the card, so three.js / rapier stay unloaded.
  // Desktop waits until the portfolio section is near so the card chunk is not in the first load.
  if (!mounted || !isDesktop || !nearPortfolio) return null;

  return <LanyardCard />;
}
