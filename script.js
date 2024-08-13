let timerInterval;
let timeLeft;
let isPaused = false;
let showPlace = false;
let lastPlayer = false;
let lastPlayerHidden = false; // New flag to track if the last player has hidden the place

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
    } else {
        customOptionsDiv.style.display = 'none';
    }
}

function startGame() {
    numPlayers = parseInt(document.getElementById('num-players').value);
    numSpies = parseInt(document.getElementById('num-spies').value);
    gameMode = document.getElementById('game-mode').value;
    duration = parseInt(document.getElementById('duration').value) * 60; // Convert to seconds

    console.log(`Starting game with ${numPlayers} players, ${numSpies} spies, game mode: ${gameMode}, duration: ${duration / 60} seconds`);

    // Validate inputs
    if (numPlayers < 2 || numSpies < 1 || numSpies >= numPlayers) {
        alert('Invalid number of players or spies');
        return;
    }

    if (gameMode === 'custom') {
        customOptions = document.getElementById('custom-input').value.split(',').map(option => option.trim()).filter(option => option.length > 0);
        if (customOptions.length === 0) {
            alert('Please enter custom places/foods');
            return;
        }
    }

    // Hide setup and show game play
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game-play').style.display = 'block';

    // Initialize game
    initializeGame(numPlayers, numSpies, gameMode, duration);
}

function initializeGame(numPlayers, numSpies, gameMode, duration) {
    const timerElement = document.getElementById('timer');
    timeLeft = duration;

    console.log(`Game initialized. Time left: ${Math.floor(timeLeft / 60)}:00`);

    // Generate and display player cards
    generatePlayerCards(numPlayers, numSpies, gameMode);

    // Reset timer
    clearInterval(timerInterval);
    timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:00`;
    isPaused = false;
    document.getElementById('stop-timer').disabled = false;
    document.getElementById('pause-timer').disabled = false;

    // Initialize visibility state
    showPlace = false;
    lastPlayer = false;
    lastPlayerHidden = false;

    // Enable the button for the first player
    document.getElementById('get-place-btn').disabled = false;
}

function generatePlayerCards(numPlayers, numSpies, gameMode) {
    const defaultPlaces = {
        'Hospital': 'fa-solid fa-hospital',
        'School': 'fa-solid fa-school',
        'Factory': 'fa-solid fa-industry',
        'Park': 'fa-solid fa-tree',
        'Library': 'fa-solid fa-book',
        'Museum': 'fa-solid fa-building-columns',
        'Cafe': 'fa-solid fa-cafe',
        'Gym': 'fa-solid fa-dumbbell',
        'Airport': 'fa-solid fa-plane',
        'Bank': 'fa-solid fa-university',
        'Beach': 'fa-solid fa-umbrella-beach',
        'Restaurant': 'fa-solid fa-utensils',
        'Theater': 'fa-solid fa-theater-masks',
        'Shopping Mall': 'fa-solid fa-shopping-cart',
        'Hotel': 'fa-solid fa-cart-flatbed-suitcase',
        'Office': 'fa-solid fa-briefcase',
        'Train Station': 'fa-solid fa-train',
        'Zoo': 'fa-solid fa-paw',
        'Amusement Park': 'fa-solid fa-cable-car',
        'Aquarium': 'fa-solid fa-fish',
        'Bar': 'fa-solid fa-beer-mug-empty'
    };
    
    const defaultFoods = {
        'Pizza': 'fa-solid fa-pizza-slice',
        'Burger': 'fa-solid fa-hamburger',
        'Sushi': 'fa-solid fa-shrimp',
        'Ice Cream': 'fa-solid fa-ice-cream',
        'Taco': 'fa-solid fa-hotdog',
        'Pasta': 'fa-solid fa-bowl-food',
        'Salad': 'fa-solid fa-leaf',
        'Cake': 'fa-solid fa-cake',
        'Steak': 'fa-solid fa-drumstick-bite',
        'Pancakes': 'fa-solid fa-cookie',
        'Fried Chicken': 'fa-solid fa-drumstick-bite',
        'Hotdog': 'fa-solid fa-hotdog',
        'Chocolate': 'fa-solid fa-jar',
        'Fruit Salad': 'fa-solid fa-plate-wheat',
        'Smoothie': 'fa-solid fa-blender',
        'Donut': 'fa-solid fa-stroopwafel',
        'French Fries': 'fa-solid fa-candy-cane',
        'Noodles': 'fa-solid fa-bowl-rice',
        'BBQ Ribs': 'fa-solid fa-bone',
        'Sandwich': 'fa-solid fa-bread-slice',
        'Soup': 'fa-solid fa-whiskey-glass'
    };

    
    let places;
    if (gameMode === 'custom') {
        places = customOptions;
    } else if (gameMode === 'foods') {
        places = Object.keys(defaultFoods);
    } else {
        places = Object.keys(defaultPlaces);
    }

    console.log(`Game mode: ${gameMode}`);
    console.log(`Places available: ${places.join(', ')}`);

    const place = places[Math.floor(Math.random() * places.length)];
    console.log(`Selected place/food: ${place}`);
    
    cards = [];
    for (let i = 0; i < numPlayers; i++) {
        cards.push(i < numSpies ? 'Spy' : place);
    }

    // Shuffle the cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    console.log(`Cards generated: ${cards.join(', ')}`);

    // Display the card
    document.getElementById('get-place-btn').disabled = false;
}

function togglePlaceVisibility() {
    const card = cards[currentPlayer];
    const cardElement = document.getElementById('place-card');
    
    if (!showPlace) {
        // Show the place
        if (card === 'Spy') {
            cardElement.innerHTML = `<div class="card-title"><i class="fa-solid fa-user-secret"></i> Spy</div>`;
        } else {
            const iconClass = gameMode === 'custom' ? '' : (gameMode === 'foods' ? {
                'Pizza': 'fa-solid fa-pizza-slice',
                'Burger': 'fa-solid fa-hamburger',
                'Sushi': 'fa-solid fa-shrimp',
                'Ice Cream': 'fa-solid fa-ice-cream',
                'Taco': 'fa-solid fa-hotdog',
                'Pasta': 'fa-solid fa-bowl-food',
                'Salad': 'fa-solid fa-leaf',
                'Cake': 'fa-solid fa-cake',
                'Steak': 'fa-solid fa-drumstick-bite',
                'Pancakes': 'fa-solid fa-cookie',
                'Fried Chicken': 'fa-solid fa-drumstick-bite',
                'Hotdog': 'fa-solid fa-hotdog',
                'Chocolate': 'fa-solid fa-jar',
                'Fruit Salad': 'fa-solid fa-plate-wheat',
                'Smoothie': 'fa-solid fa-blender',
                'Donut': 'fa-solid fa-stroopwafel',
                'French Fries': 'fa-solid fa-candy-cane',
                'Noodles': 'fa-solid fa-bowl-rice',
                'BBQ Ribs': 'fa-solid fa-bone',
                'Sandwich': 'fa-solid fa-bread-slice',
                'Soup': 'fa-solid fa-whiskey-glass'
            } : {
                'Hospital': 'fa-solid fa-hospital',
                'School': 'fa-solid fa-school',
                'Factory': 'fa-solid fa-industry',
                'Park': 'fa-solid fa-tree',
                'Library': 'fa-solid fa-book',
                'Museum': 'fa-solid fa-building-columns',
                'Cafe': 'fa-solid fa-cafe',
                'Gym': 'fa-solid fa-dumbbell',
                'Airport': 'fa-solid fa-plane',
                'Bank': 'fa-solid fa-university',
                'Beach': 'fa-solid fa-umbrella-beach',
                'Restaurant': 'fa-solid fa-utensils',
                'Theater': 'fa-solid fa-theater-masks',
                'Shopping Mall': 'fa-solid fa-shopping-cart',
                'Hotel': 'fa-solid fa-cart-flatbed-suitcase',
                'Office': 'fa-solid fa-briefcase',
                'Train Station': 'fa-solid fa-train',
                'Zoo': 'fa-solid fa-paw',
                'Amusement Park': 'fa-solid fa-cable-car',
                'Aquarium': 'fa-solid fa-fish',
                'Bar': 'fa-solid fa-beer-mug-empty'
            })[card];
            cardElement.innerHTML = `<div class="card-title"><i class="${iconClass}"></i> ${card}</div>`;
        }
        cardElement.style.display = 'inline-block';
    } else {
        // Hide the place
        cardElement.style.display = 'none';
    }

    showPlace = !showPlace;

    if (showPlace) {
        // Move to next player
        currentPlayer++;
        if (currentPlayer >= numPlayers) {
            // Last player has seen their place
            lastPlayer = true;
            console.log('All players have seen their places');
            document.getElementById('get-place-btn').disabled = false;
        } else {
            // Ensure button is enabled for the next player
            console.log(`Player ${currentPlayer + 1} is seeing their place`);
            document.getElementById('get-place-btn').disabled = false;
        }
    } else if (lastPlayer && !lastPlayerHidden) {
        // Last player hides their place and the game starts
        lastPlayerHidden = true;
        console.log('Hiding last player\'s place and starting timer');
        document.getElementById('get-place-btn').disabled = true; // Disable the button
        setTimeout(() => {
            document.getElementById('place-card').style.display = 'none';
            startTimer();
        }, 100); // Delay to ensure UI update
    }
}
function startTimer() {
    console.log('Starting timer');
    timerInterval = setInterval(() => {
        if (!isPaused) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                console.log('Time is up!');
                alert('Game over!');
                stopTimer(); // Call stopTimer to return to the main screen
            }
        }
    }, 1000);
}

function stopTimer() {
    console.log('Stopping timer');
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'Time Left: 00:00';
    document.getElementById('stop-timer').disabled = true;
    document.getElementById('pause-timer').disabled = true;

    // Reset to main screen
    document.getElementById('setup').style.display = 'block';
    document.getElementById('game-play').style.display = 'none';
}

function togglePause() {
    if (isPaused) {
        console.log('Resuming timer');
        startTimer();
        document.getElementById('pause-timer').textContent = 'Pause Timer';
    } else {
        console.log('Pausing timer');
        clearInterval(timerInterval);
        document.getElementById('pause-timer').textContent = 'Resume Timer';
    }
    isPaused = !isPaused;
}
