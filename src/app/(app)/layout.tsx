"use client";
import type { Metadata } from "next";
import {  Geist, Lora, Montserrat } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header-with-search";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${montserrat.variable} ${lora.variable} antialiased bg-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
