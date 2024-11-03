import React, { useContext } from "react";
import LOGOUT from "./assets/logout.webp";
import AuthContext from "./context/AuthContext";
import Friendlist from "./friends/Friendlist";
import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => logoutUser();
  const goToProfile = () => navigate("/profile");

  return (
    <headers className="upperpart">
      <h1 className="title">zajel</h1>
      <div className="button-container">
        <Friendlist />
        <button onClick={goToProfile}>Profile</button>
        <button className="logout" onClick={handleLogout}>
          <img src={LOGOUT} alt="Logout" width="35" height="35" />
        </button>
      </div>
    </headers>
  );
}

export default Header;
