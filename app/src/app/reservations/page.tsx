"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { addHours, format, formatISO } from "date-fns";
import { useAuth } from "@/components/providers/auth-provider";
import { useData } from "@/components/providers/data-provider";
import type { Reservation } from "@/lib/types";
import { CalendarDaysIcon, ClockIcon, Users2Icon } from "lucide-react";
import { useMemo, useState } from "react";

interface ReservationFormValues {
  date: string;
  time: string;
  guests: number;
  branchId: string;
  tablePreference: string;
  specialRequests?: string;
}

const tablePreferences = [
  { value: "chef-table", label: "Chef's Table" },
  { value: "garden-terrace", label: "Garden Terrace" },
  { value: "mixology-lounge", label: "Mixology Lounge" },
  { value: "private-salon", label: "Private Salon" },
];

export default function ReservationsPage() {
  const form = useForm<ReservationFormValues>({
    defaultValues: {
      guests: 2,
      tablePreference: "chef-table",
    },
  });
  const [tablePreference, setTablePreference] = useState(
    () => form.getValues("tablePreference") ?? "chef-table",
  );
  const { user } = useAuth();
  const { branches, reservations, createReservation } = useData();

  const userReservations = useMemo(() => {
    if (!user) return reservations.slice(0, 6);
    return reservations.filter((reservation) => reservation.userId === user.id);
  }, [reservations, user]);

  const onSubmit = (values: ReservationFormValues) => {
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      userId: user?.id ?? "guest",
      date: values.date,
      time: values.time,
      guests: Number(values.guests),
      tablePreference: values.tablePreference,
      specialRequests: values.specialRequests,
      branchId: values.branchId,
      status: "confirmed",
      createdAt: formatISO(new Date()),
    };
    createReservation(reservation);
    form.reset({
      guests: values.guests,
      tablePreference: values.tablePreference,
    });
    setTablePreference(values.tablePreference);
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:px-12">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">
            Concierge Reservations
          </p>
          <h1 className="mt-2 font-serif text-4xl text-white">
            Bespoke reservations across Cafe Nine houses
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Choose your culinary destination, table narrative, and any sensory requests. Our
            reservation artists will confirm instantly and coordinate pre-arrival preferences.
          </p>
        </div>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">Date</span>
              <div className="relative">
                <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-200/60" />
                <input
                  type="date"
                  required
                  {...form.register("date", { required: true })}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full rounded-full border border-white/10 bg-black/40 px-12 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">Time</span>
              <div className="relative">
                <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-200/60" />
                <input
                  type="time"
                  required
                  {...form.register("time", { required: true })}
                  min={format(addHours(new Date(), 1), "HH:mm")}
                  className="w-full rounded-full border border-white/10 bg-black/40 px-12 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </div>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">Guests</span>
              <div className="relative">
                <Users2Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-200/60" />
                <input
                  type="number"
                  min={1}
                  max={12}
                  {...form.register("guests", { valueAsNumber: true, required: true })}
                  className="w-full rounded-full border border-white/10 bg-black/40 px-12 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">
                Preferred House
              </span>
              <select
                {...form.register("branchId", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
              >
                <option value="">Select destination</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id} className="bg-black text-white">
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">
              Table Narrative
            </span>
            <div className="grid gap-3 md:grid-cols-2">
              {tablePreferences.map((preference) => (
                  <button
                    type="button"
                    key={preference.value}
                    onClick={() => {
                      setTablePreference(preference.value);
                      form.setValue("tablePreference", preference.value);
                    }}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      tablePreference === preference.value
                        ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                        : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/30"
                    }`}
                  >
                  {preference.label}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">
              Special Requests
            </span>
            <textarea
              rows={4}
              {...form.register("specialRequests")}
              placeholder="Allergies, celebrations, pairings, transport, or performances you would like us to orchestrate."
              className="w-full rounded-3xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-3 text-sm uppercase tracking-[0.3em] text-black shadow-lg shadow-amber-500/40 transition hover:shadow-amber-500/60"
          >
            Confirm Reservation
          </button>
        </motion.form>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Your reservations</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage confirmations, elevated services, and special experiences. Live updates and
            concierge communication happens here.
          </p>
          <div className="mt-6 space-y-4">
            {userReservations.length ? (
              userReservations.map((reservation) => {
                const branch = branches.find((item) => item.id === reservation.branchId);
                return (
                  <div
                    key={reservation.id}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-zinc-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-lg text-white">
                        {format(new Date(reservation.date), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                          reservation.status === "confirmed"
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-amber-400/15 text-amber-200"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                      <span>{reservation.time}</span>
                      <span>{reservation.guests} guests</span>
                      <span>{branch?.name ?? "Cafe Nine"}</span>
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      {reservation.tablePreference.replace("-", " ")} · {reservation.specialRequests ?? "No special requests"}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-400">
                No confirmed reservations yet. Submit your first reservation to unlock concierge
                comforts.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
          <h3 className="font-serif text-xl text-white">Reservation Services</h3>
          <ul className="mt-4 space-y-3 text-xs uppercase tracking-[0.3em] text-zinc-400">
            <li>Complimentary chauffeurs for VIP tiers</li>
            <li>Pre-fixe pairings customised to preferences</li>
            <li>Immersive soundscapes &amp; lighting design</li>
            <li>Atelier tours &amp; mixology sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
