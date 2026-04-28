import {
  serverTimestamp,
} from "firebase/firestore";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import {
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/config";

export class MultiplayerService {
    static async saveMatchHistory(
  winner: string,
  gameMode: string
) {
  await addDoc(
    collection(db, "matchHistory"),
    {
      winner,
      gameMode,
      timestamp: serverTimestamp(),
    }
  );
}
    static async updateBoard(
  roomId: string,
  board: string[],
  currentTurn: string,
  winner: string
) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    board,
    currentTurn,
    winner,
  });
}
    static listenToRoom(
  roomId: string,
  callback: (data: any) => void
) {
  const roomRef = doc(db, "rooms", roomId);

  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}
  static async createRoom() {
    const roomRef = await addDoc(
      collection(db, "rooms"),
      {
        board: Array(9).fill(""),
        currentTurn: "X",
        winner: "",
        players: 1,
      }
    );

    return roomRef.id;
  }

  static async joinRoom(roomId: string) {
    if (!roomId) {
      throw new Error("Room ID required");
    }

    // FIXED HERE
    const roomRef = doc(db, "rooms", roomId);

    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }

    const roomData = roomSnap.data();

    if (roomData.players >= 2) {
      throw new Error("Room full");
    }

    await updateDoc(roomRef, {
      players: roomData.players + 1,
    });

    return roomData;
  }
}