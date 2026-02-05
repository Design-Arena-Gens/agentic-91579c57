"use client";

import { useData } from "@/components/providers/data-provider";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const { testimonials } = useData();

  if (!testimonials.length) return null;

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-black/60 px-6 py-16 md:px-10 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.12),_transparent_75%)]" />
      <div className="relative z-10 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.4em] text-purple-200/70">Guest Reveries</p>
        <h2 className="mt-2 font-serif text-4xl text-white">
          Whispered accolades from critics and connoisseurs
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Each story is a memory crafted through tasting narratives, progressive mixology, and
          impeccable hospitality. We measure success in the glow that lingers long after the final
          course.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.id}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
          >
            <div
              className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: testimonial.avatarColor }}
            />
            <p className="text-lg text-zinc-200">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-6 space-y-1">
              <p className="font-serif text-lg text-white">{testimonial.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-200/70">
                {testimonial.location}
              </p>
              <div className="flex gap-1 text-amber-300">
                {Array.from({ length: testimonial.rating }).map((_, starIdx) => (
                  <span key={starIdx}>★</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
