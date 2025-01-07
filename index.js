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

const gameBoardModule = (function () {
    const cellsArr = [];

    function createGameboardCells () {
        const CELL_COUNT = 9;
        const gameContainer = document.querySelector('.game-container');

        for (let i = 0; i < CELL_COUNT; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');

            cellsArr.push(cell);
            gameContainer.appendChild(cell);
        }
    }

    return {
        createGameboardCells,
    }
})();

window.onload = () => {
    gameBoardModule.createGameboardCells();
}