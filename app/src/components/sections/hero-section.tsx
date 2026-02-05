"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useData } from "@/components/providers/data-provider";

const CTA_LINKS = [
  { href: "/menu", label: "View Menu" },
  { href: "/reservations", label: "Reserve Table" },
  { href: "/order", label: "Order Online" },
];

export function HeroSection() {
  const { heroImages } = useData();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const currentImage = useMemo(
    () => heroImages[index % heroImages.length],
    [heroImages, index],
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-2xl shadow-amber-500/10">
      <div className="relative h-[720px] w-full">
        <Image
          src={currentImage}
          alt="Cafe Nine hero dish"
          fill
          priority
          className="object-cover brightness-[0.55] transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="flex justify-between px-8 pt-8">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-zinc-300 backdrop-blur-lg">
              Global Gastronomy · Since 2009
            </span>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-zinc-400">
              <span>Michelin partnered</span>
              <span>Chef’s Table · Mixology Lab</span>
            </div>
          </div>

          <div className="px-8 pb-20 md:px-16">
            <motion.h1
              className="max-w-4xl font-serif text-5xl text-white md:text-6xl lg:text-7xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Fine dining theatre, tasting journeys, and haute delivery from Cafe Nine.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg text-zinc-300 md:text-xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Reserve the Chef’s Table, explore global menus, or elevate evenings with curated
              delivery and mixology pairings—all orchestrated with concierge precision.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              {CTA_LINKS.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.32em] text-white transition hover:border-amber-400/70 hover:bg-amber-400/20"
                >
                  {cta.label}
                </Link>
              ))}
            </motion.div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {["Chef’s Table · 12 Seats", "Sommelier Pairings", "Live Ambient Soundscapes"].map(
                (feature, idx) => (
                  <motion.div
                    key={feature}
                    className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-300 backdrop-blur-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                  >
                    {feature}
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 flex items-center gap-3">
        {heroImages.map((image, idx) => (
          <button
            key={image}
            type="button"
            aria-label={`Show hero ${idx + 1}`}
            onClick={() => setIndex(idx)}
            className={`h-2 w-12 rounded-full transition ${
              idx === index ? "bg-amber-400" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
