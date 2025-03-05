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
  subredditName: string;
  postId: string;
  title: string;
  moreInfo: string;
  link: string;
  score: number;
  otherInformation: {
    comments: CommentObject[];
    likes: number;
    userHasLiked: boolean;
    userHasDisliked: boolean;
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
