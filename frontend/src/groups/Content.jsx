/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useContext } from "react";
import Public_chat from "../chat/Publicchat";
import useAxios from "../utils/useAxios";
import Footer from "../Footer";
import CreateGroupButton from "../Create";
import SearchBar from "../SearchBar";
import axios from "axios";

import AuthContext from "../context/AuthContext";

function ContentTable({ onSelectChat }) {
  const [groups, setGroups] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const api = useAxios();
  const authTokens = useContext(AuthContext);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/chat/api/groups/");
      const data = response.data;
      
      // Fetch details for private chats
      const updatedGroups = await Promise.all(
        data.map(async (group) => {
          group.actual_name = group.group_name; // Keep the original group name for WebSocket
          if (group.is_private) {
            const userId = authTokens.authTokens?.user.pk;
            const OtherUser = group.members.find(
              (member) => member !== parseInt(userId)
            );
            try {
              const profileResponse = await axios.get(
                `http://127.0.0.1:8000/user/api/profile/${OtherUser}/`,
                {
                  headers: {
                    Authorization: `Bearer ${authTokens.authTokens?.access}`,
                  },
                }
              );

              if (profileResponse.status === 200) {
                const profile = profileResponse.data;
                group.group_name = profile.user.username; // Update group name to the user's username
                group.image = profile.image;
                console.log(`${group.group_name} =================== ${group.image} ===================`)
              }
            } catch (error) {
              console.error("Failed to fetch profile for private chat:", error);
            }
          }
          console.log("group after altering data :", group);
          return group; // Return the group object for state update
        })
      );

      console.log("Updated groups:", updatedGroups); // Log the updated groups for debugging
      setGroups(updatedGroups);
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []); // Fetch groups only once on mount

  const handleGroupCreated = () => {
    fetchGroups(); // Refetch groups when a new group is created
  };

  const handleChatClick = (group) => {
    console.log("Selected group:", group); // Log the selected group
    onSelectChat({
      id: group.id,
      name: group.group_name,
      photo: group.image,
      actual_name: group.actual_name,
    });
  };

  return (
    <div className="contenttable">
      <div className="searchcreate">
        <SearchBar setSearchResults={setSearchResults} />
        <CreateGroupButton onGroupCreated={handleGroupCreated} />
      </div>
      {(searchResults.length > 0 ? searchResults : groups).map((group) => (
        <div
          key={group.id}
          className="group"
          onClick={() => handleChatClick(group)}
        >
          <Public_chat name={group.group_name} photo={group.image} />
        </div>
      ))}
      <Footer />
    </div>
  );
}

export default ContentTable;
