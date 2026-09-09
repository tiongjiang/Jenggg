import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body className="flex justify-center bg-[#12131C] min-h-screen">
        <main className="w-full max-w-[480px] h-screen bg-bau-cream relative overflow-hidden flex flex-col shadow-2xl">
          {children}
        </main>
      </body>
    </html>
  );
}
