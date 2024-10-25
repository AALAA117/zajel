import React, { useState } from 'react';

function Messagebar({ onSendMessage }) {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage); // Call the passed function to send the message
            setNewMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Messagebar;
