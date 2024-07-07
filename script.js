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
    const buildings = ['Residential', 'Factory', 'Commercial', 'Park', 'Road'];
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
        let imageSrc = `assets/${building}.jpg`;
        selectedCell.innerHTML = `<img src="${imageSrc}" alt="${building}">`;
        selectedCell.classList.remove('selected');
        selectedCell = null;
        turnNumber++;
        coinsLeft--;
        currentScore += 10; // Example scoring
        if (gameMode === 'freeplay') {
            if (building === 'Factory') {
                currentProfit += 5; // Example profit
                currentUpkeep += 3; // Example upkeep
            }
        }
        updateGameInfo();
        document.getElementById('building-choice-container').classList.add('hidden');
    }
}

// Placeholder functions for other menu options
function demolishBuilding() {
    alert('Demolish Building option selected');
}

function saveGame() {
    alert('Save Game option selected');
}

function loadSavedGame() {
    alert('Load Saved Game option selected');
}

function displayHighScores() {
    alert('Display High Scores option selected');
}

function exitToMainMenu() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

// Add a button to toggle dark mode
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'dark-mode-toggle';
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Handle feedback form popup
const feedbackButton = document.getElementById('feedback-button');
const feedbackPopup = document.getElementById('feedback-popup');
const feedbackClose = document.getElementById('feedback-close');

feedbackButton.addEventListener('click', () => {
    feedbackPopup.classList.toggle('hidden');
});

feedbackClose.addEventListener('click', () => {
    feedbackPopup.classList.add('hidden');
});

// Handle feedback form submission
document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedbackText = document.getElementById('feedback-text').value;

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        feedback: feedbackText
    })
    .then(response => {
        console.log('Feedback sent successfully:', response.status, response.text);
        alert('Thank you for your feedback!');
        document.getElementById('feedback-form').reset();
        feedbackPopup.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error sending feedback:', error);
        alert('There was an error submitting your feedback. Please try again later.');
    });
});