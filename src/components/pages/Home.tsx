import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import { Link } from "react-router-dom";
import bg from "../../assets/background.svg";

export default function Home() {
  return (
    <div className="bodyCont">
      <img className="homeBackground" src={bg} alt="geometric shapes" />
      <Header />
      <div className="content">
        <div className="title">
          <h1 id="titleText">Sign up and discover the latest trends today</h1>
          <Link to="/signUp">
            Sign Up
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
