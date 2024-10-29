import React, { useState } from "react";
import Header from "./Header.jsx";
import ContentTable from "./Content.jsx";
import Chat from "./Chat.jsx";

function Homepage() {
  const [selectedContact, setSelectedContact] = useState(null);
    const handleLogout = () => {
        alert("Logging out...");
      };
      return (
        <>
          <Header onlogout={handleLogout} />
          <div className="app-container">
            <ContentTable setSelectedContact={setSelectedContact} />
            <Chat selectedContact={selectedContact} />
          </div>
        </>
      );
}

export default Homepage