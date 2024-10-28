import React, { useEffect, useState } from "react";
import Public_chat from "./Publicchat";
import Content_Chat from "./Contact_chat";
import SearchBar from "./SearchBar";
import Create_Button from "./Create";
import Footer from "./Footer";
import axios from "axios";
import Default from './assets/default.jpeg'

function ContentTable() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // API to get contacts
    axios
      .get('https', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then((response) => {
        setContacts(response.data);
      })
      .catch((err) => {
        console.error('Error fetching contacts:', err);
      });
  }, []);

  const addNewChat = (newChat) => {
    setContacts((prevContacts) => [...prevContacts, newChat]);
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="contenttable">
      <SearchBar selectContact={selectContact} />
      <Create_Button addNewChat={addNewChat} />
      {contacts.map((contact) => (
        <Content_Chat
          key={contact.id}
          image={contact.image || Default}
          name={contact.name}
          lastMessage={contact.lastMessage}
          onClick={() => setSelectedContact(contact)}
        />
      ))}

      <Footer />
    </div>
  );
}

export default ContentTable;
