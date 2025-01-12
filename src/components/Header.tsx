import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
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
          <div className="buttons">
            <Link to="/profile">
              <button>
                <CircleUserRound
                  size={32}
                  color={isDarkTheme ? "#f0f0f0" : "#333333"}
                />{" "}
                Profile
              </button>
            </Link>
            <Link to="/settings">
              <button>
                <Settings
                  size={32}
                  color={isDarkTheme ? "#f0f0f0" : "#333333"}
                />{" "}
                Settings
              </button>
            </Link>
            <button onClick={() => logout()}>
              <LogOut size={32} color={isDarkTheme ? "#f0f0f0" : "#333333"} />{" "}
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
