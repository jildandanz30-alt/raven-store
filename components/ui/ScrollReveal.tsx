"use client";

// ============================================
// RAVEN STORE — SCROLL REVEAL COMPONENTS
// Drop-in wrappers for scroll animations
// ============================================

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal, useStaggerReveal, usePanelWipe } from "@/hooks/useScrollAnimation";

// ============================================
// SCROLL REVEAL — single element
// ============================================
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 500,
  distance = 40,
  threshold = 0.15,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    direction,
    delay,
    duration,
    distance,
    threshold,
  });

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// ============================================
// STAGGER REVEAL — container with staggered children
// ============================================
interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
}

export function StaggerReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  staggerDelay = 80,
  duration = 400,
  threshold = 0.1,
}: StaggerRevealProps) {
  const ref = useStaggerReveal<HTMLDivElement>({
    direction,
    delay,
    staggerDelay,
    duration,
    threshold,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ============================================
// PANEL WIPE — comic-style reveal
// ============================================
interface PanelWipeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  delay?: number;
  threshold?: number;
}

export function PanelWipe({
  children,
  className,
  direction = "left",
  delay = 0,
  threshold = 0.2,
}: PanelWipeProps) {
  const ref = usePanelWipe<HTMLDivElement>(direction, { delay, threshold });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ============================================
// SECTION REVEAL — full section with side enter
// ============================================
interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Alternate direction each section */
  index?: number;
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  index = 0,
  delay = 0,
}: SectionRevealProps) {
  // Even sections come from left, odd from right
  const direction = index % 2 === 0 ? "left" : "right";

  const ref = useScrollReveal<HTMLDivElement>({
    direction,
    delay,
    duration: 600,
    distance: 60,
    easing: "snap",
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ============================================
// COMIC PANEL REVEAL — with border flash
// ============================================
export function ComicPanelReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = usePanelWipe<HTMLDivElement>("left", { delay, threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface border-[4px] border-border shadow-comic rounded-[2px]",
        className
      )}
    >
      {children}
    </div>
  );
}
