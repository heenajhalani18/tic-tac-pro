"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] =
    useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const snapshot = await getDocs(
        collection(db, "matchHistory")
      );

      const data = snapshot.docs.map((doc) =>
        doc.data()
      );

      const winsMap: any = {};

      data.forEach((match: any) => {
        const winner =
  match.winnerName || match.winner;

        if (
          winner &&
          winner !== "Draw"
        ) {
          winsMap[winner] =
            (winsMap[winner] || 0) + 1;
        }
      });

      const sortedLeaderboard =
        Object.entries(winsMap)
          .map(([player, wins]) => ({
            player,
            wins,
          }))
          .sort(
            (a: any, b: any) =>
              b.wins - a.wins
          );

      setLeaderboard(
        sortedLeaderboard
      );
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-5xl font-bold mb-8">
        Leaderboard 🏆
      </h1>

      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-2xl p-6">
        {leaderboard.length === 0 ? (
          <p>No matches played yet.</p>
        ) : (
          leaderboard.map(
            (player, index) => (
              <div
                key={index}
                className="flex justify-between py-3 border-b border-gray-700"
              >
                <span>
                  #{index + 1} {player.player}
                </span>
                <span>
                  {player.wins} wins
                </span>
              </div>
            )
          )
        )}
      </div>

      <Link href="/">
        <button className="mt-8 bg-white text-black px-6 py-3 rounded-xl">
          Back Home
        </button>
      </Link>
    </main>
  );
}