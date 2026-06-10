"use client";

// ============================================
// RAVEN STORE — COMIC CARD COMPONENT
// ============================================

import React from "react";
import { cn } from "@/lib/utils";

// === TYPES ===
interface ComicCardProps {
  children: React.ReactNode;
  className?: string;
  /** Disable hover lift animation */
  static?: boolean;
  /** Add halftone dot pattern to card background */
  halftone?: boolean;
  /** Custom border size */
  borderSize?: 3 | 4 | 5 | 6;
  /** Additional onClick handler */
  onClick?: () => void;
  /** Render as a different HTML element */
  as?: "div" | "article" | "section" | "li";
  /** data-testid for testing */
  testId?: string;
}

// === COMPONENT ===
export function ComicCard({
  children,
  className,
  static: isStatic = false,
  halftone = false,
  borderSize = 4,
  onClick,
  as: Tag = "div",
  testId,
}: ComicCardProps) {
  const borderClasses = {
    3: "border-[3px]",
    4: "border-[4px]",
    5: "border-[5px]",
    6: "border-[6px]",
  };

  return (
    <Tag
      data-testid={testId}
      onClick={onClick}
      className={cn(
        // Base
        "relative bg-surface rounded-[2px]",
        // Border
        borderClasses[borderSize],
        "border-border",
        // Shadow
        "shadow-comic",
        // Hover (unless static)
        !isStatic && [
          "transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "hover:-translate-x-[3px] hover:-translate-y-[4px]",
          "hover:shadow-comic-hover",
          onClick && "cursor-pointer",
        ],
        // Halftone
        halftone && "before:absolute before:inset-0 before:bg-halftone before:bg-halftone before:opacity-10 before:pointer-events-none before:rounded-[1px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// === CARD SUB-COMPONENTS ===

interface ComicCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ComicCardHeader({ children, className }: ComicCardHeaderProps) {
  return (
    <div className={cn("p-4 border-b-[3px] border-border", className)}>
      {children}
    </div>
  );
}

export function ComicCardBody({ children, className }: ComicCardHeaderProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}

export function ComicCardFooter({ children, className }: ComicCardHeaderProps) {
  return (
    <div className={cn("p-4 border-t-[3px] border-border", className)}>
      {children}
    </div>
  );
}

// === PRODUCT CARD VARIANT ===
interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({
  title,
  price,
  originalPrice,
  thumbnail,
  category,
  rating,
  reviewCount,
  badge,
  className,
  onClick,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <ComicCard
      onClick={onClick}
      className={cn("group overflow-hidden cursor-pointer", className)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden border-b-[4px] border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Halftone overlay on image */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #E8E8E0 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badge && (
            <span className="font-display text-xs px-2 py-0.5 bg-accent text-background border-[2px] border-background shadow-[2px_2px_0px_#0A0A0A]">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="font-display text-xs px-2 py-0.5 bg-background text-accent border-[2px] border-border shadow-[2px_2px_0px_#E8E8E0]">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="font-display text-xs tracking-widest text-text-secondary uppercase">
          {category}
        </p>

        {/* Title */}
        <h3 className="font-display text-lg leading-tight tracking-wide line-clamp-2 text-text-primary">
          {title}
        </h3>

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={cn(
                    "text-sm",
                    star <= rating ? "text-accent" : "text-text-secondary"
                  )}
                >
                  ★
                </span>
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className="font-mono text-xs text-text-secondary">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display text-xl text-accent">
            Rp{price.toLocaleString("id-ID")}
          </span>
          {originalPrice && (
            <span className="font-body text-sm text-text-secondary line-through">
              Rp{originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>
      </div>
    </ComicCard>
  );
}

export default ComicCard;
