/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Public_chat from "../chat/Publicchat";
import useAxios from "../utils/useAxios";
import Footer from "../Footer";
import CreateGroupButton from "../Create";
import SearchBar from "../SearchBar";

function ContentTable({ onSelectChat }) {
  const [groups, setGroups] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const api = useAxios();

  const fetchGroups = async () => {
    try {
      const response = await api.get("/chat/api/groups/");
      console.log("response:", response);
      const data = response.data;
      console.log("fetched groups:", data);
      setGroups(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add an empty array here to prevent re-runs

  const handleGroupCreated = () => {
    fetchGroups();
  };

  const handleChatClick = (group) => {
    onSelectChat({
      id: group.id,
      name: group.group_name,
      photo: group.image,
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
