import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import DotGrid from "@/components/DotGrid";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://newslyusa.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Newsly USA. Send us a message, news tip, or inquiry.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Header Banner */}
      <section className="relative w-full min-h-80 flex items-center justify-center overflow-hidden mb-12 bg-muted/20">
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
        <div className="container relative z-10 mx-auto px-4 text-center pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter  mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            We'd love to hear from you. Whether you have a question about our
            coverage, pricing, or just want to say hello.
          </p>
        </div>
      </section>
      {/* Content */}
      <section className="container mx-auto py-12 px-4 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <DotGrid 
             dotSize={2}
             gap={20}
             baseColor="#9ca3af" // muted-foreground color roughly
             activeColor="#22c55e" // primary/green color
             proximity={100}
             shockRadius={150}
            />

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us directly through these channels.
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Visit Us</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      123 News Avenue, Suite 400
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Call Us</h4>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Us</h4>
                    <p className="text-sm text-muted-foreground">
                      contact@newslyusa.com
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            
          </div>
        </div>
      </section>
      <section className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative  aspect-[17/16] rounded-2xl overflow-hidden shadow-2xl">
             <Image
              src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=1470&auto=format&fit=crop"
              alt="FAQ Assistance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">Have Questions?</h3>
                <p className="text-white/90">
                  Find answers to commonly asked questions about our services and policies.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Can't find what you're looking for? Contact our support team directly.
              </p>
            </div>

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How do I submit a news tip?",
                    answer:
                      "You can submit news tips directly through our secure contact form above, or email our editorial team at tips@newslyusa.com. We protect the anonymity of our sources.",
                  },
                  {
                    question: "Can I reproduce your content?",
                    answer:
                      "Content reproduction requires written permission. Please contact our licensing department for inquiries regarding syndication and reprints.",
                  },
                  {
                    question: "How do I manage my newsletter subscription?",
                    answer:
                      "You can manage your preferences or unsubscribe at any time using the link provided at the bottom of every newsletter email we send.",
                  },
                  {
                    question: "Do you offer advertising opportunities?",
                    answer:
                      "Yes, we offer various advertising packages including display ads, sponsored content, and newsletter features. Contact our sales team for a media kit.",
                  },
                  {
                    question: "What is your corrections policy?",
                    answer:
                      "We are committed to accuracy. If you spot an error, please reach out to us. We review all correction requests and update stories transparently when necessary.",
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
