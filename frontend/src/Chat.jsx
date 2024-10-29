import React, { useState, useEffect } from "react";
import Headerchat from "./Header_chat";
import Messagebar from "./Messagebar";
import MessageScreen from "./Message_screen";

function Chat({ selectedContact }) {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // api of web socket
    const socket = new WebSocket("websocket");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = (messageText) => {
    if (!messageText || !selectedContact) return;

    const message = {
      to: selectedContact.id,
      text: messageText,
      senderId: "your-user-id", // Replace with actual user ID
    };

    ws.send(JSON.stringify(message));
  };

  return (
    <div className="chatbox">
      <Headerchat contact={selectedContact} />
      <MessageScreen messages={messages} />
      <Messagebar onSendMessage={handleSendMessage} />
    </div>
  );
}

export default Chat;
