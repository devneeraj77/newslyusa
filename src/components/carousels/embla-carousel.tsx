"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmblaCarouselAutoplayProps {
  slides: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  autoplayDelay?: number;
  loop?: boolean;
}

export default function EmblaCarouselAutoplay({
  slides,
  className,
  itemClassName,
  autoplayDelay = 4000,
  loop = true,
}: EmblaCarouselAutoplayProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const rafId = React.useRef(0);

  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false }),
  );

  const onAutoplayButtonClick = React.useCallback(
    (callback: () => void) => {
      const autoplay = api?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [api],
  );

  React.useEffect(() => {
    const autoplay = api?.plugins()?.autoplay;
    if (!autoplay) return;

    const animate = () => {
      if (!progressBarRef.current) return;
      const timeUntilNext = autoplay.timeUntilNext();

      if (timeUntilNext === null) return;

      const progress = 1 - timeUntilNext / autoplayDelay;
      progressBarRef.current.style.width = `${progress * 100}%`;

      if (autoplay.isPlaying()) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    api
      .on("autoplay:timerset", () => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(animate);
      })
      .on("autoplay:timerstopped", () => {
        cancelAnimationFrame(rafId.current);
        if (progressBarRef.current) progressBarRef.current.style.width = "0%";
      })
      .on("select", () => {
        // Reset progress on manual slide change if needed, though timerset handles next cycle
        if (progressBarRef.current) progressBarRef.current.style.width = "0%";
      });

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [api, autoplayDelay]);

  const toggleAutoplay = () => {
    const autoplay = plugin.current;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={cn("w-full text-accent flex flex-col gap-6", className)}>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop,
          align: "center", // Matches the "peek" effect in your image
        }}
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4",
                itemClassName,
              )}
            >
              <div className="h-full w-full">{slide}</div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Controls Bar */}
        <div className="flex items-center justify-between mt-4 mb-8  px-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full text-primary hover:bg-primary active:bg-primary/90 active:text-primary-foreground hover:text-primary-foreground"
              onClick={() => onAutoplayButtonClick(() => api?.scrollPrev())}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full text-primary hover:bg-primary active:bg-primary/90 active:text-primary-foreground hover:text-primary-foreground"
              onClick={() => onAutoplayButtonClick(() => api?.scrollNext())}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div
            className={cn(
              "flex-1 max-w-[150px] mx-8 h-[2px] bg-muted-foreground/10 rounded-full overflow-hidden transition-opacity duration-300",
              isPlaying ? "opacity-100" : "opacity-0",
            )}
          >
            <div
              ref={progressBarRef}
              className="h-full bg-primary"
              style={{ width: "0%" }}
            />
          </div>
          <Button
            variant="ghost"
            className="rounded-full rounded-full bg-transparent  aactive:focus:bg-shade  bg-accent text-accent-foreground hover:bg-shade active:bg-shade active:text-accent-foreground px-8"
            onClick={toggleAutoplay}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>
      </Carousel>
    </div>
  );
}
