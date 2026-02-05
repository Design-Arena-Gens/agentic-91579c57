"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MenuIcon, XIcon } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/order", label: "Order Online" },
  { href: "/locations", label: "Branches" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/70 shadow-lg shadow-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/90 font-serif text-xl font-semibold text-black shadow-lg shadow-amber-500/30 transition group-hover:scale-105">
            C9
          </span>
          <div className="hidden flex-col leading-tight text-sm font-medium text-muted md:flex">
            <span className="font-serif text-lg text-white">Cafe Nine</span>
            <span className="uppercase tracking-[0.3em] text-xs text-zinc-400">
              Gastronomy
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm uppercase tracking-[0.25em] transition ${
                  isActive ? "text-amber-300" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute -bottom-2 left-0 h-[1px] w-full bg-amber-400"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/order"
            className="rounded-full border border-amber-400/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200 transition hover:bg-amber-400/20"
          >
            Cart · {itemCount}
          </Link>
          <Link
            href={user ? "/account" : "/account?auth=login"}
            className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:shadow-lg hover:shadow-amber-400/40"
          >
            {user ? "Profile" : "Sign In"}
          </Link>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Menu"
        >
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-black/85 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-6 px-6 py-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block text-lg font-semibold ${
                      isActive ? "text-amber-300" : "text-zinc-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="/order"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-amber-500/60 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-amber-200"
                >
                  Cart · {itemCount}
                </Link>
                <Link
                  href={user ? "/account" : "/account?auth=login"}
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-black"
                >
                  {user ? "Profile" : "Sign In"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
