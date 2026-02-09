"use client";

import React from "react";
import { Grid2x2Plus, Menu, Newspaper, Search, Sparkle, LucideIcon, Cpu, BriefcaseBusiness, Speech, HeartPlus, TicketsPlane, Sparkles, Settings, Bell, User, Info, Phone, ChevronDown, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search-modal";
import { ModeToggle } from "./darkModebtn";
import { IconMovie, IconRun } from "@tabler/icons-react";
import Link from "next/link";


export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header if scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const links = [
    { label: "News", href: "/news", icon: Newspaper },
    { label: "US", href: "/us", icon: Sparkles },
    { label: "Politics", href: "/politics", icon: Speech },
    { label: "Health", href: "/health", icon: HeartPlus },
    { label: "Travel", href: "/travel", icon: TicketsPlane },
    { label: "Sports", href: "/sports", icon: IconRun },
    { label: "Tech & Media", href: "/tech-and-media", icon: Cpu },
    { label: "Entertainment", href: "/entertainment", icon: IconMovie },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between  px-2 md:px-1">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="w-8 h-8 bg-primary  flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105 shadow-sm">
               <Grid2x2Plus className="w-5 h-5" />
            </div>
            <span className="font-mono tracking-tight hidden sm:inline-block">NewslyUSA</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith(link.href) 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <SearchModal>
              <Button
                variant="outline"
                className="relative rounded-none h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 hover:text-muted-foreground"
              >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search news...</span>
                {/* <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-shade/10 px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                  <span className="text-xs">⌘</span>K
                </kbd> */}
              </Button>
            </SearchModal>
           
           <div className="hidden md:flex">
             <ModeToggle />
           </div>

           {/* Mobile Trigger */}
           <Sheet open={open} onOpenChange={setOpen}>
             <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="lg:hidden border rounded-none h-9 w-9 p-0"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
             </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
              <SheetHeader className="px-1 text-left">
                <SheetTitle asChild>
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl" onClick={() => setOpen(false)}>
                        <div className="w-8 h-8 bg-primary  flex items-center justify-center text-primary-foreground">
                        <Grid2x2Plus className="w-5 h-5" />
                        </div>
                        <span className="font-mono tracking-tight">NewslyUSA</span>
                    </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile navigation menu
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4 h-full">
                 <div className="flex flex-col gap-1 px-1">
                    <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith("/about") ? "bg-accent/10 text-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <Info className="h-4 w-4" />
                        About
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith("/contact") ? "bg-accent/10 text-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <Phone className="h-4 w-4" />
                        Contact
                    </Link>

                    <div className="px-3 py-2.5 text-sm font-medium text-muted-foreground">
                        <button 
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex items-center justify-between w-full hover:text-foreground transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <Layers className="h-4 w-4" />
                                Categories
                            </span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoriesOpen && "rotate-180")} />
                        </button>
                    </div>

                    {isCategoriesOpen && (
                        <div className="flex flex-col gap-1 px-1 pl-4 border-l ml-6 my-1">
                            {links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                                        pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                 </div>
                 
                 <div className="mt-auto pb-8 px-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-3">
                        <span className="text-sm font-medium">Theme</span>
                        <ModeToggle />
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-1">
                        <Button variant="outline" className="w-full">Sign In</Button>
                        <Button className="w-full">Get Started</Button>
                    </div>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
