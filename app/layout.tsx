import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Abdalrhmn Anwar | Full Stack Developer",
  description:
    "Full Stack Developer based in Baghdad — architecting scalable backend systems & full-stack applications. React, Node.js, PostgreSQL.",
  openGraph: {
    title: "Abdalrhmn Anwar | Full Stack Developer",
    description:
      "Full Stack Developer based in Baghdad. React · Node.js · PostgreSQL.",
    type: "website",
  },
  // Site is already dark — stop Dark Reader from rewriting markup pre-hydrate
  other: {
    "darkreader-lock": "1",
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        plusJakarta.variable,
        jetbrainsMono.variable,
      )}
    >
      <body
        className="grain flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
