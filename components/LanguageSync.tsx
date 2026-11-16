"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

/** Keeps `<html lang dir>` in step with the chosen language. */
export default function LanguageSync() {
  const { lang } = useLang();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
