import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import FRIEND from "../assets/friend.jpg";
import publicphoto from "../assets/default.jpeg";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Friendlist.css";

function Friendlist() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("requestsIn");
  const [requestsIn, setRequestsIn] = useState([]);
  const [requestsOut, setRequestsOut] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const dropdownRef = useRef(null);
  const { authTokens } = useContext(AuthContext);
  console.log("token", authTokens);
  const UserId = authTokens.user.pk;
  console.log(UserId);

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

  // Function to fetch friend data from the backend
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
      console.log("friendsListResponse : ", friendsListResponse);
      setRequestsIn(requestsInResponse.data);
      setRequestsOut(requestsOutResponse.data);
      setFriendsList(friendsListResponse.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  useEffect(() => {
    fetchFriendData(); // Fetch data when the component mounts
  }, []);

  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/friends/accept/${UserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData(); // Refresh friend data after accepting request
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeleteRequestSend = async (userId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/friends/decline/${UserId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      fetchFriendData(); // Refresh friend data after deletion
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  const handleDeleteRequestReceive = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/friends/cancel/${UserId}`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      fetchFriendData(); // Refresh friend data after deletion
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  const handleDeleteFriend = async (friendID) => {
    try {
      console.log("token : ", authTokens?.access);

      await axios.post(
        `http://127.0.0.1:8000/friends/unfriend/${friendID}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData(); // Refresh friend data after deletion
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
              { console.log("requestsIn : ", requestsIn)}
              {requestsIn.map((friend) => (
               <li className="friend-item" key={friend.sender.id}>
                      <img
                        src={
                          friend.profile_image
                            ? `http://127.0.0.1:8000${friend.sender.profile_image}`
                            : publicphoto
                        }
                        alt={`${friend.sender.username}'s profile`}
                        width="50"
                        height="50"
                      />
                      <span className="friend-username">{friend.sender.username}</span>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteFriend(friend.id)}
                      >
                        Delete
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
                <li key={user.id}>
                  {user.name}
                  <button onClick={() => handleAcceptRequest(user.id)}>
                    Accept
                  </button>
                  <button onClick={() => handleDeleteRequestReceive(user.id)}>
                    Delete
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
              {friendsList.map(
                (friend) => (
                  (
                    console.log("friendsList : -> ", friendsList),
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
                        onClick={() => handleDeleteFriend(friend.sender.id)}
                      >
                        Delete
                      </button>
                    </li>
                  )
                )
              )}
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
            <li
              onClick={() => {
                setActiveTab("requestsIn");
                setIsDropdownOpen(true);
              }}
            >
              Requests In
            </li>
            <li
              onClick={() => {
                setActiveTab("requestsOut");
                setIsDropdownOpen(true);
              }}
            >
              Requests Out
            </li>
            <li
              onClick={() => {
                setActiveTab("friendsList");
                setIsDropdownOpen(true);
              }}
            >
              Friends List
            </li>
          </ul>
          {renderContent()}
        </div>
      )}
    </div>
  );
}

export default Friendlist;
