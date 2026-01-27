"use client";

import { Button } from "@/components/ui/button";
import { Trash2, MailOpen, Mail, Send } from "lucide-react";
import { deleteContactMessage, markContactMessageAsRead, deleteSubscriber, markSubscriberAsRead } from "@/actions/admin-actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";

interface ActionButtonsProps {
  id: string;
  type: "contact" | "subscriber";
  isRead: boolean;
  email?: string;
}

export function ActionButtons({ id, type, isRead, email }: ActionButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    startTransition(async () => {
      let result;
      if (type === "contact") {
        result = await deleteContactMessage(id);
      } else {
        result = await deleteSubscriber(id);
      }

      if (result.success) {
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete");
      }
    });
  };

  const handleMarkAsRead = () => {
    startTransition(async () => {
      let result;
      if (type === "contact") {
        result = await markContactMessageAsRead(id);
      } else {
        result = await markSubscriberAsRead(id);
      }

      if (result.success) {
        toast.success("Marked as read");
      } else {
        toast.error("Failed to update");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {email && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          title="Send Email"
        >
          <Link href={`mailto:${email}`}>
            <Send className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {!isRead && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMarkAsRead}
          disabled={isPending}
          title="Mark as Read"
        >
          <Mail className="h-4 w-4" />
        </Button>
      )}
      {isRead && (
          <Button
          variant="ghost"
          size="icon"
          disabled={true}
          title="Already Read"
          className="opacity-50"
        >
          <MailOpen className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
