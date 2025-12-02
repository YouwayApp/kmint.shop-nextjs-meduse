"use client";

import { getRegion } from "@/lib/data/regions";
import { SiteConfig } from "@/types/site-config";
import {
  getAppConfigs,
  refreshAppConfigs,
} from "@/app/actions/global/site-config";
import { getCategories } from "@/app/actions/meduse/categories";
import { HttpTypes } from "@medusajs/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SiteContextType {
  configs: SiteConfig[];
  loading: boolean;
  error: string | null;
  getConfig: (key: string, defaultValue?: any) => any;
  getConfigsByGroup: (groupName: string) => SiteConfig[];
  refreshConfigs: () => Promise<void>;
  countryCode: string;
  lastFetched: number | null;
  isStale: boolean;
  // Categories state
  categories: HttpTypes.StoreProductCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  refreshCategories: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

interface SiteProviderProps {
  children: React.ReactNode;
  params?: {
    countryCode?: string;
  };
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = "site-configs-caches";

interface CacheData {
  configs: SiteConfig[];
  timestamp: number;
}

export function SiteProvider({ children, params }: SiteProviderProps) {
  const [configs, setConfigs] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // Categories state
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Check if cache is valid
  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  // Load from cache
  const loadFromCache = (): SiteConfig[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);

      if (isCacheValid(cacheData.timestamp)) {
        console.log("📦 Loading site configs from cache");
        return cacheData.configs;
      } else {
        console.log("⏰ Cache expired, will fetch fresh data");
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error("Error loading from cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // Save to cache
  const saveToCache = (configs: SiteConfig[]) => {
    try {
      const cacheData: CacheData = {
        configs,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log("💾 Site configs saved to cache");
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const fetchConfigs = async (forceRefresh = false) => {
    try {
      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedConfigs = loadFromCache();
        if (cachedConfigs) {
          setConfigs(cachedConfigs);
          setLastFetched(Date.now());
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      console.log("🌐 Fetching site configs from server action...");

      // Use server action instead of direct API call
      const fetchedConfigs = forceRefresh
        ? await refreshAppConfigs()
        : await getAppConfigs();

      setConfigs(fetchedConfigs);
      setLastFetched(Date.now());

      // Save to cache
      saveToCache(fetchedConfigs);
    } catch (err) {
      console.error("Error fetching site configs:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch site configs"
      );
    } finally {
      setLoading(false);
    }
  };

  const getConfig = (key: string, defaultValue?: any) => {
    const config = configs.find((c) => c.key === key);
    if (!config) return defaultValue;

    // Convert value based on data type
    switch (config.dataType) {
      case "number":
        return Number(config.value);
      case "boolean":
        return config.value === "true";
      case "json":
        try {
          return JSON.parse(config.value);
        } catch {
          return defaultValue;
        }
      default:
        return config.value;
    }
  };

  const getConfigsByGroup = (groupName: string) => {
    return configs
      .filter((config) => config.groupName === groupName)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const refreshConfigs = async () => {
    await fetchConfigs(true); // Force refresh
  };

  // Fetch categories using server action
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      console.log("📂 Fetching categories from server action...");
      const fetchedCategories = await getCategories();

      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoriesError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  // Auto-load configs and categories on mount
  useEffect(() => {
    fetchConfigs();
    fetchCategories();
  }, []);

  // Auto-refresh when cache becomes stale
  useEffect(() => {
    if (!lastFetched) return;

    const checkStaleness = () => {
      if (lastFetched && !isCacheValid(lastFetched)) {
        console.log("🔄 Cache is stale, auto-refreshing...");
        fetchConfigs();
      }
    };

    // Check every minute
    const interval = setInterval(checkStaleness, 60000);

    return () => clearInterval(interval);
  }, [lastFetched]);

  useEffect(() => {
    if (params?.countryCode) {
      setCountryCode(params.countryCode);
    }
  }, [params?.countryCode]);

  // Check if data is stale
  const isStale = lastFetched ? !isCacheValid(lastFetched) : false;

  const value: SiteContextType = {
    configs,
    loading,
    error,
    getConfig,
    getConfigsByGroup,
    refreshConfigs,
    countryCode,
    lastFetched,
    isStale,
    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteConfig() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteProvider");
  }
  return context;
}

// Convenience hooks for common configs
export function useSiteInfo() {
  const { getConfig } = useSiteConfig();

  return {
    name: getConfig("site.name", "My Store"),
    tagline: getConfig("site.tagline", "Your One-Stop Shop"),
    description: getConfig(
      "site.description",
      "We offer the best products with exceptional service"
    ),
    logo: getConfig("site.logo", ""),
    favicon: getConfig("site.favicon", ""),
  };
}

export function useContactInfo() {
  const { getConfig } = useSiteConfig();

  return {
    email: getConfig("contact.email", ""),
    phone: getConfig("contact.phone", ""),
    address: getConfig("contact.address", ""),
    hours: getConfig("contact.hours", ""),
    supportEmail: getConfig("contact.support_email", ""),
  };
}

export function useSEOConfig() {
  const { getConfig } = useSiteConfig();

  return {
    title: getConfig("seo.default_title", "My Store"),
    description: getConfig("seo.default_description", ""),
    keywords: getConfig("seo.default_keywords", ""),
    googleAnalytics: getConfig("seo.google_analytics", ""),
    googleTagManager: getConfig("seo.google_tag_manager", ""),
  };
}

export function useSocialLinks() {
  const { getConfig } = useSiteConfig();

  return {
    facebook: getConfig("social.facebook", ""),
    twitter: getConfig("social.twitter", ""),
    instagram: getConfig("social.instagram", ""),
    linkedin: getConfig("social.linkedin", ""),
    youtube: getConfig("social.youtube", ""),
  };
}

export function useFeatureFlags() {
  const { getConfig } = useSiteConfig();

  return {
    enableReviews: getConfig("features.enable_reviews", true),
    enableWishlist: getConfig("features.enable_wishlist", true),
    enableNewsletter: getConfig("features.enable_newsletter", true),
    enableLiveChat: getConfig("features.enable_live_chat", false),
    maintenanceMode: getConfig("features.maintenance_mode", false),
  };
}

export function useCacheStatus() {
  const { lastFetched, isStale, refreshConfigs } = useSiteConfig();

  const getTimeUntilExpiry = () => {
    if (!lastFetched) return null;
    const timeLeft = CACHE_DURATION - (Date.now() - lastFetched);
    return Math.max(0, timeLeft);
  };

  const getFormattedTimeLeft = () => {
    const timeLeft = getTimeUntilExpiry();
    if (!timeLeft) return null;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return {
    lastFetched,
    isStale,
    timeUntilExpiry: getTimeUntilExpiry(),
    formattedTimeLeft: getFormattedTimeLeft(),
    refreshConfigs,
  };
}

export function useCategories() {
  const { categories, categoriesLoading, categoriesError, refreshCategories } =
    useSiteConfig();

  // Helper functions for categories
  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const getCategoryByHandle = (handle: string) => {
    return categories.find((category) => category.handle === handle);
  };

  const getRootCategories = () => {
    return categories.filter((category) => !category.parent_category_id);
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter(
      (category) => category.parent_category_id === parentId
    );
  };

  const getCategoryPath = (categoryId: string): string[] => {
    const category = getCategoryById(categoryId);
    if (!category) return [];

    const path: string[] = [category.handle];
    let current = category;

    while (current.parent_category) {
      current = current.parent_category;
      path.unshift(current.handle);
    }

    return path;
  };

  return {
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
    getCategoryById,
    getCategoryByHandle,
    getRootCategories,
    getChildCategories,
    getCategoryPath,
  };
}
