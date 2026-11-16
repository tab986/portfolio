"use client";

import { setLang, useLang, type Lang } from "@/lib/i18n";

const linkClassName =
  "tap-target inline-flex min-h-11 cursor-pointer items-center rounded-sm px-1 font-sans text-xs font-medium text-chrome transition-colors duration-200 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-2 sm:text-[13px]";

const LANGUAGES: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "عربي", name: "العربية" },
];

/**
 * Both languages are always visible and the active one is filled, so the
 * control reads as a state, not as a single button that changes its own label.
 */
function LanguageSwitch() {
  const { lang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="flex shrink-0 items-center rounded-full border border-[var(--surface-border)] bg-black/30 p-0.5"
    >
      {LANGUAGES.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            dir={option.code === "ar" ? "rtl" : "ltr"}
            onClick={() => setLang(option.code)}
            aria-pressed={active}
            aria-label={option.name}
            className={`tap-target inline-flex h-8 w-11 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              option.code === "ar" ? "font-arabic" : ""
            } ${
              active ? "bg-gold text-obsidian" : "text-chrome hover:text-warm-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** The bar keeps one layout in both languages; only its labels are translated. */
export default function SiteNav() {
  const { t } = useLang();

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

          <LanguageSwitch />
        </div>
      </nav>
    </header>
  );
}
