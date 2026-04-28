import { Board } from "./Board";
import { Player } from "./Player";
import { WinningStrategy } from "@/strategies/WinningStrategy";

export class Game {
  board: Board;
  players: Player[];
  currentPlayerIndex: number;
  winner: string;

  constructor() {
    this.board = new Board();

    this.players = [
      new Player("Player X", "X"),
      new Player("Player O", "O"),
    ];

    this.currentPlayerIndex = 0;
    this.winner = "";
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  makeMove(index: number) {
    const currentPlayer = this.getCurrentPlayer();

    const moveSuccessful = this.board.makeMove(
      index,
      currentPlayer.symbol
    );

    if (!moveSuccessful) {
      return false;
    }

    this.winner = WinningStrategy.checkWinner(
      this.board.grid
    );

    if (!this.winner) {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) %
        this.players.length;
    }

    return true;
  }

  resetGame() {
    this.board.resetBoard();
    this.currentPlayerIndex = 0;
    this.winner = "";
  }
}