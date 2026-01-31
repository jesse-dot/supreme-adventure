"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function VoiceCallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    const loadCharacter = async () => {
      const res = await fetch(`/api/characters/${resolvedParams.id}`);
      const char = await res.json();
      setCharacter(char);
    };
    loadCharacter();
  }, [resolvedParams.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartCall = () => {
    setIsInCall(true);
    setTranscript([`${character.name}: ${character.greeting}`]);
    
    // Simulate text-to-speech
    if ('speechSynthesis' in window && character) {
      const utterance = new SpeechSynthesisUtterance(character.greeting);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    setTranscript([]);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSpeak = () => {
    // In a real implementation, this would use Web Speech API for speech recognition
    // For demo purposes, we'll simulate it
    const userMessage = "This is a demo. In a real implementation, speech recognition would capture your voice.";
    setTranscript((prev) => [...prev, `You: ${userMessage}`]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `That's interesting! As ${character?.name}, I love having these conversations with you.`;
      setTranscript((prev) => [...prev, `${character?.name}: ${aiResponse}`]);
      
      if ('speechSynthesis' in window && isSpeakerOn) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/character/${character.id}`}
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
            <h1 className="text-xl font-bold text-white">Voice Call</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Character Avatar */}
          <div className="text-center mb-8">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white shadow-2xl">
              <span className="text-6xl font-bold">{character.name[0]}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{character.name}</h2>
            <p className="text-white/80">{character.description}</p>
          </div>

          {/* Call Status */}
          <div className="text-center mb-8">
            {isInCall ? (
              <div className="space-y-2">
                <div className="text-green-400 text-lg font-semibold">Call in Progress</div>
                <div className="text-white/80 text-2xl font-mono">{formatDuration(callDuration)}</div>
              </div>
            ) : (
              <div className="text-white/60 text-lg">Ready to call</div>
            )}
          </div>

          {/* Transcript */}
          {isInCall && transcript.length > 0 && (
            <div className="mb-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 max-h-64 overflow-y-auto">
              <h3 className="text-white font-semibold mb-3">Transcript</h3>
              <div className="space-y-2">
                {transcript.map((line, index) => (
                  <p key={index} className="text-white/80 text-sm">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Call Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {!isInCall ? (
              <button
                onClick={handleStartCall}
                className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <Phone className="h-8 w-8 text-white" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-16 h-16 rounded-full ${
                    isMuted ? "bg-red-500" : "bg-white/20"
                  } hover:bg-white/30 flex items-center justify-center shadow-lg transition`}
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6 text-white" />
                  ) : (
                    <Mic className="h-6 w-6 text-white" />
                  )}
                </button>

                <button
                  onClick={handleSpeak}
                  className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  disabled={isMuted}
                >
                  <Mic className="h-8 w-8 text-white" />
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`w-16 h-16 rounded-full ${
                    !isSpeakerOn ? "bg-red-500" : "bg-white/20"
                  } hover:bg-white/30 flex items-center justify-center shadow-lg transition`}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="h-6 w-6 text-white" />
                  ) : (
                    <VolumeX className="h-6 w-6 text-white" />
                  )}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <PhoneOff className="h-8 w-8 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="text-center text-white/60 text-sm">
            {isInCall ? (
              <p>Click the microphone to speak, or end call when done</p>
            ) : (
              <p>Click the green button to start an audio call with {character.name}</p>
            )}
          </div>

          {/* Feature Note */}
          <div className="mt-8 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <p className="text-white/80 text-sm text-center">
              <strong>Note:</strong> Audio calls use browser Text-to-Speech for character voices. 
              In production, this would integrate with advanced voice synthesis APIs for more natural conversations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
