import React, { useState } from "react";

function Messagebar({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onSendMessage(message); // Call the send function passed from Chat
    setMessage(""); // Clear the input
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Messagebar;
