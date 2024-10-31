// MessageScreen.jsx
import React from "react";
import "./Message_screen.css";

function MessageScreen({ messages, currentUser }) {
  console.log(currentUser, messages);
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.author === currentUser ? "sent" : "received "
          }`}
        >
          <p>{msg.body}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageScreen;
