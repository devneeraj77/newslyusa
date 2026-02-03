"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Sub-components for Arrows and Dots to keep it clean
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButtons";
import { Button } from "../ui/button";

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  category: string;
  timestamp: string;
  slug: string;
  categorySlug: string;
}

type PropType = {
  slides: NewsItem[];
  options?: EmblaOptionsType;
};

const EmblaTwoRow: React.FC<PropType> = (props) => {
  const { slides, options } = props;

  // Group slides into pairs
  const groupedSlides = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < slides.length; i += 2) {
      chunks.push(slides.slice(i, i + 2));
    }
    return chunks;
  }, [slides]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    ...options,
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="w-full p-2 ">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 ">
          {groupedSlides.map((group, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4" key={index}>
              <div className="grid grid-cols-2 gap-4">
                {group.map((item) => (
                  <Link
                    href={`/${item.categorySlug}/${item.slug}`}
                    key={item.id}
                    onDragStart={(e) => e.preventDefault()}
                    className="aspect-[5/3] bg-card relative overflow-hidden flex flex-col justify-end text-foreground transition-all duration-300 hover:border-primary/50 group select-none"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 flex flex-col justify-end">
                      <div className="flex items-center text-xs text-zinc-300 mb-2">
                        <span className="text-primar/70 font-medium">
                          {item.category}
                        </span>
                        <Dot size={16} />
                        <span>{item.timestamp}</span>
                      </div>
                      <h3 className="decoration-2 group-hover:underline text-white hover:text-primary-foreground underline-offset-2 mb-3 decoration-shade font-mono text-md font-bold line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: Flexbox setup to match left/right layout */}
      <div className="flex items-center justify-between px-2  mt-8">
        {/* Navigation Arrows on the Left */}
        <div className="flex  gap-3">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            className="hover:bg-primary active:bg-primary/90  active:text-primary-foreground hover:text-primary-foreground rounded-full justify-center flex items-center justify-center disabled:opacity-30  transition-colors"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            className="hover:bg-primary  active:bg-primary/90 active:text-primary-foreground hover:text-primary-foreground rounded-full justify-center flex items-center justify-center disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={44} />
          </Button>
        </div>

        {/* Pagination Dots on the Right */}
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "w-3 h-3 rounded-full border-2 border-primary transition-all duration-300",
                index === selectedIndex
                  ? "bg-primary w-6" // Elongated active dot for better UX
                  : "bg-transparent border-primary/40 hover:border-primary",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaTwoRow;
