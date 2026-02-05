"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Address,
  PaymentMethod,
  UserProfile,
} from "@/lib/types";
import { formatISO } from "date-fns";

interface Credentials {
  email: string;
  password: string;
}

interface SignUpPayload extends Credentials {
  fullName: string;
  phone: string;
}

type UpdateProfilePayload = Partial<
  Omit<UserProfile, "id" | "passwordHash" | "createdAt" | "role">
>;

interface AuthContextValue {
  user: UserProfile | null;
  users: UserProfile[];
  loading: boolean;
  signup: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: Credentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: UpdateProfilePayload) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  toggleFavorite: (menuItemId: string) => void;
  toggleWishlist: (menuItemId: string) => void;
}

const STORAGE_KEY = "cafenine.users";
const ACTIVE_USER_KEY = "cafenine.activeUser";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "admin-cafenine",
    fullName: "Celeste Marlow",
    email: "admin@cafenine.com",
    phone: "+1 212 555 9034",
    avatarColor: "#F97316",
    role: "admin",
    passwordHash: "32b58c7ef11313bd72f5b79af90cf4f5703ea3f015f84140eded02d4320253e0",
    favorites: ["lantern-scallops", "wagyu-embers"],
    wishlist: ["caviar-martini"],
    addresses: [
      {
        id: "admin-address",
        line1: "145 Hudson Yards Blvd",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: "admin-card",
        type: "card",
        label: "Amex Platinum",
        last4: "3021",
        expiry: "10/28",
        isDefault: true,
      },
    ],
    preferences: {
      spiceTolerance: "medium",
      preferredDining: "dine-in",
      dietaryNotes: "Champagne pairing preferred.",
    },
    createdAt: formatISO(new Date("2024-07-24T18:00:00Z")),
    lastLogin: formatISO(new Date("2025-01-04T20:00:00Z")),
  },
];

async function hashPassword(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadStoredUsers(): UserProfile[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_USERS;
  try {
    const parsed = JSON.parse(raw) as UserProfile[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_USERS;
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

function persistUsers(users: UserProfile[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadActiveUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_USER_KEY);
}

function persistActiveUser(userId: string | null) {
  if (typeof window === "undefined") return;
  if (!userId) {
    window.localStorage.removeItem(ACTIVE_USER_KEY);
  } else {
    window.localStorage.setItem(ACTIVE_USER_KEY, userId);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(() => loadStoredUsers());
  const [user, setUser] = useState<UserProfile | null>(() => {
    const activeUserId = loadActiveUser();
    if (!activeUserId) return null;
    const storedUsers = loadStoredUsers();
    return storedUsers.find((candidate) => candidate.id === activeUserId) ?? null;
  });
  const loading = false;

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  const updateUserState = useCallback((updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      setUsers((prev) =>
        prev.map((existing) =>
          existing.id === updatedUser.id ? { ...updatedUser } : existing,
        ),
      );
      persistActiveUser(updatedUser.id);
    } else {
      persistActiveUser(null);
    }
  }, []);

  const signup = useCallback(
    async (payload: SignUpPayload) => {
      const email = normalizeEmail(payload.email);
      const exists = users.find((existing) => existing.email === email);
      if (exists) {
        return { success: false, error: "Account already exists." };
      }
      const passwordHash = await hashPassword(`${email}::${payload.password}`);
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        fullName: payload.fullName,
        email,
        phone: payload.phone,
        role: "member",
        passwordHash,
        favorites: [],
        wishlist: [],
        addresses: [],
        paymentMethods: [],
        createdAt: formatISO(new Date()),
      };
      setUsers((prev) => [...prev, newUser]);
      updateUserState(newUser);
      return { success: true };
    },
    [updateUserState, users],
  );

  const login = useCallback(async (credentials: Credentials) => {
    const email = normalizeEmail(credentials.email);
    const passwordHash = await hashPassword(`${email}::${credentials.password}`);
    const exists = loadStoredUsers().find(
      (candidate) =>
        candidate.email === email && candidate.passwordHash === passwordHash,
    );
    if (!exists) {
      return { success: false, error: "Invalid email or password." };
    }
    const enriched: UserProfile = {
      ...exists,
      lastLogin: formatISO(new Date()),
    };
    updateUserState(enriched);
    return { success: true };
  }, [updateUserState]);

  const logout = useCallback(() => {
    setUser(null);
    persistActiveUser(null);
  }, []);

  const updateProfile = useCallback(
    (updates: UpdateProfilePayload) => {
      setUser((prev) => {
        if (!prev) return prev;
        const nextUser = { ...prev, ...updates };
        setUsers((existing) =>
          existing.map((candidate) =>
            candidate.id === prev.id ? nextUser : candidate,
          ),
        );
        persistActiveUser(prev.id);
        return nextUser;
      });
    },
    [],
  );

  const addAddress = useCallback(
    (address: Address) => {
      setUser((prev) => {
        if (!prev) return prev;
        const addresses = [...prev.addresses, address];
        const nextUser = { ...prev, addresses };
        setUsers((existing) =>
          existing.map((candidate) =>
            candidate.id === prev.id ? nextUser : candidate,
          ),
        );
        persistActiveUser(prev.id);
        return nextUser;
      });
    },
    [],
  );

  const updateAddress = useCallback(
    (addressId: string, address: Partial<Address>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const addresses = prev.addresses.map((item) =>
          item.id === addressId ? { ...item, ...address } : item,
        );
        const nextUser = { ...prev, addresses };
        setUsers((existing) =>
          existing.map((candidate) =>
            candidate.id === prev.id ? nextUser : candidate,
          ),
        );
        return nextUser;
      });
    },
    [],
  );

  const addPaymentMethod = useCallback((method: PaymentMethod) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = {
        ...prev,
        paymentMethods: [...prev.paymentMethods, method],
      };
      setUsers((existing) =>
        existing.map((candidate) =>
          candidate.id === prev.id ? nextUser : candidate,
        ),
      );
      return nextUser;
    });
  }, []);

  const setDefaultPaymentMethod = useCallback((methodId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const paymentMethods = prev.paymentMethods.map((payment) => ({
        ...payment,
        isDefault: payment.id === methodId,
      }));
      const nextUser = { ...prev, paymentMethods };
      setUsers((existing) =>
        existing.map((candidate) =>
          candidate.id === prev.id ? nextUser : candidate,
        ),
      );
      return nextUser;
    });
  }, []);

  const toggleFavorite = useCallback((menuItemId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const favorites = prev.favorites.includes(menuItemId)
        ? prev.favorites.filter((item) => item !== menuItemId)
        : [...prev.favorites, menuItemId];
      const nextUser = { ...prev, favorites };
      setUsers((existing) =>
        existing.map((candidate) =>
          candidate.id === prev.id ? nextUser : candidate,
        ),
      );
      return nextUser;
    });
  }, []);

  const toggleWishlist = useCallback((menuItemId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const wishlist = prev.wishlist.includes(menuItemId)
        ? prev.wishlist.filter((item) => item !== menuItemId)
        : [...prev.wishlist, menuItemId];
      const nextUser = { ...prev, wishlist };
      setUsers((existing) =>
        existing.map((candidate) =>
          candidate.id === prev.id ? nextUser : candidate,
        ),
      );
      return nextUser;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      loading,
      signup,
      login,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      addPaymentMethod,
      setDefaultPaymentMethod,
      toggleFavorite,
      toggleWishlist,
    }),
    [
      addAddress,
      addPaymentMethod,
      loading,
      login,
      logout,
      setDefaultPaymentMethod,
      signup,
      toggleFavorite,
      toggleWishlist,
      updateAddress,
      updateProfile,
      user,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
