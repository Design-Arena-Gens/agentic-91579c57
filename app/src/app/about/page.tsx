"use client";

import { useData } from "@/components/providers/data-provider";
import Image from "next/image";
import { motion } from "framer-motion";

const milestones = [
  {
    year: "2009",
    title: "Origins in Dubai",
    description:
      "Cafe Nine opens in Dubai’s Opus, blending Middle Eastern spice markets with Nordic precision.",
  },
  {
    year: "2015",
    title: "Conservatory Singapore",
    description:
      "Living botanical lab, progressive fermentation program, and the launch of delivery residencies.",
  },
  {
    year: "2022",
    title: "London Atelier",
    description:
      "Skyline atelier with Chef’s Table residencies, mixology labs, and immersive audio gastronomy.",
  },
];

const commitments = [
  "Seasonality & regenerative agriculture",
  "Zero-waste fermentation labs",
  "Ethical sourcing and artisanal partnerships",
  "Elevated hospitality with digital craft",
];

export default function AboutPage() {
  const { chefs, testimonials } = useData();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 lg:px-12">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Our Story</p>
        <h1 className="mt-3 font-serif text-4xl text-white">
          Cafe Nine · a luxe harmony of craft, culture, and cognisance
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          Founded in Dubai’s most sculptural landmark, Cafe Nine crafts fine dining theatre that
          flows from atelier kitchens to immersive digital touchpoints. We believe hospitality sits at
          the confluence of terroir, technology, and storytelling.
        </p>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <motion.div
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl text-white">Philosophy &amp; Craft</h2>
          <p className="text-sm text-zinc-300">
            Our kitchens are sensory ateliers led by resident chefs, fermentation artists, and
            mixologists. Every plate carries heritage whispers and progressive storytelling, plated
            on ceramics by collaborating artisans. The experience extends digitally with immersive
            ordering, sommelier live note pairing, and concierge intimacy.
          </p>
          <p className="text-sm text-zinc-400">
            We collaborate with regenerative farms, source caviar directly from ethical aquaculture,
            and operate zero-waste labs that transform coffee grinds into miso, spent citrus into
            bitters, and leftover pastry into aromatic garums. Even packaging for delivery residencies
            is crafted from bamboo fibre and recycled ocean plastics.
          </p>
        </motion.div>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Image
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop"
            alt="Cafe Nine tasting"
            width={1200}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-sm text-amber-100">
            <p className="font-serif text-2xl text-white">Cuisine as modern poetry</p>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
              Chef&apos;s Table · London Atelier
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.year}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">{milestone.year}</p>
            <p className="mt-2 font-serif text-2xl text-white">{milestone.title}</p>
            <p className="mt-3 text-sm text-zinc-400">{milestone.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-serif text-3xl text-white">Culinary Collective</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {chefs.map((chef, idx) => (
            <motion.div
              key={chef.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="relative h-64">
                <Image src={chef.portrait} alt={chef.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="space-y-4 px-6 py-6">
                <div>
                  <p className="font-serif text-2xl text-white">{chef.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{chef.title}</p>
                </div>
                <p className="text-sm text-zinc-300">{chef.bio}</p>
                <ul className="space-y-2 text-xs uppercase tracking-[0.3em] text-amber-200/80">
                  {chef.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <motion.div
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl text-white">Commitment to Quality</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            {commitments.map((commitment) => (
              <li
                key={commitment}
                className="rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.3em] text-amber-200/80"
              >
                {commitment}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl text-white">Critics on Cafe Nine</h2>
          <div className="mt-4 space-y-4 text-sm text-zinc-300">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-3xl border border-white/10 bg-black/40 p-4">
                <p className="text-lg text-zinc-100">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {testimonial.name} · {testimonial.location}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
