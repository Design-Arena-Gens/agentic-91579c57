"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useData } from "@/components/providers/data-provider";
import type { Address, PaymentMethod } from "@/lib/types";
import { CheckCircleIcon, HeartIcon, LogOutIcon, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormValues {
  fullName?: string;
  email: string;
  password: string;
  phone?: string;
}

interface AddressFormValues {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentFormValues {
  label: string;
  last4: string;
  expiry: string;
}

export default function AccountPage() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("auth") ?? "login";
  const [view, setView] = useState<"login" | "signup">(intent === "signup" ? "signup" : "login");
  const {
    user,
    loading,
    signup,
    login,
    logout,
    addAddress,
    addPaymentMethod,
    setDefaultPaymentMethod,
    toggleFavorite,
    toggleWishlist,
  } = useAuth();
  const { menuItems, orders, reservations } = useData();

  const loginForm = useForm<AuthFormValues>({ defaultValues: { email: "", password: "" } });
  const signupForm = useForm<AuthFormValues>({
    defaultValues: { fullName: "", email: "", password: "", phone: "" },
  });
  const addressForm = useForm<AddressFormValues>();
  const paymentForm = useForm<PaymentFormValues>();

  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id);
  }, [orders, user]);

  const userReservations = useMemo(() => {
    if (!user) return [];
    return reservations.filter((reservation) => reservation.userId === user.id);
  }, [reservations, user]);

  const favouriteDishes = useMemo(() => {
    if (!user) return [];
    return menuItems.filter((item) => user.favorites.includes(item.id));
  }, [menuItems, user]);

  const handleLogin = loginForm.handleSubmit(async (values) => {
    const result = await login({ email: values.email, password: values.password });
    if (!result.success) {
      loginForm.setError("password", { message: result.error });
    }
  });

  const handleSignup = signupForm.handleSubmit(async (values) => {
    if (!values.fullName || !values.phone) {
      signupForm.setError("fullName", { message: "Required" });
      signupForm.setError("phone", { message: "Required" });
      return;
    }
    const result = await signup({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone,
    });
    if (!result.success) {
      signupForm.setError("password", { message: result.error });
    }
  });

  const handleAddAddress = addressForm.handleSubmit((values) => {
    const address: Address = {
      id: crypto.randomUUID(),
      line1: values.line1,
      line2: values.line2,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      isDefault: !user?.addresses.length,
    };
    addAddress(address);
    addressForm.reset();
  });

  const handleAddPayment = paymentForm.handleSubmit((values) => {
    const method: PaymentMethod = {
      id: crypto.randomUUID(),
      type: "card",
      label: values.label,
      last4: values.last4,
      expiry: values.expiry,
      isDefault: !user?.paymentMethods.length,
    };
    addPaymentMethod(method);
    paymentForm.reset();
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-400">
        Loading your experience…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-12">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Cafe Nine Members</p>
            <h1 className="mt-3 font-serif text-4xl text-white">Access your tailored universe</h1>
            <p className="mt-4 text-sm text-zinc-400">
              Track reservations, curated deliveries, tasting invitations, and loyalty privileges.
              Sign in or become part of the global Cafe Nine collective.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
            <p>Café privileges include:</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>· Chef concierge with pre-arrival parings</li>
              <li>· Delivery tracking with live sommelier notes</li>
              <li>· Private residencies and guest list access</li>
              <li>· Loyalty elevation to VIP status</li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
            <button
              type="button"
              onClick={() => setView("login")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                view === "login" ? "bg-amber-400 text-black" : "hover:text-amber-200"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setView("signup")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                view === "signup" ? "bg-amber-400 text-black" : "hover:text-amber-200"
              }`}
            >
              Become a member
            </button>
          </div>
          {view === "login" ? (
            <motion.form
              onSubmit={handleLogin}
              className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Email
                <input
                  type="email"
                  required
                  {...loginForm.register("email", { required: true })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Password
                <input
                  type="password"
                  required
                  {...loginForm.register("password", { required: true })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              {loginForm.formState.errors.password?.message && (
                <p className="text-xs text-rose-300">{loginForm.formState.errors.password.message}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black shadow-lg shadow-amber-500/40 transition hover:shadow-amber-500/60"
              >
                Access Account
              </button>
            </motion.form>
          ) : (
            <motion.form
              onSubmit={handleSignup}
              className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Full name
                <input
                  type="text"
                  required
                  {...signupForm.register("fullName", { required: "Please share your name" })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Email
                <input
                  type="email"
                  required
                  {...signupForm.register("email", { required: true })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Mobile
                <input
                  type="tel"
                  required
                  {...signupForm.register("phone", { required: "Phone number required" })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Password
                <input
                  type="password"
                  required
                  {...signupForm.register("password", { required: true, minLength: 6 })}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              {signupForm.formState.errors.password?.message && (
                <p className="text-xs text-rose-300">{signupForm.formState.errors.password.message}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black shadow-lg shadow-emerald-500/40 transition hover:shadow-emerald-500/60"
              >
                Create Membership
              </button>
            </motion.form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_0.9fr] md:px-10 lg:px-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/80">Member Profile</p>
              <h1 className="mt-3 font-serif text-3xl text-white">{user.fullName}</h1>
              <p className="text-sm text-zinc-400">{user.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                {user.role.toUpperCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-rose-300/40 hover:text-rose-200"
            >
              <LogOutIcon className="mr-2 inline h-4 w-4 align-middle" />
              Sign out
            </button>
          </div>
          <div className="grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Phone</p>
              <p className="mt-2">{user.phone}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Preferences</p>
              <p className="mt-2">
                {user.preferences?.preferredDining ?? "No preference"} · Spice{" "}
                {user.preferences?.spiceTolerance ?? "balanced"}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-white">Addresses</h2>
            <button
              type="button"
              onClick={handleAddAddress}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-emerald-300/40 hover:text-emerald-200"
            >
              <PlusIcon className="mr-2 inline h-4 w-4 align-middle" />
              Save
            </button>
          </div>
          <div className="space-y-4">
            <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input
                placeholder="Line 1"
                {...addressForm.register("line1", { required: true })}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
              <input
                placeholder="Line 2"
                {...addressForm.register("line2")}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
              <input
                placeholder="City"
                {...addressForm.register("city", { required: true })}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
              <input
                placeholder="State"
                {...addressForm.register("state")}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
              <input
                placeholder="Postal Code"
                {...addressForm.register("postalCode", { required: true })}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
              <input
                placeholder="Country"
                {...addressForm.register("country", { required: true })}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
              />
            </form>
            <div className="space-y-3">
              {user.addresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-3xl border p-4 text-sm ${
                    address.isDefault
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                      : "border-white/10 bg-black/40 text-zinc-300"
                  }`}
                >
                  <p>
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
              ))}
              {!user.addresses.length && (
                <p className="text-xs text-zinc-400">Add an address to unlock express delivery.</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-white">Payment Methods</h2>
            <button
              type="button"
              onClick={handleAddPayment}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-emerald-300/40 hover:text-emerald-200"
            >
              <PlusIcon className="mr-2 inline h-4 w-4 align-middle" />
              Save
            </button>
          </div>
          <form className="grid gap-3 md:grid-cols-3">
            <input
              placeholder="Card label"
              {...paymentForm.register("label", { required: true })}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
            />
            <input
              placeholder="Last four"
              maxLength={4}
              {...paymentForm.register("last4", { required: true })}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
            />
            <input
              placeholder="Expiry"
              {...paymentForm.register("expiry", { required: true })}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
            />
          </form>
          <div className="space-y-3">
            {user.paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between rounded-3xl border p-4 text-sm ${
                  method.isDefault
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 bg-black/40 text-zinc-300"
                }`}
              >
                <div>
                  <p className="font-serif text-lg text-white">{method.label}</p>
                  <p>•••• {method.last4}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Expires {method.expiry}
                  </p>
                </div>
                {!method.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-zinc-200 hover:border-emerald-300/40 hover:text-emerald-200"
                  >
                    Default
                  </button>
                )}
              </div>
            ))}
            {!user.paymentMethods.length && (
              <p className="text-xs text-zinc-400">Store a card for faster checkouts and loyalty.</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Order history</h2>
          <div className="mt-4 space-y-4">
            {userOrders.length ? (
              userOrders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg text-white">
                      {order.items.length} courses · ${order.total.toFixed(2)}
                    </p>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Placed {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-400">
                No orders yet. Create your first tasting journey.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Reservations</h2>
          <div className="mt-4 space-y-4">
            {userReservations.length ? (
              userReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300"
                >
                  <p className="font-serif text-lg text-white">
                    {new Date(reservation.date).toLocaleDateString()} · {reservation.time}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {reservation.guests} guests · {reservation.tablePreference.replace("-", " ")}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {reservation.specialRequests ?? "No special requests"}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-400">
                No reservations yet. Reserve the Chef&apos;s Table to begin.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Favourites &amp; Wishlist</h2>
          <div className="space-y-3">
            {favouriteDishes.map((dish) => (
              <div key={dish.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="font-serif text-lg text-white">{dish.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {dish.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(dish.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-rose-200 hover:border-rose-300/40"
                  >
                    <HeartIcon className="mr-1 inline h-4 w-4 align-middle" />
                    Favourite
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(dish.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-amber-200 hover:border-amber-300/40"
                  >
                    Wishlist
                  </button>
                </div>
              </div>
            ))}
            {!favouriteDishes.length && (
              <p className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-400">
                Highlight your favourite dishes from the menu to curate bespoke recommendations.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-6 text-sm text-emerald-100">
          <CheckCircleIcon className="mr-2 inline h-5 w-5 align-middle" />
          VIP members enjoy priority seating, cellar access, and curated residencies. Maintain a 4x
          monthly cadence to elevate status.
        </div>
      </div>
    </div>
  );
}
