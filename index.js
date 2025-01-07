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