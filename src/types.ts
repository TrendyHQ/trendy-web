interface Trend {
  category: string;
  title: string;
  moreRelevantValue: number;
  moreInfo: string;
  link: string;
}

interface SpecificTrend {
  id: string;
  title: string;
  moreInfo: string;
  link: string;
}

export type { Trend, SpecificTrend };
