"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandDiscord, 
  IconBrandReddit, 
  IconBrandTelegram, 
  IconCopy, 
  IconShare 
} from "@tabler/icons-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface PostShareProps {
  title: string;
  image?: string | null; // Added to match usage in page.tsx, even if unused in UI
}

export function PostShare({ title }: PostShareProps) {
  const pathname = usePathname();
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = `${origin}${pathname}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const shareLinks = [
    {
      name: "Discord",
      icon: <IconBrandDiscord className="h-5 w-5" />,
      url: "#",
    },
    {
      name: "Twitter",
      icon: <IconBrandTwitter className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Reddit",
      icon: <IconBrandReddit className="h-5 w-5" />,
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "Telegram",
      icon: <IconBrandTelegram className="h-5 w-5" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Facebook",
      icon: <IconBrandFacebook className="h-5 w-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary transition-colors p-2">
          <IconShare size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center leading-tight px-4">
            Share this article with your social community
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground ml-1">
              Share your link
            </label>
            <div className="relative flex items-center">
              <input
                readOnly
                value={url}
                className="w-full bg-muted/50 border border-border rounded-full py-3 px-5 pr-12 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleCopyLink}
                className="absolute right-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconCopy size={20} />
              </button>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-foreground ml-1">
              Share to
            </label>
            <div className="flex justify-between items-center px-1">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-secondary/80 transition-all duration-200 text-foreground"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
