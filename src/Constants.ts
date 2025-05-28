import { signal } from "@preact/signals-react";
import { GoogleTrendsData, ListTrend, SavedTrendObject, Trend } from "./types";

const currentTopTrends = signal<Trend[] | null>(null);
const currentHotTrends = signal<Trend[] | null>(null);
const currentFavorites = signal<ListTrend[]>([]);
const currentFavoritePostIds = signal<SavedTrendObject[]>([]);
const currentHasSetUpAccount = signal<boolean>(false);
const storedTopTrends = signal<GoogleTrendsData[]>([]);
const testing = false;

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export {
  testing,
  currentTopTrends,
  currentHotTrends,
  currentFavorites,
  currentHasSetUpAccount,
  currentFavoritePostIds,
  storedTopTrends,
  API_BASE_URL,
};
