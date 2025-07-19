"use client"
import React,{useState} from 'react'
import { Badge } from './ui/badge'
import { Clock, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const Header = () => {
  const {roomid}=useParams()
    const [isMuted, setIsMuted] = useState(false)
    const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  return (
    <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 bg-black border-b border-gray-800">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu buttons */}
        {/*<div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPlayers(!showPlayers)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-2"
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-2"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>*/}
              


              
              <Image src='/logo.jpg' alt='logo' width={200} height={40} className='mt-3'/>
        <Badge className="hidden sm:inline-flex bg-gray-800 text-gray-300 border-gray-700 ml-5">
          Room: {roomid}
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-900 px-2 sm:px-3 py-1 rounded border border-gray-700">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          <span className="font-mono text-yellow-400 font-bold text-sm sm:text-base">
            1:00
          </span>
        </div>

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
}

export default Header