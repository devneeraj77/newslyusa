import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import {
  Grid2x2PlusIcon,
  MenuIcon,
  SearchIcon,
  Sparkle,
  PanelLeftIcon,
  User,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
// import { Sheet, SheetContent, SheetFooter } from "@/components/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconLayoutSidebarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { CommandItem, SearchModal } from "@/components/search-modal";
import { ModeToggle } from "../darkModebtn";

import {
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const { toggleSidebar } = useSidebar();

  const links = [
    {
      label: "Features",
      href: "#",
    },
    {
      label: "Pricing",
      href: "#",
    },
    {
      label: "About",
      href: "#",
    },
  ];

  return (
    <header
      className={cn(
        // TODO: replace this top-1/4 to top-0
        "top-0 sticky z-50 w-full  backdrop-blur-lg",
        "bg-background/95 border-b border-border/20 border-b supports-[backdrop-filter]:bg-background/80"
      )}
    >
      <nav className="mx-auto flex h-14 w-full   items-center justify-between  px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <IconLayoutSidebarFilled className="size-6" />
          </Button>
          <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
            {/* <Grid2x2PlusIcon className="size-6" /> */}
            <p className="font-mono text-sm  font-bold ">admin/NewslyUSA</p>
          </div>
        </div>
        <div className="flex items-center">
          {/* <ModeToggle /> */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            width={200}
                            height={200}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuItem>
                      <LogOut className="mr-2 size-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
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
