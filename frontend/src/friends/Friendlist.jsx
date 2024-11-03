import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import FRIEND from "../assets/friend.jpg";
import publicphoto from "../assets/default.jpeg";
import AuthContext from "../context/AuthContext";
import "./Friendlist.css";

function Friendlist() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("requestsIn");
  const [requestsIn, setRequestsIn] = useState([]);
  const [requestsOut, setRequestsOut] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const dropdownRef = useRef(null);
  const { authTokens } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch friend data from the backend
  const fetchFriendData = async () => {
    try {
      const requestsInResponse = await axios.get(
        "http://127.0.0.1:8000/friends/requests/",
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      const requestsOutResponse = await axios.get(
        "http://127.0.0.1:8000/friends/out/",
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      const friendsListResponse = await axios.get(
        "http://127.0.0.1:8000/friends/list/",
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      setRequestsIn(requestsInResponse.data || []);
      setRequestsOut(requestsOutResponse.data || []);
      setFriendsList(friendsListResponse.data || []);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  useEffect(() => {
    fetchFriendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/friends/accept/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeleteRequestSend = async (userId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/friends/decline/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData();
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  const handleDeleteRequestReceive = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/friends/cancel/${userId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      fetchFriendData();
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  const handleDeleteFriend = async (friendID) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/friends/unfriend/${friendID}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData();
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "requestsIn":
        return (
          <div>
            <h3>Requests In</h3>
            <ul>
              {requestsIn.map((friend) => (
                <li className="friend-item" key={friend.sender.id}>
                  <img
                    src={
                      friend.sender.profile_image
                        ? `http://127.0.0.1:8000${friend.sender.profile_image}`
                        : publicphoto
                    }
                    alt={`${friend.sender.username}'s profile`}
                    width="50"
                    height="50"
                  />
                  <span className="friend-username">
                    {friend.sender.username}
                  </span>
                  <button
                    className="accept-button"
                    onClick={() => handleAcceptRequest(friend.sender.id)}
                  >
                    accept
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRequestSend(friend.sender.id)}
                  >
                    decline
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "requestsOut":
        return (
          <div>
            <h3>Requests Out</h3>
            <ul>
              {requestsOut.map((user) => (
                <li className="friend-item" key={user.receiver.id}>
                  <img
                    src={
                      user.receiver.profile_image
                        ? `http://127.0.0.1:8000${user.receiver.profile_image}`
                        : publicphoto
                    }
                    alt={`${user.receiver.username}'s profile`}
                    width="50"
                    height="50"
                  />
                  <span className="friend-username">
                    {user.receiver.username}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRequestReceive(user.receiver.id)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "friendsList":
        return (
          <div>
            <h3>Friends List</h3>
            <ul>
              {friendsList.map((friend) => (
                <li className="friend-item" key={friend.id}>
                  <img
                    src={
                      friend.profile_image
                        ? `http://127.0.0.1:8000${friend.profile_image}`
                        : publicphoto
                    }
                    alt={`${friend.username}'s profile`}
                    width="50"
                    height="50"
                  />
                  <span className="friend-username">{friend.username}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteFriend(friend.id)}
                  >
                    Unfriend
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="friendplace">
      <button className="friendbutton" onClick={toggleDropdown}>
        <img src={FRIEND} alt="friend_page" width="35" height="35" />
      </button>
      {isDropdownOpen && (
        <div
          className="frienddropdown"
          ref={dropdownRef}
          style={{ position: "absolute", right: 0 }}
        >
          <ul>
            <li onClick={() => setActiveTab("requestsIn")}>Requests In</li>
            <li onClick={() => setActiveTab("requestsOut")}>Requests Out</li>
            <li onClick={() => setActiveTab("friendsList")}>Friends List</li>
          </ul>
          {renderContent()}
        </div>
      )}
    </div>
  );
}

export default Friendlist;
