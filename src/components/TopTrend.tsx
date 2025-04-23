import { football } from "@lucide/lab";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Shirt,
  Headset,
  CupSoda,
  Clapperboard,
  Share2,
  Dumbbell,
  HeartPulse,
  Music,
  Flag,
  Plane,
  FlaskConical,
  Icon,
  Star,
} from "lucide-react";
import { ListTrend, SavedTrendObject, Trend } from "../types";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { currentFavoritePostIds } from "../Constants";

export default function TopTrend({
  trend,
  index,
  savedTrends,
  total,
  isFromHomeFavorites,
  className,
}: {
  trend: Trend | ListTrend;
  index: number;
  savedTrends: SavedTrendObject[] | null;
  total: number;
  isFromHomeFavorites?: boolean
  className?: string;
}) {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const isTrendSaved =
    savedTrends?.some((savedTrend) => savedTrend.postId === trend.id) || false;
  const [trendSaved, setTrendSaved] = useState<boolean>(isTrendSaved);

  const getRelevancy = (moreRelevantValue: number) => {
    const className = "absolute right-[5px] top-[50%] translate-y-[-50%]";
    if (moreRelevantValue === 1) {
      return <ArrowUp size={30} color="#0E8800" className={className} />;
    } else if (moreRelevantValue === 0) {
      return <ArrowDown size={30} color="#D80000" className={className} />;
    } else if (moreRelevantValue === -1) {
      return <Minus size={30} color="#858585" className={className} />;
    }
  };
  const handleTrendClick = (trend: Trend | ListTrend) => {
    navigate(`/trend/${trend.id}`);
  };

  const getIcon = (categorie: string) => {
    const size = 30;

    switch (categorie) {
      case "fashion":
        return <Shirt size={size} />;
      case "technology":
        return <Headset size={size} />;
      case "food":
        return <CupSoda size={size} />;
      case "entertainment":
        return <Clapperboard size={size} />;
      case "socialmedia":
        return <Share2 size={size} />;
      case "fitness":
        return <Dumbbell size={size} />;
      case "health":
        return <HeartPulse size={size} />;
      case "music":
        return <Music size={size} />;
      case "politics":
        return <Flag size={size} />;
      case "travel":
        return <Plane size={size} />;
      case "science":
        return <FlaskConical size={size} />;
      case "sports":
        return <Icon iconNode={football} size={size} />;
    }
  };

  const handleTrendSave = async () => {
    const newTrendState: boolean = !trendSaved;
    setTrendSaved(newTrendState);

    await axios.patch("http://localhost:8080/api/users/saveTrend", {
      userId: user?.sub,
      trendId: trend.id,
      saveTrend: !trendSaved,
      trendCategory: trend.category,
    });

    if (newTrendState) {
      currentFavoritePostIds.value = [
        ...currentFavoritePostIds.value,
        {
          postId: trend.id,
          postCategory: trend.category,
        },
      ];
    } else {
      currentFavoritePostIds.value = currentFavoritePostIds.value.filter(
        (element) => element.postId !== trend.id
      );
    }
  };

  return (
    <div key={"topTrend" + index} className={className}>
      <div className={"top-trend hover:bg-[#00000030] pl-2 pr-2 pt-1 pb-1 rounded-s relative " + className}>
        <Star
          size={30}
          color="#FFD700"
          strokeWidth={1.5}
          fill={trendSaved ? "#FFD700" : "none"}
          onClick={handleTrendSave}
          style={{minWidth: '30px', minHeight: '30px'}}
        />
        <div className="vertical-divider"></div>
        <div className="top-trend-icon" onClick={() => handleTrendClick(trend)}>
          {getIcon(trend.category)}
        </div>
        <h2 className="top-trend-name" style={isFromHomeFavorites ? { fontSize: '1.25rem' } : {}} onClick={() => handleTrendClick(trend)}>
          {trend.title.length > 50
            ? trend.title.substring(0, 50) + "..."
            : trend.title}
        </h2>
        {(trend as Trend).moreRelevantValue !== undefined &&
          (trend as Trend).moreRelevantValue !== null && (
            <div onClick={() => handleTrendClick(trend)}>
              {getRelevancy((trend as Trend).moreRelevantValue)}
            </div>
          )}
      </div>
      {index < total - 1 && <div className="trend-divider rounded mt-[2px] mb-[2px]"></div>}
    </div>
  );
}
