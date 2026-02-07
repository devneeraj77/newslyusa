"use client";

import Image from "next/image";
import Link from "next/link";
import { Dot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateForArticle, formatDateToMDY } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface TagItem {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  category: string;
  categorySlug?: string;
  timestamp: string;
  slug: string;
  content: string;
  categories: CategoryItem[];
  tags?: TagItem[];
  createdAt: string;
}

export const FALLBACK_HIGHLIGHTS: NewsItem[] = [
  {
    id: "highlight-fallback-1",
    title: "SpaceX Successfully Launches Starship on Historic Mission to Mars",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Space",
    categorySlug: "space",
    timestamp: "2 hours ago",
    slug: "spacex-starship-mars-mission",
    content: "SpaceX has successfully launched its Starship rocket...",
    categories: [{ id: "c1", name: "Space", slug: "space" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-2",
    title: "Global Climate Summit Reaches Landmark Agreement on Carbon Emissions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Environment",
    categorySlug: "environment",
    timestamp: "4 hours ago",
    slug: "global-climate-summit-agreement",
    content: "World leaders have agreed to a new aggressive timeline...",
    categories: [{ id: "c2", name: "Environment", slug: "environment" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-3",
    title: "New Battery Technology Promises Week-Long Charge for Smartphones",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Tech",
    categorySlug: "tech",
    timestamp: "6 hours ago",
    slug: "new-battery-technology",
    content: "Researchers have unveiled a new battery technology...",
    categories: [{ id: "c3", name: "Tech", slug: "tech" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-4",
    title: "Olympic Committee Adds Esports as Official Medal Event for 2028",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sports",
    categorySlug: "sports",
    timestamp: "8 hours ago",
    slug: "olympics-esports-2028",
    content: "The IOC has officially included Esports in the 2028 games...",
    categories: [{ id: "c4", name: "Sports", slug: "sports" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-5",
    title: "Breakthrough in Alzheimer's Research Offers Hope for Millions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Health",
    categorySlug: "health",
    timestamp: "12 hours ago",
    slug: "alzheimers-research-breakthrough",
    content: "Scientists have discovered a new mechanism...",
    categories: [{ id: "c5", name: "Health", slug: "health" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-6",
    title: "Artificial Intelligence Solves 50-Year-Old Biology Problem",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Science",
    categorySlug: "science",
    timestamp: "14 hours ago",
    slug: "ai-solves-biology-problem",
    content: "DeepMind's AlphaFold has predicted protein structures...",
    categories: [{ id: "c6", name: "Science", slug: "science" }],
    createdAt: new Date().toISOString(),
  },
];

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
      return `${Math.max(0, diffInHours)}H AGO`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}D AGO`;
}


interface NewsHighlightCardProps {
  news: NewsItem;
}

const NewsHighlightCard: React.FC<NewsHighlightCardProps> = ({ news }) => {
  const timeAgo = news.createdAt ? formatDateToMDY(news.createdAt) : news.timestamp;

  return (
    <Link
      href={`/${news.categorySlug || news.category || "news"}/${news.slug}`}
      className="group flex gap-4 p-3 w-full hover:bg-muted/50 -xl transition-all duration-300 cursor-pointer border border-transparent hover:border-border/40"
    >
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <h4 className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors font-sans tracking-tight">
          {news.title}
        </h4>
        <div className="flex items-center mt-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          <span className="text-muted-foreground/70">
            {news.category}
          </span>
          <Dot className="text-muted-foreground/40" size={20} />
          <span className="text-muted-foreground/70">{timeAgo}</span>
        </div>
      </div>
      <div className="relative h-20 w-28 shrink-0 overflow-hidden -lg bg-muted shadow-sm ring-1 ring-border/10">
        <Image
          src={news.image}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 112px, 112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
};

export const NewsHighlightCardSkeleton = () => {
  return (
    <div className="flex gap-4 p-3 animate-pulse min-h-[6.5rem]">
      <div className="flex-1 space-y-2.5 py-1">
        <Skeleton className="h-4 w-full bg-muted-foreground/10 " />
        <Skeleton className="h-4 w-5/6 bg-muted-foreground/10 " />
        <div className="flex gap-2 items-center mt-3">
           <Skeleton className="h-3 w-16 bg-muted-foreground/10 " />
           <Skeleton className="h-3 w-12 bg-muted-foreground/10 " />
        </div>
      </div>
      <Skeleton className="h-20 w-28 bg-muted-foreground/10 -lg shrink-0" />
    </div>
  );
};

export default NewsHighlightCard;