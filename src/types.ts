interface Trend {
  category: string;
  title: string;
  moreRelevantValue: number;
  moreInfo: string;
  link: string;
  id: string;
  score: number;
}

interface ListTrend {
  category: string;
  id: string;
  title: string;
  moreInfo: string;
  link: string;
  score: number;
  dateSaved?: string;
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
  avatar: string;
}

interface SavedTrendObject {
  postId: string;
  postCategory: string;
  dateSaved: string;
}

interface GoogleTrendsData {
  interest_over_time: {
    timeline_data: Array<object>;
  };
  score: number;
  search_metadata: {
    id: string;
    status: string;
    created_at: string;
    processed_at: string;
    json_endpoint: string;
  };
  search_parameters: {
    q: string;
    hl?: string;
    tz?: string;
    geo?: string;
    date?: string;
  };
  title: string;
  isTrending: boolean;
}

export type { Trend, SpecificTrend, CommentObject, ListTrend, SavedTrendObject, GoogleTrendsData };
