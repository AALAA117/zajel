// MessageScreen.jsx
import React, { useEffect, useRef } from "react";

import "./Message_screen.css";

function MessageScreen({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.author === currentUser ? "sent" : "received"
          }`}
        >
          <p className="pcolor">{msg.body}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageScreen;
