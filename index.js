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
           
            cell.classList.add('cell', 'hover-cell');
            cell.addEventListener('click', gameLogic.handleCellClick);
            cellsArr.push(cell);

            gameContainer.appendChild(cell);
        }
    };

    function updateGameBoard (index, symbol) {
        boardState[index] = symbol;
    };

    function highlightWinnerCells (cells) {
        cells.forEach(i => {
            cellsArr[i].classList.add('winning-cell')
        });

        disableCellHover(); // Disable hover effect after winning cell higlight
    };

    function disableCellHover () {
        cellsArr.forEach(cell => cell.classList.remove('hover-cell'))
    };

    function getCellsArr () {
        return cellsArr;
    };

    function getBoardState () {
        return boardState;
    };

    return {
        createGameboardCells,
        updateGameBoard,
        highlightWinnerCells,
        getCellsArr,
        getBoardState
    }
})();

// Game logic module
const gameLogic = (function () {
    // Player variables
    const playerX = playerModule.createPlayer('X');
    const playerO = playerModule.createPlayer('O');
    let currentPlayer = playerX;

    // Dom element to announce result
    const announceMsgEl = document.querySelector('#game-result-msg');        
    const restartMsgEl = document.querySelector('#game-restart-msg');

    // Cells and board state arrays
    const cellsArr = gameBoardModule.getCellsArr();
    const boardState = gameBoardModule.getBoardState();

    function handleCellClick (event) {
        const targetCell = event.target;

        if (targetCell.textContent === '') {
            let targetIndex = cellsArr.indexOf(targetCell);

            targetCell.textContent = currentPlayer.symbol;

            gameBoardModule.updateGameBoard(targetIndex, currentPlayer.symbol);
            
            if (checkWinner()) {
                gameBoardModule.highlightWinnerCells(checkWinner());

                announceWinner(currentPlayer.symbol);
                stopGame();

                restartGame.clearCellInput(cellsArr);
                restartGame.clearCellsArr(cellsArr);
                restartGame.clearBoardState(boardState);

            } else if (checkDraw()) {
                announceDraw();
                stopGame();
            }
            else switchPlayer();
        };

    };

    function switchPlayer () {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    function checkDraw () { 
        let isBoardFull = boardState.every(cell => cell !== '');
    
        if (isBoardFull && !checkWinner()) return true;

        return false;
    };

    function checkWinner () {
        const winCombinations = [
            [0, 1, 2], // Rows 
            [3, 4, 5], 
            [6, 7, 8], 
            [0, 3, 6], // Columns
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], // Diagonals
            [2, 4, 6]  
        ];


        for (let combination of winCombinations) {
            const [a, b, c] = combination;

            if (boardState[a] 
                && boardState[a] === boardState[b] 
                && boardState[a] === boardState[c]) {
                
                return combination; // Get winning combination indices
            }
        }  

        return null; // In case of no winner
    };

    function announceWinner (user) {
        announceMsgEl.textContent = `${user} wins!`;
    };

    function announceDraw () {
        announceMsgEl.textContent = 'Draw!';
    }

    function clearAnnounceMsg () {
        announceMsgEl.textContent = '';
    };

    function stopGame () {
        cellsArr.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        })
    };


    return {
        handleCellClick
    };
})();

// Restart module
const restartGame = (function () {

    function clearCellsArr (cellsArr) {
       cellsArr.length = 0;
    };

    function clearBoardState (boardState) {
        boardState.fill('');
    };

    function clearCellInput (cellsArr) {
        cellsArr.forEach(cell => cell.textContent = '');
    };


    return {
        clearCellsArr,
        clearBoardState,
        clearCellInput,

    }
})();

// Testing
window.onload = () => {
    gameBoardModule.createGameboardCells();
};