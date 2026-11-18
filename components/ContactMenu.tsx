"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Mail, Phone, Send, type LucideIcon } from "lucide-react";
import { useMediaQueryAfterHydration } from "@/components/hero-3d/useMediaQuery";
import { useLang } from "@/lib/i18n";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  GITHUB_HREF,
  GITHUB_LABEL,
  LINKEDIN_HREF,
  LINKEDIN_LABEL,
  TELEGRAM_HANDLE,
  TELEGRAM_HREF,
} from "@/lib/site";

/** lucide-react dropped brand icons, so the brand marks are drawn here. */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-.95 1.83-1.9 3.76-1.9 4.02 0 4.88 2.5 4.88 5.9V21h-4v-4.95c0-1.3-.03-2.95-1.9-2.95s-2.2 1.4-2.2 2.85V21h-4V9.75Z" />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

type ContactKey = "email" | "phone" | "telegram" | "linkedin" | "github";

type Contact = {
  key: ContactKey;
  value: string;
  href: string;
  external?: boolean;
  icon: LucideIcon | typeof LinkedInMark;
};

const CONTACTS: Contact[] = [
  { key: "email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { key: "phone", value: CONTACT_PHONE_DISPLAY, href: `tel:${CONTACT_PHONE}`, icon: Phone },
  { key: "telegram", value: TELEGRAM_HANDLE, href: TELEGRAM_HREF, external: true, icon: Send },
  {
    key: "linkedin",
    value: LINKEDIN_LABEL.replace("linkedin.com", ""),
    href: LINKEDIN_HREF,
    external: true,
    icon: LinkedInMark,
  },
  { key: "github", value: GITHUB_LABEL, href: GITHUB_HREF, external: true, icon: GitHubMark },
];

/** Every way to reach out, one row each. Values stay left-to-right in Arabic. */
export function ContactList({ className = "" }: { className?: string }) {
  const { t } = useLang();

  return (
    <ul aria-label={t.contact.details} className={className}>
      {CONTACTS.map((contact) => {
        const Icon = contact.icon;
        return (
          <li key={contact.key}>
            <a
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-gold/30 bg-[var(--gold-soft)] text-gold">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-chrome-dim">
                  {t.contact[contact.key]}
                </span>
                <span
                  dir="ltr"
                  className="block truncate font-mono text-xs text-warm-white transition-colors group-hover:text-gold"
                >
                  {contact.value}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "Contact me" button that opens a small panel with every way to reach out,
 * so the details are one tap away without sitting on the page all the time.
 */
export default function ContactMenu({
  buttonClassName = "",
  className = "",
  desktopUp = false,
}: {
  buttonClassName?: string;
  className?: string;
  /** Open above the button on wide screens, where the section below is clipped. */
  desktopUp?: boolean;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  // On phones and tablets the list opens as a bottom sheet in <body>, so the
  // welcome section's overflow clipping and stacking can never cut it off.
  const sheet = useMediaQueryAfterHydration("(max-width: 1023px)");

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`tap-target glow-gold inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-gold font-sans text-sm font-semibold text-obsidian transition-[box-shadow,transform] duration-300 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${buttonClassName}`}
      >
        {t.hero.contact}
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {sheet ? (
        open &&
        createPortal(
          <>
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 motion-safe:animate-fade-up"
            />
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label={t.contact.details}
              className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[71] max-h-[85svh] overflow-y-auto rounded-2xl border border-gold/35 bg-[#161616] p-2 shadow-[0_-16px_60px_rgba(0,0,0,0.7)] motion-safe:animate-fade-up"
            >
              <p className="px-3 pb-1 pt-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                {t.contact.details}
              </p>
              <ContactList />
            </div>
          </>,
          document.body,
        )
      ) : (
        <div
          ref={panelRef}
          id={panelId}
          hidden={!open}
          className={`absolute start-0 z-40 w-[21rem] rounded-lg border border-gold/35 bg-[#161616] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.65)] ${
            desktopUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <ContactList />
        </div>
      )}
    </div>
  );
}
