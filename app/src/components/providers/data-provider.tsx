"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  analyticsSnapshots,
  branches as defaultBranches,
  chefs as defaultChefs,
  heroBackgrounds,
  initialSupportTickets,
  menuCategories,
  menuItems as defaultMenuItems,
  promotions as defaultPromotions,
  testimonials as defaultTestimonials,
} from "@/lib/data";
import type {
  AnalyticSnapshot,
  Branch,
  ChefHighlight,
  MenuCategory,
  MenuItem,
  Order,
  Promotion,
  Reservation,
  SupportTicket,
  Testimonial,
} from "@/lib/types";
import { formatISO } from "date-fns";

interface DataContextValue {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  testimonials: Testimonial[];
  chefs: ChefHighlight[];
  branches: Branch[];
  promotions: Promotion[];
  analytics: AnalyticSnapshot[];
  supportTickets: SupportTicket[];
  reservations: Reservation[];
  orders: Order[];
  heroImages: string[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  removePromotion: (id: string) => void;
  addSupportTicket: (ticket: SupportTicket) => void;
  updateSupportTicket: (id: string, ticket: Partial<SupportTicket>) => void;
  createReservation: (reservation: Reservation) => void;
  updateReservationStatus: (id: string, status: Reservation["status"]) => void;
  createOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const MENU_STORAGE_KEY = "cafenine.menu";
const PROMO_STORAGE_KEY = "cafenine.promotions";
const SUPPORT_STORAGE_KEY = "cafenine.support";
const RESERVATION_STORAGE_KEY = "cafenine.reservations";
const ORDER_STORAGE_KEY = "cafenine.orders";

const DataContext = createContext<DataContextValue | undefined>(undefined);

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    const parsed = JSON.parse(value) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

function persist<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    safeRead<MenuItem[]>(MENU_STORAGE_KEY, defaultMenuItems),
  );
  const [promotions, setPromotions] = useState<Promotion[]>(() =>
    safeRead<Promotion[]>(PROMO_STORAGE_KEY, defaultPromotions),
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    safeRead<SupportTicket[]>(SUPPORT_STORAGE_KEY, initialSupportTickets),
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    safeRead<Reservation[]>(RESERVATION_STORAGE_KEY, []),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeRead<Order[]>(ORDER_STORAGE_KEY, []),
  );

  useEffect(() => {
    persist(MENU_STORAGE_KEY, menuItems);
  }, [menuItems]);

  useEffect(() => {
    persist(PROMO_STORAGE_KEY, promotions);
  }, [promotions]);

  useEffect(() => {
    persist(SUPPORT_STORAGE_KEY, supportTickets);
  }, [supportTickets]);

  useEffect(() => {
    persist(RESERVATION_STORAGE_KEY, reservations);
  }, [reservations]);

  useEffect(() => {
    persist(ORDER_STORAGE_KEY, orders);
  }, [orders]);

  const addMenuItem = useCallback((item: MenuItem) => {
    setMenuItems((prev) => [{ ...item }, ...prev]);
  }, []);

  const updateMenuItem = useCallback((id: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((existing) =>
        existing.id === id ? { ...existing, ...item } : existing,
      ),
    );
  }, []);

  const removeMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addPromotion = useCallback((promotion: Promotion) => {
    setPromotions((prev) => [{ ...promotion }, ...prev]);
  }, []);

  const updatePromotion = useCallback((id: string, promotion: Partial<Promotion>) => {
    setPromotions((prev) =>
      prev.map((existing) =>
        existing.id === id
          ? { ...existing, ...promotion, updatedAt: formatISO(new Date()) }
          : existing,
      ),
    );
  }, []);

  const removePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSupportTicket = useCallback((ticket: SupportTicket) => {
    setSupportTickets((prev) => [{ ...ticket }, ...prev]);
  }, []);

  const updateSupportTicket = useCallback(
    (id: string, ticket: Partial<SupportTicket>) => {
      setSupportTickets((prev) =>
        prev.map((existing) =>
          existing.id === id
            ? {
                ...existing,
                ...ticket,
                updatedAt: formatISO(new Date()),
              }
            : existing,
        ),
      );
    },
    [],
  );

  const createReservation = useCallback((reservation: Reservation) => {
    setReservations((prev) => [{ ...reservation }, ...prev]);
  }, []);

  const updateReservationStatus = useCallback(
    (id: string, status: Reservation["status"]) => {
      setReservations((prev) =>
        prev.map((existing) =>
          existing.id === id ? { ...existing, status } : existing,
        ),
      );
    },
    [],
  );

  const createOrder = useCallback((order: Order) => {
    setOrders((prev) => [{ ...order }, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(
    (id: string, status: Order["status"]) => {
      setOrders((prev) =>
        prev.map((existing) =>
          existing.id === id ? { ...existing, status } : existing,
        ),
      );
    },
    [],
  );

  const value = useMemo<DataContextValue>(
    () => ({
      categories: menuCategories,
      menuItems,
      testimonials: defaultTestimonials,
      chefs: defaultChefs,
      branches: defaultBranches,
      promotions,
      analytics: analyticsSnapshots,
      supportTickets,
      reservations,
      orders,
      heroImages: heroBackgrounds,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      addPromotion,
      updatePromotion,
      removePromotion,
      addSupportTicket,
      updateSupportTicket,
      createReservation,
      updateReservationStatus,
      createOrder,
      updateOrderStatus,
    }),
    [
      addMenuItem,
      addPromotion,
      addSupportTicket,
      createOrder,
      createReservation,
      menuItems,
      orders,
      promotions,
      reservations,
      supportTickets,
      updateMenuItem,
      updateOrderStatus,
      updatePromotion,
      updateReservationStatus,
      updateSupportTicket,
      removeMenuItem,
      removePromotion,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
