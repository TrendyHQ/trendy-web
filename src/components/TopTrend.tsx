import { football } from "@lucide/lab";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Shirt,
  Headset,
  CupSoda,
  Clapperboard,
  MessageCircle,
  Dumbbell,
  HeartPulse,
  Music,
  Flag,
  Plane,
  FlaskConical,
  Icon,
  Star,
} from "lucide-react";
import { Trend } from "../types";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function TopTrend({
  trend,
  index,
  functions,
  savedTrends,
}: {
  trend: Trend;
  index: number;
  functions: {
    setFullTrendName: (name: string) => void;
    setTrendDescription: (description: string) => void;
    setTrendLink: (link: string) => void;
  };
  savedTrends: string[] | null;
}) {
  const { user } = useAuth0();

  const { setFullTrendName, setTrendDescription, setTrendLink } = functions;

  const isTrendSaved = savedTrends?.includes(trend.id) || false;
  const [trendSaved, setTrendSaved] = useState<boolean>(isTrendSaved);

  const getRelevancy = (moreRelevantValue: number) => {
    if (moreRelevantValue === 1) {
      return <ArrowUp size={30} color="#0E8800" />;
    } else if (moreRelevantValue === 0) {
      return <ArrowDown size={30} color="#D80000" />;
    } else if (moreRelevantValue === -1) {
      return <Minus size={30} color="#858585" />;
    }
  };

  const handleTrendClick = (trend: Trend) => {
    setFullTrendName(trend.title);
    if (trend.moreInfo !== "") setTrendDescription(trend.moreInfo);
    else setTrendLink(trend.link);
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
      case "social":
        return <MessageCircle size={size} />;
      case "fitness":
        return <Dumbbell size={size} />;
      case "wellness":
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
    setTrendSaved(!trendSaved);

    await axios.patch("http://localhost:8080/api/users/saveTrend", {
      userId: user?.sub,
      trendId: trend.id,
      saveTrend: !trendSaved,
    });
  };

  return (
    <div key={"topTrend" + index}>
      <div className="top-trend">
        <Star
          size={30}
          color="yellow"
          fill={trendSaved ? "yellow" : "none"}
          onClick={handleTrendSave}
        />
        <div className="vertical-divider"></div>
        <div className="top-trend-icon" onClick={() => handleTrendClick(trend)}>
          {getIcon(trend.category)}
        </div>
        <h2 className="top-trend-name" onClick={() => handleTrendClick(trend)}>
          {trend.title.length > 50
            ? trend.title.substring(0, 50) + "..."
            : trend.title}
        </h2>
        <div onClick={() => handleTrendClick(trend)}>
          {getRelevancy(trend.moreRelevantValue)}
        </div>
      </div>
      {index < 5 && <div className="trend-divider"></div>}
    </div>
  );
}
