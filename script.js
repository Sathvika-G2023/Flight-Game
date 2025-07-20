document.addEventListener('DOMContentLoaded', () => {
    const plane = document.getElementById('plane');
    const sky = document.querySelector('.sky');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const gameContainerWidth = 800; // Match .game-container width
    const skyHeight = sky.offsetHeight; // Get dynamic height of sky

    let planeX = gameContainerWidth / 2 - plane.offsetWidth / 2;
    let planeSpeed = 10;
    let score = 0;
    let gameOver = false;
    let birdInterval;
    let gameLoopInterval;

    const birds = []; // Array to hold all active bird elements

    // Game initialization
    function initGame() {
        planeX = gameContainerWidth / 2 - plane.offsetWidth / 2;
        plane.style.left = `${planeX}px`;
        score = 0;
        scoreDisplay.textContent = score;
        gameOver = false;
        gameOverMessage.classList.add('hidden');
        
        // Clear existing birds
        birds.forEach(bird => bird.remove());
        birds.length = 0; // Empty the array

        startGame();
    }

    // Start the game loop and bird spawning
    function startGame() {
        // Game Loop
        gameLoopInterval = setInterval(gameLoop, 20); // Update every 20ms

        // Spawn birds
        birdInterval = setInterval(createBird, 1500); // Create a bird every 1.5 seconds
    }

    // Handle plane movement
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;

        if (e.key === 'ArrowLeft') {
            planeX = Math.max(0, planeX - planeSpeed);
        } else if (e.key === 'ArrowRight') {
            planeX = Math.min(gameContainerWidth - plane.offsetWidth, planeX + planeSpeed);
        }
        plane.style.left = `${planeX}px`;
    });

    // Create a new bird
    function createBird() {
        const bird = document.createElement('div');
        bird.classList.add('bird');
        bird.style.left = `${Math.random() * (gameContainerWidth - 30)}px`; // Random X position
        bird.style.top = '0px'; // Start from the top
        sky.appendChild(bird);
        birds.push(bird);
    }

    // Game Loop - updates game state
    function gameLoop() {
        if (gameOver) {
            clearInterval(gameLoopInterval);
            clearInterval(birdInterval);
            return;
        }

        // Move birds
        birds.forEach((bird, index) => {
            let birdTop = parseInt(bird.style.top);
            birdTop += 3; // Bird falling speed

            bird.style.top = `${birdTop}px`;

            // Remove bird if it goes off screen
            if (birdTop > skyHeight) {
                bird.remove();
                birds.splice(index, 1);
                score++;
                scoreDisplay.textContent = score;
            }

            // Check for collision
            if (isCollision(plane, bird)) {
                endGame();
            }
        });
    }

    // Collision detection
    function isCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    // End the game
    function endGame() {
        gameOver = true;
        finalScoreDisplay.textContent = score;
        gameOverMessage.classList.remove('hidden');
    }

    // Restart button functionality
    restartButton.addEventListener('click', initGame);

    // Initial game setup
    initGame();
});