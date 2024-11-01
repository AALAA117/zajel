import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import LOGOUT from "./assets/logout.webp";
import Default from "./assets/default.jpeg";
import AuthContext from "./context/AuthContext";
import Friendlist from "./Friendlist";
import "./Header.css";

function Header() {
  const { logoutUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState("");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const dropdownRef = useRef(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/user/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );

        const data = response.data.find(
          (profile) => profile.id === authTokens?.user.pk
        );

        console.log(data.displayname);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authTokens]);

  const handleLogout = () => {
    logoutUser();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
      setIsEditingInfo(false);
      setIsEditingPhoto(false);
      setIsEditingUsername(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEditPhoto = () => {
    setIsEditingPhoto(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.put(
        `http://localhost:8000/user/api/profile/${authTokens?.user.pk}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData((prev) => ({ ...prev, image: response.data.image }));
      setIsEditingPhoto(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(userData.username);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSubmitUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/user/api/profile/${authTokens?.user.pk}/`, // Adjust the endpoint accordingly
        { displayname: newUsername },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      setUserData(response.data);
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleEditInfo = () => {
    setIsEditingInfo(true);
    setNewInfo(userData.info);
  };

  const handleInfoChange = (e) => {
    setNewInfo(e.target.value);
  };

  const handleSubmitInfoChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/user/api/profile/${authTokens?.user.pk}/`, // Adjust the endpoint accordingly
        { info: newInfo },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      setUserData(response.data);
      setIsEditingInfo(false);
    } catch (error) {
      console.error("Error updating info:", error);
    }
  };
  console.log("userdata", userData);

  return (
    <header className="upperpart">
      <h1 className="title">zajel</h1>
      <div className="button-container">
        <Friendlist />
        <div className="personal-container">
          <button className="personal" onClick={toggleDropdown}>
            <img
              src={userData?.image || Default}
              alt="personal_page"
              width="35"
              height="35"
            />
          </button>
          {isDropdownOpen && (
            <div className="dropdown" ref={dropdownRef}>
              {userData && (
                <div className="user-info">
                  <img
                    src={userData.image || Default}
                    alt="User"
                    className="user-image"
                  />
                  <div className="user-details">
                    <p className="user-name">Name: {userData.displayname}</p>
                    <p className="user-info">Info: {userData.info}</p>
                  </div>
                </div>
              )}
              <div className="dropdown-buttons">
                <button onClick={handleEditPhoto} className="dropdown-item">
                  Edit Photo
                </button>
                <button onClick={handleEditUsername} className="dropdown-item">
                  Edit Username
                </button>
                <button onClick={handleEditInfo} className="dropdown-item">
                  Edit Info
                </button>
              </div>

              {isEditingPhoto && (
                <div className="edit-photo-form">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button onClick={handlePhotoUpload} className="submit-button">
                    Upload
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditingPhoto(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {isEditingUsername && (
                <form
                  onSubmit={handleSubmitUsernameChange}
                  className="edit-username-form"
                >
                  <input
                    type="text"
                    value={newUsername}
                    onChange={handleUsernameChange}
                    placeholder="Enter new username"
                    required
                  />
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditingUsername(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}

              {isEditingInfo && (
                <form
                  onSubmit={handleSubmitInfoChange}
                  className="edit-info-form"
                >
                  <input
                    type="text"
                    value={newInfo}
                    onChange={handleInfoChange}
                    placeholder="Enter new info"
                    required
                  />
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditingInfo(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
        <button className="logout" onClick={handleLogout}>
          <img src={LOGOUT} alt="Logout" width="35" height="35" />
        </button>
      </div>
    </header>
  );
}

export default Header;
