import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import bg from "../../assets/background.svg";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  Clapperboard,
  CupSoda,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Headset,
  HeartPulse,
  Icon,
  MessageCircle,
  Plane,
  Shirt,
} from "lucide-react";
import { football } from "@lucide/lab";
import { Trend } from "../../types";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }
  

  const topTrends: Trend[] = [
    {
      name: "TikTok",
      category: "social",
      more_relevant: true,
    },
    {
      name: "Sustainable and Genderless Clothing",
      category: "fashion",
      more_relevant: true,
    },
    {
      name: "Mindfulness and Mental Health Apps",
      category: "wellness",
      more_relevant: true,
    },
    {
      name: "Facebook Usage",
      category: "social",
      more_relevant: false,
    },
    {
      name: "Esports and Gaming Communities",
      category: "entertainment",
      more_relevant: false,
    },
    {
      name: "Anime",
      category: "entertainment",
      more_relevant: true,
    },
  ];
  const getIcon = (categorie: string) => {
    const size = 30;

    switch (categorie) {
      case "fashion":
        return <Shirt size={size} />;
      case "tech":
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
      case "business":
        return <Banknote size={size} />;
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

  const getRelevancy = (moreRelevant: boolean) => {
    if (moreRelevant) {
      return <ArrowUp size={30} color="#0E8800" />;
    } else {
      return <ArrowDown size={30} color="#D80000" />;
    }
  };

  return (
    <div className="bodyCont">
      {!isAuthenticated && (
        <div className="bg-container">
          <img
            className={`homeBackground ${isAuthenticated ? "dark" : ""}`}
            src={bg}
            alt="geometric shapes"
          />
        </div>
      )}
      <Header />
      {!isAuthenticated && (
        <div className="content">
          <div className="title">
            <h1 id="titleText">Sign up and discover the latest trends today</h1>
            <a onClick={() => loginWithRedirect()}>Sign Up</a>
          </div>
        </div>
      )}
      {isAuthenticated && (
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
                <Link to="/categories/business">
                  <button className="categoryButton business">
                    <Banknote size={42} />
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
                {topTrends.map((trend: Trend, index: number) => (
                  <>
                    <div key={"a" + index} className="top-trend">
                      <div className="top-trend-icon">
                        {getIcon(trend.category)}
                      </div>
                      <h2 className="top-trend-name">{trend.name}</h2>
                      <div>{getRelevancy(trend.more_relevant)}</div>
                    </div>
                    {index < 5 && (
                      <div className="trend-divider" key={"b" + index}></div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
