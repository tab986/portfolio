"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Keeps `<html lang>` in step with the chosen language. The document direction
 * is left alone on purpose: switching language must not mirror the layout.
 */
export default function LanguageSync() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
