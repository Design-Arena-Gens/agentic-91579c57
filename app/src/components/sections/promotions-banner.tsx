"use client";

import { useData } from "@/components/providers/data-provider";
import { motion } from "framer-motion";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";

export function PromotionsBanner() {
  const { promotions } = useData();

  if (!promotions.length) return null;

  return (
    <section className="rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-rose-500/10 p-1">
      <div className="relative overflow-hidden rounded-[26px] bg-black/60 px-6 py-8 md:px-10 md:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,197,122,0.15),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-400/20 p-3 text-amber-300">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-2xl text-white">Seasonal Experiences</p>
              <p className="text-sm text-amber-200/80">
                Limited chef journeys, exclusive delivery privileges, and mixology salons
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {promotions.map((promo) => (
              <motion.div
                key={promo.id}
                className="min-w-[220px] rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-4 text-sm text-zinc-200 backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Offer</p>
                <p className="mt-2 font-medium text-white">{promo.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{promo.description}</p>
                {promo.code && (
                  <p className="mt-3 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
                    Code: {promo.code}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          <Link
            href="/reservations"
            className="rounded-full border border-amber-300/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-amber-100 transition hover:bg-amber-300/20"
          >
            Reserve Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
