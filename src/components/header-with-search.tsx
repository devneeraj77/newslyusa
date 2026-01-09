import React from "react";
import { Grid2x2PlusIcon, MenuIcon, SearchIcon, Sparkle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommandItem, SearchModal } from "@/components/search-modal";
import { ModeToggle } from "./darkModebtn";
import Image from "next/image";

export function Header() {
  const [open, setOpen] = React.useState(false);

  const links = [
    {
      label: "News",
      href: "news",
    },
    {
      label: "Politics",
      href: "#",
    },
    {
      label: "Tech & Media",
      href: "#",
    },
    {
      label: "Business",
      href: "#",
    },
    {
      label: "Health",
      href: "#",
    },
    {
      label: "Sports",
      href: "#",
    },
    // {
    //   label: "Science",
    //   href: "#",
    // },
    // {
    //   label: "more",
    //   href: "#",
    // },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full my-2 backdrop-blur-lg",
        "bg-background/35 supports-[backdrop-filter]:bg-background/80"
      )}
    >
      <nav className="mx-auto flex h-14 w-full space-x-12  max-w-7xl items-center md:justify-start justify-between px-4">
        <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
          <Grid2x2PlusIcon className="size-6" />
          <p className="font-mono text-lg font-bold">NewslyUSA</p>
        </div>
        <div className="flex md:w-full items-center justify-between gap-2">
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.label}
                className={buttonVariants({ variant: "link" })}
                href={link.href}
              >
                {link.label}{" "}
                {/* {link.icon && (
                  <Image src={link.icon} width={20} height={20} alt="user" />
                )} */}

              </a>
            ))}
            {/* <Button variant="outline">Sign In</Button>
					<Button>Get Started</Button> */}
          </div>
          <div className="hidden items-center  gap-1 lg:flex">
            <SearchModal data={blogs}>
              <Button
                variant="outline"
                className="relative size-9 cursor-pointer p-0 md:border xl:h-9 xl:w-60 xl:justify-between xl:px-3 xl:py-2"
              >
                <span className="hidden xl:inline-flex">Search...</span>
                <span className="sr-only">Search</span>
                <SearchIcon className="size-4" />
              </Button>
            </SearchModal>
            <ModeToggle />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden"
            >
              <MenuIcon className="size-4" />
            </Button>

            <SheetContent showClose={false} side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  A list of links to navigate the site.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-y-2 overflow-y-auto px-4 pb-5">
                {links.map((link) => (
                  <a
                    key={link.label}
                    className={buttonVariants({
                      variant: "link",
                      className: "justify-start text- gap-2",
                    })}
                    href={link.href}
                  >
                    {link.label}{" "}
                    <Sparkle size={10} className="ml-1 fill-background" />
                  </a>
                ))}
              </div>
              <SheetFooter>
                <Button variant="outline">Sign In</Button>
                <Button>Get Started</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

const blogs: CommandItem[] = [
  {
    id: "blog-1",
    title: "The Future of Web Dev",
    description: "A quick look at upcoming web technologies.",
    category: "Web Dev",
  },
  {
    id: "blog-2",
    title: "Minimalist Design Tips",
    description: "Learn how less can often be more in UI design.",
    category: "Design",
  },
  {
    id: "blog-3",
    title: "Boosting Page Speed",
    description: "Simple tricks to make your site load faster.",
    category: "Performance",
  },
  {
    id: "blog-4",
    title: "Intro to TypeScript",
    description: "Why TypeScript makes JavaScript safer and clearer.",
    category: "Programming",
  },
  {
    id: "blog-5",
    title: "Dark Mode Design",
    description: "Best practices for building a dark theme UI.",
    category: "Design",
  },
  {
    id: "blog-6",
    title: "Understanding APIs",
    description: "Breaking down REST and GraphQL for beginners.",
    category: "Backend",
  },
  {
    id: "blog-7",
    title: "CSS Grid Basics",
    description: "A quick guide to building layouts with CSS Grid.",
    category: "Frontend",
  },
  {
    id: "blog-8",
    title: "React State Management",
    description: "Exploring useState, Redux, and other options.",
    category: "Frontend",
  },
  {
    id: "blog-9",
    title: "SEO in 2025",
    description: "Trends and tips to rank higher on Google.",
    category: "SEO",
  },
  {
    id: "blog-10",
    title: "Debugging Like a Pro",
    description: "Tools and techniques to fix bugs faster.",
    category: "Programming",
  },
];
