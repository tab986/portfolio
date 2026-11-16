"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useLang, type Localized } from "@/lib/i18n";

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  name: string;
  /** What the project is, as titled on the CV. */
  kind?: Localized;
  role: Localized;
  summary: Localized;
  stack: string[];
  /** Screenshot of the live product, 960×480. */
  image: string;
  imageAlt: Localized;
  href?: string;
  links?: ProjectLink[];
};

const FULL_STACK: Localized = { en: "Full-Stack Developer", ar: "مطوّر Full-Stack" };

/** Same projects, order, roles and links as the CV. */
const PROJECTS: Project[] = [
  {
    name: "Coders Hub",
    kind: {
      en: "Software Studio Website & Billing Platform",
      ar: "موقع استوديو برمجيات ومنصة فوترة",
    },
    role: FULL_STACK,
    summary: {
      en: "Website for a Baghdad software studio, plus a billing platform that takes Wayl payments with signed webhook verification and automatically issues Ed25519-signed software licenses.",
      ar: "موقع لاستوديو برمجيات في بغداد، مع منصة فوترة تستقبل المدفوعات عبر Wayl مع التحقق من توقيع الـ webhook، وتُصدر تلقائياً تراخيص برمجية موقّعة بـ Ed25519.",
    },
    stack: ["Next.js", "Cloudflare Workers", "Wayl", "Ed25519", "PostgreSQL (Neon)"],
    image: "/projects/codershub.webp",
    imageAlt: { en: "Coders Hub website home page", ar: "الصفحة الرئيسية لموقع Coders Hub" },
    href: "https://www.codershub.org",
  },
  {
    name: "TabibiQ",
    kind: { en: "Medical Appointment Booking Platform", ar: "منصة حجز مواعيد طبية" },
    role: FULL_STACK,
    summary: {
      en: "Patients search doctors and clinics by specialty and location, book visits, and get reminders. Built the frontend and backend and owned the architecture end to end.",
      ar: "يبحث المرضى عن الأطباء والعيادات حسب الاختصاص والموقع، يحجزون مواعيدهم ويستلمون تذكيرات. بنيت الواجهة والخلفية وتولّيت معمارية النظام كاملة.",
    },
    stack: ["Android", "iOS"],
    image: "/projects/tabibiq.webp",
    imageAlt: { en: "TabibiQ app screens", ar: "شاشات تطبيق TabibiQ" },
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.tabibiq.app",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/iq/app/tabibiq/id6807596163",
      },
    ],
  },
  {
    name: "Teryaq",
    kind: { en: "Point of Sale (POS) System", ar: "نظام نقاط بيع (POS)" },
    role: FULL_STACK,
    summary: {
      en: "Flutter point-of-sale app with Ed25519 licensing and Wayl payments on a Next.js billing site.",
      ar: "تطبيق نقاط بيع بـ Flutter مع نظام تراخيص Ed25519 ومدفوعات Wayl عبر موقع فوترة مبني بـ Next.js.",
    },
    stack: ["Flutter", "Ed25519", "Wayl", "Next.js", "PostgreSQL", "Cloudflare Workers"],
    image: "/projects/teryaq.webp",
    imageAlt: { en: "Teryaq product page", ar: "صفحة منتج ترياق" },
    href: "https://www.codershub.org/teryaq",
  },
  {
    name: "Hala Teacher",
    kind: { en: "Educational Website", ar: "موقع تعليمي" },
    role: { en: "Front-End Developer", ar: "مطوّر Front-End" },
    summary: {
      en: "Arabic RTL site for a 6th-preparatory English course, with plans, booklets, and exam resources.",
      ar: "موقع عربي (RTL) لمادة الإنجليزي للسادس الإعدادي، فيه الخطط والملازم ومصادر الامتحانات الوزارية.",
    },
    stack: ["Arabic (RTL)", "Cloudflare Workers"],
    image: "/projects/halateacher.webp",
    imageAlt: { en: "Hala Teacher website home page", ar: "الصفحة الرئيسية لموقع الأستاذة حلا" },
    href: "https://www.halateacher.workers.dev/",
  },
  {
    name: "GameWiseIQ",
    role: { en: "Backend Developer", ar: "مطوّر Backend" },
    summary: {
      en: "Backend built for high availability, data processing, and secure API integrations for thousands of active users.",
      ar: "بنية Backend مصمَّمة للتوافر العالي ومعالجة البيانات وتكاملات API آمنة لآلاف المستخدمين النشطين.",
    },
    stack: [],
    image: "/projects/gamewiseiq.webp",
    imageAlt: { en: "GameWiseIQ store home page", ar: "الصفحة الرئيسية لمتجر GameWiseIQ" },
    href: "https://gamewiseiq.com",
  },
];

const cardClassName =
  "glass-panel group tap-target flex h-full w-full max-w-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const linkClassName =
  "tap-target inline-flex min-h-11 items-center gap-1 rounded-sm font-mono text-xs text-react underline-offset-2 hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function ProjectBody({ project, featured }: { project: Project; featured: boolean }) {
  const { lang, dir } = useLang();

  return (
    <>
      {/* Short strip on phones so five cards stay scannable; full frame from tablets up. */}
      <div
        className={`relative aspect-[3/1] w-full shrink-0 overflow-hidden border-b border-[var(--surface-border)] bg-obsidian-deep ${
          featured ? "" : "sm:aspect-[2/1]"
        }`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt[lang]}
          width={960}
          height={480}
          unoptimized
          // The global `img { height: auto }` rule outranks utilities, so pin the height here.
          style={{ height: "100%" }}
          className="absolute inset-0 w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div dir={dir} className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chrome">
          {project.role[lang]}
        </p>
        <h3
          dir="ltr"
          className="mt-1.5 break-words text-start font-sans rtl:text-end text-xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-gold sm:text-2xl"
        >
          {project.name}
        </h3>
        {project.kind ? (
          <p className="mt-1.5 font-sans text-xs font-medium leading-snug text-gold/90">
            {project.kind[lang]}
          </p>
        ) : null}
        <p className="mt-2 font-sans text-sm leading-relaxed text-chrome">
          {project.summary[lang]}
        </p>
        {project.stack.length > 0 ? (
          <ul dir="ltr" className="mt-3 flex flex-wrap gap-1.5 rtl:justify-end">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-md border border-zinc-600/80 bg-zinc-900/80 px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-200"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {/* Links sit on the card's bottom edge so a row of cards lines up. */}
        <div dir="ltr" className="mt-auto pt-3 rtl:text-end">
          {project.links ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1 rtl:justify-end">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ))}
            </p>
          ) : null}
          {project.href ? (
            <p className="inline-flex items-center gap-1 font-mono text-xs text-react">
              <span className="break-all">
                {project.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function ProjectEntry({ project, featured }: { project: Project; featured: boolean }) {
  const className = cardClassName;

  if (project.href && !project.links) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} cursor-pointer`}
      >
        <ProjectBody project={project} featured={featured} />
      </a>
    );
  }

  return (
    <article className={className}>
      <ProjectBody project={project} featured={featured} />
    </article>
  );
}

export default function ProjectCard() {
  const { t, dir } = useLang();

  return (
    <div className="w-full min-w-0">
      <p dir={dir} className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold sm:text-xs">
        {t.projects.eyebrow}
      </p>
      <div dir={dir} className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2
          id="projects-heading"
          className="font-sans text-[clamp(1.75rem,6vw,2.75rem)] font-semibold leading-tight tracking-tight text-warm-white"
        >
          {t.projects.title}
        </h2>
        <p className="max-w-md font-sans text-sm leading-relaxed text-chrome">
          {t.projects.lead}
        </p>
      </div>

      {/* Wide screens: a grid across the page, first project spanning two columns. */}
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-7 lg:gap-4 xl:grid-cols-3">
        {PROJECTS.map((project, i) => (
          <li key={project.name} className={`min-w-0 ${i === 0 ? "sm:col-span-2" : ""}`}>
            <ProjectEntry project={project} featured={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
