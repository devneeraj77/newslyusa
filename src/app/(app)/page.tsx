"use client";


import NewsCarousel from "@/components/news-carousel";
import EmblaCarouselAutoplay from "@/components/carousels/embla-carousel";
import SplitText from "@/components/SplitText";
import { ChevronDownCircle, ChevronRight, Dot, MoveRight } from "lucide-react";
import Image from "next/image";
import EmblaCarousel from "@/components/carousels/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  const handleAnimationComplete = () => {
    // Animation complete callback
    console.log("Animation complete!");
  };

  return (
    <main className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="flex min-h-screen  w-full  flex-col items-center justify-between py-4 lg:px-6 bg-white dark:bg-black sm:items-start">
        <div className="xl:flex block w-full min-h-screen mx-auto max-w-7xl">
          {/* latest news  */}
          <div className="basis-3/4 py-8 md:py-12">
            <p className="pl-2 p-1 m-3 border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
              Best of the week
            </p>
            <div className="m-1 my-4">
              <div className="flex text-sm items-center p-2 ">
                <span className="text-primary">General News</span>{" "}
                <Dot className="text-secondary" size={24} />
                <span className="text-muted">2 hours ago</span>
              </div>
              <h1 className="p-2 text-4xl max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio,
                vel.
              </h1>
              <div className="flex p-2 gap-2 text-secondary">
                <p>#bitcoin </p>
                <p>#cryptonews</p>
              </div>
              <a href="/">
                <SplitText
                  text="Read Article!"
                  className=" p-2 my-4 px-3 bg-secondary/20 rounded-full text-center"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
              </a>
            </div>
            <NewsCarousel />
          </div>
          {/* headlines news */}
          <div className="basis-1/4 lg:basis-1/3 rounded-4xl mx-4 my-4">
            <div className="flex justify-between px-3 text-sm space-y-2 ">
              <span>Recommended</span>
              <span className="flex ">
                View all <ChevronRight className="text-primary" size={20} />
              </span>
            </div>
            <div className="sm:flex xl:block rounded-2xl shadow-accent/30 shadow bg-secondary/20">
              <div className="flex justify-center ">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  height={100}
                  width={400}
                  className="rounded-4xl p-2"
                  alt="you"
                />
              </div>
              <div className=" md:p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="m-2  py-2 flex justify-between sm:">
                    <div>
                      <div className="text-xs text-accent flex justify-start items-center px-2">
                        <span className="">Politics</span>
                        <Dot className="text-secondary" size={24} />
                        <span>3 hours ago</span>
                      </div>
                      <h4 className="text-sm sm:text-md  text-priamry font-semibold px-2">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Sit nam eius doloribus?
                      </h4>
                    </div>
                    <Image
                      src={
                        "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      height={60}
                      width={100}
                      className="rounded-3xl p-2"
                      alt="you"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border">
        <div className=" flex flex-col gap-4 lg:flex-row min-h-screen mx-auto max-w-7xl flex-col items-center justify-between  bg-white dark:bg-black sm:items-start">
          <div className="w-full lg:w-2/3 p-4 ">
             <EmblaCarouselAutoplay
              slides={[
                <div
                  key="1"
                  className="h-80 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center border border-red-200 dark:border-red-800"
                >
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">
                    Featured Story 1
                  </h3>
                </div>,
                <div
                  key="2"
                  className="h-80 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    Breaking News 2
                  </h3>
                </div>,
                <div
                  key="3"
                  className="h-80 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center border border-green-200 dark:border-green-800"
                >
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                    Update 3
                  </h3>
                </div>,
              ]}
            />

            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>
          
        </div>
      </section>
    </main>
  );
}
