"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useData } from "@/components/providers/data-provider";
import { useCart } from "@/components/providers/cart-provider";
import { useMemo } from "react";

export function FeaturedDishes() {
  const { menuItems } = useData();
  const { addItem } = useCart();

  const featured = useMemo(
    () => menuItems.filter((item) => item.isFeatured).slice(0, 4),
    [menuItems],
  );

  if (!featured.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Signature Collection</p>
          <h2 className="mt-2 font-serif text-4xl text-white">Featured Dishes</h2>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">
            Chef-selected plates celebrating terroir, technique, and exquisite sourcing. Crafted for
            the season and served with sommelier-driven pairings.
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featured.map((dish, idx) => (
          <motion.div
            key={dish.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
          >
            <div className="relative h-56">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 space-y-1">
                <p className="inline-flex rounded-full bg-amber-500/90 px-3 py-1 text-xs uppercase tracking-[0.3em] text-black">
                  Chef&apos;s Pick
                </p>
                <p className="font-serif text-xl text-white">{dish.name}</p>
              </div>
            </div>
            <div className="space-y-4 px-5 py-6">
              <p className="text-sm text-zinc-300">{dish.description}</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                {dish.dietary.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-amber-200/90"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-serif text-2xl text-white">${dish.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      itemId: dish.id,
                      name: dish.name,
                      price: dish.price,
                      quantity: 1,
                      image: dish.image,
                      category: dish.category,
                    })
                  }
                  className="rounded-full border border-amber-300/40 bg-amber-400/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-amber-200 transition hover:bg-amber-400/25"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
