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

    function getCellsArr () {
        return cellsArr;
    };

    function getBoardState () {
        return boardState;
    };

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

    function resetBoardState () {
        boardState.fill('');  
      };

    return {
        getCellsArr,
        getBoardState,
        createGameboardCells,
        updateGameBoard,
        resetBoardState,
    }
})();

// Game logic module
const gameLogic = (function () {
    // Player variables
    const playerX = playerModule.createPlayer('X');
    const playerO = playerModule.createPlayer('O');
    let currentPlayer = playerX;   

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
                uiModule.highlightWinnerCells(checkWinner());

                uiModule.announceWinner(currentPlayer.symbol);
                stopGame();

                uiModule.announceRestartMsg();
                uiModule.throwConfetti();

                // Enable restart after 1 second
                setTimeout(restartGame.addRestartEvent, 1000);

            } else if (checkDraw()) {
                uiModule.announceDraw();
                stopGame();

                uiModule.announceRestartMsg();
                
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

    function stopGame () {
        for (let i = 0; i < cellsArr.length; i++) {
            cellsArr[i].removeEventListener('click', handleCellClick);
        }
    };

    return {
        handleCellClick,
        resetCurrentPlayer
    };
})();

// Restart module
const restartGame = (function () { 
    const cellsArr = gameBoardModule.getCellsArr();

    function addCellEvents () {
        cellsArr.forEach(cell => {
            cell.addEventListener('click', gameLogic.handleCellClick);
        })
    };

    function restart () {
        gameBoardModule.resetBoardState();
        uiModule.clearBoardUI();
        uiModule.clearCellInput();
        
        gameLogic.resetCurrentPlayer();
        addCellEvents();

        uiModule.clearAnnounceMsgs();
    };

    function addRestartEvent () {
        document.addEventListener('click', restart, {once : true});
    };

    return {
        addRestartEvent
    };
})();

const uiModule = (function () {
    const cellsArr = gameBoardModule.getCellsArr();

    const CLASS_CELL_HOVER = 'hover-cell';
    const CLASS_CELL_WINNER = 'winning-cell'
    const CLASS_DEFAULT_CELL = 'cell';

    const announceMsgEl = document.querySelector('#game-result-msg'); 
    const restartMsgEl = document.querySelector('#game-restart-msg');
    const restartMsg = 'Click anywhere to restart.';

    // Confetti effect on game win
    const jsConfetti = new JSConfetti();

    // Manage cell UI states
    function enableCellHover () {
        cellsArr.forEach(cell => cell.classList.add(CLASS_CELL_HOVER));
    };

    function disableCellHover () {
        cellsArr.forEach(cell => cell.classList.remove(CLASS_CELL_HOVER))
    };

    function highlightWinnerCells (cells) {
        cells.forEach(i => {
            cellsArr[i].classList.add(CLASS_CELL_WINNER)
        });

        disableCellHover(); // Disable hover effect after winning cell higlight
    };

    // Reset cells to default 
    function clearCellInput () {
        for (let i = 0; i < cellsArr.length; i++) {
            cellsArr[i].textContent = '';
        }
    };

    function clearBoardUI () {
        cellsArr.forEach(cell => {
            cell.classList.add(CLASS_DEFAULT_CELL, CLASS_CELL_HOVER);
            cell.classList.remove(CLASS_CELL_WINNER);
        })
    };

    // UI Message Announcements
    function announceWinner (user) {
        const WINNER_MSG = `${user} wins!`;
        announceMsgEl.textContent = WINNER_MSG;
    };

    function announceDraw () {
        const DRAW_MSG = 'Draw!';
        announceMsgEl.textContent = DRAW_MSG;
    };

    function announceRestartMsg () {
        restartMsgEl.textContent = restartMsg;
    };

    function clearAnnounceMsgs () {
        announceMsgEl.textContent = restartMsgEl.textContent = '';
    };

    // Extra effects
    function throwConfetti () {
        jsConfetti.addConfetti();
    };

    return {
        enableCellHover,
        highlightWinnerCells,
        announceWinner,
        announceDraw,
        announceRestartMsg,
        clearAnnounceMsgs,
        clearCellInput,
        clearBoardUI,
        throwConfetti
    }

})();
 
// Generate cells when page is loaded
window.onload = () => {
    gameBoardModule.createGameboardCells();
};

