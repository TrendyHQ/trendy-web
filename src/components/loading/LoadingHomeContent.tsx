import React from "react";
import Header from "../Header";
import Footer from "../Footer";

interface LoadingHomeContentProps {
  hasSetUpAccount: boolean | null;
}

const LoadingHomeContent: React.FC<LoadingHomeContentProps> = ({ hasSetUpAccount }) => {
  return (
    <div className="bodyCont">
      <Header hasSetUpAccount={hasSetUpAccount} headerIsLoading />
      <div className="content bottom">
        <div className="header-wrapper">
          <div className="header-cont loading"></div>
        </div>
        <div className="body-wrapper">
          <div className="left-body-cont loading"></div>
          <div className="right-body-cont loading"></div>
        </div>
        <div className="body-wrapper">
          <div className="right-body-cont2 loading"></div>
          <div className="left-body-cont2 loading"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoadingHomeContent;
