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
    <div className="w-full mmax-w-fit text-left   mx-auto  text-center">
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
          className="
    w-full
    px-4 py-2
    text-base
    border border-gray-300
    rounded-md
    focus:outline-none
    focus:ring-2 focus:ring-blue-500
    focus:border-blue-500
    placeholder-gray-400
    transition
    duration-200
  "
        />

        <Button
          type="submit"
          variant="default"
          size={"lg"}
          className=" bg-accent text-accent-foreground hover:text-primary hover:bg-shade "
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
