import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ArrowDown,
  ArrowUp,
  Clapperboard,
  CupSoda,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Headset,
  HeartPulse,
  Icon,
  MessageCircle,
  Minus,
  Music,
  Plane,
  Shirt,
} from "lucide-react";
import { football } from "@lucide/lab";
import { Trend } from "../../types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(null);
  const [hotTrendsLoading, setHotTrendsLoading] = useState(false);

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
      case "education":
        return <GraduationCap size={size} />;
      case "travel":
        return <Plane size={size} />;
      case "science":
        return <FlaskConical size={size} />;
      case "sports":
        return <Icon iconNode={football} size={size} />;
    }
  };

  useEffect(() => {
    try {
      if (hotTrendsLoading == false) {
        console.log("updating top trends");
        setHotTrendsLoading(true);
        axios.post("http://localhost:8080/api/trendData/reddit").then((res) => {
          console.log(res.data);
          setTopTrends(res.data);
          setHotTrendsLoading(false);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const updateTopTrends = () => {
    try {
      if (hotTrendsLoading == false) {
        setHotTrendsLoading(true);
        console.log("updating top trends");
        axios.post("http://localhost:8080/api/trendData/reddit").then((res) => {
          console.log(res.data);
          setTopTrends(res.data);
          setHotTrendsLoading(false);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  setInterval(() => {
    updateTopTrends();
  }, 180000);

  const getRelevancy = (moreRelevantValue: number) => {
    if (moreRelevantValue === 1) {
      return <ArrowUp size={30} color="#0E8800" />;
    } else if (moreRelevantValue === 0) {
      return <ArrowDown size={30} color="#D80000" />;
    } else if (moreRelevantValue === -1) {
      return <Minus size={30} color="#858585" />;
    }
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

  const getTrendTitle = (trend: Trend) => {
    if (trend.title.length <= 48) return trend.title;
    const slicePoint = trend.title.indexOf(" ", 45);
    if (slicePoint !== -1) return trend.title.slice(0, slicePoint) + "...";
    return trend.title.slice(0, 45) + "...";
  };

  if (isAuthenticated) {
    return (
      <div className="bodyCont">
        <Header />
        <div className="content bottom">
          <div className="header-wrapper">
            <div className="header-cont">
              <div className="text">
                <h1 className="section-title header">
                  Evaluate the trends of the world with a simple click, using AI
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
              <h1 className="section-title">Categories</h1>
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
                <Link to="/categories/education">
                  <button className="categoryButton education">
                    <GraduationCap size={42} />
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
                      <div className="top-trend">
                        <div className="top-trend-icon">
                          {getIcon(trend.category)}
                        </div>
                        <h2 className="top-trend-name">
                          {getTrendTitle(trend)}
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
