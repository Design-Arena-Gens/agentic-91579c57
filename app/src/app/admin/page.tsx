"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useData } from "@/components/providers/data-provider";
import { useForm } from "react-hook-form";
import type { MenuItem, Promotion } from "@/lib/types";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ClipboardListIcon,
  LayoutGridIcon,
  ListChecksIcon,
  PercentIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { formatISO } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  ChartTitle,
);

type AdminTab =
  | "overview"
  | "menu"
  | "orders"
  | "customers"
  | "reservations"
  | "support"
  | "promotions";

const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: ShieldIcon },
  { id: "menu", label: "Menu", icon: LayoutGridIcon },
  { id: "orders", label: "Orders", icon: ClipboardListIcon },
  { id: "customers", label: "Customers", icon: UsersIcon },
  { id: "reservations", label: "Reservations", icon: ListChecksIcon },
  { id: "support", label: "Support", icon: ShieldIcon },
  { id: "promotions", label: "Promotions", icon: PercentIcon },
];

interface MenuFormValues {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  dietary: string;
}

interface PromotionFormValues {
  title: string;
  description: string;
  code?: string;
  discountPercentage?: number;
  endsAt: string;
}

export default function AdminPage() {
  const { user, users: authUsers } = useAuth();
  const {
    categories,
    menuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    orders,
    updateOrderStatus,
    reservations,
    updateReservationStatus,
    supportTickets,
    updateSupportTicket,
    promotions,
    addPromotion,
    updatePromotion,
    analytics,
  } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const menuForm = useForm<MenuFormValues>();
  const promotionForm = useForm<PromotionFormValues>();

  const chartData = useMemo(
    () => ({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Monthly Revenue (k)",
          data: [120, 156, 189, 215, 244, 268],
          borderColor: "#fbbf24",
          backgroundColor: "rgba(251,191,36,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [],
  );

  const handleAddMenu = menuForm.handleSubmit((values) => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: values.name,
      category: values.category,
      description: values.description,
      price: Number(values.price),
      image: values.image,
      dietary: values.dietary.split(",").map((tag) => tag.trim()) as MenuItem["dietary"],
      availability: "available",
      addOns: [],
    };
    addMenuItem(newItem);
    menuForm.reset();
  });

  const handleAddPromotion = promotionForm.handleSubmit((values) => {
    const newPromo: Promotion = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      code: values.code,
      discountPercentage: values.discountPercentage,
      startsAt: formatISO(new Date()),
      endsAt: values.endsAt,
      isActive: true,
    };
    addPromotion(newPromo);
    promotionForm.reset();
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center">
        <ShieldIcon className="h-12 w-12 text-amber-300" />
        <div className="space-y-3">
          <h1 className="font-serif text-4xl text-white">Restricted Access</h1>
          <p className="text-sm text-zinc-400">
            This command centre is reserved for Cafe Nine administrators. Please authenticate with
            elevated credentials to proceed.
          </p>
        </div>
        <Link
          href="/account?auth=login"
          className="rounded-full border border-amber-400/40 bg-amber-400/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-amber-100 transition hover:bg-amber-400/20"
        >
          Authenticate
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Admin Command Centre</p>
        <h1 className="mt-3 font-serif text-4xl text-white">Cafe Nine Control Suite</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Manage menus, orders, reservations, promotions, and guest care. Live analytics ensure
          performance stays luminous.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                isActive
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-100"
                  : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/20"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <section className="mt-10 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {analytics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                  {metric.title}
                </p>
                <p className="mt-3 font-serif text-3xl text-white">{metric.value}</p>
                <p
                  className={`mt-2 text-xs uppercase tracking-[0.3em] ${
                    metric.trend === "up"
                      ? "text-emerald-200"
                      : metric.trend === "down"
                        ? "text-rose-300"
                        : "text-zinc-400"
                  }`}
                >
                  {metric.delta > 0 ? "+" : ""}
                  {metric.delta}% · {metric.caption}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Line
              data={chartData}
              options={{
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { color: "#d4d4d8" }, grid: { color: "rgba(212,212,216,0.1)" } },
                  y: { ticks: { color: "#d4d4d8" }, grid: { color: "rgba(212,212,216,0.1)" } },
                },
              }}
            />
          </div>
        </section>
      )}

      {activeTab === "menu" && (
        <section className="mt-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-2xl text-white">Add Menu Item</h2>
            <form className="space-y-3">
              <input
                placeholder="Dish name"
                {...menuForm.register("name", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <select
                {...menuForm.register("category", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                rows={4}
                placeholder="Description"
                {...menuForm.register("description", { required: true })}
                className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                {...menuForm.register("price", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <input
                placeholder="Image URL"
                {...menuForm.register("image", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <input
                placeholder="Dietary tags (comma separated)"
                {...menuForm.register("dietary", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <button
                type="button"
                onClick={handleAddMenu}
                className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
              >
                Add dish
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-white">Current menu</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {menuItems.map((item) => (
                <div key={item.id} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-lg text-white">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        {item.category}
                      </p>
                    </div>
                    <p className="font-serif text-lg text-amber-200">${item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {item.dietary.map((badge) => (
                      <span key={badge} className="rounded-full border border-white/10 px-3 py-1">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                    <button
                      type="button"
                      onClick={() =>
                        updateMenuItem(item.id, {
                          availability:
                            item.availability === "available" ? "limited" : "available",
                        })
                      }
                      className="rounded-full border border-white/10 px-3 py-2 text-zinc-300 hover:border-emerald-300/40 hover:text-emerald-200"
                    >
                      {item.availability === "available" ? "Mark limited" : "Mark available"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(item.id)}
                      className="rounded-full border border-white/10 px-3 py-2 text-rose-300 hover:border-rose-300/40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl text-white">Live orders</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg text-white">#{order.id.slice(0, 6)}</p>
                  <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {order.items.length} courses · ${order.total.toFixed(2)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["preparing", "en-route", "completed"] as const).map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                        order.status === status
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                          : "border-white/10 text-zinc-300 hover:border-white/30"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!orders.length && (
              <p className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-400">
                No active orders. Expect evening rush around 19:00.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === "customers" && (
        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl text-white">Guest Profiles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {authUsers.map((guest) => (
              <div key={guest.id} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg text-white">{guest.fullName}</p>
                  <span className="rounded-full border border-amber-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
                    {guest.role}
                  </span>
                </div>
                <p>{guest.email}</p>
                <p>{guest.phone}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Favourites: {guest.favorites.length} · Wishlist: {guest.wishlist.length}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "reservations" && (
        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl text-white">Reservation log</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <p className="font-serif text-lg text-white">
                  {new Date(reservation.date).toLocaleDateString()} · {reservation.time}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {reservation.guests} guests · {reservation.tablePreference}
                </p>
                <p className="mt-2 text-xs text-zinc-500">{reservation.specialRequests ?? "No requests"}</p>
                <div className="mt-3 flex gap-2">
                  {(["confirmed", "completed", "cancelled"] as const).map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => updateReservationStatus(reservation.id, status)}
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                        reservation.status === status
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                          : "border-white/10 text-zinc-300 hover:border-white/30"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!reservations.length && (
              <p className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-400">
                No reservations logged yet.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === "support" && (
        <section className="mt-10 space-y-4">
          <h2 className="font-serif text-2xl text-white">Support tickets</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg text-white">{ticket.subject}</p>
                  <span className="rounded-full border border-amber-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {ticket.email} · {new Date(ticket.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-zinc-400">{ticket.message}</p>
                <div className="mt-3 flex gap-2">
                  {(["responded", "resolved"] as const).map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => updateSupportTicket(ticket.id, { status })}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-300 hover:border-emerald-300/40 hover:text-emerald-200"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "promotions" && (
        <section className="mt-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-2xl text-white">Launch promotion</h2>
            <form className="space-y-3">
              <input
                placeholder="Title"
                {...promotionForm.register("title", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <textarea
                rows={4}
                placeholder="Description"
                {...promotionForm.register("description", { required: true })}
                className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white"
              />
              <input
                placeholder="Promo code"
                {...promotionForm.register("code")}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <input
                type="number"
                placeholder="Discount %"
                {...promotionForm.register("discountPercentage")}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <input
                type="date"
                {...promotionForm.register("endsAt", { required: true })}
                className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
              <button
                type="button"
                onClick={handleAddPromotion}
                className="w-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
              >
                Activate promotion
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-white">Active campaigns</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {promotions.map((promo) => (
                <div key={promo.id} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                  <p className="font-serif text-lg text-white">{promo.title}</p>
                  <p>{promo.description}</p>
                  {promo.code && (
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Code: {promo.code}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    Ends {new Date(promo.endsAt).toLocaleDateString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => updatePromotion(promo.id, { isActive: !promo.isActive })}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 hover:border-emerald-300/40 hover:text-emerald-200"
                  >
                    {promo.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
