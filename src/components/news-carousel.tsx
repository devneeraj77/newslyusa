"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const newsItems = [
  {
    category: "Blockchain News",
    time: "4 hours ago",
    title:
      "Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge",
  },
  {
    category: "Blockchain News",
    time: "4 hours ago",
    title:
      "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Are Red Hot",
  },
  {
    category: "Blockchain News",
    time: "4 hours ago",
    title:
      "STX Price Prediction: After 126% Price Jump in December, What’s in Store?",
  },
  {
    category: "Blockchain News",
    time: "6 hours ago",
    title: "Bitcoin Whales Accumulate as Market Sentiment Turns Bullish",
  },
];

export default function NewsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    let animationFrameId: number;
    let startTime = 0;
    const autoplay = api.plugins().autoplay;
    if (!autoplay) return;

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / 3500) * 100, 100);
      setProgress(newProgress);

      if (elapsed < 3500) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      startTime = 0;
      setProgress(0);
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    api.on("select", onSelect);
    autoplay.play();
    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      api.off("select", onSelect);
      cancelAnimationFrame(animationFrameId);
    };
  }, [api]);

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
        className="w-full"
      >
        <CarouselContent>
          {newsItems.map((item, index) => (
            <CarouselItem
              key={index}
              className="
                basis-full
                sm:basis-1/2
                lg:basis-1/3
              "
            >
              <div className="w-10 mx-4 h-1 bg-muted rounded">
                <div
                  className="h-1 bg-primary rounded"
                  style={{
                    width: `${
                      index === current ? progress : index < current ? 100 : 0
                    }%`,
                  }}
                />
              </div>
              {/* CARD */}
              <article className="h-full px-4 pt-4 relative">
                {/* Meta row */}
                <div className="mb-1 text-xs text-muted-foreground">
                  {item.category} · {item.time}
                </div>

                {/* Headline */}
                <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-foreground pb-4">
                  {item.title}
                </h3>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
