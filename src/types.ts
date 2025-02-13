interface Trend {
  category: string;
  title: string;
  moreRelevantValue: number;
  moreInfo: string;
  link: string;
  id: string;
}

interface SpecificTrend {
  category: string;
  id: string;
  title: string;
  moreInfo: string;
  link: string;
  comments: CommentObject[];
}

interface CommentObject {
  userId: string;
  value: string;
  datePublished: string;
  nick: string;
}

export type { Trend, SpecificTrend, CommentObject };
