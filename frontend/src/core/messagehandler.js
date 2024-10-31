export const handleSendMessage = (message, ws) => {
  console.log(message);

  // const newMessage = { body: message.body, author: message.author };
  // setMessages((prevMessages) => [...prevMessages, newMessage]);

  if (!ws) {
    console.error("WebSocket is not initialized. Message not sent.");
    return; // Early return if WebSocket is not available
  }

  const sendMessage = () => {
    console.log("WebSocket state:", ws.readyState);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: message.body }));
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  };

  sendMessage();

  // if (sendMessageRef.current) {
  //   sendMessageRef.current(message.body);
  // }
};

export const handleReceiveMessage = (message, setMessages) => {
  const newMessage = { body: message.message, author: message.author };
  setMessages((prevMessages) => [...prevMessages, newMessage]);
};
