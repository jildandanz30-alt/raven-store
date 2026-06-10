"use client";

// ============================================
// RAVEN STORE — ROOT PROVIDERS
// Wraps app with all client-side context providers
// ============================================

import React from "react";
// Future providers can be imported and added here:
// import { CartProvider } from "@/contexts/CartContext";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { Toaster } from "@/components/ui/Toaster";

interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <>
      {/*
        Add providers here as they're built:
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      */}
      {children}

      {/* Toast notifications portal */}
      {/* <Toaster /> */}
    </>
  );
}
