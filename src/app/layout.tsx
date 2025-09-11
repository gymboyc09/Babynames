import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Name Suggestion App",
  description: "Find the perfect baby name using numerology, phonology, and astrology principles. Get personalized name suggestions with detailed analysis and cultural insights.",
  keywords: "baby names, numerology, astrology, name suggestions, parenting, baby naming",
  authors: [{ name: "Baby Names Team" }],
  viewport: "width=device-width, initial-scale=1",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baby Names"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
