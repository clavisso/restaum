// app.js - Frontend do jogo

let game;
let selectedCell = null;
let movesCount = 0;

function initGame() {
    game = new RestaUm();
    selectedCell = null;
    movesCount = 0;
    updateDisplay();
    renderBoard();
    showMessage('Selecione uma peça para começar', 'info');
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            const value = game.board[row][col];

            if (value === -1) {
                cell.classList.add('invalid');
            } else if (value === 0) {
                cell.classList.add('empty');
            } else if (value === 1) {
                cell.classList.add('piece');
            }

            cell.addEventListener('click', () => handleCellClick(row, col));
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    const cellValue = game.board[row][col];

    if (selectedCell === null) {
        if (cellValue === 1) {
            selectCell(row, col);
        } else {
            showMessage('Selecione uma peça para mover', 'error');
        }
    } else {
        if (row === selectedCell.row && col === selectedCell.col) {
            deselectCell();
        } else if (cellValue === 0) {
            tryMove(selectedCell.row, selectedCell.col, row, col);
        } else if (cellValue === 1) {
            deselectCell();
            selectCell(row, col);
        }
    }
}

function selectCell(row, col) {
    selectedCell = { row, col };
    renderBoard();
    highlightSelectedCell();
    highlightValidMoves(row, col);
    showMessage('Agora clique no destino válido', 'info');
}

function deselectCell() {
    selectedCell = null;
    renderBoard();
    showMessage('Peça desmarcada. Selecione outra', 'info');
}

function highlightSelectedCell() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (row === selectedCell.row && col === selectedCell.col) {
            cell.classList.add('selected');
        }
    });
}

function highlightValidMoves(fromRow, fromCol) {
    const possibleMoves = [
        { row: fromRow - 2, col: fromCol },
        { row: fromRow + 2, col: fromCol },
        { row: fromRow, col: fromCol - 2 },
        { row: fromRow, col: fromCol + 2 }
    ];

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        possibleMoves.forEach(move => {
            if (row === move.row && col === move.col) {
                if (game.isValidMove(fromRow, fromCol, row, col)) {
                    cell.classList.add('valid-move');
                }
            }
        });
    });
}

function tryMove(fromRow, fromCol, toRow, toCol) {
    const success = game.makeMove(fromRow, fromCol, toRow, toCol);

    if (success) {
        movesCount++;
        selectedCell = null;
        renderBoard();
        updateDisplay();
        checkGameStatus();
    } else {
        showMessage('Movimento inválido! Tente outro destino', 'error');
    }
}

function updateDisplay() {
    document.getElementById('pieces-count').textContent = game.countPieces();
    document.getElementById('moves-count').textContent = movesCount;
}

function checkGameStatus() {
    if (game.hasWon()) {
        showMessage(`Parabéns! Você venceu em ${movesCount} movimentos!`, 'success');
        setTimeout(() => {
            if (confirm('Você venceu! Jogar novamente?')) {
                initGame();
            }
        }, 1000);
    } else if (game.countPieces() > 1 && !hasValidMoves()) {
        showMessage('Game Over! Não há mais movimentos válidos', 'error');
        setTimeout(() => {
            if (confirm('Sem movimentos válidos. Tentar novamente?')) {
                initGame();
            }
        }, 1000);
    } else {
        showMessage(`Ótimo movimento! Continue jogando`, 'success');
    }
}

function hasValidMoves() {
    for (let fromRow = 0; fromRow < 7; fromRow++) {
        for (let fromCol = 0; fromCol < 7; fromCol++) {
            if (game.board[fromRow][fromCol] === 1) {
                const moves = [
                    { row: fromRow - 2, col: fromCol },
                    { row: fromRow + 2, col: fromCol },
                    { row: fromRow, col: fromCol - 2 },
                    { row: fromRow, col: fromCol + 2 }
                ];

                for (let move of moves) {
                    if (game.isValidMove(fromRow, fromCol, move.row, move.col)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = 'message ' + type;
}

function showHint() {
    for (let fromRow = 0; fromRow < 7; fromRow++) {
        for (let fromCol = 0; fromCol < 7; fromCol++) {
            if (game.board[fromRow][fromCol] === 1) {
                const moves = [
                    { row: fromRow - 2, col: fromCol },
                    { row: fromRow + 2, col: fromCol },
                    { row: fromRow, col: fromCol - 2 },
                    { row: fromRow, col: fromCol + 2 }
                ];

                for (let move of moves) {
                    if (game.isValidMove(fromRow, fromCol, move.row, move.col)) {
                        showMessage(`Dica: Mova a peça de (${fromRow}, ${fromCol}) para (${move.row}, ${move.col})`, 'info');
                        selectCell(fromRow, fromCol);
                        return;
                    }
                }
            }
        }
    }
    showMessage('Não há movimentos válidos disponíveis', 'error');
}

document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja reiniciar o jogo?')) {
        initGame();
    }
});

document.getElementById('hint-btn').addEventListener('click', showHint);

window.addEventListener('load', initGame);
