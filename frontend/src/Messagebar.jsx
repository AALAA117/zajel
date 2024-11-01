import React, { useState } from "react";
import Picker from "@emoji-mart/react";

function Messagebar({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };
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
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={() => setShowEmojiPicker((prev) => !prev)}>😊</button>
      {showEmojiPicker && <Picker onEmojiSelect={addEmoji} theme="light" />}
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Messagebar;