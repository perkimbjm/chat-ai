import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (content, sender, type = 'text') => {
    const newMessage = {
      content,
      sender,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  
  const handleSendMessage = async (message, type = 'text') => {
    // Atur isTyping menjadi true saat mulai mengetik atau proses pesan
    setIsTyping(true);

    // Simulasikan delay saat pesan sedang diproses
    setTimeout(() => {
      addMessage(message, 'User', type);
      setIsTyping(false); // Set kembali menjadi false setelah pesan dikirim
    }, 1000);
  };

  return (
    <div className="chat-app">
      <ChatWindow messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
