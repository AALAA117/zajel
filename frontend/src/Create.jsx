import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthContext";
import "./Create.css";
import axios from "axios";

function CreateGroupButton({ onGroupCreated }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [creatingGroup, setCreatingGroup] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const { authTokens } = useContext(AuthContext);

  const handleCreateGroupClick = () => {
    setShowDropdown(true);
    setError(null);
    setSuccess(null);
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
      const fromData = new FormData();
      fromData.append("group_name", groupName);

      if (description) fromData.append("description", description);
      if (image) fromData.append("image", image);
      selectedFriends.forEach((friendId) =>
        fromData.append("members", friendId)
      );
      // send the create to the back
      const response = await axios.post(
        "http://127.0.0.1:8000/chat/api/groups/",
        fromData,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        onGroupCreated();
        console.log("New group created successfully");
      }
    } catch (err) {
      console.error("Error creating new group:", err);
    } finally {
      setCreatingGroup(false);
      setShowDropdown(false);
      setSelectedFriends([]); // Clear selected friends
      setGroupName("");
      setDescription("");
      setImage(null);
    }
  };

  const cancelGroupCreation = () => {
    setShowDropdown(false);
    setSelectedFriends([]); // Clear selected friends if canceled
    setError(null);
  };

  useEffect(() => {
    if (showDropdown) {
      // api to get friend list
      setLoadingFriends(true);
      axios
        .get("http://127.0.0.1:8000/friends/list/", {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        })
        .then((response) => {
          setFriends(response.data);
        })
        .catch((err) => {
          console.error("Error fetching friends:", err);
        })
        .finally(() => {
          setLoadingFriends(false);
        });
    }
  }, [authTokens?.access, showDropdown]);

  return (
    <div className="create-group">
      <button onClick={handleCreateGroupClick} className="button-main">
        Create Group
      </button>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {showDropdown && (
        <div className="dropdown-menu">
          <h2>New Zajel Group 🕊️</h2>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <h3>Select Friends</h3>
          <ul>
            {loadingFriends ? (
              <li>Loading friends...</li>
            ) : friends.length > 0 ? (
              friends.map((friend) => (
                <li key={friend.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriendSelection(friend.id)}
                    />
                    {friend.username}
                  </label>
                </li>
              ))
            ) : (
              <li>No Friends available</li>
            )}
          </ul>
          <button onClick={createGroup} disabled={creatingGroup}>
            {creatingGroup ? "Creating" : "Create Group"}
          </button>
          <button onClick={cancelGroupCreation}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default CreateGroupButton;
