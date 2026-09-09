import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Jenggg — Food Hunter Game",
  description: "Explore, discover, and hunt authentic eateries across Malaysia.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jenggg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF3B30",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* iOS Touch App Icon */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* CRITICAL: Force load Leaflet CSS on head so pins render at exact GPS coordinates */}
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body className="flex justify-center bg-[#12131C] min-h-[100dvh]">
        {/* Responsive mobile wrapper */}
        <main className="w-full max-w-[480px] h-[100dvh] bg-bau-cream relative overflow-hidden flex flex-col shadow-2xl">
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </div>
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
