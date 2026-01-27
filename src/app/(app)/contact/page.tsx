"use client";

import React, { useState } from "react";
import DotGrid from "@/components/DotGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success(result.message || "Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Send us a message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    required
                    className="min-h-[150px] bg-background/50 resize-y"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6 text-black">
            <Card className="shadow-lg border-0 text-black">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription className="text-primary">
                  Reach out to us directly through these channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Visit Us</h4>
                    <p className="text-sm text-primary leading-relaxed">
                      123 News Avenue, Suite 400
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary-foreground/10 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Call Us</h4>
                    <p className="text-sm text-primary">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-xs text-primary mt-1">
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary-foreground/10 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Us</h4>
                    <p className="text-sm text-primary">
                      contact@newslyusa.com
                    </p>
                  </div>
                </div>
              </CardContent>
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
