import axios from "axios";
import { JSX, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Trend } from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingPage from "./LoadingPage";

export default function CategoryInDepth() {
  const { isAuthenticated, isLoading } = useAuth0();

  const location = useLocation();
  const navigate = useNavigate();

  const [trends, setTrends] = useState<Trend[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);

  const checkCategory = () => {
    const path = location.pathname;
    const category = path.split("/")[2];
    return category;
  };

  const getTrendsForCategory = () => {
    try {
      setPageIsLoading(true);
      axios
        .post(
          "http://localhost:8080/api/reddit/topTrendsForCategory",
          { categoryName: checkCategory() },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setTrends(res.data);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setPageIsLoading(false);
    }
  };

  useEffect(() => {
    getTrendsForCategory();
  }, []);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (pageIsLoading || trends.length === 0) {
    return <LoadingPage />;
  }

  function calculateScoreWidth(score: number, maxScore: number): number {
    // Use logarithmic scale but normalize so max score is exactly 100%
    const logScore = Math.log10(score + 1); // +1 to handle score=0
    const logMaxScore = Math.log10(maxScore + 1);
    
    // Blend log scale (70%) with linear scale (30%) for better distribution
    const blendedScore = (0.7 * (logScore / logMaxScore)) + (0.3 * (score / maxScore));
    
    // Convert to percentage (0-100)
    return blendedScore * 100;
  }

  return (
    <div className="bodyCont">
      <Header />
      <div className="category-title">
        <h1>{checkCategory()}</h1>
        <p>Explore the top trends in this category</p>
      </div>
      <div className="category-boxes-wrapper">
        {(() => {
          // Find maximum score among all trends
          const maxScore = Math.max(...trends.map(trend => trend.score));
          
          return trends.reduce((groups: JSX.Element[], _, index) => {
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
                      <div className="trend-header flex-col">
                        <h3 className="trend-title">{trend.title}</h3>
                        <div className="trend-score w-100">
                          <div className="upvote-count">
                            <i className="fa fa-arrow-up"></i>
                            <span className="score-value">{trend.score.toLocaleString()}</span>
                          </div>
                          <div className="score-bar">
                            <div 
                              className="score-indicator" 
                              style={{ 
                                width: `${calculateScoreWidth(trend.score, maxScore)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="trend-content">
                        <p className="trend-info">{trend.moreInfo.length > 180 ? 
                          `${trend.moreInfo.substring(0, 180)}...` : 
                          trend.moreInfo}
                        </p>
                      </div>
                      <div className="trend-footer">
                        <span className="view-more">View details</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return groups;
          }, []);
        })()}
      </div>
      <Footer />
    </div>
  );
}
