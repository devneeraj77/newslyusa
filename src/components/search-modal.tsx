"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { LucideIcon, SearchIcon, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon?: LucideIcon;
  shortcut?: string;
};

type SearchModalProps = {
  children: React.ReactNode;
};

export function SearchModal({ children }: SearchModalProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<CommandItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const url = query
          ? `/api/news?search=${encodeURIComponent(query)}`
          : `/api/news?limit=5`;

        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          const items: CommandItem[] = data.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            description:
              item.description || item.content?.substring(0, 50) + "...",
            category: item.categories?.[0]?.name || "News",
          }));
          setResults(items);
        }
      } catch (error) {
        console.error("Failed to search news", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="p-1 rounded-lg">
        <ModalTitle className="sr-only">Search</ModalTitle>
        <Command
          className="bg-background md:bg-card rounded-md "
          shouldFilter={false}
        >
          <CommandInput
            className={cn(
              "placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder="Search news..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[380px] min-h-[380px] px-2 md:px-0">
            <CommandEmpty className="flex min-h-[280px] flex-col items-center justify-center">
              <SearchIcon className="text-muted-foreground mb-2 size-6" />
              <p className="text-muted-foreground mb-1 text-xs">
                {loading
                  ? "Searching..."
                  : query
                    ? `No results found for "${query}"`
                    : "No news found"}
              </p>
            </CommandEmpty>
            <CommandGroup heading={query ? "Results" : "Latest News"}>
              {results.map((item) => {
                return (
                  <CommandItem
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3"
                    value={item.title}
                    onSelect={() => {
                      window.location.href = `/news/${item.slug}`; // Or use router.push
                      setOpen(false);
                    }}
                  >
                    {item.icon ? <item.icon className="size-5" /> : ""}
                    <div className="flex flex-col px-2">
                      <p className="max-w-[250px] truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-muted-foreground text-xs line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-muted-foreground ml-auto text-xs px-2">
                      {item.category}
                    </p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </ModalContent>
    </Modal>
  );
}
