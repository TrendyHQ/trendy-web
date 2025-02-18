import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { SpecificTrend } from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth0 } from "@auth0/auth0-react";

export default function CategoryInDepth() {
  const { isAuthenticated, isLoading } = useAuth0();

  const location = useLocation();
  const navigate = useNavigate();

  const [trends, setTrends] = useState<SpecificTrend[]>([]);

  const checkCategory = () => {
    const path = location.pathname;
    const category = path.split("/")[2];
    return category;
  };

  const getTrendsForCategory = () => {
    try {
      axios
        .post(
          "http://localhost:8080/api/reddit/topTrendsForCategory",
          checkCategory(),
          {
            headers: {
              "Content-Type": "text/plain",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data);
          setTrends(res.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTrendsForCategory();
  }, []);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bodyCont">
      <Header />
      <div className="category-boxes-wrapper">
        {trends.reduce((groups: JSX.Element[], _, index) => {
          if (index % 3 === 0) {
            const group = trends.slice(index, index + 3);
            groups.push(
              <div className="box-container" key={`group-${index}`}>
                {group.map((trend, i) => (
                  <div
                    className="category-box"
                    onClick={() => navigate(`/trend/${trend.id}`)}
                    key={`${trend.id}-${i}`}
                  >
                    {trend.title} <br />
                  </div>
                ))}
              </div>
            );
          }
          return groups;
        }, [])}
      </div>
      <Footer />
    </div>
  );
}
