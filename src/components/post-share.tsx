"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandReddit, 
  IconBrandTelegram, 
  IconCopy, 
  IconShare,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface PostShareProps {
  title: string;
  image?: string | null; // Added to match usage in page.tsx, even if unused in UI
  description?: string;
}

export function PostShare({ title, description }: PostShareProps) {
  const pathname = usePathname();
  const [origin, setOrigin] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

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
      name: "Twitter",
      icon: IconBrandTwitter,
      color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      icon: IconBrandFacebook,
      color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Reddit",
      icon: IconBrandReddit,
      color: "hover:text-[#FF4500] hover:bg-[#FF4500]/10",
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: IconBrandLinkedin,
      color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: IconBrandTelegram,
      color: "hover:text-[#0088cc] hover:bg-[#0088cc]/10",
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: IconBrandWhatsapp,
      color: "hover:text-[#25D366] hover:bg-[#25D366]/10",
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "Email",
      icon: IconMail,
      color: "hover:text-foreground hover:bg-foreground/10",
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary rounded-none transition-colors p-2 border hover:bg-muted">
          <IconShare size={20} />
          <span className="sr-only">Share</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-none p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">Share this article</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            Share this link via
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border border-transparent transition-all duration-200 hover:border-border hover:shadow-sm ${link.color} group`}
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-transparent transition-colors">
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                  {link.name}
                </span>
              </a>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Or copy link
            </label>
            <div className="flex items-center gap-2 p-1.5 border bg-muted/30 focus-within:ring-1 focus-within:ring-ring transition-all">
              <div className="flex-1 min-w-0">
                <input
                  readOnly
                  value={url}
                  className="w-full bg-transparent border-none text-sm text-muted-foreground px-2 focus:outline-none font-mono truncate"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="shrink-0 p-2 hover:bg-background  transition-all hover:text-primary hover:shadow-sm border border-transparent hover:border-border"
              >
                <IconCopy size={16} />
                <span className="sr-only">Copy link</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
