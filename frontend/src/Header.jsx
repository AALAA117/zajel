import React, { useContext } from "react";
import LOGOUT from "./assets/logout.webp";
import AuthContext from "./context/AuthContext";
import Friendlist from "./friends/Friendlist";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => logoutUser();
  const goToProfile = () => navigate("/profile");
  const goToChat = () => navigate("/");
  const location = useLocation();

  return (
    <header className="upperpart">
      <h1 className="title">zajel</h1>
      <div className="button-container">
        {location.pathname === "/" && <Friendlist />}
        {location.pathname === "/" && (
          <button className="home-button" onClick={goToProfile}>
            Profile Pad
          </button>
        )}
        {location.pathname === "/profile" && (
          <button onClick={goToChat} className="home-button">
            Let's Chat
          </button>
        )}
        <button className="logout" onClick={handleLogout}>
          <img src={LOGOUT} alt="Logout" width="35" height="35" />
        </button>
      </div>
    </header>
  );
}

export default Header;
