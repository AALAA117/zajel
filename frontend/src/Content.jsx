/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Public_chat from "./Publicchat";
import api from "./core/api";
import Footer from "./Footer";

function ContentTable({ onSelectChat }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api({
          method: "GET",
          url: "/api/groups/",
        });
        const data = response.data;
        console.log("fetched groups:", data);
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

  const handleChatClick = (group) => {
    onSelectChat({
      id: group.id,
      name: group.group_name,
      photo: group.group_image,
    });
  };
  return (
    <div className="contenttable">
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
