"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { useData } from "@/components/providers/data-provider";
import { formatISO } from "date-fns";
import { MessageCircleIcon, HeadphonesIcon, MessageSquareIcon, SendIcon } from "lucide-react";

interface SupportFormValues {
  subject: string;
  message: string;
}

interface FeedbackFormValues {
  name: string;
  email: string;
  message: string;
}

const faqs = [
  {
    question: "How do I modify a reservation?",
    answer:
      "Visit your Account → Reservations to adjust date, time, or table narrative. Concierge assistance is also available via chat.",
  },
  {
    question: "Do you accommodate dietary considerations?",
    answer:
      "Absolutely. Every dish can be tailored for allergies or dietary requests. Share details in reservations, orders, or with concierge.",
  },
  {
    question: "How do live order updates work?",
    answer:
      "We share status via SMS, email, and concierge chat. Delivery couriers provide live coordinates for premium members.",
  },
];

export default function SupportPage() {
  const { user } = useAuth();
  const { supportTickets, addSupportTicket } = useData();
  const supportForm = useForm<SupportFormValues>();
  const feedbackForm = useForm<FeedbackFormValues>();

  const handleSupportSubmit = supportForm.handleSubmit((values) => {
    addSupportTicket({
      id: crypto.randomUUID(),
      userId: user?.id,
      name: user?.fullName ?? "Guest",
      email: user?.email ?? "guest@cafenine.com",
      subject: values.subject,
      message: values.message,
      status: "open",
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    });
    supportForm.reset();
  });

  const handleFeedbackSubmit = feedbackForm.handleSubmit((values) => {
    addSupportTicket({
      id: crypto.randomUUID(),
      name: values.name,
      email: values.email,
      subject: "Guest Feedback",
      message: values.message,
      status: "open",
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    });
    feedbackForm.reset();
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Guest Experience</p>
        <h1 className="mt-3 font-serif text-4xl text-white">
          Concierge support, live chat, and tailored care
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          The Cafe Nine concierge collective is on call for reservations, orders, private residencies,
          and celebrations. Reach us anytime.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="h-8 w-8 text-amber-300" />
            <div>
              <p className="font-serif text-2xl text-white">Concierge Support</p>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Instant assistance · 24/7 availability
              </p>
            </div>
          </div>
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <input
              placeholder="Subject"
              {...supportForm.register("subject", { required: true })}
              className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
            />
            <textarea
              rows={6}
              placeholder="Share how we can elevate your experience..."
              {...supportForm.register("message", { required: true })}
              className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black shadow-lg shadow-amber-500/40 transition hover:shadow-amber-500/60"
            >
              <SendIcon className="h-4 w-4" />
              Submit Request
            </button>
          </form>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Live Chat</p>
            <p className="mt-1">
              Tap the concierge bubble on any page for instant support. AI-assisted agents handle
              pre-arrivals, transport, and culinary collaborations.
            </p>
          </div>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <MessageCircleIcon className="h-6 w-6 text-emerald-300" />
              <h2 className="font-serif text-xl text-white">Recent tickets</h2>
            </div>
            <div className="mt-4 space-y-4">
              {supportTickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
                  <p className="font-medium text-white">{ticket.subject}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {ticket.status} · {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">{ticket.message}</p>
                </div>
              ))}
              {!supportTickets.length && (
                <p className="text-sm text-zinc-400">No tickets yet. Submit a request to begin.</p>
              )}
            </div>
          </motion.section>

          <motion.section
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <MessageSquareIcon className="h-6 w-6 text-purple-300" />
              <h2 className="font-serif text-xl text-white">Feedback</h2>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3">
              <input
                placeholder="Name"
                {...feedbackForm.register("name", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-purple-400/60 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                {...feedbackForm.register("email", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-purple-400/60 focus:outline-none"
              />
              <textarea
                rows={4}
                placeholder="Share your thoughts, compliments, or areas to refine…"
                {...feedbackForm.register("message", { required: true })}
                className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white placeholder:text-zinc-500 focus:border-purple-400/60 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full border border-purple-300/40 bg-purple-400/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-purple-100 transition hover:bg-purple-400/20"
              >
                Send Feedback
              </button>
            </form>
          </motion.section>

          <motion.section
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-xl text-white">FAQs</h2>
            <div className="mt-4 space-y-4 text-sm text-zinc-300">
              {faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
