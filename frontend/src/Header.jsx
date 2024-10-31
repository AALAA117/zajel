import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import LOGOUT from "./assets/logout.webp";
import Default from "./assets/default.jpeg";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";

function Header() {
  // const history = useNavigate();
  const { logoutUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState("");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false); // State for editing username
  const [newUsername, setNewUsername] = useState(""); // State for new username
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://your-backend-endpoint/user-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
      setIsEditingUsername(false); // Close username editing
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEditPhoto = () => {
    setIsEditingPhoto(true); // Open photo editing interface
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Set the selected file
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return; // Do nothing if no file is selected

    const formData = new FormData();
    formData.append("photo", selectedFile); // Append the file to the form data

    try {
      const response = await axios.put(
        "https://your-backend-endpoint/update-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(response.data); // Update user data with the new photo
      setIsEditingPhoto(false); // Close the photo editing interface
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true); // Open username editing interface
    setNewUsername(userData.username); // Set current username as new username
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value); // Update state with new username input
  };

  const handleSubmitUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://your-backend-endpoint/update-username",
        {
          username: newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserData(response.data); // Update user data with new username
      setIsEditingUsername(false); // Close username editing interface
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
        "https://your-backend-endpoint/update-info",
        {
          info: newInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserData(response.data);
      setIsEditingInfo(false); // Close info editing interface
    } catch (error) {
      console.error("Error updating info:", error);
    }
  };

  return (
    <header className="upperpart">
      <h1 className="title">zajel</h1>
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
                  <p className="user-name">Name: {userData.name}</p>
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
    </header>
  );
}

export default Header;
