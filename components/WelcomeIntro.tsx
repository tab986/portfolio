"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FileDown } from "lucide-react";
import ContactMenu from "@/components/ContactMenu";
import HeroExperienceClient from "@/components/hero-3d/HeroExperienceClient";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";
import { useLang } from "@/lib/i18n";
import { CV_FILENAME, CV_HREF } from "@/lib/site";

const headlineClassName =
  "font-sans text-[clamp(2.25rem,11vw,4.75rem)] font-semibold leading-[1.04] tracking-tight text-warm-white sm:text-[clamp(2.75rem,6vw,4.75rem)]";

// GSAP registers plugins at import time. Keep that off the Worker SSR graph.
const SplitText = dynamic(() => import("@/components/SplitText"), {
  ssr: false,
  loading: () => <span aria-hidden="true" className={headlineClassName} />,
});

export default function WelcomeIntro() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { t, isArabic, dir } = useLang();
  // Splitting into characters breaks Arabic letter joining, so Arabic is set plain.
  const animateName = !reduceMotion && !isArabic;

  return (
    <section
      id="welcome"
      aria-label={t.hero.name}
      className="relative z-10 flex w-full max-w-[100vw] flex-col overflow-hidden lg:h-svh lg:min-h-[100dvh]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_65%_at_72%_42%,rgba(54,54,54,0.55),transparent_68%),radial-gradient(ellipse_55%_45%_at_18%_78%,rgba(212,175,55,0.05),transparent_62%),#1a1a1a]"
      />

      <div className="relative mx-auto grid h-full w-full max-w-[90rem] flex-1 grid-cols-1 content-start items-stretch gap-2 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[calc(4.75rem+env(safe-area-inset-top))] sm:gap-4 sm:px-8 lg:grid-cols-12 lg:grid-rows-none lg:content-stretch lg:gap-6 lg:px-8 lg:pb-8 lg:pt-14 xl:gap-8 xl:px-12">
        <div className="relative z-20 flex shrink-0 flex-col justify-center pt-2 lg:col-span-5 lg:pt-0 xl:col-span-4">
          <div dir={dir} className="max-w-md lg:max-w-none">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold sm:text-xs">
              {t.hero.role}
            </p>
            <h1 className={`${headlineClassName} relative mt-3 sm:mt-4`} style={{ textAlign: "start" }}>
              <span className="sr-only">{t.hero.name}</span>
              {animateName ? (
                <SplitText
                  text={t.hero.name}
                  tag="span"
                  ariaHidden
                  className={headlineClassName}
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
              ) : (
                <span aria-hidden="true">{t.hero.name}</span>
              )}
            </h1>
            <p className="mt-4 max-w-md font-sans text-[0.9375rem] leading-relaxed text-chrome sm:mt-6 md:text-base">
              {t.hero.lead}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              <ContactMenu buttonClassName="px-4 py-2.5" desktopUp />
              <a
                href={CV_HREF}
                download={CV_FILENAME}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel tap-target inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-gold/35 px-4 py-2.5 font-sans text-sm font-semibold text-warm-white transition-[border-color,box-shadow,transform,color] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <FileDown className="h-3.5 w-3.5 text-gold" aria-hidden />
                {t.hero.cv}
              </a>
            </div>
          </div>
        </div>

        <figure
          aria-label={t.hero.roomAlt}
          className="relative min-h-0 w-full min-w-0 max-lg:mx-auto max-lg:aspect-[5/4] max-lg:max-w-xl lg:col-span-7 lg:h-auto lg:min-h-0 lg:cursor-grab lg:active:cursor-grabbing xl:col-span-8"
        >
          {/* Phones and tablets get a still render: no WebGL, three.js or model download. */}
          <Image
            src="/hero-3d/room-static.webp"
            alt=""
            width={900}
            height={724}
            unoptimized
            loading="eager"
            style={{ height: "100%" }}
            className="absolute inset-0 w-full object-contain lg:hidden"
          />
          <div className="welcome-room-stage absolute inset-0 hidden overflow-hidden bg-transparent shadow-none lg:-right-8 lg:left-0 lg:block xl:-right-12">
            <HeroExperienceClient />
          </div>
        </figure>
      </div>

      <a
        href="#portfolio"
        className="tap-target absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex min-h-11 min-w-[4.5rem] -translate-x-1/2 cursor-pointer flex-col items-center justify-center gap-2 px-4 py-2 text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em]">
          {t.hero.scroll}
        </span>
        <span
          aria-hidden
          className="block h-8 w-px origin-top animate-scroll-line bg-gradient-to-b from-gold to-transparent"
        />
      </a>
    </section>
  );
}
