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
        <div className="content">
          <div className="header-wrapper">
            <div className="header-cont">
              <h1>
                Evaluate the trends of the world with a simple click, using AI
              </h1>
              <p>
                Explore current and upcoming trends to find all sorts of
                statistics like relevancy, start date, and more.
              </p>
              <button>Try It Now</button>
            </div>
          </div>
          <div className="body-wrapper">
            <div className="left-body-cont">
              <h1>Categories</h1>
              <div className="categorieButtons">
                <Link to="/categories/fashion">
                  <button>
                    <Shirt size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/technology">
                  <button>
                    <Headset size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/foodandbeverages">
                  <button>
                    <CupSoda size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/entertainment">
                  <button>
                    <Clapperboard size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/socialmedia">
                  <button>
                    <MessageCircle size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/fitness">
                  <button>
                    <Dumbbell size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/lifestyle">
                  <button>
                    <HeartPulse size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/business">
                  <button>
                    <Banknote size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/education">
                  <button>
                    <GraduationCap size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/travel">
                  <button>
                    <Plane size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/science">
                  <button>
                    <FlaskConical size={32} color="333333" />
                  </button>
                </Link>
                <Link to="/categories/sports">
                  <button>
                    <Icon iconNode={football} size={32} color="333333" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="right-body-cont">
              <h1>Hot 🔥🔥🔥</h1>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
