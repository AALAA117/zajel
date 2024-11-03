import publicphoto from "./assets/default.jpeg";

import React from "react";

function Headerchat({ contact }) {
  if (!contact)
    return (
      <div className="chat-header">Select a contact to start chatting</div>
    );
  return (
    <div className="chat-header">
      <img
        className="contact-image"
        src={contact.photo || publicphoto}
        alt={contact.name}
      />
      <h2>{contact.name}</h2>
    </div>
  );
}

export default Headerchat;
