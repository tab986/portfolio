import { Mail, Phone, Send, type LucideIcon } from "lucide-react";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  LINKEDIN_HREF,
  TELEGRAM_HANDLE,
  TELEGRAM_HREF,
} from "@/lib/site";

/** lucide-react dropped brand icons, so the LinkedIn mark is drawn here. */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-.95 1.83-1.9 3.76-1.9 4.02 0 4.88 2.5 4.88 5.9V21h-4v-4.95c0-1.3-.03-2.95-1.9-2.95s-2.2 1.4-2.2 2.85V21h-4V9.75Z" />
    </svg>
  );
}

type Contact = {
  label: string;
  /** Read by screen readers instead of the bare value. */
  name: string;
  href: string;
  external?: boolean;
  icon: LucideIcon | typeof LinkedInMark;
};

const CONTACTS: Contact[] = [
  { label: "Email", name: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  {
    label: CONTACT_PHONE_DISPLAY,
    name: `Phone ${CONTACT_PHONE_DISPLAY}`,
    href: `tel:${CONTACT_PHONE}`,
    icon: Phone,
  },
  {
    label: TELEGRAM_HANDLE,
    name: `Telegram ${TELEGRAM_HANDLE}`,
    href: TELEGRAM_HREF,
    external: true,
    icon: Send,
  },
  { label: "LinkedIn", name: "LinkedIn profile", href: LINKEDIN_HREF, external: true, icon: LinkedInMark },
];

export default function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Contact" className={`flex flex-wrap gap-2 ${className}`}>
      {CONTACTS.map((contact) => {
        const Icon = contact.icon;
        return (
          <li key={contact.href}>
            <a
              href={contact.href}
              aria-label={contact.name}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noopener noreferrer" : undefined}
              className="tap-target inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-[var(--surface-border)] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-warm-white transition-colors duration-300 hover:border-gold/60 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span dir="ltr">{contact.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
