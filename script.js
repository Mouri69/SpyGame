let timerInterval;
let timeLeft;
let isPaused = false;
let showPlace = false;
let lastPlayer = false;
let lastPlayerHidden = false;

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('get-place-btn').addEventListener('click', togglePlaceVisibility);
document.getElementById('stop-timer').addEventListener('click', stopTimer);
document.getElementById('pause-timer').addEventListener('click', togglePause);
document.getElementById('game-mode').addEventListener('change', updateGameMode);

let numPlayers, numSpies, gameMode, duration, cards;
let currentPlayer = 0;
let customOptions = [];

function updateGameMode() {
    const gameMode = document.getElementById('game-mode').value;
    const customOptionsDiv = document.getElementById('custom-options');
    if (gameMode === 'custom') {
        customOptionsDiv.style.display = 'block';
        console.log('Custom mode selected');
    } else {
        customOptionsDiv.style.display = 'none';
        console.log(`${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} mode selected`);
    }
}

function startGame() {
    numPlayers = parseInt(document.getElementById('num-players').value);
    numSpies = parseInt(document.getElementById('num-spies').value);
    gameMode = document.getElementById('game-mode').value;
    duration = parseInt(document.getElementById('duration').value) * 60; // Convert to seconds

    console.log(`Game started with ${numPlayers} players, ${numSpies} spies, in ${gameMode} mode, for ${duration / 60} minutes.`);

    if (numPlayers < 2 || numSpies < 1 || numSpies >= numPlayers) {
        alert('Invalid number of players or spies');
        console.log('Invalid game setup: Not enough players or too many spies.');
        return;
    }

    if (gameMode === 'custom') {
        customOptions = document.getElementById('custom-input').value
            .split(',')
            .map(option => option.trim())
            .filter(option => option.length > 0);

        if (customOptions.length === 0) {
            alert('Please enter custom places/foods');
            console.log('Custom mode selected but no custom options provided.');
            return;
        }
    }

    document.getElementById('setup').style.display = 'none';
    document.getElementById('game-play').style.display = 'block';

    initializeGame(numPlayers, numSpies, gameMode, duration);
}

function initializeGame(numPlayers, numSpies, gameMode, duration) {
    const timerElement = document.getElementById('timer');
    timeLeft = duration;

    generatePlayerCards(numPlayers, numSpies, gameMode);

    clearInterval(timerInterval);
    timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:00`;
    isPaused = false;
    document.getElementById('stop-timer').disabled = false;
    document.getElementById('pause-timer').disabled = false;

    showPlace = false;
    lastPlayer = false;
    lastPlayerHidden = false;

    currentPlayer = 0; // Reset current player to the first player
    document.getElementById('get-place-btn').disabled = false;

    console.log('Game initialized');
}

function generatePlayerCards(numPlayers, numSpies, gameMode) {
    const defaultPlaces = {
        'Hospital': 'fa-solid fa-hospital',
        'School': 'fa-solid fa-school',
        // Add other places here
    };
    
    const defaultFoods = {
        'Pizza': 'fa-solid fa-pizza-slice',
        'Burger': 'fa-solid fa-hamburger',
        // Add other foods here
    };

    let places;
    if (gameMode === 'custom') {
        places = customOptions;
    } else if (gameMode === 'foods') {
        places = Object.keys(defaultFoods);
    } else {
        places = Object.keys(defaultPlaces);
    }

    const place = places[Math.floor(Math.random() * places.length)];

    cards = [];
    for (let i = 0; i < numPlayers; i++) {
        cards.push(i < numSpies ? 'Spy' : place);
    }

    // Shuffle the cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    console.log(`Player cards generated. Cards: ${cards.join(', ')}`);
}

function togglePlaceVisibility() {
    const card = cards[currentPlayer];
    const cardElement = document.getElementById('place-card');

    if (!showPlace) {
        if (card === 'Spy') {
            cardElement.innerHTML = `<div class="card-title"><i class="fa-solid fa-user-secret"></i> Spy</div>`;
            console.log(`Player ${currentPlayer + 1} is a Spy.`);
        } else {
            const iconClass = gameMode === 'custom' ? '' : (gameMode === 'foods' ? {
                'Pizza': 'fa-solid fa-pizza-slice',
                'Burger': 'fa-solid fa-hamburger',
                // Add other foods here
            } : {
                'Hospital': 'fa-solid fa-hospital',
                'School': 'fa-solid fa-school',
                // Add other places here
            })[card];
            cardElement.innerHTML = `<div class="card-title"><i class="${iconClass}"></i> ${card}</div>`;
            console.log(`Player ${currentPlayer + 1} sees their card: ${card}`);
        }
        cardElement.style.display = 'inline-block';
    } else {
        cardElement.style.display = 'none';
        console.log(`Player ${currentPlayer + 1} hides their card.`);
    }

    showPlace = !showPlace;

    if (showPlace) {
        currentPlayer++;
        if (currentPlayer >= numPlayers) {
            lastPlayer = true;
            document.getElementById('get-place-btn').disabled = false;
        } else {
            document.getElementById('get-place-btn').disabled = false;
        }
    } else if (lastPlayer && !lastPlayerHidden) {
        lastPlayerHidden = true;
        document.getElementById('get-place-btn').disabled = true;
        setTimeout(() => {
            document.getElementById('place-card').style.display = 'none';
            startTimer();
        }, 100);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                alert('Game over!');
                stopTimer();
                console.log('Game over! Timer has finished.');
            }
        }
    }, 1000);
    console.log('Timer started');
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'Time Left: 00:00';
    document.getElementById('stop-timer').disabled = true;
    document.getElementById('pause-timer').disabled = true;

    document.getElementById('setup').style.display = 'block';
    document.getElementById('game-play').style.display = 'none';

    console.log('Timer stopped');
}

function togglePause() {
    if (isPaused) {
        startTimer();
        document.getElementById('pause-timer').textContent = 'Pause Timer';
        console.log('Timer resumed');
    } else {
        clearInterval(timerInterval);
        document.getElementById('pause-timer').textContent = 'Resume Timer';
        console.log('Timer paused');
    }
    isPaused = !isPaused;
}

function resetGame() {
    currentPlayer = 0;
    lastPlayer = false;
    lastPlayerHidden = false;
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'Time Left: 00:00';
    document.getElementById('get-place-btn').disabled = false;
    document.getElementById('pause-timer').textContent = 'Pause Timer';
    isPaused = false;

    document.getElementById('setup').style.display = 'block';
    document.getElementById('game-play').style.display = 'none';

    console.log('Game reset');
}
