"use client";

import { Languages } from "lucide-react";
import { setLang, useLang } from "@/lib/i18n";

const linkClassName =
  "tap-target inline-flex min-h-11 cursor-pointer items-center rounded-sm px-1 font-sans text-xs font-medium text-chrome transition-colors duration-200 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-2 sm:text-[13px]";

export default function SiteNav() {
  const { lang, t } = useLang();

  const links = [
    { href: "#portfolio", label: t.nav.projects },
    { href: "#terminal", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--surface-border)] bg-[rgba(22,22,22,0.78)] pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-[90rem] items-center justify-between gap-3 px-4 sm:px-8 xl:px-12"
      >
        <a
          href="#welcome"
          aria-label={t.nav.home}
          className="tap-target inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm font-sans text-sm font-semibold text-warm-white transition-colors duration-200 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span
            aria-hidden
            dir="ltr"
            className="grid h-8 w-8 shrink-0 place-items-center border border-gold/50 bg-[var(--gold-soft)] font-mono text-[11px] font-medium text-gold"
          >
            AA
          </span>
          <span className="hidden sm:inline">{t.nav.home}</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClassName}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={t.nav.switchLabel}
            className="tap-target inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border border-gold/45 px-2.5 py-1.5 font-sans text-xs font-medium text-gold transition-colors duration-200 hover:border-gold hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Languages aria-hidden className="h-3.5 w-3.5" />
            <span lang={lang === "ar" ? "en" : "ar"}>{t.nav.switchTo}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
