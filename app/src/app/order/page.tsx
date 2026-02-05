"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider";
import { useData } from "@/components/providers/data-provider";
import { useAuth } from "@/components/providers/auth-provider";
import type { Order, OrderItem, PaymentMethodType } from "@/lib/types";
import { formatISO, addMinutes } from "date-fns";
import { BikeIcon, CheckCircleIcon, CreditCardIcon, MapPinIcon, TruckIcon } from "lucide-react";

type Fulfilment = "delivery" | "pickup";

export default function OrderPage() {
  const { items, subtotal, taxes, total, updateItem, removeItem, clearCart, addItem } = useCart();
  const { menuItems, createOrder, orders } = useData();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [notes, setNotes] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    const favorites = menuItems.filter((item) => item.isChefRecommendation).slice(0, 4);
    return favorites.filter((item) => !items.some((cart) => cart.itemId === item.id));
  }, [items, menuItems]);

  const latestOrder = useMemo(() => {
    if (!user) return orders[0];
    return orders.find((order) => order.userId === user.id);
  }, [orders, user]);

  const handleCheckout = () => {
    if (!items.length) return;
    const orderItems: OrderItem[] = items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      notes: item.notes,
      addOns: item.addOns,
    }));
    const order: Order = {
      id: crypto.randomUUID(),
      userId: user?.id ?? "guest",
      items: orderItems,
      subtotal,
      tax: taxes,
      total,
      paymentMethod,
      status: "accepted",
      deliveryAddressId: user?.addresses.find((address) => address.isDefault)?.id ?? "pickup",
      createdAt: formatISO(new Date()),
      estimatedDelivery:
        fulfilment === "delivery"
          ? formatISO(addMinutes(new Date(), 45))
          : formatISO(addMinutes(new Date(), 25)),
      branchId: "dubai-opus",
    };
    createOrder(order);
    setStatusMessage("Order received · Our culinary couriers are confirming your journey.");
    clearCart();
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_0.8fr] md:px-10 lg:px-12">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">
            Artisanal Delivery &amp; Pickup
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white">
            Curate your tasting journey at home
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Select dishes, customise flavour cadence, and track each course in real time. Our
            culinary couriers transport dishes in temperature-controlled cases with sommelier notes.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Your Cart</h2>
          {!items.length ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-black/40 px-6 py-10 text-center text-sm text-zinc-400">
              No dishes yet. Explore the menu and indulge your senses.
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-4 md:flex-row md:items-center"
                >
                  <div className="relative h-20 w-full overflow-hidden rounded-2xl md:h-20 md:w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-serif text-lg text-white">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{item.category}</p>
                    {item.notes && <p className="text-xs text-zinc-400">{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.itemId, Number(event.target.value) || 1)
                      }
                      className="w-16 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white"
                    />
                    <p className="font-serif text-lg text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.itemId)}
                      className="text-xs uppercase tracking-[0.3em] text-rose-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Recommended Pairings</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recommendations.map((item) => (
              <motion.div
                key={item.id}
                className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-4 transition hover:border-amber-300/40 hover:bg-black/30"
                whileHover={{ translateY: -4 }}
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-lg text-white">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {item.category}
                  </p>
                  <p className="text-sm text-amber-100">${item.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      itemId: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                      category: item.category,
                    })
                  }
                  className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200 transition hover:bg-amber-300/25"
                >
                  Add
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Fulfilment</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(["delivery", "pickup"] as Fulfilment[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFulfilment(option)}
                className={`flex items-center gap-3 rounded-3xl border px-4 py-4 text-left text-sm transition ${
                  fulfilment === option
                    ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-100"
                    : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/20"
                }`}
              >
                {option === "delivery" ? (
                  <>
                    <TruckIcon className="h-5 w-5" />
                    Elevated Delivery · 45 mins
                  </>
                ) : (
                  <>
                    <BikeIcon className="h-5 w-5" />
                    Concierge Pickup · 25 mins
                  </>
                )}
              </button>
            ))}
          </div>
          {fulfilment === "delivery" && (
            <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200/80">
                <MapPinIcon className="h-4 w-4" />
                Delivery Address
              </div>
              {user?.addresses.length ? (
                user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`rounded-2xl border p-3 ${
                      address.isDefault
                        ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                        : "border-white/10 bg-black/50 text-zinc-300"
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
                ))
              ) : (
                <p className="text-xs text-zinc-400">
                  Add delivery addresses in your profile for bespoke coordination.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Payment</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {(["card", "apple-pay", "google-pay", "cash"] satisfies PaymentMethodType[]).map(
              (method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-3 rounded-3xl border px-4 py-4 text-left text-sm uppercase tracking-[0.3em] transition ${
                    paymentMethod === method
                      ? "border-amber-400/60 bg-amber-400/15 text-amber-100"
                      : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/20"
                  }`}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  {method.replace("-", " ")}
                </button>
              ),
            )}
          </div>
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="uppercase tracking-[0.3em] text-xs text-amber-200/70">
              Notes for the kitchen
            </span>
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Vessel preferences, plating instructions, or celebratory messages."
              className="w-full rounded-3xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-white">Summary</h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxes &amp; fees</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-serif text-xl text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!items.length}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 px-6 py-3 text-sm uppercase tracking-[0.3em] text-black shadow-lg shadow-emerald-400/40 transition hover:shadow-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm Order
          </button>
          {statusMessage && (
            <div className="mt-4 rounded-3xl border border-emerald-400/50 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-100">
              <CheckCircleIcon className="mr-2 inline h-5 w-5 align-middle" />
              {statusMessage}
            </div>
          )}
        </div>

        {latestOrder && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-2xl text-white">Live Order Status</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <p>Order #{latestOrder.id.slice(0, 8).toUpperCase()}</p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                <span>{latestOrder.status}</span>
                <span>
                  ETA ·{" "}
                  {latestOrder.estimatedDelivery
                    ? new Date(latestOrder.estimatedDelivery).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Awaiting"}
                </span>
                <span>{latestOrder.items.length} courses</span>
              </div>
              <p className="text-xs text-zinc-500">
                Notifications: Email {user?.email ?? "guest"} · SMS concierge on request.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
