"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success(
        data.message ||
          "Subscribed successfully! Thank you for joining our newsletter.",
      );
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-base font-bold leading-none tracking-tight">Subscribe to our newsletter</h3>
          <p className="text-xs text-muted-foreground">
            Latest news and updates delivered to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-2">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 w-full bg-background pr-28 text-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1.5 top-1.5 h-8 px-3 font-semibold text-xs uppercase tracking-wide"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
      <p className="text-[10px] text-muted-foreground/60 px-1">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
