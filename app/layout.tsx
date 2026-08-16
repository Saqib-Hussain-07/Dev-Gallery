import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/query-provider";
import { CommandPalette } from "@/components/command-palette";

export const viewport: Viewport = {
  themeColor: "#E2E4E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://devgallery.com"),
  title: {
    default: "DevGallery — Curated Directory of 1,900+ Developer & Designer Portfolios",
    template: "%s | DevGallery",
  },
  description:
    "DevGallery is a curated index of 1,900+ world-class developer & designer portfolios. Explore live websites, verified tech stacks, and creative inspiration.",
  keywords: [
    "DevGallery",
    "developer portfolio",
    "designer portfolio",
    "software engineer",
    "frontend developer",
    "full stack developer",
    "design engineering",
    "web development",
    "portfolio inspiration",
    "Three.js portfolio",
    "minimalist portfolio",
  ],
  authors: [{ name: "DevGallery Community" }],
  creator: "Saqib Hussain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devgallery.com",
    siteName: "DevGallery",
    title: "DevGallery — Curated Directory of 1,900+ Developer Portfolios",
    description:
      "Explore 1,900+ handpicked, live developer and designer portfolios with real-time previews and tech stacks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevGallery — Curated Directory of 1,900+ Developer Portfolios",
    description:
      "Explore 1,900+ handpicked, live developer and designer portfolios with real-time previews and tech stacks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to WordPress screenshot CDN and avatar services for fast screenshot loading */}
        <link rel="preconnect" href="https://s0.wp.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://s0.wp.com" />
        <link rel="preconnect" href="https://avatar.vercel.sh" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avatar.vercel.sh" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#E2E4E9] text-[#111827] font-sans antialiased selection:bg-black selection:text-white">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <QueryProvider>
          <Navbar />
          <div className="flex-1 flex w-full">
            <main id="main-content" className="flex-1 w-full min-w-0">
              {children}
            </main>
          </div>
          <Footer />
          <CommandPalette />
        </QueryProvider>
      </body>
    </html>
  );
}
