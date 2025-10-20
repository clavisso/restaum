// game.js - Implementação do jogo Resta Um

class RestaUm {
  constructor() {
    this.board = [
      [-1, -1,  1,  1,  1, -1, -1],
      [-1, -1,  1,  1,  1, -1, -1],
      [ 1,  1,  1,  1,  1,  1,  1],
      [ 1,  1,  1,  0,  1,  1,  1],
      [ 1,  1,  1,  1,  1,  1,  1],
      [-1, -1,  1,  1,  1, -1, -1],
      [-1, -1,  1,  1,  1, -1, -1]
    ];
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow < 0 || fromRow >= 7 || fromCol < 0 || fromCol >= 7) return false;
    if (toRow < 0 || toRow >= 7 || toCol < 0 || toCol >= 7) return false;
    if (this.board[fromRow][fromCol] !== 1) return false;
    if (this.board[toRow][toCol] !== 0) return false;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    if (rowDiff === 2 && colDiff === 0) {
      const middleRow = (fromRow + toRow) / 2;
      return this.board[middleRow][fromCol] === 1;
    } else if (colDiff === 2 && rowDiff === 0) {
      const middleCol = (fromCol + toCol) / 2;
      return this.board[fromRow][middleCol] === 1;
    }
    return false;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }
    this.board[fromRow][fromCol] = 0;
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    this.board[middleRow][middleCol] = 0;
    this.board[toRow][toCol] = 1;
    return true;
  }

  countPieces() {
    let count = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (cell === 1) count++;
      }
    }
    return count;
  }

  hasWon() {
    return this.countPieces() === 1;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RestaUm;
}
