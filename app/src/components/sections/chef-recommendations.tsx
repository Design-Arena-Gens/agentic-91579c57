"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useData } from "@/components/providers/data-provider";
import { useMemo } from "react";

export function ChefRecommendations() {
  const { menuItems } = useData();

  const chefSelections = useMemo(
    () =>
      menuItems
        .filter((item) => item.isChefRecommendation)
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 3),
    [menuItems],
  );

  if (!chefSelections.length) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.08),_transparent_65%)]" />
      <div className="relative mx-auto w-full max-w-7xl rounded-[32px] border border-white/10 bg-black/50 px-6 py-16 shadow-2xl shadow-emerald-400/10 md:px-10 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">
              Chef&apos;s Recommendations
            </p>
            <h2 className="mt-2 font-serif text-4xl text-white">Global Signatures</h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              A lyrical journey through coastal Japan, Parisian ateliers, and spice bazaars. Crafted
              nightly by our culinary director and finished tableside for sensory theatre.
            </p>
          </div>
          <div className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-emerald-100">
            New seasonal pairings available
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {chefSelections.map((dish, idx) => (
            <motion.div
              key={dish.id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative h-64">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="space-y-2">
                  <p className="font-serif text-2xl text-white">{dish.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                    {dish.category}
                  </p>
                  <p className="text-sm text-zinc-400">{dish.description}</p>
                </div>
                {dish.pairings && (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100">
                    <p className="uppercase tracking-[0.3em]">Pairings</p>
                    <p className="mt-1 font-medium tracking-wider">
                      {dish.pairings.join(" · ")}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-serif text-xl text-white">${dish.price.toFixed(2)}</p>
                  <div className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                    Limited seats nightly
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
