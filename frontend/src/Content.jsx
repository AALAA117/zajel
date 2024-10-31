/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Public_chat from "./Publicchat";
import useAxios from "./utils/useAxios";
import Footer from "./Footer";
import CreateGroupButton from "./Create";
import SearchBar from "./SearchBar";

function ContentTable({ onSelectChat }) {
  const [groups, setGroups] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = useState([]);
  const api = useAxios();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log(localStorage.getItem("authTokens"));
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
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add an empty array here to prevent re-runs

  const handleChatClick = (group) => {
    onSelectChat({
      id: group.id,
      name: group.group_name,
      photo: group.group_image,
    });
  };
  return (
    <div className="contenttable">
      <div className="searchcreate">
        <SearchBar setSearchResults={setSearchResults} />
        <CreateGroupButton />
      </div>
      {groups.map((group) => (
        <div
          key={group.id}
          className="group"
          onClick={() => handleChatClick(group)}
        >
          <Public_chat name={group.group_name} />
        </div>
      ))}
      {/* <Content_Chat /> */}
      <Footer />
    </div>
  );
}

export default ContentTable;
