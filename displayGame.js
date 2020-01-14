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

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const eraseFood = function(food) {
  let [colId, rowId] = food;
  const cell = getCell(colId, rowId);
  cell.classList.remove("food");
};

const drawFood = function(food) {
  let [colId, rowId] = food;
  const cell = getCell(colId, rowId);
  cell.classList.add("food");
};

const drawGame = function(game) {
  const state = game.state();
  drawSnake(state.snake);
  drawSnake(state.ghostSnake);
};

const moveAndDrawSnake = function(game) {
  const state = game.state();
  game.move();
  eraseTail(state.snake);
  drawSnake(state.snake);
  eraseTail(state.ghostSnake);
  drawSnake(state.ghostSnake);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => {
    game.turnSnake(event.key);
  };
};

const animateSnakes = game => {
  moveAndDrawSnake(game);
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
  game.innerHTML = `<div style='text-align:center;'><p style='font-size:10vw'>Game Over</p><br><p style='font-size:3vw'>Score: ${score}`;
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawGame(game);
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

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5, "normal");
  const size = [100, 60];
  const game = new Game(snake, ghostSnake, food, size);
  setup(game);

  const interval = setInterval(() => {
    const state = game.state();
    if (game.hasGameOver()) {
      clearInterval(interval);
      printGameOver(state.score);
    }

    eraseFood(state.previousFood);
    drawFood(state.food);
    animateSnakes(game);
    randomlyTurnSnake(game);
    game.update();
    displayScore(state.score);
  }, 200);
};
