// Player creation module
const playerModule = (function () {
    function createPlayer (symbol) {
        let playerName = 'Player' + symbol;

        return {
            playerName, symbol
        };
    }

    return {
        createPlayer
    };
})();

// Gameboard management module
const gameBoardModule = (function () {
    const cellsArr = [];
    const boardState = ['', '', '','', '', '', '', '', ''];

    function createGameboardCells () {
        const CELL_COUNT = 9;
        const gameContainer = document.querySelector('.game-container');

        for (let i = 0; i < CELL_COUNT; i++) {
            let cell = document.createElement('div');
           
            cell.classList.add('cell');
            cell.addEventListener('click', gameLogic.handleCellClick);
            cellsArr.push(cell);

            gameContainer.appendChild(cell);
        }
    };

    function updateGameBoard (index, symbol) {
        boardState[index] = symbol;
    };

    function getCellsArr () {
        return cellsArr;
    };

    return {
        createGameboardCells,
        updateGameBoard,
        getCellsArr,
    }
})();

// Game logic module
const gameLogic = (function () {
    // Player variables
    const playerX = playerModule.createPlayer('X');
    const playerO = playerModule.createPlayer('O');
    let currentPlayer = playerX;

    // cellsArr accesed to get index of target cell
    const cellsArr = gameBoardModule.getCellsArr();

    function handleCellClick (event) {
        const targetCell = event.target;

        if (targetCell.textContent === '') {
            let targetIndex = cellsArr.indexOf(targetCell);

            targetCell.textContent = currentPlayer.symbol;

            gameBoardModule.updateGameBoard(targetIndex, currentPlayer.symbol);

            switchPlayer();
        };

    };

    function checkWinner () {
        const winningCombinations = [
            [0, 1, 2], // Rows 
            [3, 4, 5], 
            [6, 7, 8], 
            [0, 3, 6], // Columns
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], // Diagonals
            [2, 4, 6]  
        ];
        
    }

    function switchPlayer () {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    return {
        handleCellClick,
    }
})();

// Testing
window.onload = () => {
    gameBoardModule.createGameboardCells();
}