import React, { useState, useEffect } from "react";
import axios from "axios";

function Create_Button() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNewChat = () => {
    setShowDropdown(false);
    setShowUserList(true); // Show the list of users to select from
  };

  const startChatWithUser = async (userId) => {
    try {
      // api for all users data
      const response = await axios.post(
        "https",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("New chat created successfully");
      }
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
    setShowUserList(false);
  };

  useEffect(() => {
    if (showUserList) {
      // send the backend the new chat
      axios
        .get("https", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    }
  }, [showUserList]);

  return (
    <div className="create-chat-group-button">
      <button onClick={toggleDropdown} className="button-main">
        Create
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          <button onClick={handleNewChat} className="dropdown-item">
            Create New Chat
          </button>
        </div>
      )}
      {showUserList && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select a User to Chat With</h2>
            <ul>
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.id}>
                    <button
                      className="user-item"
                      onClick={() => startChatWithUser(user.id)}
                    >
                      {user.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>Loading users...</li>
              )}
            </ul>
            <button onClick={() => setShowUserList(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create_Button;
