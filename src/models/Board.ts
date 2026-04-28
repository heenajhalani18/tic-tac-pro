export class Board {
  grid: string[];

  constructor() {
    this.grid = Array(9).fill("");
  }

  makeMove(index: number, symbol: string): boolean {
    if (this.grid[index] !== "") {
      return false;
    }

    this.grid[index] = symbol;
    return true;
  }

  resetBoard() {
    this.grid = Array(9).fill("");
  }
}