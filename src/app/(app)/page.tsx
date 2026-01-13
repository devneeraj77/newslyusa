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
      <section className="flex   mx-auto container  w-full  flex-col items-center justify-between    sm:items-start">
        <div className="xl:flex block w-full mx-auto ">
          {/* latest news  */}
          <div className="basis-3/4  py-8  ">
            <p className="pl-2 p-1 m-3 border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
              Best of the week
            </p>
            <div className="m-3  my-4 relative ">
              <div className="">
                <div className="overflow-hidden  h-80 md:h-96 bg-center">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    height={300}
                    width={300}
                    alt="hllo"
                    priority
                    className="w-screen object-cover h-80  md:h-96 bg-cover "
                  />
                </div>
              </div>
              <div className="top-0 absolute p-2 md:p-6 flex-col flex flex-col justify-end h-full text-white">
                <div className="flex text-sm items-center px-2 ">
                  <span className="text-muted">General News</span>{" "}
                  <Dot className="text-secondary" size={24} />
                  <span className="text-muted">2 hours ago</span>
                </div>
                <h1 className="px-2 text-2xl font-mono md:text-4xl max-w-2xl">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Optio, vel.
                </h1>
                <div className="flex p-2 gap-2 text-secondary">
                  <p>#bitcoin </p>
                  <p>#cryptonews</p>
                </div>
              </div>
            </div>
            <div className=" pt-10">
              <h2 className="px-3 text-xl text-accent">Headlines</h2>
              {/* <p className="px-3 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et nisi libero obcaecati iure labore consectetur voluptates est, corporis veniam cumque illum, ab nemo cupiditate, possimus mollitia voluptatum saepe ducimus explicabo?</p> */}
              <NewsHeadlines  />
            </div>
          </div>

          {/* headlines news */}
          <div className="basis-1/4 lg:basis-1/3 mx-3 mdpy-8 lg:py-12">
            <div className="flex justify-between px-3 text-sm space-y-2 ">
              <span>Highlihgts</span>
              <span className="flex ">
                View all <ChevronRight className="text-primary" size={20} />
              </span>
            </div>
            <div className="sm:flex xl:block mx-1">
              {/* <div className="flex justify-center ">
                <div style={{ height: "auto", position: "relative" }}>
                  <Carousel
                    autoplay
                    autoplayDelay={4000}
                    pauseOnHover
                    loop
                  />
                </div>
              </div> */}
              <div className="flex flex-col gap-3 md:m-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-3 p-2  hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <h4 className="text-sm font-medium leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, laudantium.
                      </h4>
                      <div className="text-xs text-muted-foreground flex items-center mt-2 gap-1">
                        <span className="font-semibold text-accent">Lorem, ipsum.</span>
                        <span className="text-[10px]">•</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden ">
                      <Image
                        src={'https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt={'hello'}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 80px, 80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
        <hr  className="border px-6  border-dashed"/>      
      <section className=" py-4  mx-auto container mb-8">
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
      <hr  className="border px-6 border-dashed"/>
      <section className=" py-4 mx-auto container mb-8">
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
      <section className="py-4 mx-auto container my-8">
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
      <section className=" py-4 mx-auto container mb-8">
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
