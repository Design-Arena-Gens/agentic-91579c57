"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      enableSystem={false}
      themes={["dark", "dusk"]}
    >
      {children}
    </NextThemesProvider>
  );
}
