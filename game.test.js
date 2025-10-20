// game.test.js - Testes unitários

const RestaUm = require('./game');

describe('Resta Um Game', () => {
  let game;

  beforeEach(() => {
    game = new RestaUm();
  });

  test('deve inicializar o tabuleiro corretamente', () => {
    expect(game.countPieces()).toBe(32);
  });

  test('deve validar movimento válido', () => {
    expect(game.isValidMove(1, 3, 3, 3)).toBe(true);
  });

  test('deve rejeitar movimento inválido', () => {
    expect(game.isValidMove(0, 2, 0, 4)).toBe(false);
  });

  test('deve executar movimento válido', () => {
    const result = game.makeMove(1, 3, 3, 3);
    expect(result).toBe(true);
    expect(game.countPieces()).toBe(31);
  });

  test('deve rejeitar movimento inválido ao executar', () => {
    const result = game.makeMove(0, 0, 0, 2);
    expect(result).toBe(false);
    expect(game.countPieces()).toBe(32);
  });

  test('deve detectar vitória', () => {
    expect(game.hasWon()).toBe(false);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (game.board[i][j] === 1) {
          game.board[i][j] = 0;
        }
      }
    }
    game.board[3][3] = 1;
    expect(game.hasWon()).toBe(true);
  });
});
