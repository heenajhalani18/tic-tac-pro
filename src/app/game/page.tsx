"use client";

import { useState } from "react";
import Confetti from "react-confetti";
import { Game } from "@/models/Game";
import { BotStrategy } from "@/strategies/BotStrategy";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect } from "react";
import { MultiplayerService } from "@/services/MultiplayerService";

function GameContent() {
  const [playerSymbol, setPlayerSymbol] = useState<string>("X");
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const roomId = searchParams.get("roomId");
  const [game, setGame] = useState(new Game());
  const [isDraw, setIsDraw] = useState(false);
  const [gameMode, setGameMode] = useState<string | null>(null);

  const [scores, setScores] = useState({
    xWins: 0,
    oWins: 0,
    aiWins: 0,
    draws: 0,
  });
  useEffect(() => {
  if (modeParam === "ai") {
    setGameMode("ai");
  }
}, [modeParam]);
  useEffect(() => {
  if (!roomId) return;
  if (roomId) {
  const existingPlayer =
    localStorage.getItem(`player-${roomId}`);

  if (existingPlayer) {
    setPlayerSymbol(existingPlayer);
  } else {
    const randomPlayer =
      Math.random() > 0.5 ? "X" : "O";

    localStorage.setItem(
      `player-${roomId}`,
      randomPlayer
    );

    setPlayerSymbol(randomPlayer);
  }
}
  const unsubscribe =
    MultiplayerService.listenToRoom(
      roomId,
      (roomData) => {
        const updatedGame = new Game();

        updatedGame.board.grid = roomData.board;
        updatedGame.winner = roomData.winner;

        updatedGame.currentPlayerIndex =
          roomData.currentTurn === "X" ? 0 : 1;

        setGame(updatedGame);
      }
    );

  return () => unsubscribe();
}, [roomId]);
useEffect(() => {
  const isAiMode =
    gameMode === "ai" || modeParam === "ai";

  if (!isAiMode) return;

  // AI should only play when it's O's turn
  if (
    game.getCurrentPlayer().symbol !== "O"
  )
    return;

  if (
    game.winner ||
    isDraw ||
    game.board.grid.every(
      (cell) => cell !== ""
    )
  )
    return;

  const timer = setTimeout(() => {
    const aiGame = new Game();

    aiGame.board.grid = [
      ...game.board.grid,
    ];
    aiGame.currentPlayerIndex = 1; // O
    aiGame.winner = game.winner;

    const bestMove =
      BotStrategy.getBestMove(
        aiGame.board.grid
      );

    const aiMoveSuccess =
      aiGame.makeMove(bestMove);

    if (!aiMoveSuccess) return;

    if (aiGame.winner) {
      MultiplayerService.saveMatchHistory(
        aiGame.winner,
        "ai"
      );

      setScores((prev) => ({
        ...prev,
        aiWins: prev.aiWins + 1,
      }));
    } else if (
      !aiGame.board.grid.includes("")
    ) {
      setIsDraw(true);

      MultiplayerService.saveMatchHistory(
        "Draw",
        "ai"
      );

      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    }

    setGame(aiGame);
  }, 500);

  return () => clearTimeout(timer);
}, [game, gameMode, modeParam, isDraw]);
  const handleClick = (index: number) => {
  if (!gameMode && !modeParam) return;

// Prevent clicking when AI's turn
if (
  (gameMode === "ai" || modeParam === "ai") &&
  game.getCurrentPlayer().symbol === "O"
) {
  return;
}
  if (game.winner || isDraw) return;

  const updatedGame = new Game();

  updatedGame.board.grid = [...game.board.grid];
  updatedGame.currentPlayerIndex = game.currentPlayerIndex;
  updatedGame.winner = game.winner;

  const moveSuccess = updatedGame.makeMove(index);

  if (!moveSuccess) return;

  // Human winner logic
  if (updatedGame.winner) {
    MultiplayerService.saveMatchHistory(
      updatedGame.winner,
      gameMode || modeParam || "unknown"
    );

    if (updatedGame.winner === "X") {
      setScores((prev) => ({
        ...prev,
        xWins: prev.xWins + 1,
      }));
    } else if (updatedGame.winner === "O") {
      if (
        gameMode === "ai" ||
        modeParam === "ai"
      ) {
        setScores((prev) => ({
          ...prev,
          aiWins: prev.aiWins + 1,
        }));
      } else {
        setScores((prev) => ({
          ...prev,
          oWins: prev.oWins + 1,
        }));
      }
    }
  }

  // Draw logic
  else if (!updatedGame.board.grid.includes("")) {
    setIsDraw(true);

    MultiplayerService.saveMatchHistory(
      "Draw",
      gameMode || modeParam || "unknown"
    );

    setScores((prev) => ({
      ...prev,
      draws: prev.draws + 1,
    }));
  }

  setGame(updatedGame);

  // Multiplayer sync
  if (roomId) {
    MultiplayerService.updateBoard(
      roomId,
      updatedGame.board.grid,
      updatedGame.getCurrentPlayer().symbol,
      updatedGame.winner
    );
  }

  // AI Move Logic
  
};

  const resetGame = () => {
    setGame(new Game());
    setIsDraw(false);
    setGameMode(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      
      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Confetti */}
      {game.winner === playerSymbol && (
  <Confetti
    width={window.innerWidth}
    height={window.innerHeight}
  />
)}

      {/* Mode selection */}
      {!gameMode && !modeParam && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Choose Game Mode
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setGameMode("pvp")}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
              >
                Player vs Player
              </button>

              <button
                onClick={() => setGameMode("ai")}
                className="border border-gray-600 px-6 py-3 rounded-xl"
              >
                Player vs AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 z-10">
        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>X Wins</p>
          <h2 className="text-2xl font-bold">{scores.xWins}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>O Wins</p>
          <h2 className="text-2xl font-bold">{scores.oWins}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>AI Wins</p>
          <h2 className="text-2xl font-bold">{scores.aiWins}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>Draws</p>
          <h2 className="text-2xl font-bold">{scores.draws}</h2>
        </div>
      </div>

      {/* Game Status */}
<h1 className="text-4xl font-bold mb-4 text-center z-10">
  {game.winner
    ? `${game.winner} Wins 🎉`
    : isDraw
    ? "It's a Draw 🤝"
    : `${game.getCurrentPlayer().symbol}'s Turn`}
</h1>

{/* Multiplayer Room ID */}
{roomId && (
  <p className="mb-4 text-green-400 z-10 font-medium">
    Multiplayer Room: {roomId}
  </p>
)}


{/* Board */}
<div className="grid grid-cols-3 gap-3 mb-8 z-10">
        {game.board.grid.map((cell, index) => (
          <button
            key={index}
            
            onClick={() => handleClick(index)}
            className="w-24 h-24 bg-white/10 backdrop-blur-md border border-gray-700 rounded-2xl text-4xl font-bold hover:scale-105 hover:bg-white/20 transition flex items-center justify-center shadow-lg"
          >
            <span
              className={
                cell === "X"
                  ? "text-blue-400"
                  : "text-pink-400"
              }
            >
              {cell}
            </span>
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={resetGame}
        className="z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
      >
        Restart Game
      </button>
    </main>
  );
  }

export default function GamePage() {
  return (
    <Suspense fallback={<div className="text-white min-h-screen flex items-center justify-center bg-black">Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}