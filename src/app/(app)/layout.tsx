import type { Metadata } from "next";
import {  Geist, Lora, Montserrat } from "next/font/google";
import "../globals.css";
// import "@/styles/_variables.scss";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header-with-search";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DotGrid from "@/components/DotGrid";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-mon-sans",
  subsets: ["latin"],
  weight: "400"
});

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Newsly USA",
    template: "%s | Newsly USA",
  },
  description: "Stay updated on daily life with Newsly USA.",
  openGraph: {
    title: "Newsly USA",
    description: "Stay updated on daily life with Newsly USA.",
    url: process.env.NEXT_PUBLIC_URL || "https://newslyusa.com",
    siteName: "Newsly USA",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    site: "@newslyusa",
    creator: "@newslyusa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${lora.variable} antialiased smooth-scroll bg-background text-foreground min-h-screen bg-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          
          {children}
          <SpeedInsights />
          <Footer/>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
