import React from "react";
import { Link } from "react-router-dom";
import {
  Clapperboard,
  CupSoda,
  Dumbbell,
  FlaskConical,
  Headset,
  HeartPulse,
  Icon,
  Share2,
  Music,
  Plane,
  Shirt,
  Flag,
} from "lucide-react";
import { football } from "@lucide/lab";

const Categories: React.FC = () => {
  return (
    <div className="categories-wrapper">
      <div className="button-wrapper">
        <Link to="/category/fashion">
          <button className="categoryButton fashion">
            <Shirt size={42} />
          </button>
        </Link>
        <Link to="/category/technology">
          <button className="categoryButton technology">
            <Headset size={42} />
          </button>
        </Link>
        <Link to="/category/foodandbeverages">
          <button className="categoryButton food">
            <CupSoda size={42} />
          </button>
        </Link>
        <Link to="/category/entertainment">
          <button className="categoryButton entertainment">
            <Clapperboard size={42} />
          </button>
        </Link>
      </div>
      <div className="button-wrapper">
        <Link to="/category/socialmedia">
          <button className="categoryButton social">
            <Share2 size={42} />
          </button>
        </Link>
        <Link to="/category/fitness">
          <button className="categoryButton fitness">
            <Dumbbell size={42} />
          </button>
        </Link>
        <Link to="/category/health">
          <button className="categoryButton health">
            <HeartPulse size={42} />
          </button>
        </Link>
        <Link to="/category/music">
          <button className="categoryButton music">
            <Music size={42} />
          </button>
        </Link>
      </div>
      <div className="button-wrapper">
        <Link to="/category/politics">
          <button className="categoryButton politics">
            <Flag size={42} />
          </button>
        </Link>
        <Link to="/category/travel">
          <button className="categoryButton travel">
            <Plane size={42} />
          </button>
        </Link>
        <Link to="/category/science">
          <button className="categoryButton science">
            <FlaskConical size={42} />
          </button>
        </Link>
        <Link to="/category/sports">
          <button className="categoryButton sports">
            <Icon iconNode={football} size={42} />
          </button>
        </Link>
      </div>
    </div>
  );
};

const CategoriesSection: React.FC = () => {
  return (
    <div className="left-body-cont">
      <Link to="/categories">
        <h1 className="section-title">Categories</h1>
      </Link>
      <Categories />
    </div>
  );
};

export default CategoriesSection;
