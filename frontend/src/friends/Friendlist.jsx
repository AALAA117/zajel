import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import FRIEND from "../assets/friend.jpg";
import publicphoto from "../assets/default.jpeg";
import AuthContext from "../context/AuthContext";
import "./Friendlist.css";
import {v4 as uuidv4} from 'uuid';

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

   // Helper function to add new group to friends list
  const addNewGroupToFriendsList = (newGroup) => {
    setFriendsList((prevList) => [...prevList, newGroup]);
  };

  const createPrivateGroup = async (friendId) => {
    try {
      const formData = new FormData();
      const newGroupName = uuidv4();
      formData.append("group_name", newGroupName);
      formData.append("is_private", true);
      formData.append("members", friendId);

      const response = await axios.post(
        "http://127.0.0.1:8000/chat/api/groups/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // if (response.status === 201) {
      //   console.log("New group created successfully");
      //   // Add the newly created group to the friends list
      //   const newGroup = { id: response.data.id, group_name: newGroupName, members: [friendId] };
      //   console.log(newGroup);
      //   addNewGroupToFriendsList(newGroup);
      // }
    } catch (err) {
      console.error("Error creating new group:", err);
    }
  };

  const handleAcceptRequest = async (friendID) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/friends/accept/${friendID}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      fetchFriendData();
      // console.log("Chat between the users will be created here");
      // console.log("Friend ID:", friendID);
      // console.log("My ID:", authTokens?.user.pk);
      const newGroup = await createPrivateGroup(friendID);

      // If the group was created successfully, update the friends list
      if (newGroup) {
        setFriendsList((prevList) => [...prevList, newGroup]);
      }

      // Optionally update requestsIn to remove the accepted request
      // setRequestsIn((prev) => prev.filter((request) => request.sender.id !== friendID));

      // Then create a private group with the friend      
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
