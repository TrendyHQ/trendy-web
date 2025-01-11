import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import bg from "../../assets/background.svg";
import { loggedIn } from "../../Constants";
import {
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

export default function Home() {
  const prevLoggedIn: string | null = localStorage.getItem("loggedIn");
  loggedIn.value = prevLoggedIn === "true";

  return (
    <div className="bodyCont">
      {!loggedIn.value && (
        <div className="bg-container">
          <img
            className={`homeBackground ${loggedIn.value ? "dark" : ""}`}
            src={bg}
            alt="geometric shapes"
          />
        </div>
      )}
      <Header />
      {!loggedIn.value && (
        <div className="content">
          <div className="title">
            <h1 id="titleText">Sign up and discover the latest trends today</h1>
            <Link to="/signUp">Sign Up</Link>
          </div>
        </div>
      )}
      {loggedIn.value && (
        <div className="content bottom">
          <div className="header-wrapper">
            <div className="header-cont">
              <h1 className="section-title header">
                Evaluate the trends of the world with a simple click, using AI
              </h1>
              <p className="section-text header">
                Explore current and upcoming trends to find all sorts of
                statistics like relevancy, start date, and more.
              </p>
              <button id="try-it-button">Try It Now</button>
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
                <Link to="/categories/lifestyle">
                  <button className="categoryButton lifestyle">
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
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
