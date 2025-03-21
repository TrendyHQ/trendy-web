import { signal } from "@preact/signals-react";
import { GoogleTrendsData, ListTrend, SavedTrendObject, Trend } from "./types";

const currentTopTrends = signal<Trend[] | null>(null);
const currentHotTrends = signal<Trend[] | null>(null);
const currentFavorites = signal<ListTrend[]>([]);
const currentFavoritePostIds = signal<SavedTrendObject[]>([]);
const currentHasSetUpAccount = signal<boolean>(false);
const storedTopTrends = signal<GoogleTrendsData[]>([]);
const testing = false;

export {
  testing,
  currentTopTrends,
  currentHotTrends,
  currentFavorites,
  currentHasSetUpAccount,
  currentFavoritePostIds,
  storedTopTrends,
};
