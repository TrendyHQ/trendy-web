import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <div className="header-cont">
      <div className="text">
        <h1 className="section-title header">
          Evaluate the trends of the world with a simple click, using AI
        </h1>
        <p className="section-text header">
          Explore current and upcoming trends to find all sorts of statistics
          like relevancy, start date, and more.
        </p>
        <Link to="/ask-ai">
          <button id="try-it-button">Try It Now</button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
