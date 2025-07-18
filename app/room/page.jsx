"use client";
import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const page = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (!username || !room) return;
    socket.emit("joinRoom", { username, room });
    setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  if (!joined) {
    return (
      <div className="p-6">
        <h2 className="text-xl mb-4">Join a Chat Room</h2>
        <input
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={joinRoom} className="bg-blue-500 text-white p-2">
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Room: {room}</h2>
      <div className="border h-64 overflow-y-auto p-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 mr-2 w-1/2"
      />
      <button onClick={sendMessage} className="bg-green-500 text-white p-2">
        Send
      </button>
    </div>
  );
};

export default page;
