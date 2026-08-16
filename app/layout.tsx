import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/query-provider";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  metadataBase: new URL("https://wallofportfolios.in"),
  title: {
    default: "Wall of Portfolios — Discover Top Developer & Designer Portfolios",
    template: "%s | Wall of Portfolios",
  },
  description:
    "Wall of Portfolios is a curated index of the world's best designer and developer portfolios.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#ECEEF2] text-[#111827] font-sans antialiased selection:bg-black selection:text-white">
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
