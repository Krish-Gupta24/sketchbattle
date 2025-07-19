"use client"
import socket from '@/app/socket-client';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Users } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useState,useEffect } from 'react'

const GamePage = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {roomid} = useParams()

  function handleCreateRoom() {
    const username = localStorage.getItem("username");
    const avatarUrl = localStorage.getItem("avatarUrl")
    if (!username || !roomid) return;
    socket.emit("joinRoom", { username, room: roomid, avatarUrl });
  }

  useEffect(() => {
    handleCreateRoom()
  }, [roomid])
  
  
  useEffect(() => {
      socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      return () => {
        socket.off("message");
      };
  }, []);
  
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen text-white overflow-hidden relative">
      <Header />
      <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex relative">
        {/* Left Sidebar - Players (Desktop) */}
        <div className="hidden lg:block w-60 bg-gray-900 border-r border-gray-800 p-3 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-purple-400">
              Players {/*TODO*/ }
            </h2>
            <div className="space-y-2">
              
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat (Desktop) */}
        <div className="hidden lg:flex w-72 bg-gray-900 border-l border-gray-800 flex-col">
          <div className="p-3 border-b border-gray-800">
            <h2 className="font-semibold text-purple-400">Chat & Guesses</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div className="flex items-start gap-2" key={idx}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-medium text-purple-300">
                      {msg.username}:
                    </span>
                    <span className="text-xs text-white">{msg.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your guess..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 text-sm"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 border border-purple-600 px-3"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage