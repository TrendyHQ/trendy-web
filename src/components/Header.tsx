import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { loggedIn } from "../constants";
import logo from "../assets/logo.svg";

export default function Header() {
  const [profileDown, setProfileDown] = useState<boolean>(false);
  const navigate = useNavigate();

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
      {loggedIn.value && (
        <header>
          <Link to="/" id="logo">
            <h1>TRENDY</h1>
          </Link>
          <img
            src={logo}
            className="userImg"
            onClick={handleProfileClick}
          ></img>
        </header>
      )}
      {loggedIn.value && (
        <div className={`dropDown ${profileDown ? "show" : ""}`}>
          <div className="buttons">
            <Link to="/profile">
              <button>
                <CircleUserRound size={32} color="#f0f0f0" /> Profile
              </button>
            </Link>
            <Link to="/settings">
              <button>
                <Settings size={32} color="#f0f0f0" /> Settings
              </button>
            </Link>
            <button onClick={handleLogOut}>
              <LogOut size={32} color="#f0f0f0" /> Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
