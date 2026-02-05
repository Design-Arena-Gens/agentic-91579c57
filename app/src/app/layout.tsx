import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { SiteShell } from "@/components/layout/site-shell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cafe Nine | Haute Cuisine & Global Flavours",
    template: "%s · Cafe Nine",
  },
  description:
    "Cafe Nine is a luxe dining destination offering global cuisine, sommelier-led pairings, and a seamless fine dining experience online.",
  keywords: [
    "fine dining",
    "gourmet restaurant",
    "global cuisine",
    "online reservations",
    "luxury cafe",
    "Cafe Nine",
  ],
  metadataBase: new URL("https://agentic-91579c57.vercel.app"),
  openGraph: {
    title: "Cafe Nine · Global Gastronomy Redefined",
    description:
      "Reserve, order, and indulge in chef-crafted tasting menus with Cafe Nine’s immersive digital experience.",
    url: "https://agentic-91579c57.vercel.app",
    siteName: "Cafe Nine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafe Nine · Haute Cuisine at Your Fingertips",
    description:
      "Discover the artistry of Cafe Nine with curated menus, seamless ordering, and bespoke reservations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${manrope.variable} bg-background text-foreground`}
      >
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
