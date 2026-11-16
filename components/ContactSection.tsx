"use client";

import Image from "next/image";
import { FileDown } from "lucide-react";
import { ContactList } from "@/components/ContactMenu";
import LanyardCardClient from "@/components/band/LanyardCardClient";
import { useLang } from "@/lib/i18n";
import { CV_FILENAME, CV_HREF } from "@/lib/site";

/** Closing section: every way to reach out, with the ID card beside it. */
export default function ContactSection() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 mx-auto w-full max-w-[90rem] scroll-mt-14 overflow-x-hidden px-4 pb-10 pt-16 sm:px-8 lg:pb-12 lg:pt-20 xl:px-12"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-10">
        <div className="min-w-0 lg:col-span-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold sm:text-xs">
            {t.contact.eyebrow}
          </p>
          <h2
            id="contact-heading"
            className="mt-2 font-sans text-[clamp(2rem,8vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-warm-white"
          >
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-md font-sans text-[0.9375rem] leading-relaxed text-chrome md:text-base">
            {t.contact.lead}
          </p>

          {/* Phones and tablets: a flat ID badge instead of the 3D lanyard card. */}
          <div className="mt-6 flex items-center gap-4 lg:hidden">
            <div className="id-badge relative w-[5.25rem] shrink-0 pt-4 sm:w-24">
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-6 w-2.5 -translate-x-1/2 rounded-sm bg-gradient-to-b from-zinc-700 to-zinc-900"
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-3 z-10 h-3.5 w-5 -translate-x-1/2 rounded-[3px] border-2 border-zinc-400 bg-obsidian"
              />
              <Image
                src="/assets/card-front.webp"
                alt={t.hero.name}
                width={320}
                height={513}
                unoptimized
                className="relative block h-auto w-full rounded-md border-2 border-zinc-300/90 shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
              />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-base font-semibold leading-snug text-warm-white">
                {t.hero.name}
              </p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-chrome">
                {t.contact.education}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-chrome-dim">
                {t.contact.location}
              </p>
            </div>
          </div>

          <ContactList className="glass-panel mt-6 grid max-w-md grid-cols-1 rounded-lg p-1.5" />

          <a
            href={CV_HREF}
            download={CV_FILENAME}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel group tap-target mt-4 inline-flex min-h-11 w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-none border border-gold/35 px-5 py-3 font-sans text-sm font-semibold text-warm-white transition-[border-color,box-shadow,transform,color] duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold hover:shadow-[0_0_28px_rgba(212,175,55,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:justify-start"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center border border-gold/40 bg-[var(--gold-soft)] text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-obsidian">
              <FileDown className="h-3.5 w-3.5" aria-hidden suppressHydrationWarning />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span>{t.contact.cv}</span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-dim transition-colors group-hover:text-gold/80">
                {t.contact.cvNote}
              </span>
            </span>
          </a>
        </div>

        <div className="hidden w-full min-w-0 flex-col items-center justify-center lg:col-span-7 lg:flex lg:items-end lg:justify-start lg:self-start">
          {/* The 3D scene is composed left-to-right, so its stage keeps that direction. */}
          <div dir="ltr" className="w-full lg:max-w-[760px] lg:overflow-visible">
            <LanyardCardClient />
          </div>
        </div>
      </div>
    </section>
  );
}
