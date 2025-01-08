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
    const boardState = 
    [  
        null, null, null,
        null, null, null,
        null, null, null
    ];
    const cellsArr = [];

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

    function getCellsArr () {
        return cellsArr;
    };
 
    function getBoardState () {
        return boardState;
    }

    return {
        createGameboardCells,
        getCellsArr,
        getBoardState
    }
})();

// Game logic module
const gameLogic = (function () {
    const playerX = playerModule.createPlayer('X');
    const playerO = playerModule.createPlayer('O');

    let currentPlayer = playerX;

    const cellsArr = gameBoardModule.getCellsArr(); // Copy
    const boardState = gameBoardModule.getBoardState() // Copy

    function handleCellClick (event) {
        const targetCell = event.target;

        if (targetCell.textContent === '') {
            let targetIndex = cellsArr.indexOf(targetCell);

            targetCell.textContent = currentPlayer.symbol;
            boardState[targetIndex] = currentPlayer.symbol;

            console.log(boardState);
            switchPlayer();
        };

    };

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