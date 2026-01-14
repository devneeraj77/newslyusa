"use client";

import React from "react";
import DotGrid from "@/components/DotGrid";
import { Scale, Gavel, AlertCircle, FileText, Copyright, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen text-foreground">
      {/* Header Banner */}
      <section className="relative w-full min-h-80 flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 w-full h-full">
          <DotGrid
            dotSize={2}
            gap={20}
            baseColor="#9ca3af"
            activeColor="#22c55e"
            proximity={100}
            shockRadius={150}
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Terms & Conditions
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Please read these terms carefully before using NewslyUSA. By accessing our site, you agree to be bound by these conditions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container font-mono mx-auto space-y-12 pb-16 px-4">
        {/* Introduction */}
        <div className="bg-card p-6 rounded-lg border border-border/50">
           <div className="md:flex py-3 justify-between items-center">
            <h3 className="text-xl font-bold text-card-foreground mb-3">
              Agreement to Terms
            </h3>
            <p className="mb-3">Last Updated : 14 Jan 2026</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to NewslyUSA. These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NewslyUSA ("we," "us," or "our"), concerning your access to and use of the NewslyUSA website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
          </p>
        </div>

        {/* Key Terms Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Intellectual Property",
                icon: Copyright,
                description:
                  "Unless otherwise indicated, the Site and its original content, features, and functionality are owned by NewslyUSA and are protected by international copyright, trademark, and other intellectual property laws.",
              },
              {
                title: "User Conduct",
                icon: CheckCircle,
                description:
                  "You agree not to use the Site for any unlawful purpose or in any way that interrupts, damages, impairs, or renders the Site less efficient or accurate.",
              },
              {
                title: "Disclaimer",
                icon: AlertCircle,
                description:
                  "The information provided on the Site is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind.",
              },
              {
                title: "Limitation of Liability",
                icon: Scale,
                description:
                  "In no event shall NewslyUSA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.",
              },
              {
                title: "Governing Law",
                icon: Gavel,
                description:
                  "These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.",
              },
              {
                title: "Changes to Terms",
                icon: FileText,
                description:
                  "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.",
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
              1. Acceptable Use
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You are responsible for your use of the Site, and for any use of the Site made using your account. Our goal is to create a positive, useful, and safe user experience. To promote this goal, we prohibit certain kinds of conduct that may be harmful to other users or to us.
            </p>
             <p className="text-muted-foreground leading-relaxed">
              When you use the Site, you may not:
            </p>
             <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 mt-2">
              <li>Violate any applicable law or regulation.</li>
              <li>Infringe the rights of any third party, including without limitation, intellectual property, privacy, and publicity rights.</li>
              <li>Use the Service to transmit, distribute, post or submit any information concerning any other person or entity, including without limitation, photographs of others without their permission, personal contact information or credit, debit, calling card or account numbers.</li>
            </ul>
          </section>

          <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">
              2. Content Liability
            </h3>
            <p className="text-muted-foreground leading-relaxed">
               We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>
          </section>

           <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">
              3. Termination
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
          </section>

          <section className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="text-2xl font-bold mb-4">4. Contact Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at legal@newslyusa.com.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
