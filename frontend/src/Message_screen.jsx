import React from 'react';

function MessageScreen({ messages }) {
    return (
        <div className="chat-messages">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'Me' ? 'my-message' : 'contact-message'}`}>
                    <p>{msg.text}</p>
                </div>
            ))}
        </div>
    );
}

export default MessageScreen;
