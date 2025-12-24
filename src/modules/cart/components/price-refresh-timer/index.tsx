"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { refreshCartPrices } from "@lib/data/cart-refresh";
import { useCart } from "@/providers/CartProvider";

interface PriceRefreshTimerProps {
  intervalMinutes?: number;
  textColor?: string;
  iconColor?: string;
  timeColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const PriceRefreshTimer: React.FC<PriceRefreshTimerProps> = ({
  intervalMinutes = 3,
  textColor = "text-white",
  iconColor = "text-white",
  timeColor = "text-white",
  buttonColor = "text-white",
  buttonHoverColor = "hover:text-white/80",
  backgroundColor = "bg-white/10",
  borderColor = "border-white/20",
}) => {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [timeRemaining, setTimeRemaining] = useState(intervalMinutes * 60); // seconds
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    try {
      setIsRefreshing(true);
      await refreshCartPrices();
      await refreshCart(); // Refresh cart in context
      router.refresh(); // Force Next.js to re-render the page with new data
      setLastRefreshTime(new Date());
      setTimeRemaining(intervalMinutes * 60); // Reset timer
    } catch (error) {
      console.error("Error refreshing cart prices:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCart, intervalMinutes, isRefreshing, router]);

  useEffect(() => {
    // Set up interval timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up, trigger refresh
          // Use a flag to prevent multiple calls
          if (!isRefreshing) {
            handleRefresh();
          }
          return intervalMinutes * 60; // Reset to full interval
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [intervalMinutes, handleRefresh, isRefreshing]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center gap-2 p-3 ${backgroundColor} border ${borderColor}`}
    >
      <div className="flex items-center gap-2">
        <svg
          className={`w-5 h-5 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className={`text-sm font-medium ${textColor}`}>
          Fiyatlar otomatik güncelleniyor:
        </span>
        <span className={`text-sm font-bold ${timeColor}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      {isRefreshing && (
        <div className="flex items-center gap-2">
          <div
            className={`animate-spin h-4 w-4 border-b-2 ${iconColor}`}
            style={{ borderColor: "currentColor" }}
          ></div>
          <span className={`text-xs ${textColor}`}>Güncelleniyor...</span>
        </div>
      )}
      {lastRefreshTime && !isRefreshing && (
        <span className={`text-xs ${textColor} opacity-70`}>
          Son güncelleme: {lastRefreshTime.toLocaleTimeString("tr-TR")}
        </span>
      )}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`ml-auto text-xs ${buttonColor} ${buttonHoverColor} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Şimdi Güncelle
      </button>
    </div>
  );
};

export default PriceRefreshTimer;
