import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LogOut,
  MessageSquareWarning,
  Settings,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const [profileDown, setProfileDown] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const isDarkTheme: boolean = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? true
    : false;

  const handleProfileClick = () => {
    setProfileDown(!profileDown);
  };

  const iconSize: number = 26;

  return (
    <>
      <header className={!isAuthenticated ? "transparent" : ""}>
        {location.pathname != "/signUp" && (
          <Link to="/" className={isAuthenticated ? "logo" : "logo big"}>
            <h1>TRENDY</h1>
          </Link>
        )}
        {isAuthenticated && (
          <img
            src={user?.picture}
            className="userImg"
            onClick={handleProfileClick}
          ></img>
        )}
        {!isAuthenticated && location.pathname != "/signUp" && (
          <button onClick={() => loginWithRedirect()}>Sign Up</button>
        )}
      </header>
      {isAuthenticated && (
        <div className={`dropDown ${profileDown ? "show" : ""}`}>
          <div className="upperQuadrant">
            <div className="profileShowcase">
              <img src={user?.picture} alt="Picture of User" className="pfp" />
              <h3>{user?.nickname}</h3>
            </div>
          </div>
          <div className="lowerQuadrant">
            <div className="buttons">
              <button>
                <div className="greyCircle">
                  <Settings
                    size={iconSize}
                    color={isDarkTheme ? "#f0f0f0" : "#333333"}
                  />
                </div>{" "}
                <Link to="/settings">Settings</Link>
              </button>
              <button>
                <div className="greyCircle">
                  <MessageSquareWarning
                    size={iconSize}
                    color={isDarkTheme ? "#f0f0f0" : "#333333"}
                  />
                </div>{" "}
                Give Feedback
              </button>
              <button onClick={() => logout()}>
                <div className="greyCircle">
                  <LogOut size={iconSize} color={isDarkTheme ? "#f0f0f0" : "#333333"} />
                </div>{" "}
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
