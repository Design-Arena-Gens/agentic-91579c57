"use client";

import { motion } from "framer-motion";
import { CalendarIcon, GiftIcon, MapIcon, SmartphoneIcon } from "lucide-react";

const EXPERIENCES = [
  {
    icon: CalendarIcon,
    title: "Concierge Reservations",
    description:
      "Seamless selection of chef tables, private salons, and terrace evenings with realtime confirmation.",
    href: "/reservations",
  },
  {
    icon: SmartphoneIcon,
    title: "Immersive Ordering",
    description:
      "Curate tasting journeys, customise spice cadence, and track deliveries with sommelier tips.",
    href: "/order",
  },
  {
    icon: MapIcon,
    title: "Global Houses",
    description:
      "Explore Dubai Opus, Singapore Conservatory, and London Atelier with branch-specific experiences.",
    href: "/locations",
  },
  {
    icon: GiftIcon,
    title: "Celebrations & Events",
    description:
      "Design bespoke celebrations, culinary labs, and mixology salons with our events collective.",
    href: "/support",
  },
];

export function ExperienceTiles() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {EXPERIENCES.map((experience, index) => {
          const Icon = experience.icon;
          return (
            <motion.a
              key={experience.title}
              href={experience.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent p-6 shadow-xl shadow-black/10 transition hover:border-amber-400/40 hover:shadow-amber-400/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.45 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(246,189,96,0.12),_transparent_65%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-serif text-xl text-white">{experience.title}</p>
                  <p className="mt-2 text-sm text-zinc-400">{experience.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                  Discover →
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
