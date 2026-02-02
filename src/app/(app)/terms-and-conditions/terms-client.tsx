"use client";

import React from "react";
import DotGrid from "@/components/DotGrid";

const TermsClient = () => {
  return (
    <DotGrid
      dotSize={2}
      gap={20}
      baseColor="#9ca3af" // muted-foreground color roughly
      activeColor="#22c55e" // primary/green color
      proximity={100}
      shockRadius={150}
    />
  );
};

export default TermsClient;
