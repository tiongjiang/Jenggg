import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Jenggg — Food Hunter Game",
  description: "Explore, discover, and hunt authentic eateries across Malaysia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex justify-center bg-[#12131C] min-h-[100dvh]">
        {/* Mobile viewport container locked to 100dvh */}
        <main className="w-full max-w-[480px] h-[100dvh] bg-bau-cream relative overflow-hidden flex flex-col shadow-2xl">
          {/* Scrollable screen content */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </div>
          {/* Always pinned to bottom */}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
