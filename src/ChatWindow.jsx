import React from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

function ChatWindow({ messages, isTyping }) {
  const config = {
    ALLOWED_TAGS: ['p', 'em', 'strong', 'br'],
  };

  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.sender}`}>
          {message.type === 'text' ? (
            <ReactMarkdown className="message-text">
              {DOMPurify.sanitize(message.content, config)}
            </ReactMarkdown>
          ) : message.type === 'image' ? (
            <img src={message.content} alt="Uploaded" style={{ maxWidth: '25%', height: 'auto' }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
          <div className="message-info">
            <span className="message-sender">{message.sender}</span>
            <span className="message-timestamp">{message.timestamp}</span>
          </div>
        </div>
      ))}
      {isTyping && <p className="typing-indicator">Robot sedang mengetik...</p>}
    </div>
  );
}

export default ChatWindow;
