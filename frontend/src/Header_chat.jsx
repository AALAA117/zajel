
import React from 'react';

function Headerchat({ contact }) {
    return (
        <div className="chat-header">
            <img src={contact.photo} alt={contact.name} className="contact-image" />
            <h2>{contact.name}</h2>
        </div>
    );
}

export default Headerchat;
