import { signal } from "@preact/signals-react";
import { ListTrend, Trend } from "./types";

const currentTopTrends = signal<Trend[] | null>(null);
const currentFavorites = signal<ListTrend[]>([]);
const currentHasSetUpAccount = signal<boolean | null>(null);
const testing = false;

export { testing, currentTopTrends, currentFavorites, currentHasSetUpAccount };
