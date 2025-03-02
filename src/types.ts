interface Trend {
  category: string;
  title: string;
  moreRelevantValue: number;
  moreInfo: string;
  link: string;
  id: string;
}

interface ListTrend {
  category: string;
  id: string;
  title: string;
  moreInfo: string;
  link: string;
  score: number;
}

interface SpecificTrend {
  category: string;
  id: string;
  title: string;
  moreInfo: string;
  link: string;
  otherInformation: {
    comments: CommentObject[];
    likes: number;
  };
}

interface CommentObject {
  userId: string;
  value: string;
  datePublished: string;
  nick: string;
}

interface SavedTrendObject {
  postId: string;
  postCategory: string;
}

export type { Trend, SpecificTrend, CommentObject, ListTrend, SavedTrendObject };
