import React, { JSX } from "react";
import { Link } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import TopTrend from "../TopTrend";
import { Trend, SavedTrendObject } from "../../types";

interface HotTrendsSectionProps {
  topTrends: Trend[] | null;
  hotTrendsLoading: boolean;
  savedTrends: SavedTrendObject[] | null;
  updateTopTrends: () => void;
  getLoadingTrendElements: () => JSX.Element[];
}

const HotTrendsSection: React.FC<HotTrendsSectionProps> = ({
  topTrends,
  hotTrendsLoading,
  savedTrends,
  updateTopTrends,
  getLoadingTrendElements,
}) => {
  return (
    <div className="right-body-cont relative">
      <button
        disabled={hotTrendsLoading}
        className={hotTrendsLoading ? "cursor-default" : "cursor-pointer"}
        onClick={() => updateTopTrends()}
      >
        <RefreshCcw
          className={`absolute right-5 top-4 ${
            hotTrendsLoading ? "animate-spin" : ""
          }`}
          style={{
            animationDuration: "800ms",
            animationTimingFunction: "cubic-bezier(0.55, 0.09, 0.41, 0.95)",
            animationDirection: "reverse",
            animationIterationCount: "infinite",
          }}
          color="#bdbdbd"
          size={28}
        ></RefreshCcw>
      </button>
      <Link to="/hottrends" className="w-fit" style={{ textDecoration: "none" }}>
        <h1 className="section-title">Hot 🔥🔥🔥</h1>
      </Link>
      <div className="top-trends-wrapper">
        {topTrends &&
          !hotTrendsLoading &&
          topTrends.map((trend: Trend, index: number) => (
            <TopTrend
              key={index}
              trend={trend}
              index={index}
              savedTrends={savedTrends}
              total={topTrends.length}
            />
          ))}
        {topTrends && !hotTrendsLoading && (
          <Link to="/hottrends" className="view-more">
            View More
          </Link>
        )}
        {hotTrendsLoading && getLoadingTrendElements()}
      </div>
    </div>
  );
};

export default HotTrendsSection;
