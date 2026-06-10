"use client";

// ============================================
// RAVEN STORE — PAGE LOADER WRAPPER
// Client component that controls loader lifecycle
// ============================================

import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export function PageLoaderWrapper() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check sessionStorage — only show loader on first visit per session
    const hasLoaded = sessionStorage.getItem("raven-loaded");
    if (hasLoaded) {
      setShowLoader(false);
      return;
    }
    sessionStorage.setItem("raven-loaded", "1");
  }, []);

  if (!showLoader) return null;

  return (
    <PageLoader
      minDuration={1400}
      onComplete={() => setShowLoader(false)}
    />
  );
}
