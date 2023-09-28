const ball = document.querySelector('.ball');
const container = document.querySelector('.game-container');
const dxValue = document.getElementById('dx-value');
const obstacle = document.querySelector('.obstacle');
const obstacleHorizontal = document.querySelector('.obstacle-horizontal');
const target = document.querySelector('.target');
const scoreValue = document.getElementById('score-value');
const countdownTimer = document.getElementById('countdown-timer');
const gameOver = document.getElementById('game-over');

let dx = 0; // Initial horizontal speed
let dx1 = 0; // User set Angle
let dy = -5; // Initial vertical speed (upwards)
let isAnimating = false;
let obstacleDirection = 1; // 1 for moving down, -1 for moving up
let obstacleY = 50; // Initial Y position of the obstacle
let obstacleHorizontalDirection = 1; // 1 for moving right, -1 for moving left
let obstacleX = 50; // Initial X position of the obstacle
let score = 0;

let remainingTime = 120; // Initial remaining time in seconds
let countdownInterval;

function startCountdown() {
    countdownInterval = setInterval(function () {
        if (remainingTime > 0) {
            remainingTime--;
            countdownTimer.textContent = remainingTime;
        } else {
            clearInterval(countdownInterval);
            countdownTimer.style.display = 'none';
            showGameOver();
        }
    }, 1000);
}

function showGameOver() {
    gameOver.style.display = 'block';
    setTimeout(function () {
        gameOver.style.display = 'none';
        resetGame();
    }, 5000);
}

function resetGame() {
    score = 0;
    scoreValue.textContent = score;
    remainingTime = 120;
    countdownTimer.textContent = remainingTime;
    countdownTimer.style.display = 'block';
    launchBall(); // Restart the game
    startCountdown();
    moveObstacle(); // Start moving the obstacles
    moveHorizontalObstacle();
}

function moveObstacle() {
    obstacle.style.top = obstacleY + 'px';

    if (obstacleY >= container.clientHeight / 3 - obstacle.clientHeight) {
        obstacleDirection = -1; // Change direction when reaching the bottom
    } else if (obstacleY <= 0) {
        obstacleDirection = 1; // Change direction when reaching the top
    }

    obstacleY += obstacleDirection;
    requestAnimationFrame(moveObstacle);
}

function moveHorizontalObstacle() {
    obstacleHorizontal.style.left = obstacleX + 'px';

    if (obstacleX >= container.clientWidth - obstacleHorizontal.clientWidth) {
        obstacleHorizontalDirection = -1; // Change direction when reaching the right edge
    } else if (obstacleX <= 0) {
        obstacleHorizontalDirection = 1; // Change direction when reaching the left edge
    }

    obstacleX += obstacleHorizontalDirection;
    requestAnimationFrame(moveHorizontalObstacle);
}

function checkCollisionWithTarget() {
    const ballRect = ball.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (
        ballRect.right >= targetRect.left &&
        ballRect.left <= targetRect.right &&
        ballRect.bottom >= targetRect.top &&
        ballRect.top <= targetRect.bottom
    ) {
        // Collision with the target
        score += 10; // Increment the score by 10
        scoreValue.textContent = score; // Update the score display
        stopAnimation();
    }
}

function stopAnimation() {
    // Reset the ball and stop animation
    isAnimating = false;
    ball.style.display = 'none';
}

function launchBall() {
    if (!isAnimating) {
        isAnimating = true;
        ball.style.display = 'block';
        ball.style.left = container.clientWidth / 2 + 'px';
        ball.style.top = container.clientHeight / 2 + 'px';

        let x = parseFloat(ball.style.left);
        let y = parseFloat(ball.style.top) + 200;
        dy = -5;

        function animateBall() {
            x += dx;
            y += dy;

            if (x + ball.clientWidth / 2 > container.clientWidth || x - ball.clientWidth / 2 < 0) {
                dx = -dx; // Reverse horizontal direction when hitting the sides
            }

            //checkCollisionWithTarget(); // Check collision with the target

            
           

            ball.style.left = x + 'px';
            ball.style.top = y + 'px';

            if (y - ball.clientHeight / 2 < 10) {
                dy = -dy; // Reverse vertical direction when hitting the top
                y += Math.sign(dy);
            }

            if (y + ball.clientHeight / 2 >= container.clientHeight) {
                // Reset the ball when it hits the bottom
                stopAnimation();
                return;
            }

            if (
                x + ball.clientWidth / 2 > obstacle.offsetLeft - obstacle.clientWidth /2 &&
                x - ball.clientWidth / 2 < obstacle.offsetLeft + obstacle.clientWidth /2 &&
                y + ball.clientHeight / 2 > obstacle.offsetTop - obstacle.clientHeight/2 &&
                y - ball.clientHeight / 2 < obstacle.offsetTop + obstacle.clientHeight/2
            ) {
                dy = -dy; // Reverse vertical direction when hitting the obstacle
                y += Math.sign(dy);
            }

            if (
                x + ball.clientWidth / 2 > obstacleHorizontal.offsetLeft &&
                x - ball.clientWidth / 2 < obstacleHorizontal.offsetLeft + obstacleHorizontal.clientWidth &&
                y + ball.clientHeight / 2 > obstacleHorizontal.offsetTop &&
                y - ball.clientHeight / 2 < obstacleHorizontal.offsetTop + obstacleHorizontal.clientHeight
            ) {
                dx = -dx; // Reverse horizontal direction when hitting the horizontal obstacle
                x += Math.sign(dx);
            }
            
            if (
                x + ball.clientWidth / 2 > target.offsetLeft &&
                x - ball.clientWidth / 2 < target.offsetLeft + target.clientWidth &&
                y + ball.clientHeight / 2 > target.offsetTop &&
                y - ball.clientHeight / 2 < target.offsetTop + target.clientHeight
            ) {
                score += 10; // Increment the score by 10
                scoreValue.textContent = score; // Update the score display
                stopAnimation();
            }

            requestAnimationFrame(animateBall);
        }

        animateBall();
    }
}

// Listen for arrow key presses to adjust dx and update the dx value display
document.addEventListener('keydown', function (event) {
    
    if (event.key === 'ArrowLeft' && dx1 > -6) {
        dx1 += -1; // Move left
    } else if (event.key === 'ArrowRight' && dx1 < 6) {
        dx1 += 1; // Move right
    } else if (event.key === 'ArrowUp' && !isAnimating) {
        dx=dx1;
        launchBall();
    }
    
    // Update the dx value display for every keydown event
    dxValue.textContent = dx1*8;
    
});

// Start the game
resetGame();
