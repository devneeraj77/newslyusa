"use client";

import React from "react";
import DotGrid from "@/components/DotGrid";
import { Shield, Lock, Eye, FileText, Server, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen text-foreground">
      {/* Header Banner */}
      <section className="relative w-full min-h-80 flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 w-full h-full">
          <DotGrid
            dotSize={2}
            gap={20}
            baseColor="#9ca3af" // muted-foreground color roughly
            activeColor="#22c55e" // primary/green color
            proximity={100}
            shockRadius={150}
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter  mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl  max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Your privacy matters to us. Learn how we collect, use, and protect
            your personal information at NewslyUSA.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container font-mono mx-auto space-y-12 pb-16 px-4">
        {/* Introduction */}
        <div className="bg-card p-6 rounded-lg border border-border/50">
          <div className="md:flex py-3 justify-between items-center">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            Commitment to Privacy
          </h3>
            <p className="mb-3">Published : 14 Jan 2026</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            At NewslyUSA, we value the trust you place in us when you visit our
            website and use our services. This Privacy Policy outlines our
            practices regarding the collection, use, and disclosure of your
            information. We are committed to transparency and ensuring your data
            is handled with the utmost care and security.
          </p>
        </div>

        {/* Key Policies Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Information Collection",
                icon: FileText,
                description:
                  "We collect information you provide directly to us, such as when you subscribe to our newsletter, create an account, or contact us. We also automatically collect certain technical data when you browse our site.",
              },
              {
                title: "Data Usage",
                icon: Server,
                description:
                  "We use your information to deliver the content you request, improve our website's functionality, personalize your experience, and communicate with you about updates and relevant news.",
              },
              {
                title: "Data Protection",
                icon: Lock,
                description:
                  "We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your data security is our top priority.",
              },
              {
                title: "Cookies & Tracking",
                icon: Eye,
                description:
                  "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior to improve our content delivery.",
              },
              {
                title: "Third-Party Sharing",
                icon: Shield,
                description:
                  "We do not sell your personal information. We may share data with trusted service providers who assist us in operating our website, strictly under confidentiality agreements.",
              },
              {
                title: "User Rights",
                icon: UserCheck,
                description:
                  "You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time by following the unsubscribe instructions.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-shadow duration-300 border-border/50"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-8">
          <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">
              1. Information We Collect
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Personal Information:</strong> When you register for an
              account, subscribe to our newsletter, or contact us, we may ask
              for your name, email address, and other contact details.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Usage Data:</strong> We may collect information about how
              you access and use the Service. This Usage Data may include
              information such as your computer's Internet Protocol address
              (e.g. IP address), browser type, browser version, the pages of our
              Service that you visit, the time and date of your visit, the time
              spent on those pages, unique device identifiers and other
              diagnostic data.
            </p>
          </section>

          <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">
              2. How We Use Your Information
            </h3>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>
                To allow you to participate in interactive features of our
                Service when you choose to do so
              </li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information so that we can
                improve our Service
              </li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>
          <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">3. Contact Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us by visiting the contact page on our website or emailing
              us directly at privacy@newslyusa.com.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
