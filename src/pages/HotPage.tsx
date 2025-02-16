import { useEffect, useRef, useState } from "react";
import TopTrend from "../components/TopTrend";
import axios from "axios";
import { Trend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { currentHotTrends } from "../Constants";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HotPage() {
  const { user } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(
    currentHotTrends.value
  );
  const [savedTrends, setSavedTrends] = useState<string[] | null>(null);
  const [hotTrendsLoading, setHotTrendsLoading] = useState<boolean>(false);

  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  async function updateTopTrends() {
    if (user && currentHotTrends.value) {
      try {
        setHotTrendsLoading(true);
        const trendsRes = await axios.post(
          "http://localhost:8080/api/reddit/topReddit",
          30,
          {
            headers: {
              "Content-Type": "text/plain",
            },
            withCredentials: true, // Send cookies
          }
        );

        const savedTrendsRes = await axios.get(
          "http://localhost:8080/api/users/getSavedTrends",
          {
            params: {
              userId: user.sub,
            },
          }
        );

        currentHotTrends.value = trendsRes.data;

        setTopTrends(trendsRes.data);
        setSavedTrends(savedTrendsRes.data);
        setHotTrendsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  }
  useEffect(() => {
    if (currentHotTrends.value == null) updateTopTrends();

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

  if (hotTrendsLoading) {
    return <div>Loading...</div>;
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
