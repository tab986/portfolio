"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CardPlaceholder } from "@/components/hero-3d/ScenePlaceholder";

const LanyardCard = dynamic(() => import("@/components/band/LanyardCard"), {
  ssr: false,
  loading: () => <CardPlaceholder />,
});

export default function LanyardCardClient() {
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

  // Wait until the portfolio section is near so three.js / rapier stay out of
  // the first load; the placeholder holds the stage size so nothing jumps.
  if (!mounted || !nearPortfolio) return <CardPlaceholder />;

  return <LanyardCard />;
}
