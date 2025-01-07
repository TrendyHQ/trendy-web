import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import bg from "../../assets/background.svg";
import { loggedIn } from "../../constants";

export default function Home() {
  const prevLoggedIn: string | null = localStorage.getItem("loggedIn");
  loggedIn.value = prevLoggedIn === "true";

  return (
    <div className="bodyCont">
      {!loggedIn.value && <div className="bg-container">
        <img
          className={`homeBackground ${loggedIn.value ? "dark" : ""}`}
          src={bg}
          alt="geometric shapes"
        />
      </div>}
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
        </div>
      )}
      <Footer />
    </div>
  );
}
