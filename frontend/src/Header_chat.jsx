
import React from 'react';

function Headerchat({contact}) {
    if (!contact) return <div className="chat-header">Select a contact to start chatting</div>;
    return (
        <div className="chat-header">
            <img className="contact-image" src={contact.image} alt={contact.name} />
            <h2>{contact.name}</h2>
        </div>
    );
}

export default Headerchat;
