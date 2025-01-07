import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import bg from "../../assets/background.svg";
import { loggedIn } from "../../constants";

export default function Home() {
  const prevLoggedIn = localStorage.getItem("loggedIn");
  loggedIn.value = prevLoggedIn === "true";

  return (
    <div className="bodyCont">
      <img className="homeBackground" src={bg} alt="geometric shapes" />
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
          <div className="title">
            <h1 id="titleText">Welcome back!</h1>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
