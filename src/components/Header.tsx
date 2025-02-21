import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  CircleX,
  LogOut,
  MessageCircleMore,
  MessageSquareWarning,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();
  const isDarkTheme: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);

  const [profileDown, setProfileDown] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(
    user?.nickname || ""
  );
  const [feedbackWindowOpen, setFeedbackWindowOpen] = useState<boolean>(false);

  const iconSize: number = 26;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if the feedback window was clicked
      if (
        event.target instanceof Element &&
        event.target.closest(".feedbackWindow")
      ) {
        return;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileImgRef.current &&
        !profileImgRef.current.contains(event.target as Node)
      ) {
        setProfileDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    setUserNickname(user?.nickname || "");

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFeedback = () => {
    setFeedbackWindowOpen(true);
  };

  if (isLoading) {
    return (
      <header>
        <h1 className="logo">TRENDY</h1>
        <div className="loadingPfp loading"></div>
      </header>
    );
  }

  return (
    <>
      <div
        className={`feedbackWindow ${feedbackWindowOpen ? "show" : ""}`}
        onClick={() => setFeedbackWindowOpen(false)}
      >
        <div className="feedbackBox" onClick={(e) => e.stopPropagation()}>
          <h2>Give Feedback</h2>
          <button
            className="feedback-close-button"
            onClick={() => setFeedbackWindowOpen(false)}
          >
            <CircleX size={40} color="grey" />
          </button>
          <div className="feedback-header"></div>
          <div className="feedback-buttons-wrapper">
            <button className="feedback-button">
              <div className="icon-wrapper">
                <MessageCircleMore size={30} />
              </div>
              <p className="text">Suggest Something</p>
            </button>
            <button className="feedback-button">
              <div className="icon-wrapper">
                <TriangleAlert size={30} />
              </div>
              <p className="text">Report an error</p>
            </button>
          </div>
        </div>
      </div>
      <header className={!isAuthenticated ? "transparent" : ""}>
        <Link to="/" className={isAuthenticated ? "logo" : "logo big"}>
          <h1>TRENDY</h1>
        </Link>
        {isAuthenticated && (
          <img
            ref={profileImgRef}
            src={user?.picture}
            className="userImg"
            onClick={() => setProfileDown((prev) => !prev)}
            alt="User profile"
          />
        )}
        {!isAuthenticated && location.pathname !== "/signUp" && (
          <button onClick={() => loginWithRedirect()}>Sign Up</button>
        )}
      </header>
      {isAuthenticated && (
        <div
          ref={dropdownRef}
          className={`dropDown ${profileDown ? "show" : ""}`}
          tabIndex={0}
        >
          <div className="upperQuadrant">
            <div className="profileShowcase">
              <img src={user?.picture} alt="Picture of User" className="pfp" />
              <h3 className="userName">{userNickname}</h3>
            </div>
          </div>
          <div className="lowerQuadrant">
            <div className="buttons">
              <Link to="/settings">
                <button>
                  <div className="greyCircle">
                    <Settings
                      size={iconSize}
                      color={isDarkTheme ? "#f0f0f0" : "#333333"}
                    />
                  </div>
                  Settings
                </button>
              </Link>
              <button onClick={handleFeedback}>
                <div className="greyCircle">
                  <MessageSquareWarning
                    size={iconSize}
                    color={isDarkTheme ? "#f0f0f0" : "#333333"}
                  />
                </div>
                Give Feedback
              </button>
              <button onClick={() => logout()}>
                <div className="greyCircle">
                  <LogOut
                    size={iconSize}
                    color={isDarkTheme ? "#f0f0f0" : "#333333"}
                  />
                </div>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
