const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = "grid";

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + "_" + rowId;

const getCell = (colId, rowId) => document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.remove(snake.species);
  });
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const eraseFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove(food.type);
};

const drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.type);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => {
    game.turnSnake(event.key);
  };
};

const randomlyTurnSnake = game => {
  let x = Math.random() * 100;
  if (x > 50) {
    game.turnGhostSnake();
  }
};

const displayScore = function(score) {
  scoreCard.innerText = `SCORE: ${score}`;
};

const printGameOver = function(score) {
  game.innerText = `Game Over \n  Score: ${score}`;
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), "snake");
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), "ghost");
};

const eraseGame = function(status) {
  eraseSnake(status.snake);
  eraseSnake(status.ghostSnake);
  eraseFood(status.food);
};
const drawGame = function(status) {
  drawSnake(status.snake);
  drawSnake(status.ghostSnake);
  drawFood(status.food);
};

const updateGame = function(game, gameInterval) {
  let status = game.getStatus();
  game.move();
  if (game.isGameOver()) {
    clearInterval(gameInterval);
    printGameOver(status.score);
  }
  eraseGame(status);
  game.update();
  status = game.getStatus();
  drawGame(status);
  randomlyTurnSnake(game);
  displayScore(status.score);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5, "normalFood");
  const size = [100, 60];
  const game = new Game(snake, ghostSnake, food, size);
  setup(game);

  const gameInterval = setInterval(() => {
    updateGame(game, gameInterval);
  }, 50);
};
