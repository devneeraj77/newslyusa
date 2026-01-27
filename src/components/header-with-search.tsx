"use client";

import React from "react";
import { Grid2x2Plus, Menu, Newspaper, Search, Sparkle, LucideIcon, Cpu, BriefcaseBusiness, Speech, HeartPlus, TicketsPlane, Sparkles, Settings, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
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
import { SearchModal } from "@/components/search-modal";
import { ModeToggle } from "./darkModebtn";
import { IconMovie, IconRun } from "@tabler/icons-react";
import Link from "next/link";


export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const links = [
    { label: "News", href: "/news", icon: Newspaper },
    { label: "US", href: "/us", icon: Sparkles }, // Example icon
    { label: "Politics", href: "/politics", icon: Speech }, // Example icon
    // { label: "Business", href: "/business", icon: BriefcaseBusiness }, // Example icon
    { label: "Health", href: "/health", icon: HeartPlus }, // Example icon
    { label: "Travel", href: "/travel", icon: TicketsPlane }, // Example icon
    { label: "Sports", href: "/sports", icon: IconRun }, // Example icon
    { label: "Tech & Media", href: "/tech-and-media", icon: Cpu }, // Example icon
    { label: "Entertainment", href: "/entertainment", icon: IconMovie }, // Example icon
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-transform duration-300 backdrop-blur-lg",
        "bg-background/35 supports-[backdrop-filter]:bg-background/80",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <nav className="mx-auto flex h-16 w-full container  items-center justify-between px-3 sx:px-2 lg:p-0 ">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white transition-transform group-hover:scale-105">
               <Grid2x2Plus className="w-5 h-5" />
            </div>
            <span className="font-mono tracking-tight">NewslyUSA</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "hover:text-primary transition-colors",
                pathname.startsWith(link.href) ? "text-primary underline" : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <SearchModal>
              <Button
                variant="outline"
                className="relative size-9 bg-none cursor-pointer   p-0 xl:h-9 xl:w-63 xl:justify-between xl:px-3 xl:py-2"
              >
                <span className="hidden xl:inline-flex">Search...</span>
                <span className="sr-only">Search</span>
                <Search className="size-4" />
              </Button>
            </SearchModal>
           
           <div className="hidden lg:flex">
             <ModeToggle />
           </div>

           {/* Mobile Trigger */}
           <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden w-9 h-9"
            >
              <Menu className="size-5" />
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
                  <Link
                    key={link.label}
                    className={buttonVariants({
                      variant: "link",
                      className: cn("justify-start gap-2", pathname.startsWith(link.href) && " underline"),
                    })}
                    href={link.href}
                  >
                    {link.label}{" "}
                    <link.icon size={20} />
                   </Link>
                ))}
              </div>
              <SheetFooter>
                <Button variant="ghost">Sign In</Button>
                <Button>Get Started</Button>
                <div className="flex w-full items-center justify-between pt-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ModeToggle  />
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
