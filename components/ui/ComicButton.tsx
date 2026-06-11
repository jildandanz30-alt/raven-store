"use client";

// ============================================
// RAVEN STORE — COMIC BUTTON COMPONENT
// ============================================

import React from "react";
import { cn } from "@/lib/utils";

// === TYPES ===
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon on the left */
  leftIcon?: React.ReactNode;
  /** Icon on the right */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  children: React.ReactNode;
}

// === VARIANT STYLES ===
const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-accent text-background",
    "border-[3px] border-background",
    "shadow-[4px_4px_0px_#E8E8E0]",
    "hover:-translate-x-[2px] hover:-translate-y-[3px]",
    "hover:shadow-[6px_6px_0px_#E8E8E0]",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#E8E8E0]",
  ].join(" "),

  secondary: [
    "bg-transparent text-text-primary",
    "border-[3px] border-border",
    "shadow-[4px_4px_0px_#E8E8E0]",
    "hover:bg-[rgba(232,232,224,0.08)]",
    "hover:-translate-x-[2px] hover:-translate-y-[3px]",
    "hover:shadow-[6px_6px_0px_#E8E8E0]",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#E8E8E0]",
  ].join(" "),

  ghost: [
    "bg-transparent text-text-secondary",
    "border-[3px] border-transparent",
    "shadow-none",
    "hover:text-text-primary hover:border-border",
    "hover:shadow-[3px_3px_0px_#E8E8E0]",
    "hover:-translate-x-[1px] hover:-translate-y-[2px]",
    "active:translate-x-[1px] active:translate-y-[1px]",
  ].join(" "),

  danger: [
    "bg-background text-[#FF4444]",
    "border-[3px] border-[#FF4444]",
    "shadow-[4px_4px_0px_#FF4444]",
    "hover:-translate-x-[2px] hover:-translate-y-[3px]",
    "hover:shadow-[6px_6px_0px_#FF4444]",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#FF4444]",
  ].join(" "),

  outline: [
    "bg-transparent text-border",
    "border-[3px] border-border",
    "shadow-[3px_3px_0px_#E8E8E0]",
    "hover:bg-surface",
    "hover:-translate-x-[1px] hover:-translate-y-[2px]",
    "hover:shadow-[5px_5px_0px_#E8E8E0]",
    "active:translate-x-[1px] active:translate-y-[1px]",
  ].join(" "),
};

// === SIZE STYLES ===
const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-base px-4 py-2 gap-2",
  lg: "text-lg px-6 py-2.5 gap-2.5",
  xl: "text-xl px-8 py-3 gap-3",
};

// === LOADING SPINNER ===
function Spinner({ size }: { size: ButtonSize }) {
  const spinnerSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  return (
    <svg
      className={cn("animate-loader-spin", spinnerSize[size])}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// === COMPONENT ===
export function ComicButton({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ComicButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center",
        "font-display tracking-[0.05em] rounded-[2px]",
        "transition-[transform,box-shadow,background-color] duration-[150ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "select-none relative",
        // Variant
        variantStyles[variant],
        // Size
        sizeStyles[size],
        // Full width
        fullWidth && "w-full",
        // Disabled
        isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Left icon / spinner */}
      {loading ? (
        <Spinner size={size} />
      ) : leftIcon ? (
        <span className="flex items-center">{leftIcon}</span>
      ) : null}

      {/* Label */}
      <span>{children}</span>

      {/* Right icon */}
      {!loading && rightIcon && (
        <span className="flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}

// === ICON BUTTON VARIANT ===
interface ComicIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string; // for a11y
}

export function ComicIconButton({
  icon,
  variant = "secondary",
  size = "md",
  label,
  className,
  disabled,
  ...props
}: ComicIconButtonProps) {
  const squareSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  return (
    <button
      aria-label={label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center",
        "font-display rounded-[2px]",
        "transition-[transform,box-shadow] duration-[150ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "select-none",
        squareSizes[size],
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

export default ComicButton;
