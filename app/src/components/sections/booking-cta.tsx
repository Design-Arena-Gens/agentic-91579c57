"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDaysIcon, SparklesIcon } from "lucide-react";

export function BookingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-amber-400/20 bg-gradient-to-r from-amber-400/15 via-orange-500/10 to-rose-500/10 p-[1px]">
      <div className="rounded-[30px] bg-black/80 px-8 py-12 shadow-2xl shadow-amber-500/30 md:px-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-100">
              <SparklesIcon className="h-4 w-4" />
              New Year degustation residencies
            </div>
            <h3 className="font-serif text-4xl text-white md:text-5xl">
              Reserve coveted seats or curate an at-home soirée
            </h3>
            <p className="max-w-2xl text-sm text-amber-100/80">
              Choose the Chef’s Table, private terraces, or digital concierge for immersive
              delivery. Our reservation artists tailor every moment—pairings, playlists, floral
              installations, and travel arrangements.
            </p>
          </div>
          <motion.div
            className="flex flex-col gap-4 text-sm uppercase tracking-[0.3em]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/reservations"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-3 text-black shadow-lg shadow-amber-500/40 transition hover:shadow-amber-500/50"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Reserve a Table
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/40 px-6 py-3 text-amber-100 transition hover:bg-amber-200/10"
            >
              Plan a Celebration
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
