import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/query-provider";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  metadataBase: new URL("https://devgallery.design"),
  title: {
    default: "DevGallery — The Curated Gallery of High-Craft Developer & Designer Portfolios",
    template: "%s | DevGallery",
  },
  description:
    "DevGallery is a curated index of the world's most creative, minimal, and high-craft developer & designer portfolios. Explore live websites, tech stacks, and source code.",
  openGraph: {
    type: "website",
    siteName: "DevGallery",
    title: "DevGallery — The Curated Gallery of Developer & Designer Portfolios",
    description:
      "Explore curated design engineering portfolios, real-time live site previews, and tech stacks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevGallery",
    description:
      "Explore curated design engineering portfolios, real-time live site previews, and tech stacks.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#08090C] text-[#94A3B8] font-sans antialiased selection:bg-indigo-600 selection:text-white">
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
