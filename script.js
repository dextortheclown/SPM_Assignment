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
            cell.dataset.building = ''; // Track the building type in the cell
            cell.addEventListener('click', () => selectCell(i, j));
            gameBoard.appendChild(cell);
        }
    }
}

// Start a new Arcade game
function startNewArcadeGame() {
    document.getElementById('high-scores-container').style.display = 'none';

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
    console.log("Arcade game started"); // Log that the game has started
}


// Start a new Free Play game
function startNewFreePlayGame() {
    document.getElementById('high-scores-container').style.display = 'none';

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

// Handle cell selection for building or removing
function selectCell(row, col) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    selectedCell.classList.add('selected');
}

// Build a building
function buildBuilding() {
    if (!selectedCell) {
        alert('Please select a cell first.');
        return;
    }
    if (coinsLeft <= 0) {
        alert('No more coins left!');
        endGame(); // Trigger end game if no coins are left
        return;
    }
    const buildings = ['Residential', 'Industry', 'Commercial', 'Park', 'Road'];
    building1 = buildings[Math.floor(Math.random() * buildings.length)];
    building2 = buildings[Math.floor(Math.random() * buildings.length)];

    document.getElementById('building-choice-1').textContent = building1;
    document.getElementById('building-choice-2').textContent = building2;

    document.getElementById('building-choice-container').classList.remove('hidden');
}

document.getElementById('building-choice-1').addEventListener('click', () => selectBuilding(1));
document.getElementById('building-choice-2').addEventListener('click', () => selectBuilding(2));

function selectBuilding(choice) {
    const building = choice === 1 ? building1 : building2;
    if (selectedCell) {
        let imageSrc = `assets/${building}.jpg`;
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        selectedCell.innerHTML = `<img src="${imageSrc}" alt="${building}">`;
        selectedCell.dataset.building = building; // Track the building type in the cell
        selectedCell.classList.remove('selected');
        selectedCell = null;
        turnNumber++;
        coinsLeft--;
        currentScore += calculateScore(row, col, building);
        if (gameMode === 'freeplay') {
            updateProfitAndUpkeep(building);
            if (isOnBorder(row, col)) {
                expandBoard();
            }
        }
        updateGameInfo();
        document.getElementById('building-choice-container').classList.add('hidden'); // Hide the popup

        // Check coins after building placement
        if (coinsLeft <= 0) {
            alert('No more coins left! Ending game.');
            endGame(); // Trigger end game if no coins are left after building
        }
    }
}

function isOnBorder(row, col) {
    return row == 0 || row == boardSize - 1 || col == 0 || col == boardSize - 1;
}

function expandBoard() {
    boardSize += 5;
    initGameBoard(boardSize);
}

function calculateScore(row, col, building) {
    let score = 0;

    // Define the scoring rules for each building type
    if (building === 'Residential') {
        score = calculateAdjacentScore(row, col, ['Residential', 'Commercial'], 1) + calculateAdjacentScore(row, col, ['Park'], 2);
        if (hasAdjacentBuilding(row, col, 'Industry')) {
            score = 1;
        }
    } else if (building === 'Industry') {
        score = 1;
    } else if (building === 'Commercial') {
        score = calculateAdjacentScore(row, col, ['Commercial'], 1);
    } else if (building === 'Park') {
        score = calculateAdjacentScore(row, col, ['Park'], 1);
    } else if (building === 'Road') {
        score = calculateConnectedRoadScore(row, col);
    }

    return score;
}

function calculateAdjacentScore(row, col, buildingTypes, points) {
    let score = 0;
    const adjacentCells = getAdjacentCells(row, col);
    adjacentCells.forEach(cell => {
        if (buildingTypes.includes(cell.dataset.building)) {
            score += points;
        }
    });
    return score;
}

function getAdjacentCells(row, col) {
    const adjacentCells = [];
    const directions = [
        { r: -1, c: 0 }, // Up
        { r: 1, c: 0 },  // Down
        { r: 0, c: -1 }, // Left
        { r: 0, c: 1 }   // Right
    ];

    directions.forEach(direction => {
        const r = row + direction.r;
        const c = col + direction.c;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                adjacentCells.push(cell);
            }
        }
    });

    return adjacentCells;
}

function hasAdjacentBuilding(row, col, buildingType) {
    const adjacentCells = getAdjacentCells(row, col);
    return adjacentCells.some(cell => cell.dataset.building === buildingType);
}

function calculateConnectedRoadScore(row, col) {
    let score = 0;
    const rowCells = Array.from(document.querySelectorAll(`.cell[data-row="${row}"]`));
    const connectedRoads = rowCells.filter(cell => cell.dataset.building === 'Road');
    score = connectedRoads.length;
    return score;
}

function updateProfitAndUpkeep(building) {
    if (building === 'Residential') {
        currentProfit += 1;
        // Check for adjacent Residential buildings to calculate upkeep
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        if (hasAdjacentBuilding(row, col, 'Residential')) {
            currentUpkeep += 1;
        }
    } else if (building === 'Industry') {
        currentProfit += 2;
        currentUpkeep += 1;
    } else if (building === 'Commercial') {
        currentProfit += 3;
        currentUpkeep += 2;
    } else if (building === 'Park') {
        currentUpkeep += 1;
    } else if (building === 'Road') {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        if (!hasAdjacentBuilding(row, col, 'Road')) {
            currentUpkeep += 1;
        }
    }
}

// Demolish a building
function demolishBuilding() {
    if (!selectedCell) {
        alert('Please select a cell first.');
        return;
    }
    if (selectedCell.innerHTML !== '') {
        const building = selectedCell.dataset.building;
        selectedCell.innerHTML = '';
        selectedCell.dataset.building = '';
        selectedCell.classList.remove('selected');
        selectedCell = null;
        turnNumber++;
        coinsLeft++;
        currentScore -= 5; // Example penalty for demolishing a building
        if (gameMode === 'freeplay') {
            if (building === 'Residential') {
                currentProfit -= 1;
                currentUpkeep -= 1;
            } else if (building === 'Industry') {
                currentProfit -= 2;
                currentUpkeep -= 1;
            } else if (building === 'Commercial') {
                currentProfit -= 3;
                currentUpkeep -= 2;
            } else if (building === 'Park') {
                currentUpkeep -= 1;
            } else if (building === 'Road') {
                currentUpkeep -= 1;
            }
        }
        updateGameInfo();
    } else {
        alert('No building to demolish!');
    }
}

// Save the game state to localStorage
function saveGame() {
    const gameState = {
        turnNumber: turnNumber,
        coinsLeft: coinsLeft,
        currentScore: currentScore,
        currentProfit: currentProfit,
        currentUpkeep: currentUpkeep,
        boardSize: boardSize,
        gameMode: gameMode,
        boardState: getBoardState()
    };
    console.log("Saving game state:", gameState);
    localStorage.setItem('cityBuildingGameState', JSON.stringify(gameState));
    const savedState = localStorage.getItem('cityBuildingGameState');
    console.log("Saved state in localStorage:", savedState);
    alert('Game saved successfully');
}

// Load the game state from localStorage
function loadSavedGame() {
    document.getElementById('high-scores-container').style.display = 'none'; // Hide high scores
    const savedState = localStorage.getItem('cityBuildingGameState');
    console.log("Loaded state from localStorage:", savedState);
    if (savedState) {
        const gameState = JSON.parse(savedState);
        console.log("Parsed game state:", gameState);
        turnNumber = gameState.turnNumber;
        coinsLeft = gameState.coinsLeft;
        currentScore = gameState.currentScore;
        currentProfit = gameState.currentProfit;
        currentUpkeep = gameState.currentUpkeep;
        boardSize = gameState.boardSize;
        gameMode = gameState.gameMode;
        restoreBoardState(gameState.boardState);
        updateGameInfo();
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('main-menu').style.display = 'none';
        alert('Game loaded successfully');
    } else {
        alert('No saved game available. Start a new game or check your local storage settings.');
    }
}


// Get the current state of the game board
function getBoardState() {
    const boardState = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const building = cell.dataset.building;
        boardState.push({
            row: parseInt(cell.dataset.row),
            col: parseInt(cell.dataset.col),
            building: building
        });
    });
    return boardState;
}

// Restore the game board from saved state
function restoreBoardState(boardState) {
    console.log("Restoring board state:", boardState);
    initGameBoard(boardSize);
    boardState.forEach(state => {
        const cell = document.querySelector(`.cell[data-row="${state.row}"][data-col="${state.col}"]`);
        if (cell && state.building) {
            cell.dataset.building = state.building;
            cell.innerHTML = `<img src="assets/${state.building}.jpg" alt="${state.building}">`;
        }
    });
}

function displayHighScores() {
    alert('Display High Scores option selected');
}

function exitToMainMenu() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function displayHighScores() {
    const APIKEY = '66a4b1c52212c708cd8e9199';
    const apiUrl = 'https://spmasg-82df.restdb.io/rest/scores';

    console.log("Fetching high scores from:", apiUrl);

    fetch(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': APIKEY
        }
    })
    .then(response => {
        console.log("API Response:", response);
        return response.json();
    })
    .then(data => {
        console.log("High Scores Data:", data);
        updateHighScoresTable(data);
    })
    .catch(error => {
        console.error('Error fetching high scores:', error);
        alert("Failed to fetch high scores.");
    });

    // Make the high scores container visible
    document.getElementById('high-scores-container').style.display = 'block';
}

function updateHighScoresTable(scores) {
    const tableBody = document.getElementById('high-scores-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    console.log("Updating table with scores:", scores);

    scores.forEach(score => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = score.name || "No name";  // Handle possible undefined names
        cell2.textContent = score.score;
        cell3.textContent = score.createdAt ? new Date(score.createdAt).toLocaleDateString("en-US") : "No date";  // Handle possible undefined dates
    });
}


// Add a button to toggle dark mode
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'dark-mode-toggle';
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Function to end the game and handle score saving
function endGame() {
    // Prompt for player's name at the end of the game
    const playerName = prompt("Game Over! Enter your name to save your score:");
    if (playerName) {
        sendPointsToAPI(currentScore, playerName);
    } else {
        alert("Score not saved. No name provided.");
    }
}

// Function to send score and player name to the API
function sendPointsToAPI(score, playerName) {
    // Get current date and time in ISO format
    const now = new Date().toISOString();

    // Prepare the data object with score, player name, and the current timestamp
    const data = {
        name: playerName,
        score: score,
        createdAt: now
    };

    const APIKEY = '66a4b1c52212c708cd8e9199';
    const apiUrl = 'https://spmasg-82df.restdb.io/rest/scores';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': APIKEY,
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score saved:', data);
        alert("Thank you, " + playerName + "! Your score has been saved.");
        fetchHighestScoreAndUpdateDisplay(); // Optional: Fetch and display the highest score
    })
    .catch(error => {
        console.error('Error saving score:', error);
        alert("Failed to save score. Please try again later.");
    });
}
