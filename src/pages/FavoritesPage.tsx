import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ListTrend } from "../types";
import { currentFavorites } from "../Constants";

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [listOfFavorites, setListOfFavorites] = useState<ListTrend[]>(currentFavorites.value);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);

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

  if(pageIsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bodyCont">
      <Header />
      <h1>Favorites Page</h1>
      <div className="favorites-container">
        {listOfFavorites.map((favorite, index) => (
          <Link to={`/trend/${favorite.id}`} key={index}>
            <div className="favorite-trend">{favorite.title}</div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
