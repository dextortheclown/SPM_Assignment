let turnNumber = 1;
let coinsLeft = 16;
let currentScore = 0;
let currentProfit = 0;
let currentUpkeep = 0;
const arcadeBoardSize = 20;
const freePlayInitialBoardSize = 5;
let boardSize = arcadeBoardSize;
let gameMode = 'arcade';
let selectedCell = null;
let building1 = '';
let building2 = '';
const gameBoard = document.getElementById('game-board');

// Initialize the game board
function initGameBoard(size) {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gameBoard.style.gridTemplateRows = `repeat(${size}, 30px)`;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => selectCell(i, j));
            gameBoard.appendChild(cell);
        }
    }
}

// Start a new Arcade game
function startNewArcadeGame() {
    gameMode = 'arcade';
    document.getElementById('game-mode').textContent = 'Arcade Mode';
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    turnNumber = 1;
    coinsLeft = 16;
    currentScore = 0;
    boardSize = arcadeBoardSize;
    updateGameInfo();
    initGameBoard(boardSize);
}

// Start a new Free Play game
function startNewFreePlayGame() {
    gameMode = 'freeplay';
    document.getElementById('game-mode').textContent = 'Free Play Mode';
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('profit-display').style.display = 'block';
    document.getElementById('upkeep-display').style.display = 'block';
    turnNumber = 1;
    coinsLeft = 100; // Start with more coins in Free Play mode
    currentScore = 0;
    currentProfit = 0;
    currentUpkeep = 0;
    boardSize = freePlayInitialBoardSize;
    updateGameInfo();
    initGameBoard(boardSize);
}

// Update game information display
function updateGameInfo() {
    document.getElementById('turn-number').textContent = turnNumber;
    document.getElementById('coins-left').textContent = coinsLeft;
    document.getElementById('current-score').textContent = currentScore;
    if (gameMode === 'freeplay') {
        document.getElementById('current-profit').textContent = currentProfit;
        document.getElementById('current-upkeep').textContent = currentUpkeep;
    }
}

// Handle cell selection for building
function selectCell(row, col) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    selectedCell.classList.add('selected');
    buildBuilding();
}

// Randomly select two buildings and allow player to build one
function buildBuilding() {
    if (coinsLeft <= 0) {
        alert('No more coins left!');
        return;
    }
    const buildings = ['R', 'I', 'C', 'O', 'road'];
    building1 = buildings[Math.floor(Math.random() * buildings.length)];
    building2 = buildings[Math.floor(Math.random() * buildings.length)];

    document.getElementById('building-choice-1').textContent = building1;
    document.getElementById('building-choice-2').textContent = building2;

    document.getElementById('building-choice-container').classList.remove('hidden');
}

document.getElementById('building-choice-1').addEventListener('click', () => selectBuilding(1));
document.getElementById('building-choice-2').addEventListener('click', () => selectBuilding(2));

function selectBuilding(choice) {
    const building = choice == 1 ? building1 : building2;
    if (selectedCell) {
        selectedCell.classList.add(building);
        selectedCell.textContent = building;
        coinsLeft--;
        turnNumber++;
        if (gameMode === 'freeplay') {
            updateFreePlayGameState(building);
        }
        updateGameInfo();
        checkBoardExpansion(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col));
        document.getElementById('building-choice-container').classList.add('hidden');
    } else {
        alert('No cell selected!');
    }
}

function updateFreePlayGameState(building) {
    switch (building) {
        case 'R':
            currentProfit += 1;
            break;
        case 'I':
            currentProfit += 2;
            currentUpkeep += 1;
            break;
        case 'C':
            currentProfit += 3;
            currentUpkeep += 2;
            break;
        case 'O':
            currentUpkeep += 1;
            break;
        case 'road':
            // No profit or upkeep change for roads in this simple version
            break;
    }
}

function checkBoardExpansion(row, col) {
    if (row == 0 || col == 0 || row == boardSize - 1 || col == boardSize - 1) {
        boardSize += 5;
        initGameBoard(boardSize);
    }
}

function demolishBuilding() {
    if (selectedCell && selectedCell.textContent) {
        const building = selectedCell.textContent;
        selectedCell.className = 'cell';
        selectedCell.textContent = '';
        coinsLeft--;
        turnNumber++;
        if (gameMode === 'freeplay') {
            updateFreePlayGameStateAfterDemolition(building);
        }
        updateGameInfo();
    } else {
        alert('No building to demolish or no cell selected!');
    }
}

function updateFreePlayGameStateAfterDemolition(building) {
    switch (building) {
        case 'R':
            currentProfit -= 1;
            break;
        case 'I':
            currentProfit -= 2;
            currentUpkeep -= 1;
            break;
        case 'C':
            currentProfit -= 3;
            currentUpkeep -= 2;
            break;
        case 'O':
            currentUpkeep -= 1;
            break;
        case 'road':
            // No profit or upkeep change for roads in this simple version
            break;
    }
}

function saveGame() {
    const gameState = {
        gameMode,
        turnNumber,
        coinsLeft,
        currentScore,
        currentProfit,
        currentUpkeep,
        boardSize,
        cells: Array.from(gameBoard.children).map(cell => ({
            row: cell.dataset.row,
            col: cell.dataset.col,
            class: cell.className,
            text: cell.textContent
        }))
    };
    localStorage.setItem('cityBuildingGameState', JSON.stringify(gameState));
    alert('Game saved!');
}

function loadSavedGame() {
    const savedState = localStorage.getItem('cityBuildingGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        gameMode = gameState.gameMode;
        turnNumber = gameState.turnNumber;
        coinsLeft = gameState.coinsLeft;
        currentScore = gameState.currentScore;
        currentProfit = gameState.currentProfit;
        currentUpkeep = gameState.currentUpkeep;
        boardSize = gameState.boardSize;
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        if (gameMode === 'freeplay') {
            document.getElementById('profit-display').style.display = 'block';
            document.getElementById('upkeep-display').style.display = 'block';
        }
        updateGameInfo();
        initGameBoard(boardSize);
        gameState.cells.forEach(cell => {
            const boardCell = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
            boardCell.className = cell.class;
            boardCell.textContent = cell.text;
        });
    } else {
        alert('No saved game found.');
    }
}

function displayHighScores() {
    alert('High scores not implemented yet.');
}

function exitToMainMenu() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('profit-display').style.display = 'none';
    document.getElementById('upkeep-display').style.display = 'none';
}

document.querySelector('.menu-button:nth-child(3)').addEventListener('click', loadSavedGame);
document.querySelector('.menu-button:nth-child(4)').addEventListener('click', displayHighScores);
