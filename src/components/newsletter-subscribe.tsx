"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      "Subscribed successfully! Thank you for joining our newsletter.",
    );
    setEmail("");
    setIsLoading(false);
  };

  return (
    <div className="w-full mmax-w-fit text-left   mx-auto    border-muted text-center">
      
      <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
      <p className="text-muted-foreground text-xs mb-6">
        Get the latest news and updates delivered directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="acitve:border rounded-lg hover:text-primary bg-background hover:text-accent hover:bg-accent-foreground focus:border "
        />
        <Button type="submit" variant="outline"  className="py-5" disabled={isLoading}>
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
