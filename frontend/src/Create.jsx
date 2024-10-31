import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateGroupButton() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleCreateGroupClick = () => {
    setShowDropdown(true);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const createGroup = async () => {
    try {
      // send the create to the back 
      const response = await axios.post(
        "http://127.0.0.1:8000/chat/api/groups/",
        { userIds: selectedFriends },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("New group created successfully");
      }
    } catch (err) {
      console.error("Error creating new group:", err);
    }
    setShowDropdown(false);
    setSelectedFriends([]); // Clear selected friends after creating the group
  };

  const cancelGroupCreation = () => {
    setShowDropdown(false);
    setSelectedFriends([]); // Clear selected friends if canceled
  };

  useEffect(() => {
    if (showDropdown) {
      // api to get friend list
      axios
        .get("http://127.0.0.1:8000/friends/list/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          setFriends(response.data);
        })
        .catch((err) => {
          console.error("Error fetching friends:", err);
        });
    }
  }, [showDropdown]);

  return (
    <div className="create-group">
      <button onClick={handleCreateGroupClick} className="button-main">
        Create Group
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          <h2>Select Friends for Group</h2>
          <ul>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <li key={friend.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriendSelection(friend.id)}
                    />
                    {friend.name}
                  </label>
                </li>
              ))
            ) : (
              <li>Loading friends...</li>
            )}
          </ul>
          <button onClick={createGroup}>Create Group</button>
          <button onClick={cancelGroupCreation}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default CreateGroupButton;
