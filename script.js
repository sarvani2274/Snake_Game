const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Reduced box size for smaller grid
const boxSize = 25; // Decreased size for smaller grid squares
const canvasSize = 600;
const rows = canvasSize / boxSize;
const columns = canvasSize / boxSize;

let snake = [{x: 9 * boxSize, y: 9 * boxSize}];
let direction = {x: 0, y: 0};
let food = {x: Math.floor(Math.random() * columns) * boxSize, y: Math.floor(Math.random() * rows) * boxSize};
let score = 0;
let gameInterval;

function drawGrid() {
  ctx.strokeStyle = '#444'; // Color for grid lines
  for (let x = 0; x <= canvasSize; x += boxSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize);
  }
  for (let y = 0; y <= canvasSize; y += boxSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvasSize, y);
  }
  ctx.stroke();
}

function drawSnake() {
  ctx.fillStyle = '#39FF14'; // Neon green color for snake
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.fillStyle = '#FF5733'; // Bright red color for food
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function moveSnake() {
  const newHead = {x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize};

  // Check if the snake eats the food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    food = {x: Math.floor(Math.random() * columns) * boxSize, y: Math.floor(Math.random() * rows) * boxSize};
  } else {
    snake.pop(); // Remove the last part of the snake if no food eaten
  }

  // Check for border collision (corrected)
  if (newHead.x < 0 || newHead.x + boxSize > canvasSize || newHead.y < 0 || newHead.y + boxSize > canvasSize) {
    clearInterval(gameInterval);
    alert('Game Over! Final Score: ' + score);
    document.location.reload();
  }

  // Check for collision with itself
  if (collision(newHead)) {
    clearInterval(gameInterval);
    alert('Game Over! Final Score: ' + score);
    document.location.reload();
  }

  snake.unshift(newHead); // Add new head to the front of the snake
}

function collision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function updateGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawGrid(); // Draw the grid
  drawSnake();
  drawFood();
  moveSnake();
}

document.addEventListener('keydown', event => {
  const key = event.key;

  if (key === 'ArrowUp' && direction.y === 0) {
    direction = {x: 0, y: -1};
  } else if (key === 'ArrowDown' && direction.y === 0) {
    direction = {x: 0, y: 1};
  } else if (key === 'ArrowLeft' && direction.x === 0) {
    direction = {x: -1, y: 0};
  } else if (key === 'ArrowRight' && direction.x === 0) {
    direction = {x: 1, y: 0};
  }
});

gameInterval = setInterval(updateGame, 100);
