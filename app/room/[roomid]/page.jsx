"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const GamePage = () => {
    const {roomid} = useParams()
    console.log(roomid)

    function handleCreateRoom() {
        const username = localStorage.getItem("username");
      console.log(roomid);
      if (!username || !roomid) return;
      socket.emit("joinRoom", { username, room:roomid });
    }

    handleCreateRoom()
  return (
    <div>GamePage</div>
  )
}

export default GamePage