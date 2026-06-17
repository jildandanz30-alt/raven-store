"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "accent";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-zinc-200",
  secondary: "bg-zinc-900 text-white border border-white/5 hover:bg-zinc-800",
  accent: "bg-[#2d4a3e] text-white border border-white/5 hover:bg-[#365a4b]",
  ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
  outline: "bg-transparent text-white border border-white/10 hover:border-white/30 hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-5 py-2.5 gap-2 rounded-xl",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl",
  xl: "text-lg px-8 py-4 gap-3 rounded-2xl",
};

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
        "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
      ) : leftIcon ? (
        <span className="flex items-center">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}

export default ComicButton;
