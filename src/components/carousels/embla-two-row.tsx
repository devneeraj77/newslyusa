"use client"

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Dot } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Sub-components for Arrows and Dots to keep it clean
import { 
  PrevButton, 
  NextButton, 
  usePrevNextButtons 
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButtons'

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  category: string;
  timestamp: string;
}

type PropType = {
  slides: NewsItem[]
  options?: EmblaOptionsType
}

const EmblaTwoRow: React.FC<PropType> = (props) => {
  const { slides, options } = props

  // Group slides into pairs
  const groupedSlides = React.useMemo(() => {
    const chunks = []
    for (let i = 0; i < slides.length; i += 2) {
      chunks.push(slides.slice(i, i + 2))
    }
    return chunks
  }, [slides])

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    slidesToScroll: 1, 
    containScroll: 'trimSnaps', 
    ...options 
  })

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="w-full p-3">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 ">
          {groupedSlides.map((group, index) => (
            <div 
              className="flex-[0_0_100%] min-w-0 pl-4" 
              key={index}
            >
              <div className="grid grid-cols-2 gap-4">
                {group.map((item) => (
                  <div 
                    key={item.id} 
                    className="aspect-[4/3] bg-card relative overflow-hidden flex flex-col justify-end text-foreground transition-all duration-300 hover:border-primary/50 group"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 flex flex-col justify-end">
                      <div className="flex items-center text-xs text-zinc-300 mb-2">
                          <span className="text-muted font-medium">{item.category}</span>
                          <Dot size={16} />
                          <span>{item.timestamp}</span>
                      </div>
                      <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight">
                          {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: Flexbox setup to match left/right layout */}
      <div className="flex items-center justify-between mt-8 px-2">
        
        {/* Navigation Arrows on the Left */}
        <div className="flex gap-3">
          <button
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-accent transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-accent transition-colors"
          >
            <ChevronRight size={24} />
          </button>
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
                  : "bg-transparent border-primary/40 hover:border-primary"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaTwoRow