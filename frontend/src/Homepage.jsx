import Header from "./Header.jsx";
import ContentTable from "./Content.jsx";
import Chat from "./Chat.jsx";
import { WebSocketProvider } from "./core/websocket.js";
// import Bob from "./assets/bob.jpeg";
import { useState } from "react";
function Homepage() {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleLogout = () => {
    alert("Logging out...");
  };
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };
  return (
    <>
      <Header onLogout={handleLogout} />
      <div className="app-container">
        <ContentTable onSelectChat={handleChatSelect} />
        {selectedChat && (
          <WebSocketProvider roomName={selectedChat.name}>
            <Chat contact={selectedChat} />
          </WebSocketProvider>
        )}
      </div>
    </>
  );
}

export default Homepage;
