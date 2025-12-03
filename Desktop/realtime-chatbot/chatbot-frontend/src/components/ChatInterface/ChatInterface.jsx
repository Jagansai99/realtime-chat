import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import {socket} from "../../utils/socketUtils"


const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId,setSessionId] = useState("")
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if(socket){
      socket.on("join",(data) => {
        setSessionId(data.id)
      })
      socket.on("new-message",(data) => {
           const newMessage = {
      id: data.id,
      text: data.text,
      sender: "other",
      timestamp: data.timestamp,
    };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      })
    }
  },[])

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = {
      id: sessionId,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
     
    socket.emit("new-message",newMessage)

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput(''); 
  };

  return (
    <div className="chat-window">
      <div style={{width:"100%",background:"#002455",height:"3rem"}}>
        <div style={{
          height:"inherit",
          display:"flex",
          justifyContent:"start",
          alignItems:"center",
          padding: "0 10px"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="30" fill="#fff" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
        </div>
      </div>
      <div className="message-list">
        {messages.map((message,index) => (
          <div
            key={index}
            className={`message-bubble ${message.sender}`}
          >
            <div className="message-text">{message.text}</div>
            <div className="message-time">{message.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>
      <form className="message-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;