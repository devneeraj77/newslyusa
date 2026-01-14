"use client";

import Image from "next/image";
import {
  MapPinIcon,
  StarIcon,
  Linkedin,
  Twitter,
  Mail,
  ShieldCheck,
  Zap,
  Flag,
} from "lucide-react";
import { ProfileCard } from "@/components/ui/profile-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DotGrid from "@/components/DotGrid";

export default function About() {
  return (
    <main className="min-h-screen text-foreground">
      {/* Header Banner */}
      <section className="relative w-full min-h-80 flex items-center justify-center overflow-hidden mb-12">
        {/* <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
            alt="Newsroom Background"
            fill
            className="object-cover brightness-[0.25]"
            priority
          />
        </div> */}
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
            About NewslyUSA
          </h1>
          <p className="text-lg md:text-xl  max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Empowering the nation with unbiased, real-time journalism. We bring
            clarity to the chaos of modern news.
          </p>
        </div>
      </section>
      {/* Content */}
      <section className="container font-mono mx-auto space-y-12">
        {/* Trusted Source */}
        <div className="bg-card  l p-6 ">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            Trusted Source for Us News
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Amet tristique nisl augue
            metus et vulputate integer. Vivamus tortor rhoncus vitae justo massa
            vitae dui diam. Eget mattis vulputate tortor et lorem arcu sagittis.
            Sed pellentesque dignissim nulla id at.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-card l p-6 ">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            Our Mission
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Amet tristique nisl augue
            metus et vulputate integer. Vivamus tortor rhoncus vitae justo massa
            vitae dui diam. Eget mattis vulputate tortor et lorem arcu sagittis.
          </p>
        </section>

        {/* Team */}
        <section>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "John Lee",
                handle: "@johnlee",
                role: "Senior Reporter",
                imgId: 11,
              },
              {
                name: "Sarah Smith",
                handle: "@sarahsmith",
                role: "Editor in Chief",
                imgId: 5,
              },
              {
                name: "Michael Chen",
                handle: "@michaelchen",
                role: "Lead Photographer",
                imgId: 3,
              },
              {
                name: "Emma Wilson",
                handle: "@emmawilson",
                role: "Political Analyst",
                imgId: 9,
              },
            ].map((profile, i) => (
              <ProfileCard
                key={i}
                name={profile.name}
                handle={profile.handle}
                time={profile.role}
                imageUrl={`https://i.pravatar.cc/300?img=${profile.imgId}`}
              />
            ))}
          </div>
        </section>

        {/* Why Choose */}
        <section className="mb-8">
          <div className="flex flex-col items-center text-center mb-10">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Why Choose NewslyUSA?
            </h3>
            <p className="text-lg text-muted-foreground max-w-[800px]">
              We are dedicated to delivering accurate, timely, and comprehensive
              coverage of the stories that matter most to you.
            </p>
          </div>
          <div className="grid p-4 grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Unbiased Reporting",
                icon: ShieldCheck,
                description:
                  "We are committed to objective journalism, presenting multiple viewpoints to help you form your own informed opinions.",
              },
              {
                title: "Real Time Updates",
                icon: Zap,
                description:
                  "Stay ahead of the curve with our breaking news alerts and live coverage of developing stories across the nation.",
              },
              {
                title: "Nationwide Coverage",
                icon: Flag,
                description:
                  "From local communities to the halls of Congress, our extensive network ensures you never miss a beat of American life.",
              },
            ].map((item) => (
              <Card
                key={item.title}
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
      </section>
    </main>
  );
}
