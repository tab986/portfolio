import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { metadataBase, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
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
  metadataBase,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Abdalrhmn Anwar",
  authors: [{ name: "Abdalrhmn Anwar Hameed" }],
  creator: "Abdalrhmn Anwar Hameed",
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Abdalrhmn Anwar",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Site is already dark — stop Dark Reader from rewriting markup pre-hydrate
  other: {
    "darkreader-lock": "1",
    "color-scheme": "dark",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
