"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ArticleStatusToggleProps {
  id: string;
  field: "isTopStory" | "isEditorsPick";
  initialChecked: boolean;
  disabled?: boolean;
}

export default function ArticleStatusToggle({
  id,
  field,
  initialChecked,
  disabled = false,
}: ArticleStatusToggleProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(initialChecked);
  const [loading, setLoading] = useState(false);

  const handleCheckedChange = async (value: boolean) => {
    // Optimistic update
    setChecked(value);
    setLoading(true);

    try {
      const res = await fetch("/api/news/article", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          [field]: value,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      
      router.refresh();
      toast.success("Status updated successfully");
    } catch (error) {
      // Revert on error
      setChecked(!value);
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={loading || disabled}
    />
  );
}
