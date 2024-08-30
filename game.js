const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const pauseUI = document.getElementById('pauseUI');
const termsPopup = document.getElementById('termsPopup');
const acceptButton = document.getElementById('acceptButton');
const denyButton = document.getElementById('denyButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: '#61dafb',
    dy: 0,
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false,
    canDoubleJump: true
};

let obstacles = [];
let obstacleFrequency = 100;
let frameCount = 0;
let score = 0;
let isPaused = false;
let gameStarted = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    if (player.isJumping) {
        player.dy += player.gravity;
        player.y += player.dy;
        if (player.y + player.height >= canvas.height - 100) {
            player.y = canvas.height - 150;
            player.dy = 0;
            player.isJumping = false;
            player.canDoubleJump = true;
        }
    }
}

function createObstacle() {
    let obstacle = {
        x: canvas.width,
        y: canvas.height - 150,
        width: 50,
        height: 50,
        color: '#f00'
    };
    obstacles.push(obstacle);
    obstacleFrequency = Math.floor(Math.random() * 100) + 50; // Random gap between 50 and 150 frames
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            // Collision detected, reset the game
            resetGame();
        }
    });
}

function resetGame() {
    player.y = canvas.height - 150;
    player.dy = 0;
    player.isJumping = false;
    player.canDoubleJump = true;
    obstacles = [];
    frameCount = 0;
    score = 0;
    isPaused = false;
    pauseUI.style.display = 'none';
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${Math.floor(score / 60)}`;
}

function drawFloor() {
    ctx.fillStyle = '#444';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function gameLoop() {
    if (!isPaused && gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFloor();
        drawPlayer();
        updatePlayer();
        drawObstacles();
        updateObstacles();
        checkCollision();
        updateScore();

        frameCount++;
        score++;
        if (frameCount % obstacleFrequency === 0) {
            createObstacle();
        }
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!player.isJumping) {
            player.isJumping = true;
            player.dy = player.jumpPower;
        } else if (player.canDoubleJump) {
            player.dy = player.jumpPower;
            player.canDoubleJump = false;
        }
    } else if (e.code === 'Escape') {
        togglePause();
    }
});

pauseButton.addEventListener('click', togglePause);
resetButton.addEventListener('click', resetGame);
acceptButton.addEventListener('click', () => acceptTerms(true));
denyButton.addEventListener('click', () => acceptTerms(false));

function togglePause() {
    isPaused = !isPaused;
    pauseUI.style.display = isPaused ? 'block' : 'none';
}

function openTermsPopup() {
    termsPopup.style.display = 'block';
}

function acceptTerms(accepted) {
    if (accepted) {
        gameStarted = true;
        termsPopup.style.display = 'none';
    } else {
        alert('You must agree and accept the terms and conditions to continue on this site.');
    }
}

openTermsPopup();
gameLoop();