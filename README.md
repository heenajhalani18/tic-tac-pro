# Tic Tac Pro 🎮

A full-stack real-time multiplayer Tic Tac Toe platform built using **Next.js, TypeScript, Firebase, and Tailwind CSS**, designed with **Low-Level Design (LLD) principles** and deployed on Vercel.

🔗 **Live Demo:** https://tic-tac-pro-tau.vercel.app/  
🔗 **GitHub Repo:** https://github.com/heenajhalani18/tic-tac-pro

---

## Features ✨

### 🎯 Multiple Game Modes
- Local Player vs Player mode
- Smart AI mode
- Real-time Multiplayer mode

### 🤖 AI Opponent
- Implemented bot gameplay using strategy-based move selection
- Automatically plays against users in real time

### 🌐 Real-Time Multiplayer
- Create room
- Join room using room code
- Live board synchronization using Firebase Firestore

### 🔐 Google Authentication
- Sign in using Google account
- Authentication handled using Firebase Auth

### 🏆 Leaderboard
- Tracks top players based on wins
- Displays rankings dynamically

### 📜 Match History
- Stores completed match data
- Tracks winners and game mode

### 🎨 Premium UI
- Modern glassmorphism UI
- Hover animations
- Confetti winner celebration
- Responsive design

---

# Tech Stack 🛠️

### Frontend
- :contentReference[oaicite:1]{index=1}
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend / Database
- :contentReference[oaicite:2]{index=2} Firestore
- Firebase Authentication

### Deployment
- :contentReference[oaicite:3]{index=3}

---

# Low Level Design Implementation 🧠

This project was intentionally built using modular LLD principles:

### Models
- `Game.ts`
- `Board.ts`
- `Player.ts`

### Strategy Pattern
- `BotStrategy.ts`
- `WinningStrategy.ts`

### Services
- `MultiplayerService.ts`

This architecture makes the code scalable, maintainable, and easy to extend.

---

# Project Architecture

```bash
src/
 ├── app/
 │   ├── page.tsx
 │   ├── game/
 │   ├── leaderboard/
 │
 ├── models/
 │   ├── Game.ts
 │   ├── Board.ts
 │   ├── Player.ts
 │
 ├── strategies/
 │   ├── BotStrategy.ts
 │   ├── WinningStrategy.ts
 │
 ├── services/
 │   ├── MultiplayerService.ts
 │
 ├── firebase/
 │   ├── config.ts
```

---

# Challenges Faced 🚀

- Managing AI move logic with React state updates
- Fixing multiplayer synchronization issues
- Handling Google Auth deployment issues
- Resolving Next.js production deployment errors
- Building scalable game architecture using LLD

---

# Future Improvements

- Sound effects
- Friend invite links
- Minimax AI
- Player profiles
- Match analytics dashboard

---

# Installation & Setup

Clone repository:

```bash
git clone https://github.com/heenajhalani18/tic-tac-pro.git
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## Author

**Heena Jhalani**  

---

If you liked this project, feel free to ⭐ the repo.
