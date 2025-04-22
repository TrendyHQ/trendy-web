import React, { JSX } from "react";
import { Link } from "react-router-dom";
import { ListTrend, SavedTrendObject } from "../../types";
import TopTrend from "../TopTrend";

interface FavoritesSectionProps {
  listOfFavorites: ListTrend[];
  savedTrends: SavedTrendObject[] | null;
  favoriteTrendsLoading: boolean;
  getLoadingTrendElements: () => JSX.Element[];
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  listOfFavorites,
  savedTrends,
  favoriteTrendsLoading,
  getLoadingTrendElements,
}) => {

  return (
    <div className="left-body-cont2" style={{ paddingBottom: 0 }}>
      <Link to="/favorites">
        <h1 className="section-title">Favorites</h1>
      </Link>
      <div className="top-trends-wrapper">
        {listOfFavorites &&
          !favoriteTrendsLoading &&
          listOfFavorites
            .slice(0, 5)
            .map((trend: ListTrend, index: number) => (
              <TopTrend
                key={index}
                trend={trend}
                index={index}
                savedTrends={savedTrends}
                total={Math.min(listOfFavorites.length, 5)}
                isFromHomeFavorites={true}
              />
            ))}
        {listOfFavorites && listOfFavorites.length > 0 && (
          <Link to="/favorites" className="view-more">
            View More
          </Link>
        )}
        {favoriteTrendsLoading && getLoadingTrendElements()}
      </div>
    </div>
  );
};

export default FavoritesSection;
