import React, { useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import { useAutoplay } from './EmblaCarouselAutoPlay'
import { useAutoplayProgress } from './EmblCarouselAutoPlayProgress'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const progressNode = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi)

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom -ml-4">
          {slides.map((index) => (
            <div className="flex-[0_0_80%] min-w-0 pl-4" key={index}>
              <div className="shadow-[inset_0_0_0_0.2rem_var(--border)] rounded-[1.8rem] text-[4rem] font-semibold flex items-center justify-center h-[19rem] select-none dark:text-white">
                <span>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] gap-5 mt-7">
        <div className="grid grid-cols-2 gap-2.5 items-center">
          <PrevButton
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>

        <div
          className={`rounded-[1.8rem] bg-secondary relative h-[0.6rem] overflow-hidden justify-self-center self-center w-52 max-w-full ${
            showAutoplayProgress ? '' : 'opacity-0 transition-opacity duration-300 ease-in-out'
          }`}
        >
          <div
            className="bg-primary absolute w-full top-0 bottom-0 -left-full"
            style={{
              animationName: 'embla-progress',
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
            ref={progressNode}
          />
        </div>

        <button
          className="rounded-full bg-transparent border-zinc-700 hover:bg-zinc-800 text-accent px-8 border hover:text-white"
          onClick={toggleAutoplay}
          type="button"
        >
          {autoplayIsPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default EmblaCarousel