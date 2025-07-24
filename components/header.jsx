"use client";

import React, { useEffect, useState, useRef } from "react";
import { Badge } from "./ui/badge";
import { Clock, Mic, MicOff, Volume2, VolumeX, Play } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { words } from "@/data/data";

const Header = ({
  time: initialTime,
  rounds: initialRounds,
  word,
  setWord,
  roomDetails,
}) => {
  const { roomid } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime || 5);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  const gameStateRef = useRef({
    phase: "stopped", // 'stopped', 'playing', 'waiting'
    currentRound: 1,
    totalRounds: initialRounds,
    currentPlayerIndex: 0,
    totalPlayers: roomDetails?.users?.length || 1,
  });

  // Get total number of players
  const totalPlayers = roomDetails?.users?.length || 1;

  // Get current player info
  const getCurrentPlayer = () => {
    if (!roomDetails?.users || roomDetails.users.length === 0) return null;
    return roomDetails.users[currentPlayerIndex];
  };

  const startGame = () => {
    if (gameStarted) return;

    setGameStarted(true);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setIsWaiting(false);
    setTimeLeft(initialTime || 5);

    // Generate first word
    const firstWord = words[Math.floor(Math.random() * words.length)];
    setWord(firstWord);

    gameStateRef.current = {
      phase: "playing",
      currentRound: 1,
      totalRounds: initialRounds,
      currentPlayerIndex: 0,
      totalPlayers: totalPlayers,
    };
  };

  const nextTurn = () => {
    const state = gameStateRef.current;
    const nextPlayerIndex = state.currentPlayerIndex + 1;

    if (nextPlayerIndex >= totalPlayers) {
      // All players in current round have played, check if we need next round
      if (state.currentRound < state.totalRounds) {
        // Start next round
        const nextRound = state.currentRound + 1;

        setTimeout(() => {
          setIsWaiting(true);
          setCurrentRound(nextRound);
          setCurrentPlayerIndex(0);
          gameStateRef.current.phase = "waiting";
          gameStateRef.current.currentRound = nextRound;
          gameStateRef.current.currentPlayerIndex = 0;
        }, 0);

        // Wait 2 seconds before starting next round
        setTimeout(() => {
          const newWord = words[Math.floor(Math.random() * words.length)];
          setWord(newWord);
          setIsWaiting(false);
          setTimeLeft(initialTime || 5);
          gameStateRef.current.phase = "playing";
        }, 2000);
      } else {
        // Game completely over
        setTimeout(() => {
          setGameStarted(false);
          gameStateRef.current.phase = "stopped";
        }, 0);
      }
    } else {
      // Next player's turn in same round
      setTimeout(() => {
        setCurrentPlayerIndex(nextPlayerIndex);
        const newWord = words[Math.floor(Math.random() * words.length)];
        setWord(newWord);
        setTimeLeft(initialTime || 5);
        gameStateRef.current.currentPlayerIndex = nextPlayerIndex;
      }, 0);
    }
  };

  // Timer effect for individual player turns
  useEffect(() => {
    if (!gameStarted || isWaiting) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Time's up for current player, move to next turn
          nextTurn();
          return initialTime || 5; // Reset timer for next player
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, isWaiting, currentPlayerIndex, currentRound]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentPlayer = getCurrentPlayer();

  return (
    <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 bg-black border-b border-gray-800">
      <div className="flex items-center gap-2 sm:gap-4">
        <Image
          src="/logo.jpg"
          alt="logo"
          width={200}
          height={40}
          className="mt-3"
        />
        <Badge className="hidden sm:inline-flex bg-gray-800 text-gray-300 border-gray-700 ml-5">
          Room: {roomid}
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!gameStarted ? (
          <Button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Start
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-900 px-2 sm:px-3 py-1 rounded border border-gray-700">
              <span className="text-white text-xs sm:text-sm font-medium">
                {isWaiting
                  ? `Round ${currentRound} starting...`
                  : `Round ${currentRound}/${initialRounds}`}
              </span>
            </div>

            {!isWaiting && currentPlayer && (
              <div className="flex items-center gap-1 sm:gap-2 bg-purple-900 px-2 sm:px-3 py-1 rounded border border-purple-700">
                <span className="text-purple-200 text-xs sm:text-sm font-medium">
                  {currentPlayer.username}'s turn
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2 bg-gray-900 px-2 sm:px-3 py-1 rounded border border-gray-700">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="font-mono text-yellow-400 font-bold text-sm sm:text-base">
                {isWaiting
                  ? "Starting..."
                  : timeLeft > 60
                  ? formatTime(timeLeft)
                  : `${timeLeft}s`}
              </span>
            </div>

            {/* Add manual next turn button for testing/manual control */}
            <Button
              onClick={nextTurn}
              className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
              disabled={isWaiting}
            >
              Next Turn
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-2"
        >
          {isSpeakerMuted ? (
            <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className={`border p-2 ${
            isMuted
              ? "bg-red-900 text-red-400 border-red-700 hover:bg-red-800"
              : "bg-green-900 text-green-400 border-green-700 hover:bg-green-800"
          }`}
        >
          {isMuted ? (
            <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
