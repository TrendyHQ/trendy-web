import Header from "../Header";
import Footer from "../Footer";
import "../../css/Home.css";
import topLeftFire from "../../assets/topLeftFire.svg";
import topRightFire from "../../assets/bottomRightFire.svg";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bodyCont">
      <Header />
      <div className="content">
        <img src={topLeftFire} />
        <div className="title">
          <h1 id="titleText">Sign up and discover the latest trends today</h1>
          <Link to="/signUp">
            Sign Up
          </Link>
        </div>
        <img src={topRightFire} />
      </div>
      <Footer />
    </div>
  );
}
