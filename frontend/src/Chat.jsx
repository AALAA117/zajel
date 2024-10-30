import React, { useEffect, useState, useRef } from "react";
import Headerchat from "./Header_chat";
import Messagebar from "./Messagebar";
import MessageScreen from "./Message_screen";
import { jwtDecode } from "jwt-decode";
import { handleSendMessage, handleReceiveMessage } from "./core/messagehandler"; // Import handlers
import { useWebSocket } from "./core/websocket";
import useAxios from "./utils/useAxios";

function Chat({ contact }) {
  const [messages, setMessages] = useState([]);
  const sendMessageRef = useRef(null);
  const api = useAxios();
  const authTokens = localStorage.getItem("authTokens");
  console.log("token", authTokens);
  const UserId = jwtDecode(authTokens).user_id;
  const { ws, isWsOpen } = useWebSocket();
  useEffect(() => {
    const fetchMessages = async () => {
      if (contact) {
        try {
          const response = await api.get(
            `/chat/api/groupmessages/${contact.id}/`
          );
          setMessages(response.data);
          console.log("Group number", contact.id);
          console.log("response", response.data);
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      }
    };
    fetchMessages();
    // Ensure ws is initialized before setting event handlers
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connection established.");
        ws.send(JSON.stringify({ action: "subscribe", room: contact.name }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message from server:", message);
        handleReceiveMessage(message, setMessages);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    return () => {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ action: "unsubscribe", room: contact.name }));
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, ws]);
  return (
    <div className="chatbox">
      <Headerchat contact={contact} />
      <MessageScreen messages={messages} currentUser={UserId} />
      <Messagebar
        onSendMessage={(message) => {
          if (isWsOpen) {
            message = {
              body: message,
              author: UserId,
            };
            handleSendMessage(message, sendMessageRef, setMessages, ws);
          } else {
            console.error("WebSocket is not open. Cannot send message.");
          }
        }}
      />
    </div>
  );
}

export default Chat;
