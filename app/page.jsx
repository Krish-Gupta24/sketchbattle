"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  LogIn,
  Palette,
  Crown,
  Zap,
  Sparkles,
  GamepadIcon,
  Timer,
  MessageCircle,
  Mic,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { RoomExist } from "@/actions/logic";

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [seed, setSeed] = useState(generateRandomSeed());
  const [activeTab, setActiveTab] = useState();
  const [time, setTime] = useState("80");
  const [rounds, setRounds] = useState("3");

  const avatarUrl = `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${seed}&radius=50`;

  function generateRandomSeed() {
    return Math.random().toString(36).substring(2, 10);
  }

  const host = false;
  const router = useRouter();
  const generateRoomId = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateRoom = () => {
    if (!username) return;
    const room = generateRoomId();
    localStorage.setItem("avatarUrl", avatarUrl);
    localStorage.setItem("username", username);
    localStorage.setItem("time", time);
    localStorage.setItem("rounds", rounds);
    const isHost = !host;
    localStorage.setItem("host", isHost);
    router.push(`/room/${room}`);
  };

  const handleJoinRoom = async () => {
    if (!username) return;
    const val = await RoomExist(room);
    console.log(val);
    if (val === true) {
      localStorage.setItem("avatarUrl", avatarUrl);
      localStorage.setItem("username", username);
      localStorage.setItem("host", host);
      router.push(`/room/${room}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/logo.jpg"
              alt="logo"
              width={300}
              height={40}
              className="mt-3"
            />
          </div>
          <p className="text-center text-gray-400 mt-2 text-lg">
            Draw, guess, and have fun with friends!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Room Management */}
            <div className="space-y-6">
              {/* Avatar Selection */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 p-6">
                <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Choose Your Avatar
                </h2>
                <img
                  src={avatarUrl}
                  alt="Random Avatar"
                  className="w-20 h-20 rounded-full  self-center border"
                  loading="lazy"
                />
                <Button
                  onClick={() => setSeed(generateRandomSeed())}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Randomize Avatar
                </Button>

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Your Name
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name..."
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                    maxLength={20}
                  />
                </div>
              </Card>

              {/* Room Management */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    onClick={() => setActiveTab("join")}
                    className={`flex-1 ${
                      activeTab === "join"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Join Room
                  </Button>
                  <Button
                    onClick={() => setActiveTab("create")}
                    className={`flex-1 ${
                      activeTab === "create"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </Button>
                </div>

                {activeTab === "join" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Room Code
                      </label>
                      <Input
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
                        placeholder="Enter room code..."
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-center text-lg font-mono"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={handleJoinRoom}
                      disabled={!username || !room}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Game
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h3 className="font-semibold text-white mb-2">
                        Room Settings
                      </h3>
                      <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>Round Time:</span>
                          <Select
                            value={time}
                            onValueChange={(val) => setTime(val)}
                          >
                            <SelectTrigger className="w-[90px]">
                              <SelectValue placeholder="80s" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="80">80s</SelectItem>
                              <SelectItem value="90">90s</SelectItem>
                              <SelectItem value="100">100s</SelectItem>
                              <SelectItem value="110">110s</SelectItem>
                              <SelectItem value="120">120s</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rounds:</span>
                          <Select
                            value={rounds}
                            onValueChange={(val) => setRounds(val)}
                          >
                            <SelectTrigger className="w-[90px]">
                              <SelectValue placeholder="3" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!username.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Create Room
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Side - Game Features */}
            <div className="space-y-6">
              {/* How to Play */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 p-6">
                <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <GamepadIcon className="w-5 h-5" />
                  How to Play
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Draw</h3>
                      <p className="text-sm text-gray-400">
                        When it's your turn, draw the given word
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Guess</h3>
                      <p className="text-sm text-gray-400">
                        Type your guesses in the chat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Score</h3>
                      <p className="text-sm text-gray-400">
                        Earn points for correct guesses and good drawings
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Game Features */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800 p-6">
                <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Features
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mic className="w-4 h-4 text-green-400" />
                    Voice Chat
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    Live Chat
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Timer className="w-4 h-4 text-yellow-400" />
                    Timed Rounds
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Crown className="w-4 h-4 text-purple-400" />
                    Leaderboard
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Palette className="w-4 h-4 text-pink-400" />
                    Drawing Tools
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Multiplayer
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-500 text-sm">
          <p>© 2025 ScribleBattle. Made with ❤️ for fun and creativity.</p>
        </div>
      </div>
    </div>
  );
}
