import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ListTrend, SavedTrendObject } from "../types";
import { currentFavorites } from "../Constants";
import "../css/FavoritesPage.css";
import TopTrend from "../components/TopTrend";

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [listOfFavorites, setListOfFavorites] = useState<ListTrend[]>(
    currentFavorites.value
  );
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [savedTrends, setSavedTrends] = useState<SavedTrendObject[] | null>(
    null
  );

  useEffect(() => {
    if (currentFavorites.value.length === 0) fetchFavorites();
  }, [user]);

  async function fetchFavorites() {
    if (user?.sub) {
      setPageIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/getUsersTrends",
          {
            params: {
              userId: user.sub,
            },
            withCredentials: true,
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

        setSavedTrends(savedTrendsRes.data);

        setPageIsLoading(false);
        currentFavorites.value = response.data;
        setListOfFavorites(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (pageIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bodyCont">
      <Header />
      <h1 className="text-4xl text-center font-bold">Favorites Page</h1>
      <div
        className="right-body-cont"
        style={{ width: "95%", margin: "20px auto", height: "fit-content" }}
      >
        <h1 className="section-title">Favorites ⭐⭐⭐</h1>
        <div className="top-trends-wrapper">
          {listOfFavorites &&
            listOfFavorites.map((trend: ListTrend, index: number) => (
              <TopTrend
                key={index}
                trend={trend}
                index={index}
                savedTrends={savedTrends}
                total={listOfFavorites.length}
              />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
