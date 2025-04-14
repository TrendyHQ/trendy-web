import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ListTrend, SavedTrendObject } from "../types";
import { currentFavoritePostIds, currentFavorites } from "../Constants";
import "../css/FavoritesPage.css";
import TopTrend from "../components/TopTrend";
import LoadingPage from "./LoadingPage";

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [listOfFavorites, setListOfFavorites] = useState<ListTrend[]>(
    currentFavorites.value
  );
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [savedTrends, setSavedTrends] = useState<SavedTrendObject[] | null>(
    currentFavoritePostIds.value
  );

  /**
   * Fetches the user's favorite trends and saved trends from the server.
   *
   * This function makes two API calls:
   * 1. Gets all trends created by the user (getUsersTrends)
   * 2. Gets all trends saved by the user (getSavedTrends)
   *
   * The fetched data is then:
   * - Sorted alphabetically by title
   * - Stored in the component's state
   * - Stored in shared reference values
   *
   * @async
   * @function fetchFavorites
   * @requires user - The authenticated user object with a sub property (user ID)
   * @throws {Error} If API requests fail
   */
  async function fetchFavorites() {
    if (user?.sub) {
      setPageIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getUsersTrends`,
          {
            params: {
              userId: user.sub,
            },
            withCredentials: true,
          }
        );

        const savedTrendsRes = await axios.get(
          `http://localhost:8080/api/users/getSavedTrends`,
          {
            params: {
              userId: user.sub,
            },
          }
        );

        setSavedTrends(savedTrendsRes.data);
        currentFavoritePostIds.value = savedTrendsRes.data;

        setPageIsLoading(false);
        currentFavorites.value = response.data.sort(
          (a: { title: string }, b: { title: string }) =>
            a.title.localeCompare(b.title)
        );
        setListOfFavorites(
          response.data.sort((a: { title: string }, b: { title: string }) =>
            a.title.localeCompare(b.title)
          )
        );
      } catch (e) {
        console.error(e);
        setPageIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (currentFavorites.value.length === 0) fetchFavorites();
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (pageIsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="bodyCont">
      <Header />
      <div
        className="right-body-cont pb-5"
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
