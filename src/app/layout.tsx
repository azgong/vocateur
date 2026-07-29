import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { AgeGate } from "@/components/AgeGate";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
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
  metadataBase: new URL("https://vocateur.app"),
  title: "Vocateur",
  description: "Find the career that actually fits how you think.",
  openGraph: {
    title: "Vocateur",
    description: "Find the career that actually fits how you think.",
    url: "https://vocateur.app",
    siteName: "Vocateur",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vocateur",
    description: "Find the career that actually fits how you think.",
  },
  appleWebApp: {
    capable: true,
    title: "Vocateur",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1d21",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuroraBackdrop />
        <AgeGate />
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
