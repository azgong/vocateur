import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { AgeGate } from "@/components/AgeGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuroraBackdrop />
        <AgeGate />
        {children}
      </body>
    </html>
  );
}
