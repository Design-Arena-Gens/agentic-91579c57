"use client";

import { ThemeProvider } from "./theme-provider";
import { DataProvider } from "./data-provider";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
