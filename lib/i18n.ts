"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "ar";

/** A string in both languages. English is the default and what search engines see. */
export type Localized = Record<Lang, string>;

const STORAGE_KEY = "portfolio-lang";

const en = {
  nav: {
    home: "Abdalrhmn Anwar",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    switchTo: "العربية",
    switchLabel: "عرض الموقع بالعربية",
  },
  hero: {
    role: "Full-Stack Developer · Baghdad, Iraq",
    name: "Abdalrhmn Anwar",
    lead: "I build and ship production web and mobile applications, from database design and backend APIs to responsive interfaces.",
    contact: "Contact me",
    cv: "Download CV",
    scroll: "Projects",
    roomAlt: "3D illustration of a developer's workspace",
  },
  projects: {
    eyebrow: "Selected work",
    title: "Projects",
    lead: "Five shipped products across web, mobile and backend.",
  },
  about: {
    label: "At a glance",
    lead: "Experienced in owning complete systems end to end, deploying serverless apps on Cloudflare Workers, managing relational databases, and building secure licensing and payment flows.",
    work: "Work",
    workValue: "Full-Stack Developer, Freelance / Projects · 2025–Present",
    internship: "Internship",
    internshipValue: "Backend Intern, GDG · 05/2025–08/2025",
    education: "Education",
    educationValue: "Computer Engineering Technology, MTU · 2023–2027",
    shipping: "Shipping",
    shippingValue: "Google Play and the App Store",
    stack: "Core stack",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk.",
    lead: "Have a project or a role in mind? Reach me directly through any of these.",
    email: "Email",
    phone: "Phone",
    telegram: "Telegram",
    linkedin: "LinkedIn",
    github: "GitHub",
    details: "Contact details",
    cv: "Download CV",
    cvNote: "PDF · Resume",
    education: "Computer Engineering Technology (MTU)",
    location: "Baghdad, Iraq",
  },
  footer: {
    name: "Abdalrhmn Anwar · Baghdad",
  },
};

const ar: typeof en = {
  nav: {
    home: "عبدالرحمن أنور",
    projects: "المشاريع",
    about: "نبذة",
    contact: "تواصل",
    switchTo: "English",
    switchLabel: "View the site in English",
  },
  hero: {
    role: "مطوّر Full-Stack · بغداد، العراق",
    name: "عبدالرحمن أنور",
    lead: "أبني وأُطلق تطبيقات ويب وموبايل تعمل لدى عملاء حقيقيين، من تصميم قواعد البيانات وواجهات الـ API إلى واجهات المستخدم المتجاوبة.",
    contact: "تواصل معي",
    cv: "تحميل السيرة الذاتية",
    scroll: "المشاريع",
    roomAlt: "رسم ثلاثي الأبعاد لمكتب مبرمج",
  },
  projects: {
    eyebrow: "أعمال مختارة",
    title: "المشاريع",
    lead: "خمسة منتجات منشورة بين الويب والموبايل والـ Backend.",
  },
  about: {
    label: "لمحة سريعة",
    lead: "خبرة في تولّي أنظمة كاملة من البداية إلى النهاية، ونشر تطبيقات serverless على Cloudflare Workers، وإدارة قواعد البيانات العلائقية، وبناء أنظمة تراخيص ودفع آمنة.",
    work: "العمل",
    workValue: "مطوّر Full-Stack، عمل حر / مشاريع · 2025 – الآن",
    internship: "التدريب",
    internshipValue: "متدرّب Backend، GDG · 05/2025 – 08/2025",
    education: "الدراسة",
    educationValue: "هندسة تقنيات الحاسوب، الجامعة التقنية الوسطى · 2023 – 2027",
    shipping: "النشر",
    shippingValue: "Google Play و App Store",
    stack: "التقنيات الأساسية",
  },
  contact: {
    eyebrow: "تواصل",
    title: "لنتحدث.",
    lead: "عندك مشروع أو فرصة عمل؟ تواصل معي مباشرة عبر أي من هذه الوسائل.",
    email: "البريد",
    phone: "الهاتف",
    telegram: "تلغرام",
    linkedin: "لينكدإن",
    github: "GitHub",
    details: "وسائل التواصل",
    cv: "تحميل السيرة الذاتية",
    cvNote: "PDF · السيرة الذاتية",
    education: "هندسة تقنيات الحاسوب (الجامعة التقنية الوسطى)",
    location: "بغداد، العراق",
  },
  footer: {
    name: "عبدالرحمن أنور · بغداد",
  },
};

const DICTIONARY = { en, ar };

let current: Lang = "en";
let restored = false;
const listeners = new Set<() => void>();

function readStored(): Lang {
  if (!restored) {
    restored = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "en") current = stored;
    } catch {
      // Storage can be blocked; the page then simply stays in English.
    }
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setLang(lang: Lang) {
  current = lang;
  restored = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not saved; the choice still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

/**
 * Current language. The server and the first client render are always English,
 * then a saved choice is applied, so hydration never mismatches.
 */
export function useLang() {
  const lang = useSyncExternalStore<Lang>(subscribe, readStored, () => "en");
  return { lang, t: DICTIONARY[lang], isArabic: lang === "ar" };
}
