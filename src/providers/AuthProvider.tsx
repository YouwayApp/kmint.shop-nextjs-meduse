"use client";

import { retrieveCustomer, signout } from "@/lib/data/customer";
import { HttpTypes } from "@medusajs/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface AuthContextType {
  customer: HttpTypes.StoreCustomer | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshCustomer: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch customer data
  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // helpful debug
      // console.log("🔐 Fetching customer data...");
      const customerData = await retrieveCustomer();

      setCustomer(customerData);

      setIsLoggedIn(!!customerData);

      // console.log("✅ Customer data loaded:", customerData ? "Authenticated" : "Not authenticated");
    } catch (err) {
      console.error("Error fetching customer:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch customer data"
      );
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCustomer = async () => {
    await fetchCustomer();
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current country code from URL or default
      const countryCode = window.location.pathname.split("/")[1] || "us";
      await signout(countryCode);

      // Clear local state
      setCustomer(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      console.error("Error during logout:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load customer data on mount
  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const value: AuthContextType = {
    customer,
    loading,
    error,
    isAuthenticated: isLoggedIn,
    refreshCustomer,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Convenience hooks for authentication
export function useCustomer() {
  const { customer, loading, error, isAuthenticated } = useAuth();

  return {
    customer,
    loading,
    error,
    isAuthenticated,
    isLoggedIn: isAuthenticated,
    customerName: customer
      ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
      : "",
    customerEmail: customer?.email || "",
    customerId: customer?.id || "",
  };
}

export function useAuthActions() {
  const { refreshCustomer, logout } = useAuth();

  return {
    refreshCustomer,
    logout,
  };
}
