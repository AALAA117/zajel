import React from "react";

function MessageScreen({ messages }) {
  return (
    <div className="chat-messages">
      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.senderId === "your-user-id" ? "sent" : "received"
            }`}
          >
            <p>{message.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageScreen;
