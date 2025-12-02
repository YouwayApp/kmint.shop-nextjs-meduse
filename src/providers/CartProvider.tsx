"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { HttpTypes } from "@medusajs/types";
import {
  retrieveCart,
  addToCart,
  updateLineItem,
  deleteLineItem,
} from "@/lib/data/cart";

interface CartContextType {
  cart: HttpTypes.StoreCart | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItemToCart: (
    variantId: string,
    quantity: number,
    countryCode: string
  ) => Promise<void>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (lineId: string) => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cartData = await retrieveCart();

      setCart(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch cart data"
      );
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh cart data
  const refreshCart = async () => {
    await fetchCart();
  };

  // Add item to cart
  const addItemToCart = async (
    variantId: string,
    quantity: number,
    countryCode: string
  ) => {
    try {
      setError(null);
      await addToCart({ variantId, quantity, countryCode });
      await refreshCart(); // Refresh cart after adding item
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add item to cart"
      );
      throw err; // Re-throw to let component handle the error
    }
  };

  // Update item quantity
  const updateItemQuantity = async (lineId: string, quantity: number) => {
    try {
      setError(null);
      await updateLineItem({ lineId, quantity });
      await refreshCart(); // Refresh cart after updating
    } catch (err) {
      console.error("Error updating item quantity:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update item quantity"
      );
      throw err; // Re-throw to let component handle the error
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (lineId: string) => {
    try {
      setError(null);
      await deleteLineItem(lineId);
      await refreshCart(); // Refresh cart after removing item
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove item from cart"
      );
      throw err; // Re-throw to let component handle the error
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total
  const getCartTotal = () => {
    if (!cart?.total) return 0;
    return cart.total; // Convert from cents to dollars
  };

  // Auto-load cart data on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    refreshCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Convenience hooks for specific cart data
export function useCartItems() {
  const { cart, loading, error } = useCart();
  return {
    items: cart?.items || [],
    loading,
    error,
  };
}

export function useCartTotals() {
  const { cart, loading, error, getCartTotal, getCartItemCount } = useCart();
  return {
    total: getCartTotal(),
    itemCount: getCartItemCount(),
    subtotal: cart?.subtotal ? cart.subtotal / 100 : 0,
    tax: cart?.tax_total ? cart.tax_total / 100 : 0,
    shipping: cart?.shipping_total ? cart.shipping_total / 100 : 0,
    loading,
    error,
  };
}

export function useCartActions() {
  const { addItemToCart, updateItemQuantity, removeItemFromCart, refreshCart } =
    useCart();
  return {
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    refreshCart,
  };
}
