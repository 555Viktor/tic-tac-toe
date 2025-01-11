// Player creation module
const playerModule = (function () {
    function createPlayer (symbol) {
        let playerName = 'Player' + symbol;

        return {
            playerName, symbol
        };
    };

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
           
            cell.classList.add('cell'); // Cell style;
            cell.addEventListener('click', gameLogic.handleCellClick);
            cellsArr.push(cell);

            gameContainer.appendChild(cell);
        }

        uiModule.enableCellHover();
    };

    function updateGameBoard (index, symbol) {
        boardState[index] = symbol;
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
        getCellsArr,
        getBoardState,
    }
})();

// Game logic module
const gameLogic = (function () {
    // Player variables
    const playerX = playerModule.createPlayer('X');
    const playerO = playerModule.createPlayer('O');
    let currentPlayer = playerX;

    // Dom el to announce result
    const announceMsgEl = document.querySelector('#game-result-msg');        

    // Cells and board state arrays
    const cellsArr = gameBoardModule.getCellsArr();
    const boardState = gameBoardModule.getBoardState();

    function getUpdatedCellsArr () {
        return cellsArr;
    };

    function getUpdatedBoardState () {
        return boardState;
    };

    function handleCellClick (event) {
        const targetCell = event.target;

        if (targetCell.textContent === '') {
            let targetIndex = cellsArr.indexOf(targetCell);

            targetCell.textContent = currentPlayer.symbol;

            gameBoardModule.updateGameBoard(targetIndex, currentPlayer.symbol);
            
            if (checkWinner()) {
                uiModule.highlightWinnerCells(checkWinner());

                announceWinner(currentPlayer.symbol);
                stopGame();

                restartGame.announceRestartMsg();

                // Enable restart after 1 second
                setTimeout(restartGame.addRestartEvent, 1000);

            } else if (checkDraw()) {
                announceDraw();
                stopGame();

                restartGame.announceRestartMsg();
                
                // Enable restart after 1 second
                setTimeout(restartGame.addRestartEvent, 1000);
            }
            else switchPlayer();
        };

    };

    function resetCurrentPlayer () {
        currentPlayer = playerX;
    }

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
    };

    function stopGame () {
        for (let i = 0; i < cellsArr.length; i++) {
            cellsArr[i].removeEventListener('click', handleCellClick);
        }
    };

    return {
        getUpdatedCellsArr,
        getUpdatedBoardState,
        handleCellClick,
        resetCurrentPlayer
    };
})();

// Restart module
const restartGame = (function () { 
    const updatedCellsArr = gameLogic.getUpdatedCellsArr();
    const updatedBoardState = gameLogic.getUpdatedBoardState();
 
    const announceMsgEl = document.querySelector('#game-result-msg'); 
    const restartMsgEl = document.querySelector('#game-restart-msg');
    const restartMsg = 'Click anywhere to restart.';

    function announceRestartMsg () {
        restartMsgEl.textContent = restartMsg;
    };

    function clearAnnounceMsgs () {
        announceMsgEl.textContent = restartMsgEl.textContent = '';
    };

    function clearCellInput () {
        for (let i = 0; i < updatedCellsArr.length; i++) {
            updatedCellsArr[i].textContent = '';
        }
    };

    function resetBoardState () {
      updatedBoardState.fill('');  
    };

    function resetBoardUI () {
        updatedCellsArr.forEach(cell => {
            cell.classList.add('cell', 'hover-cell');
            cell.classList.remove('winning-cell');
        })
    };

    function addCellEvents () {
        updatedCellsArr.forEach(cell => {
            cell.addEventListener('click', gameLogic.handleCellClick);
        })
    };

    function restart () {
        resetBoardState();
        resetBoardUI();

        clearCellInput();
        
        gameLogic.resetCurrentPlayer();
        addCellEvents();
        clearAnnounceMsgs();
    };

    function addRestartEvent () {
        document.addEventListener('click', restart, {once : true});
    };

    return {
        announceRestartMsg,
        addRestartEvent
    };
})();

const uiModule = (function () {
    const cellsArr = gameBoardModule.getCellsArr();

    // Manage cell UI states
    function enableCellHover () {
        cellsArr.forEach(cell => cell.classList.add('hover-cell'));
    };

    function disableCellHover () {
        cellsArr.forEach(cell => cell.classList.remove('hover-cell'))
    };

    function highlightWinnerCells (cells) {
        cells.forEach(i => {
            cellsArr[i].classList.add('winning-cell')
        });

        disableCellHover(); // Disable hover effect after winning cell higlight
    };

    return {
        enableCellHover,
        highlightWinnerCells
    }

})();
 
// Generate cells when page is loaded
window.onload = () => {
    gameBoardModule.createGameboardCells();
};

