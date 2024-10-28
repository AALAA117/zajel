import { useEffect, useRef } from "react";
import { ADDRESS } from "./api";

const WebsocketComponent = ({ roomName, onMessage, onSendMessageRef }) => {
  const ws = useRef(null);

  useEffect(() => {
    // Close the existing WebSocket if it's already open
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    const connectWebSocket = () => {
      const authTokensSring = localStorage.getItem("authTokens");
      const authTokens = JSON.parse(authTokensSring);
      const token = authTokens.access;
      console.log("token=", token);
      ws.current = new WebSocket(
        `ws://${ADDRESS}/ws/chat/${roomName}/?token=${token}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection established for room:", roomName);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // onMessage(data.message);
        if (typeof onMessage === "function") {
          onMessage(data.message);
        } else {
          console.error("onMessage is not a function");
        }
        console.log("Message received:", event.data);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error observed:", error);
      };

      ws.current.onclose = (e) => {
        console.log("WebSocket connection closed:", e.code, e.reason);
        if (e.code === 1006) {
          console.error(
            "WebSocket closed abnormally: Connection was interrupted or server-side issue."
          );
        }
      };
    };

    connectWebSocket();

    // Ensure onSendMessageRef is defined
    if (
      onSendMessageRef &&
      typeof onSendMessageRef === "object" &&
      onSendMessageRef !== null
    ) {
      onSendMessageRef.current = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ message }));
        }
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log(`Closed WebSocket for room: ${roomName}`);
      }
    };
  }, [roomName, onMessage, onSendMessageRef]);

  return null;
};

export default WebsocketComponent;
