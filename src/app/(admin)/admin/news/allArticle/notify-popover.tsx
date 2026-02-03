"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { sendNotification } from "@/actions/notification-actions";

interface NotifyPopoverProps {
  articleId: string;
  articleTitle: string;
  slug: string;
}

export default function NotifyPopover({
  articleId,
  articleTitle,
  slug,
}: NotifyPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNotification = async () => {
    setIsLoading(true);
    
    try {
      // Use the actual server action
      // Assuming article detail page is at /news/[slug]
      const url = `/news/${slug}`;
      
      const result = await sendNotification(articleTitle, url); 
      
      if (result.success) {
        toast.success("Notification sent successfully", {
          description: `Sent to ${result.count} devices.`,
        });
        setIsOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
        console.error(error);
      toast.error("Failed to send notification", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notify</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notify Users</h4>
            <p className="text-sm text-muted-foreground">
              Send a push notification to all devices for this article.
            </p>
          </div>
          <div className="bg-muted p-3 rounded-md text-sm italic border">
            "{articleTitle}"
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendNotification} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to All
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
