"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { userData } from "@/actions/logic";
import socket from "@/app/socket-client";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  MicOff,
  Send,
  Palette,
  Eraser,
  RotateCcw,
  Users,
  Clock,
  Crown,
  Volume2,
  VolumeX,
  X,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GamePage = () => {
  const { roomid } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [showPlayers, setShowPlayers] = useState(false);

  const handleCreateRoom = () => {
    const username = localStorage.getItem("username");
    const avatarUrl = localStorage.getItem("avatarUrl");
    const host = localStorage.getItem("host") === "true" ;
    const time = parseInt(localStorage.getItem("time"), 10);
    const rounds = parseInt(localStorage.getItem("rounds"), 10);
    
    if (!username || !roomid) return;
    socket.emit("joinRoom", { username, room: roomid, avatarUrl, host, time,rounds});
    //localStorage.clear()
  };

  useEffect(() => {
    handleCreateRoom();

    socket.on("message", async (msg) => {
      setMessages((prev) => [...prev, msg]);

      const isServerJoinOrLeave =
        msg.username === "Server" &&
        (msg.message.endsWith("joined the room.") ||
          msg.message.endsWith("left the room."));

      if (isServerJoinOrLeave) {
        const room = await userData(roomid);
        console.log("Room Detail:", room);
        setRoomDetails(room);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [roomid]);


  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chatMessage", message);
    setMessage("");
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
              Players {roomDetails?.users?.length ?? 0}
            </h2>
          </div>
          <div className="space-y-2">
            {roomDetails?.users?.map((user, index) => (
              <Card
                key={user.id || index}
                className="bg-gray-800 border-gray-700 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Avatar Circle */}
                    <img
                      src={user.avatar}
                      alt={user.username}
                      loading="lazy"
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    {/* Username and Status */}
                    <div className="flex items-center gap-1">
                      {user.host === true && (
                        <Crown className="w-3 h-3 text-yellow-400" />
                      )}
                      <span className={`text-sm font-medium text-white`}>
                        {user.username}
                      </span>
                    </div>
                  </div>

                  {/* You can later show score or role here */}
                  <Badge className="bg-gray-700 text-purple-300 border-gray-600 text-xs">
                    {user.score ?? 0}
                  </Badge>
                </div>

                {/* If user is drawing */}
              </Card>
            ))}
          </div>
        </div>


        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-gray-900 p-2 sm:p-3 text-center border-b border-gray-800">
            <p className="text-xs text-gray-400 mb-1">Your word:</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400 tracking-wider">
              BUTTERFLY
            </p>
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
};

export default GamePage;
