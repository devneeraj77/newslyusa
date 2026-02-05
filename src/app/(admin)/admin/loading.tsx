"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-baseline"
        >
          <span className="font-mono text-8xl font-black tracking-tighter text-sidebar-primary">
            {Math.round(progress)}
          </span>
          <span className="ml-1 text-2xl font-bold text-muted-foreground">
            %
          </span>
        </motion.div>

        <div className="mt-4 h-1 w-64 overflow-hidden rounded-full bg-sidebar-accent">
          <motion.div
            className="h-full bg-sidebar-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          Loading Dashboard...
        </motion.p>
      </div>
    </div>
  );
}
