"use client";

import EmblaCarouselAutoplay from "@/components/carousels/embla-carousel";
import { ChevronDownCircle, ChevronRight, Dot, MoveRight } from "lucide-react";
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import NewsHeadlines from "@/components/carousels/news-carousel";
import EmblaTwoRow from "@/components/carousels/embla-two-row";

const OPTIONS: EmblaOptionsType = { loop: true };

const MOCK_NEWS_DATA = [
  {
    id: "1",
    title: "Global Markets Rally as Tech Stocks Hit New Highs",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1445&auto=format&fit=crop",
    category: "Finance",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Breakthrough in Renewable Energy Storage Announced",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1470&auto=format&fit=crop",
    category: "Technology",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    title: "New Art Exhibition Opens in Downtown Gallery",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1445&auto=format&fit=crop",
    category: "Culture",
    timestamp: "5 hours ago",
  },
  {
    id: "4",
    title: "Local Sports Team Secures Championship Title",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop",
    category: "Sports",
    timestamp: "6 hours ago",
  },
  {
    id: "5",
    title: "The Future of AI: Trends to Watch in 2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    category: "Tech",
    timestamp: "1 hour ago",
  },
  {
    id: "6",
    title: "Sustainable Fashion: A Growing Trend",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1470&auto=format&fit=crop",
    category: "Lifestyle",
    timestamp: "3 hours ago",
  },
];

export default function Home() {
  const handleAnimationComplete = () => {
    // Animation complete callback
    console.log("Animation complete!");
  };

  return (
    <main className="items-center justify-center  ">
      <section className="container mx-auto  px-4 py-2">
        <div className=" grid grid-cols-1 xl:grid-cols-4  gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-4">
            <div className=" top-4 left-4 z-20">
          <span className="pl-2 p-1  my-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
            Best of the week
          </span>
        </div>
            {/* Featured Story */}
            <div className="relative group overflow-hidden  bg-muted shadow-sm">
              <div className="aspect-[16/10] md:aspect-[21/9] relative w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured News"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 text-white z-20">
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-200 mb-3">
                  <span className="font-semibold text-primary-foreground/90">
                    General News
                  </span>
                  <Dot className="text-gray-400" size={16} />
                  <span>2 hours ago</span>
                </div>

                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold font-mono leading-tight mb-4 max-w-4xl drop-shadow-md">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Optio, vel.
                </h1>

                <div className="flex gap-3">
                  {["#bitcoin", "#cryptonews"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs md:text-sm font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-md backdrop-blur-md border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub Headlines */}
            <div className="">
              <div className="flex items-center mb-6 pl-4 border-l-4 border-primary">
                <h2 className="text-2xl font-bold tracking-tight">Headlines</h2>
              </div>
              <NewsHeadlines />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-1 space-y-6">
            <div className="flex items-center justify-between mt-2 pb-6 border-b">
              <span className="font-bold text-lg">Highlights</span>
              <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1">
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-1 h-[80vh] overflow-y-scroll">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="group flex gap-4 p-3  transition-all cursor-pointer border border-transparent "
                >
                  <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                    <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem, laudantium.
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary/80">
                        Analysis
                      </span>
                      <span className="text-[10px] opacity-50">•</span>
                      <span>2h ago</span>
                    </div>
                  </div>
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden  bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                     
                      alt="Thumbnail"
                      fill
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Ad Placeholder or Extra Widget can go here */}
            {/* <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed text-muted-foreground text-sm">
              Advertisement / Widget
            </div> */}
          </div>
        </div>
      </section>
      <hr className="border m-4 md:mx-16 lg:mx-20  border-dashed" />
      <section className=" py-2  mx-auto container my-2">
        <div className="flex">
          <p className="pl-2 p-1 md:tex-xl lg:text-2xl m-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
            Editor's pick
          </p>
        </div>
        <div className=" flex flex-col gap-4 lg:flex-row  mx-auto flex-col items-center justify-between    sm:items-start">
          <div className="w-full">
            <EmblaCarouselAutoplay
              slides={[...Array(16)].map((_, i) => (
                <div key={i} className="m-2 py-2">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    height={100}
                    width={600}
                    loading="lazy"
                    className=" p-2"
                    alt="you"
                  />
                  <div>
                    <div className="text-xs text-accent flex justify-start items-center px-2">
                      <span className="">Politics</span>
                      <Dot className="text-secondary" size={24} />
                      <span>3 hours ago</span>
                    </div>
                    <h4 className="text-sm sm:text-md  text-priamry font-semibold px-2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Sit nam eius doloribus?
                    </h4>
                  </div>
                  <div className="text-sm pt-4 px-2 flex justify-between items-center ">
                    <a href="/">Read More</a>
                    <IconArrowNarrowRight />
                  </div>
                </div>
              ))}
            />

            {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
          </div>
        </div>
      </section>
      <hr className="border m-4 md:mx-16 lg:mx-20  border-dashed" />
      <section className=" py-2 mx-auto container my-2">
        <div className="flex">
          <p className="pl-2 p-1 md:tex-xl lg:text-2xl m-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
            Top Trending News
          </p>
        </div>
        <div className=" flex flex-col gap-4 lg:flex-row mx-auto flex-col items-center justify-between    sm:items-start">
          <div className="w-full">
            <EmblaCarouselAutoplay
              slides={[...Array(14)].map((_, i) => (
                <div key={i} className="m-2 py-2">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    height={100}
                    width={600}
                    loading="lazy"
                    className=" p-2"
                    alt="you"
                  />
                  <div>
                    <div className="text-xs text-accent flex justify-start items-center px-2">
                      <span className="">Politics</span>
                      <Dot className="text-secondary" size={24} />
                      <span>3 hours ago</span>
                    </div>
                    <h4 className="text-sm sm:text-md  text-priamry font-semibold px-2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Sit nam eius doloribus?
                    </h4>
                  </div>
                  <div className="text-sm pt-4 px-2 flex justify-between items-center ">
                    <a href="/">Read More</a>
                    <IconArrowNarrowRight />
                  </div>
                </div>
              ))}
            />
          </div>
        </div>
      </section>
      <section className="py-2 mx-auto container my-8">
        <div className="md:flex  gap-4">
          <div className="md:basis-1/2 ">
            <p className="pl-2 p-1 md:tex-xl lg:text-2xl m-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
              Health News
            </p>
            <EmblaTwoRow slides={MOCK_NEWS_DATA} options={OPTIONS} />
          </div>
          <div className="md:basis-1/2 ">
            <p className="pl-2 p-1 md:tex-xl lg:text-2xl m-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
              Sports News
            </p>

            <EmblaTwoRow slides={MOCK_NEWS_DATA} options={OPTIONS} />
          </div>
        </div>
      </section>
      <section className=" py-2 mx-auto container my-2">
        <div className="flex">
          <p className="pl-2 p-1 md:tex-xl lg:text-2xl m-3 block border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
            More News
          </p>
        </div>
        <div className=" flex flex-col gap-4 lg:flex-row mx-auto flex-col items-center justify-between     sm:items-start">
          <div className="w-full">
            <EmblaCarouselAutoplay
              slides={[...Array(14)].map((_, i) => (
                <div key={i} className="m-2 py-2">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    height={100}
                    width={600}
                    loading="lazy"
                    className=" p-2"
                    alt="you"
                  />
                  <div>
                    <div className="text-xs text-accent flex justify-start items-center px-2">
                      <span className="">Politics</span>
                      <Dot className="text-secondary" size={24} />
                      <span>3 hours ago</span>
                    </div>
                    <h4 className="text-sm sm:text-md  text-priamry font-semibold px-2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Sit nam eius doloribus?
                    </h4>
                  </div>
                  <div className="text-sm pt-4 px-2 flex justify-between items-center ">
                    <a href="/">Read More</a>
                    <IconArrowNarrowRight />
                  </div>
                </div>
              ))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
