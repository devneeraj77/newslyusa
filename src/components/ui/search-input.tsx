"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Helper hook for throttling
function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = React.useRef<number>(0);

  return React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        callback(...args);
        lastCallRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastCallRef.current = Date.now();
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  );
}

export function SearchInput({
  placeholder = "Search...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get("q") || "");

  const handleSearch = useThrottledCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Reset page to 1 when searching
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, 2000); // 2 seconds throttle

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setValue(term);
    handleSearch(term);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 bg-background rounded-lg "
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}