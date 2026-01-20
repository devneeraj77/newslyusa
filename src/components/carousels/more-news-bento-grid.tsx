"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dot } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  image: string;
  category: string;
  timestamp: string;
  slug: string;
  content: string;
  description: string;
  categories: CategoryItem[];
  createdAt: string;
}

const FALLBACK_NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "Two dead after another construction crane collapses in Thailand",
    image: "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "USA",
    timestamp: "2 hrs ago",
    slug: "thailand-crane-collapse",
    content: "It comes one day after a crane accident in another part of the country killed 32 people.",
    description: "It comes one day after a crane accident in another part of the country killed 32 people.",
    categories: [{ id: "cat1", name: "USA" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Hand-stitched Indian ship arrives in Oman to rousing welcome",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1494",
    category: "USA",
    timestamp: "55 mins ago",
    slug: "indian-ship-oman",
    content: "The ship, which has no engine and moves under square sails, retraced the ancient route in 17 days.",
    description: "The ship, which has no engine and moves under square sails, retraced the ancient route in 17 days.",
    categories: [{ id: "cat2", name: "USA" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "US launches phase two of Gaza peace plan with new technocratic government",
    image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=1439",
    category: "World",
    timestamp: "11 hrs ago",
    slug: "gaza-peace-plan",
    content: "It includes the establishment of a technocratic Palestinian government and demilitarisation.",
    description: "It includes the establishment of a technocratic Palestinian government and demilitarisation.",
    categories: [{ id: "cat3", name: "World" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Labubu toy manufacturer exploited workers, labour group claims",
    image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?q=80&w=1470",
    category: "Business",
    timestamp: "2 hrs ago",
    slug: "labubu-labour-claims",
    content: "Investigators allege that a factory making Pop Mart products neglected staff safety.",
    description: "Investigators allege that a factory making Pop Mart products neglected staff safety.",
    categories: [{ id: "cat4", name: "Business" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Two Palestine Action hunger strikers end protest after 73 days",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471",
    category: "UK",
    timestamp: "6 hrs ago",
    slug: "hunger-strike-ends",
    content: "The BBC understands that one of the protesters was taken to hospital in poor condition.",
    description: "The BBC understands that one of the protesters was taken to hospital in poor condition.",
    categories: [{ id: "cat5", name: "UK" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Zelensky declares energy emergency as biting cold persists",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470",
    category: "Europe",
    timestamp: "4 hrs ago",
    slug: "zelensky-energy-emergency",
    content: "The move comes as US President Donald Trump said Ukraine is 'less ready'.",
    description: "The move comes as US President Donald Trump said Ukraine is 'less ready'.",
    categories: [{ id: "cat6", name: "Europe" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Italian influencer Chiara Ferragni cleared of cake fraud",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1374",
    category: "Europe",
    timestamp: "15 hrs ago",
    slug: "chiara-ferragni-cleared",
    content: "Chiara Ferragni had been accused of misleading consumers in her promotion of Christmas cakes.",
    description: "Chiara Ferragni had been accused of misleading consumers in her promotion of Christmas cakes.",
    categories: [{ id: "cat7", name: "Europe" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "SpaceX Starship reaches orbit for the first time",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=1470",
    category: "Tech",
    timestamp: "1 hr ago",
    slug: "spacex-starship-orbit",
    content: "The massive rocket achieved orbital velocity in a major milestone for the company.",
    description: "The massive rocket achieved orbital velocity in a major milestone for the company.",
    categories: [{ id: "cat8", name: "Tech" }],
    createdAt: new Date().toISOString(),
  }
];

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

const NewsGrid = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        
        let mappedData: NewsItem[] = [];
        if (data && Array.isArray(data) && data.length > 0) {
          mappedData = data.map((post: any) => ({
            ...post,
            image: post.image || "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?q=80&w=1470&auto=format&fit=crop", // Fallback image
            category: post.categories?.[0]?.name || "General",
            timestamp: new Date(post.createdAt).toLocaleDateString(),
            description: post.description || "",
          }));
        }

        // Ensure we have at least 8 items for the grid layout
        if (mappedData.length < 8) {
          const needed = 8 - mappedData.length;
          // Append fallback items that aren't already in mappedData (simple check or just slice)
          // We'll just slice the fallback data to fill the gap. 
          // Note: Real IDs might collide with "1", "2" etc from fallback if we aren't careful, 
          // but for display this is acceptable or we can prefix fallback IDs.
          const fallbackFill = FALLBACK_NEWS_DATA.slice(0, needed).map((item, index) => ({
            ...item,
            id: `fallback-${item.id}-${index}` // Ensure unique keys
          }));
          setNewsData([...mappedData, ...fallbackFill]);
        } else {
          setNewsData(mappedData);
        }

      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNewsData(FALLBACK_NEWS_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading News...</div>;

  return (
    <div className=" mx-auto p-4 font-sans text-[#212121]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-2 pb-2 border-dashed border-b ">
        {/* Main Content Area (Spans 9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {/* Article 1: Headline Left, Image Right */}
          <Link href={`/${newsData[0].category || "news"}/${newsData[0].slug}`} className="grid grid-cols-1 md:grid-cols-3 gap-6 group">
            <div className="md:col-span-1 order-2 md:order-1">
              <h2 className="text-xl md:text-3xl font-mono font-bold leading-tight decoration-1 group-hover:underline underline-offset-4 mb-3">
                {newsData[0].title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-4 md:line-clamp-none">
                {newsData[0].description
                  ? stripHtml(newsData[0].description)
                  : stripHtml(newsData[0].content)}
              </p>
              <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-medium">
                <span>{newsData[0].timestamp}</span>
                <Dot className="text-secondary" size={24} />
                <span>{newsData[0].category}</span>
              </div>
            </div>
            <div className="md:col-span-2 order-1 md:order-2 relative aspect-[16/9] w-full">
              <Image src={newsData[0].image} alt={newsData[0].title} fill  className="object-cover " />
            </div>
          </Link>

          {/* Former Bottom Section: 4 Column Grid - Now inside the 9-col container */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-dashed border-t">
            {newsData.slice(4, 8).map((news) => (
              <Link key={news.id} href={`/${news.category || "news"}/${news.slug}`} className="group">
                 <div className="relative aspect-video mb-3 overflow-hidden ">
                   <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                 </div>
                 <h4 className="font-bold font-mono text-sm leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">{news.title}</h4>
                 <div className="flex items-center text-[10px] text-muted-foreground uppercase font-medium">
                  <span>{news.timestamp}</span>
                  <Dot className="text-primary" size={16} />
                  <span>{news.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar (Spans 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6  lg:pl-2 border-primary/5">
           {/* First item with image */}
           <Link href={`/${newsData[1].category || "news"}/${newsData[1].slug}`} className="group block">
              <div className="relative aspect-video mb-3 overflow-hidden ">
                <Image src={newsData[1].image} alt={newsData[1].title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-lg font-mono font-bold leading-snug group-hover:text-primary transition-colors mb-2">{newsData[1].title}</h3>
               <div className="flex items-center text-xs text-muted-foreground uppercase font-medium">
                <span>{newsData[1].timestamp}</span>
                <Dot className="text-primary" size={24} />
                <span>{newsData[1].category}</span>
              </div>
           </Link>

           <hr className="w-full border-dashed  " />

           {/* Second item text only */}
           <Link href={`/${newsData[2].category || "news"}/${newsData[2].slug}`} className="group block">
           <div className="relative lg:hidden block  aspect-video mb-3 overflow-hidden ">
                <Image src={newsData[2].image} alt={newsData[2].title} fill className=" object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-lg font-mono font-bold leading-snug group-hover:text-primary transition-colors mb-2">{newsData[2].title}</h3>
               <div className="flex items-center text-xs text-muted-foreground uppercase font-medium">
                <span>{newsData[2].timestamp}</span>
                <Dot className="text-primary" size={24} />
                <span>{newsData[2].category}</span>
              </div>
           </Link>

           <hr className="w-full border-dashed  " />

           {/* Third item text only */}
            <Link href={`/${newsData[3].category || "news"}/${newsData[3].slug}`} className="group block">
            <div className="relative lg:hidden block aspect-video mb-3 overflow-hidden ">
                <Image src={newsData[3].image} alt={newsData[3].title} fill className=" object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-lg font-mono font-bold leading-snug group-hover:text-primary transition-colors mb-2">{newsData[3].title}</h3>
               <div className="flex items-center text-xs text-muted-foreground uppercase font-medium">
                <span>{newsData[3].timestamp}</span>
                <Dot className="text-primary" size={24} />
                <span>{newsData[3].category}</span>
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;