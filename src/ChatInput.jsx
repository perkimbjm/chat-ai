import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";


function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get('prompt');

    if (prompt) {
      setInputValue(prompt);
    }

    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    adjustHeight();
  }, [inputValue]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setImageBase64(base64);
        const previewUrl = reader.result;
        onSendMessage(previewUrl, 'image'); // Kirim URL gambar ke ChatWindow

      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;


    try {
      const contents = [
        {
          role: 'user',
          parts: [
            ...(imageBase64 ? [{ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }] : []),
            { text: inputValue }
          ]
        }
      ];

      const apiKey = process.env.GEMINI_API;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });
  
      const result = await model.generateContentStream({ contents });
  
      let buffer = [];

      for await (let response of result.stream) {
        const newText = response.text().replace(/\n+/g, ' ');
        buffer.push(newText); // Simpan teks baru ke dalam buffer
      }
      
      // Gabungkan buffer dan kirim pesan
      const finalContent = buffer.join('');
      if (finalContent.trim()) {
        onSendMessage(finalContent);
      }
      
      setInputValue('');
      setImageBase64('');
    } catch (error) {
      console.error('Error sending message:', error);
      onSendMessage('Error: Unable to send message');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-input">
      {imageBase64 && (
        <div className="thumbnail-preview">
          <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Thumbnail" style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Masukkan Perintah disini..."
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
      <button onClick={() => fileInputRef.current.click()} id='upload'>
        <FaPaperclip />
      </button>
      <span className="tooltip-text">Lampirkan File</span>
      <button ref={buttonRef} onClick={sendMessage} id='send'>
        <img src="/send.svg" alt="Send" width="25" />
      </button>
    </div>
  );
}

export default ChatInput;
