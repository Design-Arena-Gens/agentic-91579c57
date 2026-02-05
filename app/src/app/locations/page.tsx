"use client";

import { useData } from "@/components/providers/data-provider";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LocationsPage() {
  const { branches, menuItems } = useData();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">
          International Houses
        </p>
        <h1 className="mt-3 font-serif text-4xl text-white">Cafe Nine Branches &amp; Experiences</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Discover immersive gastronomy in Dubai, Singapore, and London. Each house showcases
          architecture, terroir influences, and branch-exclusive menus.
        </p>
      </div>

      <div className="mt-10 grid gap-8">
        {branches.map((branch, index) => {
          const branchMenu = branch.signatureMenu
            ?.map((id) => menuItems.find((item) => item.id === id))
            .filter(Boolean) ?? [];

          return (
            <motion.section
              key={branch.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6 p-6 md:p-10">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">House</p>
                    <h2 className="font-serif text-3xl text-white">{branch.name}</h2>
                    <p className="text-sm text-zinc-400">{branch.address}</p>
                    <p className="text-sm text-zinc-500">{branch.city}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                        Timing
                      </p>
                      <p className="mt-1">{branch.timing}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                        Contact
                      </p>
                      <p className="mt-1">{branch.contact}</p>
                      <p className="text-xs text-zinc-500">{branch.email}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                      Signature Experiences
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {branchMenu.length ? (
                        branchMenu.map((item) => (
                          <div key={item!.id} className="flex gap-3 rounded-3xl border border-white/10 bg-black/40 p-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
                              <Image
                                src={item!.image}
                                alt={item!.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-serif text-lg text-white">{item!.name}</p>
                              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                                {item!.category}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">
                          Branch experiences are curated on rotation.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/reservations"
                      className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-emerald-100 transition hover:bg-emerald-400/20"
                    >
                      Reserve at {branch.city}
                    </Link>
                    <Link
                      href="/order"
                      className="rounded-full border border-emerald-400/40 px-5 py-3 text-xs uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-400/70 hover:text-white"
                    >
                      Order from {branch.city}
                    </Link>
                  </div>
                </div>
                <div className="relative min-h-[320px]">
                  <iframe
                    title={`${branch.name} map`}
                    src={`https://www.google.com/maps?q=${branch.coordinates[0]},${branch.coordinates[1]}&hl=en&z=14&output=embed`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-right text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Interactive map powered by Google
                  </div>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
