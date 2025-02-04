import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Home.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ArrowDown,
  ArrowUp,
  Clapperboard,
  CupSoda,
  Dumbbell,
  FlaskConical,
  Headset,
  HeartPulse,
  Icon,
  MessageCircle,
  Minus,
  Music,
  Plane,
  Shirt,
  Flag,
} from "lucide-react";
import { football } from "@lucide/lab";
import { Trend } from "../types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(null);
  const [hotTrendsLoading, setHotTrendsLoading] = useState(false);
  const [fullTrendName, setFullTrendName] = useState<string | null>(null);
  const [trendDescription, setTrendDescription] = useState<string | null>(null);
  const [trendLink, setTrendLink] = useState<string | null>(null);

  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const getIcon = (categorie: string) => {
    const size = 30;

    switch (categorie) {
      case "fashion":
        return <Shirt size={size} />;
      case "technology":
        return <Headset size={size} />;
      case "food":
        return <CupSoda size={size} />;
      case "entertainment":
        return <Clapperboard size={size} />;
      case "social":
        return <MessageCircle size={size} />;
      case "fitness":
        return <Dumbbell size={size} />;
      case "wellness":
        return <HeartPulse size={size} />;
      case "music":
        return <Music size={size} />;
      case "politics":
        return <Flag size={size} />;
      case "travel":
        return <Plane size={size} />;
      case "science":
        return <FlaskConical size={size} />;
      case "sports":
        return <Icon iconNode={football} size={size} />;
    }
  };

  const updateTopTrends = async () => {
    // Prevent a new update if one is already in progress
    if (hotTrendsLoading) return;

    setHotTrendsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/reddit/topReddit",
        {},
        {
          withCredentials: true, // Send cookies
        }
      );
      console.log(res.data);
      setTopTrends(res.data);
    } catch (error) {
      console.error("Error updating top trends:", error);
    } finally {
      setHotTrendsLoading(false);
    }
  };

  useEffect(() => {
    // Perform an immediate update on component mount
    updateTopTrends();

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
  }, []);

  const getRelevancy = (moreRelevantValue: number) => {
    if (moreRelevantValue === 1) {
      return <ArrowUp size={30} color="#0E8800" />;
    } else if (moreRelevantValue === 0) {
      return <ArrowDown size={30} color="#D80000" />;
    } else if (moreRelevantValue === -1) {
      return <Minus size={30} color="#858585" />;
    }
  };

  const handleTrendClick = (trend: Trend) => {
    setFullTrendName(trend.title);
    if (trend.moreInfo !== "") setTrendDescription(trend.moreInfo);
    else setTrendLink(trend.link);
  };

  const handleTrendOffClick = () => {
    setFullTrendName(null);
    setTrendDescription(null);
    setTrendLink(null);
  };

  if (isLoading) {
    return (
      <div className="bodyCont">
        <Header />
        <div className="content bottom">
          <div className="header-wrapper">
            <div className="header-cont loading"></div>
          </div>
          <div className="body-wrapper">
            <div className="left-body-cont loading"></div>
            <div className="right-body-cont loading"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        {fullTrendName && (
          <div className="trendContainer">
            <div className="clickable" onClick={handleTrendOffClick}></div>
            <div className="trendBox">
              {fullTrendName}
              {trendDescription && (
                <>
                  <br /> <br />
                  {trendDescription}
                </>
              )}
              {trendLink && (
                <>
                  <br />
                  <br />
                  <a href={trendLink} target="blank">
                    {trendLink}
                  </a>
                </>
              )}
            </div>
          </div>
        )}
        <div className="bodyCont">
          <Header />
          <div className="content bottom">
            <div className="header-wrapper">
              <div className="header-cont">
                <div className="text">
                  <h1 className="section-title header">
                    Evaluate the trends of the world with a simple click, using
                    AI
                  </h1>
                  <p className="section-text header">
                    Explore current and upcoming trends to find all sorts of
                    statistics like relevancy, start date, and more.
                  </p>
                  <button id="try-it-button">Try It Now</button>
                </div>
                <div className="geometric-bg"></div>
              </div>
            </div>
            <div className="body-wrapper">
              <div className="left-body-cont">
                <Link to="/categories">
                  <h1 className="section-title">Categories</h1>
                </Link>
                <div className="categories-wrapper">
                  <Link to="/categories/fashion">
                    <button className="categoryButton fashion">
                      <Shirt size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/technology">
                    <button className="categoryButton technology">
                      <Headset size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/foodandbeverages">
                    <button className="categoryButton food">
                      <CupSoda size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/entertainment">
                    <button className="categoryButton entertainment">
                      <Clapperboard size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/socialmedia">
                    <button className="categoryButton social">
                      <MessageCircle size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/fitness">
                    <button className="categoryButton fitness">
                      <Dumbbell size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/wellness">
                    <button className="categoryButton wellness">
                      <HeartPulse size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/music">
                    <button className="categoryButton music">
                      <Music size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/politics">
                    <button className="categoryButton politics">
                      <Flag size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/travel">
                    <button className="categoryButton travel">
                      <Plane size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/science">
                    <button className="categoryButton science">
                      <FlaskConical size={42} />
                    </button>
                  </Link>
                  <Link to="/categories/sports">
                    <button className="categoryButton sports">
                      <Icon iconNode={football} size={42} />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="right-body-cont">
                <h1 className="section-title">Hot 🔥🔥🔥</h1>
                <div className="top-trends-wrapper">
                  {topTrends &&
                    topTrends.map((trend: Trend, index: number) => (
                      <div key={"topTrend" + index}>
                        <div
                          className="top-trend"
                          onClick={() => handleTrendClick(trend)}
                        >
                          <div className="top-trend-icon">
                            {getIcon(trend.category)}
                          </div>
                          <h2 className="top-trend-name">
                            {trend.title.length > 50
                              ? trend.title.substring(0, 50) + "..."
                              : trend.title}
                          </h2>
                          <div>{getRelevancy(trend.moreRelevantValue)}</div>
                        </div>
                        {index < 5 && <div className="trend-divider"></div>}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
  return (
    <div className="bodyCont">
      <div className="bg-container">
        {/* <img className="homeBackground" src={bg} alt="geometric shapes" /> */}
      </div>
      <Header />
      <div className="content">
        <div className="title">
          <h1 id="titleText">Sign up and discover the latest trends today</h1>
          <a onClick={() => loginWithRedirect()}>Sign Up</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
