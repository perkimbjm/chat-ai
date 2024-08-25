import React, { useState } from 'react';
import ChatApp from './ChatApp';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Menyimpan status mengetik

  const handleSendMessage = (content, type = 'text') => {
    if (content === 'Robot Sedang Mengetik...') {
      setIsTyping(true); // Tampilkan "Robot sedang mengetik..."
    } else {
      setIsTyping(false); // Hapus status mengetik
      setMessages((prevMessages) => [
        ...prevMessages,
        { content, type }
      ]);
    }
  };

  return (
    <div className="app-container">
      <h1>Chat with Robot Konsultan</h1>
      {isTyping && <p className="typing-indicator">Robot sedang mengetik...</p>} {/* Tampilkan indikator mengetik */}
      <ChatApp />
    </div>
  );
}

export default App;
