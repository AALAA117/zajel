import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Default from "./assets/default.jpeg";
import AuthContext from "./context/AuthContext";
import "./Profile.css";
function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState("");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
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
        console.log("data", data.displayname);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [authTokens]);

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
  return (
    <div className="profile-page">
      <div className="profile-content-box">
        <h2>Zajel Profile</h2>
        <img
          src={userData?.image || Default}
          alt="User"
          width="100"
          height="100"
        />
        <div>
          <p>Name: {userData?.displayname}</p>
          <p>Info: {userData?.info}</p>
        </div>
        <button onClick={handleEditPhoto}>Edit Photo</button>
        {isEditingPhoto && (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handlePhotoUpload}>Upload</button>
            <button
              className="cancel-button"
              onClick={() => setIsEditingPhoto(false)}
            >
              Cancel
            </button>
          </div>
        )}
        <button onClick={handleEditUsername}>Edit Username</button>
        {isEditingUsername && (
          <form onSubmit={handleSubmitUsernameChange}>
            <input
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              placeholder="Enter new username"
            />
            <button type="submit">Submit</button>
            <button
              className="cancel-button"
              onClick={() => setIsEditingUsername(false)}
            >
              Cancel
            </button>
          </form>
        )}
        <button onClick={handleEditInfo}>Edit Info</button>
        {isEditingInfo && (
          <form onSubmit={handleSubmitInfoChange}>
            <input
              type="text"
              value={newInfo}
              onChange={handleInfoChange}
              placeholder="Enter new info"
            />
            <button type="submit">Submit</button>
            <button
              className="cancel-button"
              onClick={() => setIsEditingInfo(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default Profile;
