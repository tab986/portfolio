"use client";

import { useLang } from "@/lib/i18n";
import { GITHUB_HREF, LINKEDIN_HREF, TELEGRAM_HREF } from "@/lib/site";

const LINKS = [
  { label: "GitHub", href: GITHUB_HREF },
  { label: "LinkedIn", href: LINKEDIN_HREF },
  { label: "Telegram", href: TELEGRAM_HREF },
];

export default function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col gap-3 border-t border-[var(--surface-border)] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-chrome-dim sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8 sm:tracking-[0.16em] xl:px-12">
      <span>{t.footer.name}</span>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex min-h-11 cursor-pointer items-center text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
