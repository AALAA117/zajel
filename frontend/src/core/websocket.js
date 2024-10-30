import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, roomName }) => {
  const ws = useRef(null);
  const [isWsOpen, setIsWsOpen] = useState(false);

  useEffect(() => {
    if (roomName) {
      const authTokensSring = localStorage.getItem("authTokens");
      const authTokens = JSON.parse(authTokensSring);
      const token = authTokens.access;

      ws.current = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`
      );

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        console.log("WebSocket instance:", ws.current); // Debug log
        setIsWsOpen(true);
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
        setIsWsOpen(false);
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [roomName]);

  return (
    <WebSocketContext.Provider value={{ ws: ws.current, isWsOpen }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
