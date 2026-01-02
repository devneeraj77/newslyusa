"use client";

import NewsCarousel from "@/components/news-carousel";
import SplitText from "@/components/SplitText";
import { ChevronDownCircle, ChevronRight, Dot, MoveRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const handleAnimationComplete = () => {
    // Animation complete callback
    console.log("Animation complete!");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen  w-full  flex-col items-center justify-between py-4 lg:px-16 bg-white dark:bg-black sm:items-start">
        <section className="lg:flex block w-full min-h-screen mx-auto max-w-full">
          {/* latest news  */}
          <div className="basis-3/1 py-12">
            <p className="pl-2 p-1 m-3 border-l-2 border-border w-fit bg-linear-to-r/decreasing from-background/35 to-transperant">
              Best of the week
            </p>
            <div className="m-1 my-14">
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
                  className=" p-2 my-4 px-3  bg-secondary/20 rounded-full text-center"
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
          <div className="basis-2/2 rounded-4xl my-4">
            <div className="flex justify-between px-3 text-sm space-y-2 ">
              <span>Recommended</span>
              <span className="flex ">
                View all <ChevronRight className="text-primary" size={20} />
              </span>
            </div>
            <div className="flex md:flex-col">
              <div className="flex justify-center m-2 md:m-0">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  height={300}
                  width={600}
                  className="rounded-4xl p-2"
                  alt="you"
                />
              </div>
              <div className=" p-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b h-24 flex justify-between">
                    <div>
                      <div className="text-xs text-primary flex justify-start items-center px-2">
                        <span>Politics</span>
                        <Dot className="text-secondary" size={24} />
                        <span>3 hours ago</span>
                      </div>
                      <h4 className="text-sm sm:text-md  text-priamry  px-2">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit nam eius doloribus?
                      </h4>
                    </div>
                    <Image
                      src={
                        "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      height={60}
                      width={100}
                      className="rounded-xl p-2"
                      alt="you"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
