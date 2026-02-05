"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Suspense } from "react";

const AUTHENTICATION_PAGES = new Set(["/admin/login"]);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = !AUTHENTICATION_PAGES.has(pathname);

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black/20 backdrop-blur-xl">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-muted">Loading…</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
