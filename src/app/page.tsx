"use client";

import { auth } from "@/firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { Play, Trophy, Bot, Users } from "lucide-react";
import { MultiplayerService } from "@/services/MultiplayerService";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const handleCreateRoom = async () => {
    try {
      const newRoomId = await MultiplayerService.createRoom();

      setCreatedRoomId(newRoomId);

    } catch (error) {
      console.error(error);
      alert("Failed to create room");
    }
  };
  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(
      auth,
      provider
    );

    setUser(result.user);

localStorage.setItem(
  "user",
  JSON.stringify(result.user)
);
  } catch (error) {
    console.error(error);
  }
};
  const handleJoinRoom = async () => {
    try {
      await MultiplayerService.joinRoom(roomId);

      alert("Joined room successfully!");

      // later we’ll pass room ID properly
      window.location.href = `/game?roomId=${roomId}`;
    } catch (error) {
      console.error(error);
      alert("Failed to join room");
    }
  };
  const handleLogout = async () => {
  try {
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">

      {/* Google Auth UI */}
<div className="absolute top-6 right-6 z-20">
  {user ? (
    <div className="flex items-center gap-3">
      <img
        src={user.photoURL}
        alt="profile"
        className="w-10 h-10 rounded-full"
      />

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={handleGoogleLogin}
      className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
    >
      Sign in with Google
    </button>
  )}
</div>

      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight z-10">
        Tic Tac Pro
      </h1>

      <p className="text-gray-400 text-lg md:text-xl mb-10 text-center max-w-xl z-10">
        Play against friends, battle AI, or create real-time multiplayer rooms.
      </p>
      {/* Existing buttons */}
<div className="flex flex-col md:flex-row gap-4 z-10 mb-8">

  {/* Play Now */}
  <Link href="/game">
    <button className="flex items-center gap-2 border border-gray-600 px-6 py-3 rounded-xl hover:bg-blue-500 hover:border-blue-500 hover:scale-105 transition duration-300">
      <Play size={20} />
      Play Now
    </button>
  </Link>

  {/* Play vs AI */}
  <Link href="/game?mode=ai">
    <button className="flex items-center gap-2 border border-gray-600 px-6 py-3 rounded-xl hover:bg-purple-500 hover:border-purple-500 hover:scale-105 transition duration-300">
      <Bot size={20} />
      Play vs AI
    </button>
  </Link>

  {/* Leaderboard */}
  <Link href="/leaderboard">
    <button className="flex items-center gap-2 border border-gray-600 px-6 py-3 rounded-xl hover:bg-yellow-500 hover:border-yellow-500 hover:text-black hover:scale-105 transition duration-300">
      <Trophy size={20} />
      Leaderboard
    </button>
  </Link>

</div>
      {/* NEW Multiplayer Section */}
<div className="bg-white/10 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl z-10 w-full max-w-md">
  <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
    <Users size={22} />
    Multiplayer Room
  </h2>

  <div className="flex flex-col gap-4">
    
    {/* Create Room Button */}
    <button
      onClick={handleCreateRoom}
      className="bg-blue-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
    >
      Create Room
    </button>

    {/* Show Created Room Code */}
    {createdRoomId && (
      <div className="bg-green-500/20 p-3 rounded-xl text-center">
        <p className="text-sm text-gray-300">
          Share this Room Code:
        </p>
        <p className="font-bold text-green-400 text-lg break-all">
          {createdRoomId}
        </p>
      </div>
    )}

    {/* Join Input */}
    <input
      type="text"
      placeholder="Enter Room Code"
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)}
      className="px-4 py-3 rounded-xl text-black"
    />

    {/* Join Button */}
    <button
      onClick={handleJoinRoom}
      className="bg-purple-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
    >
      Join Room
    </button>
  </div>
</div>
</main>
  );
}