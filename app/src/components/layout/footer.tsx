"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const quickLinks = [
  { href: "/menu", label: "Explore Menu" },
  { href: "/reservations", label: "Reserve a Table" },
  { href: "/order", label: "Order Online" },
  { href: "/support", label: "Support" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://pinterest.com", label: "Pinterest" },
  { href: "https://x.com", label: "X" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10 lg:px-12">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-xl font-semibold text-black shadow-lg shadow-amber-500/30">
              C9
            </div>
            <div>
              <p className="font-serif text-2xl text-white">Cafe Nine</p>
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">
                Global Gastronomy
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Haute cuisine, chef-led experiences, and technology-forward hospitality across Dubai,
            Singapore, and London.
          </p>
        </motion.div>

        <div>
          <h3 className="font-serif text-lg text-white">Quick Access</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg text-white">Visit Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 text-amber-300" />
              <span>Level 9, The Opus · Dubai | Marina Conservatory · Singapore | The Shard · London</span>
            </li>
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 text-amber-300" />
              <span>Global Concierge · +971 4 921 9090</span>
            </li>
            <li className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 text-amber-300" />
              <span>concierge@cafenine.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg text-white">Social</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            {socials.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-amber-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs uppercase tracking-[0.3em] text-zinc-500">
        © {new Date().getFullYear()} Cafe Nine. Crafted for connoisseurs.
      </div>
    </footer>
  );
}
