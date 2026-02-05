"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useData } from "@/components/providers/data-provider";
import { useCart } from "@/components/providers/cart-provider";
import { SparklesIcon, StarIcon } from "lucide-react";
import type { DietaryLabel } from "@/lib/types";

const dietaryFilters: { label: string; value: DietaryLabel }[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Gluten-Free", value: "gluten-free" },
  { label: "Contains Nuts", value: "contains-nuts" },
  { label: "Contains Dairy", value: "contains-dairy" },
  { label: "Spicy", value: "spicy" },
];

export default function MenuPage() {
  const { categories, menuItems } = useData();
  const { addItem } = useCart();
  const [category, setCategory] = useState<string>("all");
  const [dietary, setDietary] = useState<DietaryLabel[]>([]);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesDietary =
        !dietary.length || dietary.every((tag) => item.dietary.includes(tag));
      return matchesCategory && matchesSearch && matchesDietary;
    });
  }, [category, dietary, menuItems, search]);

  const handleToggleDietary = (value: DietaryLabel) => {
    setDietary((prev) =>
      prev.includes(value) ? prev.filter((tag) => tag !== value) : [...prev, value],
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-amber-200/80">
            Cafe Nine Menu
          </span>
          <h1 className="mt-3 font-serif text-5xl text-white">Curated Culinary Atlas</h1>
          <p className="mt-4 max-w-3xl text-sm text-zinc-400">
            Seasonal degustations, heritage revivals, and experimental mixology. Select dishes by
            category, tailor dietary preferences, and stage the perfect dining moment. Every plate
            is available for tasting in-house or indulgent delivery.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-amber-200">
          <SparklesIcon className="h-4 w-4" />
          Chef&apos;s Table tasting now booking
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
            category === "all"
              ? "bg-amber-400 text-black"
              : "border border-white/10 text-zinc-300 hover:border-amber-400/40 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
              category === cat.id
                ? "bg-amber-400 text-black"
                : "border border-white/10 text-zinc-300 hover:border-amber-400/40 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

  <div className="mt-8 grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          {dietaryFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleToggleDietary(filter.value)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                dietary.includes(filter.value)
                  ? "bg-emerald-400 text-black"
                  : "border border-white/10 text-zinc-300 hover:border-emerald-300/40 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by dish, ingredient, or mood…"
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-200">
                  {item.category}
                </span>
                {item.isChefRecommendation && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
                    <StarIcon className="h-3 w-3" />
                    Chef
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 px-6 py-6">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-white">{item.name}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                {item.dietary.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 px-3 py-1 text-amber-200/80"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl text-white">${item.price.toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    {item.availability === "available"
                      ? "Available tonight"
                      : item.availability === "limited"
                        ? "Limited · reserve early"
                        : "Currently sold out"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      itemId: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                      category: item.category,
                    })
                  }
                  className="rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-amber-200 transition hover:bg-amber-300/25"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!filteredItems.length && (
        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-zinc-400">
          No dishes match your filters. Adjust your selections to explore the full menu.
        </div>
      )}
    </div>
  );
}
