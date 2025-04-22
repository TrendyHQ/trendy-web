import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Header";
import Footer from "../Footer";

const LandingContent: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div className="bodyCont">
      <div className="bg-container"></div>
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
};

export default LandingContent;
