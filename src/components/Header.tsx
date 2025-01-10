import "../css/Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { loggedIn } from "../Constants";
import logo from "../assets/logo.svg";

export default function Header() {
  const [profileDown, setProfileDown] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;

  const handleProfileClick = () => {
    setProfileDown(!profileDown);
  };

  const handleLogOut = () => {
    localStorage.setItem("loggedIn", "false");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className={!loggedIn.value ? "transparent" : ""}>
        {location.pathname != "/signUp" && (
          <Link to="/" className={loggedIn.value ? "logo" : "logo big"}>
            <h1>TRENDY</h1>
          </Link>
        )}
        {loggedIn.value && (
          <img
            src={logo}
            className="userImg"
            onClick={handleProfileClick}
          ></img>
        )}
        {!loggedIn.value && location.pathname != "/signUp" && (
          <Link to="/signUp">
            <button>Sign Up</button>
          </Link>
        )}
      </header>
      {loggedIn.value && (
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
            <button onClick={handleLogOut}>
              <LogOut size={32} color={isDarkTheme ? "#f0f0f0" : "#333333"} />{" "}
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
