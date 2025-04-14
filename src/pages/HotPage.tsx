import { useEffect, useRef, useState } from "react";
import TopTrend from "../components/TopTrend";
import axios from "axios";
import { SavedTrendObject, Trend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { currentFavoritePostIds, currentHotTrends } from "../Constants";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

export default function HotPage() {
  const { user, isLoading, isAuthenticated } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(
    currentHotTrends.value
  );
  const [savedTrends, setSavedTrends] = useState<SavedTrendObject[] | null>(
    currentFavoritePostIds.value
  );
  const [hotTrendsLoading, setHotTrendsLoading] = useState<boolean>(false);

  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const updateTopTrends = async () => {
    // Prevent a new update if one is already in progress
    if (hotTrendsLoading || !user) return;

    setHotTrendsLoading(true);

    try {
      const trendsRes = await axios.post(
        "http://localhost:8080/api/reddit/topReddit",
        { requestAmount: 50, userId: user.sub }
      );

      const savedTrendsRes = await axios.get(
        "http://localhost:8080/api/users/getSavedTrends",
        {
          params: {
            userId: user.sub,
          },
        }
      );

      setSavedTrends(savedTrendsRes.data);
      currentFavoritePostIds.value = savedTrendsRes.data;

      setHotTrendsLoading(false);
      currentHotTrends.value = trendsRes.data;
      setTopTrends(trendsRes.data);
    } catch (error) {
      console.error("Error updating top trends:", error);
    }
  };

  useEffect(() => {
    if (currentHotTrends.value === null || currentHotTrends.value.length === 0)
      updateTopTrends();
    console.log(currentHotTrends.value);

    // Set up the interval if it's not already set
    if (updateTrendsIntervalRef.current === null) {
      updateTrendsIntervalRef.current = setInterval(() => {
        updateTopTrends();
      }, 180000); // 180,000ms = 3 minutes
    }

    // Clean up the interval on component unmount
    return () => {
      if (updateTrendsIntervalRef.current !== null) {
        clearInterval(updateTrendsIntervalRef.current);
      }
    };
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (hotTrendsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="bodyCont">
      <Header />
      <div
        className="right-body-cont"
        style={{ width: "95%", margin: "20px auto", height: "fit-content" }}
      >
        <h1 className="section-title">Hot 🔥🔥🔥</h1>
        <div className="top-trends-wrapper">
          {topTrends &&
            topTrends.map((trend: Trend, index: number) => (
              <TopTrend
                key={index}
                trend={trend}
                index={index}
                savedTrends={savedTrends}
                total={topTrends.length}
              />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
