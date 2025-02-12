import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function FavoritesPage() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
            fetchFavorites();
    }, []);

    async function fetchFavorites() {
        try {
            
            const response = await axios.get("http://localhost:8080/api/users/getUsersTrends", {
                params: {
                    userId: user?.sub,
                },
                withCredentials: true,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    if (!isAuthenticated && !isLoading) {
        return <Navigate to="/" />;
    }

  return (
    <div>
      <h1>Favorites Page</h1>
    </div>
  );
}