import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Name Suggestion App",
  description: "Find the perfect baby name using numerology, phonology, and astrology principles. Get personalized name suggestions with detailed analysis and cultural insights.",
  keywords: "baby names, numerology, astrology, name suggestions, parenting, baby naming",
  authors: [{ name: "Baby Names Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baby Names"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} antialiased h-full bg-gray-50`}
      >
        <SessionProvider>
          <div className="min-h-full">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
