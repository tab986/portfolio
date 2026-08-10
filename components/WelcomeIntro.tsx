"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import SplitText from "@/components/SplitText";
import HeroExperienceClient from "@/components/hero-3d/HeroExperienceClient";

function teleportToPortfolio(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document
    .getElementById("portfolio")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WelcomeIntro() {
  const [sceneActive, setSceneActive] = useState(true);

  useEffect(() => {
    const welcome = document.getElementById("welcome");
    if (!welcome) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneActive(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.5, 1] },
    );

    observer.observe(welcome);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="welcome"
      aria-label="Welcome"
      className="relative z-10 h-svh min-h-[100dvh] w-full overflow-hidden"
    >
      <div className="mx-auto grid h-full w-full max-w-[90rem] grid-cols-1 items-stretch px-5 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-8 xl:gap-8 xl:px-12">
        <div className="relative z-20 flex flex-col justify-center pt-16 lg:col-span-4 lg:pt-0 xl:col-span-4">
          <div className="max-w-md lg:max-w-none">
            <SplitText
              text="welcome to Abdalrhman portfolio"
              className="font-sans text-[clamp(2rem,5.5vw,4.75rem)] font-semibold leading-[1.05] tracking-tight text-warm-white"
              delay={80}
              duration={0.7}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 48 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
              onLetterAnimationComplete={() => {}}
            />
            <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-chrome md:text-base">
              Scroll to explore selected work, stack, and contact.
            </p>
          </div>
        </div>

        <figure
          aria-hidden={!sceneActive}
          className="relative min-h-[48vh] flex-1 cursor-grab active:cursor-grabbing lg:col-span-8 lg:min-h-0 xl:col-span-8"
          style={{ touchAction: "none" }}
        >
          <div className="absolute inset-0 -mx-5 sm:-mx-8 lg:inset-y-0 lg:-right-8 lg:left-0 lg:mx-0 xl:-right-12">
            {sceneActive ? (
              <HeroExperienceClient />
            ) : (
              <div className="h-full w-full bg-transparent" />
            )}
          </div>
        </figure>
      </div>

      <a
        href="#portfolio"
        onClick={teleportToPortfolio}
        className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em]">
          Scroll
        </span>
        <span
          aria-hidden
          className="block h-8 w-px origin-top animate-scroll-line bg-gradient-to-b from-gold to-transparent"
        />
      </a>
    </section>
  );
}
