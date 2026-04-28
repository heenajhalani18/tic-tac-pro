export class BotStrategy {
  static getBestMove(board: string[]): number {
    const winningCombinations = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    // First: try to win
    for (const combo of winningCombinations) {
      const [a,b,c] = combo;
      const values = [board[a], board[b], board[c]];

      if (
        values.filter(v => v === "O").length === 2 &&
        values.includes("")
      ) {
        if (board[a] === "") return a;
        if (board[b] === "") return b;
        if (board[c] === "") return c;
      }
    }

    // Second: block player from winning
    for (const combo of winningCombinations) {
      const [a,b,c] = combo;
      const values = [board[a], board[b], board[c]];

      if (
        values.filter(v => v === "X").length === 2 &&
        values.includes("")
      ) {
        if (board[a] === "") return a;
        if (board[b] === "") return b;
        if (board[c] === "") return c;
      }
    }

    // Third: take center
    if (board[4] === "") return 4;

    // Fourth: random fallback
    const emptyCells = board
      .map((cell, index) => (cell === "" ? index : -1))
      .filter(index => index !== -1);

    return emptyCells[
      Math.floor(Math.random() * emptyCells.length)
    ];
  }
}