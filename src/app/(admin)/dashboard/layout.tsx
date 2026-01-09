"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/admin/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header/>
        {children}
      </ThemeProvider>
    </div>
  );
}