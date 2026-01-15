"use client";

import Image from "next/image";
import Link from "next/link";
import { Dot } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  category: string;
  timestamp: string;
  slug: string;
  content: string;
  categories: CategoryItem[];
  createdAt: string;
}

export const FALLBACK_HIGHLIGHTS: NewsItem[] = [
  {
    id: "highlight-fallback-1",
    title: "SpaceX Successfully Launches Starship on Historic Mission to Mars",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Space",
    timestamp: "2 hours ago",
    slug: "spacex-starship-mars-mission",
    content: "SpaceX has successfully launched its Starship rocket...",
    categories: [{ id: "c1", name: "Space" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-2",
    title: "Global Climate Summit Reaches Landmark Agreement on Carbon Emissions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Environment",
    timestamp: "4 hours ago",
    slug: "global-climate-summit-agreement",
    content: "World leaders have agreed to a new aggressive timeline...",
    categories: [{ id: "c2", name: "Environment" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-3",
    title: "New Battery Technology Promises Week-Long Charge for Smartphones",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Tech",
    timestamp: "6 hours ago",
    slug: "new-battery-technology",
    content: "Researchers have unveiled a new battery technology...",
    categories: [{ id: "c3", name: "Tech" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-4",
    title: "Olympic Committee Adds Esports as Official Medal Event for 2028",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sports",
    timestamp: "8 hours ago",
    slug: "olympics-esports-2028",
    content: "The IOC has officially included Esports in the 2028 games...",
    categories: [{ id: "c4", name: "Sports" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-5",
    title: "Breakthrough in Alzheimer's Research Offers Hope for Millions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Health",
    timestamp: "12 hours ago",
    slug: "alzheimers-research-breakthrough",
    content: "Scientists have discovered a new mechanism...",
    categories: [{ id: "c5", name: "Health" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-6",
    title: "Breakthrough in Alzheimer's Research Offers Hope for Millions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Health",
    timestamp: "12 hours ago",
    slug: "alzheimers-research-breakthrough",
    content: "Scientists have discovered a new mechanism...",
    categories: [{ id: "c6", name: "Health" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "highlight-fallback-7",
    title: "Breakthrough in Alzheimer's Research Offers Hope for Millions",
    image:
      "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Health",
    timestamp: "12 hours ago",
    slug: "alzheimers-research-breakthrough",
    content: "Scientists have discovered a new mechanism...",
    categories: [{ id: "7", name: "Health" }],
    createdAt: new Date().toISOString(),
  },
];

interface NewsHighlightCardProps {
  news: NewsItem;
}

const NewsHighlightCard: React.FC<NewsHighlightCardProps> = ({ news }) => {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex gap-4 p-3 hover:bg-muted/50 transition-colors cursor-pointer "
    >
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h4>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="font-semibold text-primary/80">
            {news.category}
          </span>
          <Dot className="text-gray-400" size={16} />
          <span>{news.timestamp}</span>
        </div>
      </div>
      <div className="relative h-16 w-24 shrink-0 overflow-hidden  bg-muted">
        <Image
          src={news.image}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 96px, 96px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </Link>
  );
};

export default NewsHighlightCard;