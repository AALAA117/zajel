import React, { useState } from 'react';
import Headerchat from "./Header_chat";
import Messagebar from "./Messagebar";
import MessageScreen from "./Message_screen";

function Chat({ contact }) {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (text) => {
        setMessages([...messages, { text, sender: 'Me' }]);
    };

    return (
        <div className="chatbox">
            <Headerchat contact={contact} />
            <MessageScreen messages={messages} />
            <Messagebar onSendMessage={handleSendMessage} />
        </div>
    );
}

export default Chat;