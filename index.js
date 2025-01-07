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

    function createGameboardCells () {
        const CELL_COUNT = 9;
        const gameContainer = document.querySelector('.game-container');

        for (let i = 0; i < CELL_COUNT; i++) {
            let cell = document.createElement('div');
           
            cell.classList.add('cell');
            cell.addEventListener('click', handleCellClick);
            cellsArr.push(cell);
            
            gameContainer.appendChild(cell);
        }
    };

    function handleCellClick (event) {
        const targetCell = event.target;

        if (targetCell.textContent === '') {
            targetCell.textContent = currentPlayer.symbol;
        }
    }


    return {
        createGameboardCells,
        handleCellClick,

    }
})();

// Testing
window.onload = () => {
    gameBoardModule.createGameboardCells();
}
