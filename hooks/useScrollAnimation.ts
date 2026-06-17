"use client";

// ============================================
// RAVEN STORE — SCROLL ANIMATION HOOK
// Uses IntersectionObserver for comic panel reveal
// ============================================

import { useEffect, useRef, useCallback } from "react";

type Direction = "left" | "right" | "up" | "down";
type EasingName = "comic" | "snap" | "ease-out" | "ease-in-out";

interface ScrollAnimationOptions {
  /** Direction the element enters from */
  direction?: Direction;
  /** Delay in ms before animation starts */
  delay?: number;
  /** Duration in ms */
  duration?: number;
  /** Easing function */
  easing?: EasingName;
  /** Distance to travel in px */
  distance?: number;
  /** Threshold (0-1) for when to trigger */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
}

const EASING_MAP: Record<EasingName, string> = {
  comic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  snap: "cubic-bezier(0.87, 0, 0.13, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
};

function getInitialTransform(direction: Direction, distance: number): string {
  switch (direction) {
    case "left": return `translateX(-${distance}px)`;
    case "right": return `translateX(${distance}px)`;
    case "up": return `translateY(${distance}px)`;
    case "down": return `translateY(-${distance}px)`;
  }
}

// ============================================
// SINGLE ELEMENT HOOK
// ============================================
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
) {
  const {
    direction = "up",
    delay = 0,
    duration = 500,
    easing = "comic",
    distance = 40,
    threshold = 0.15,
    once = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Set initial hidden state
    el.style.opacity = "0";
    el.style.transform = getInitialTransform(direction, distance);
    el.style.transition = "none";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.transition = `opacity ${duration}ms ${EASING_MAP[easing]}, transform ${duration}ms ${EASING_MAP[easing]}`;
              el.style.opacity = "1";
              el.style.transform = "none";
            }, delay);

            if (once) observer.unobserve(el);
          } else if (!once) {
            el.style.transition = "none";
            el.style.opacity = "0";
            el.style.transform = getInitialTransform(direction, distance);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, duration, easing, distance, threshold, once]);

  return ref;
}

// ============================================
// STAGGER CHILDREN HOOK
// Animates children with staggered delay
// ============================================
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 80, ...rest } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const children = Array.from(container.children) as HTMLElement[];

    if (prefersReduced) {
      children.forEach((child) => {
        child.style.opacity = "1";
        child.style.transform = "none";
      });
      return;
    }

    const direction = rest.direction ?? "up";
    const distance = rest.distance ?? 30;
    const duration = rest.duration ?? 400;
    const easing = rest.easing ?? "comic";
    const threshold = rest.threshold ?? 0.1;

    // Hide all children initially
    children.forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = getInitialTransform(direction, distance);
      child.style.transition = "none";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.style.transition = `opacity ${duration}ms ${EASING_MAP[easing]}, transform ${duration}ms ${EASING_MAP[easing]}`;
                child.style.opacity = "1";
                child.style.transform = "none";
              }, (rest.delay ?? 0) + i * staggerDelay);
            });
            observer.unobserve(container);
          }
        });
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [rest.delay, rest.direction, rest.distance, rest.duration, rest.easing, rest.threshold, staggerDelay]);

  return ref;
}

// ============================================
// PANEL WIPE HOOK
// Comic-style panel wipe from left/right
// ============================================
export function usePanelWipe<T extends HTMLElement = HTMLDivElement>(
  direction: "left" | "right" = "left",
  options: { delay?: number; threshold?: number } = {}
) {
  const { delay = 0, threshold = 0.2 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.clipPath = "none";
      return;
    }

    const initial =
      direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

    el.style.clipPath = initial;
    el.style.transition = "none";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.transition =
                "clip-path 600ms cubic-bezier(0.87, 0, 0.13, 1)";
              el.style.clipPath = "inset(0 0% 0 0)";
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, threshold]);

  return ref;
}

// ============================================
// COUNTER ANIMATION HOOK
// Animates numbers counting up
// ============================================
export function useCountUp(
  target: number,
  options: {
    duration?: number;
    delay?: number;
    formatter?: (n: number) => string;
  } = {}
) {
  const { duration = 1500, delay = 0, formatter = (n) => n.toString() } = options;
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.textContent = formatter(target);
      return;
    }

    el.textContent = formatter(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            setTimeout(() => {
              const start = performance.now();
              const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased =
                  progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;
                el.textContent = formatter(Math.floor(eased * target));
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = formatter(target);
              };
              requestAnimationFrame(tick);
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, delay, formatter]);

  return ref;
}
