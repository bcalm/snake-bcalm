const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
}

const updateSnakeHead = function(location, direction, position) {
  const [headX, headY] = location[location.length - 1];
  const [deltaX, deltaY] = direction;
  position.push([headX + deltaX, headY + deltaY]);
};

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  get head() {
    return this.positions[this.positions.length - 1];
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  move() {
    updateSnakeHead(this.location, this.direction.delta, this.positions);
    this.previousTail = this.positions.shift();
  }

  grow() {
    updateSnakeHead(this.location, this.direction.delta, this.positions);
  }
}
class Food {
  constructor(colId, rowId) {
    this.colId = colId;
    this.rowId = rowId;
  }

  get position() {
    return [this.colId, this.rowId];
  }
}

const isFoodEaten = function(snakePosition, foodPosition) {
  return snakePosition[0] === foodPosition[0] && snakePosition[1] === foodPosition[1];
};

const generateNewFood = function(width, height) {
  const rowId = Math.floor(Math.random() * width);
  const colId = Math.floor(Math.random() * height);
  const newFood = new Food(rowId, colId);
  return newFood;
};

class Game {
  constructor(snake, ghostSnake, food, size) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.rowId = size[0];
    this.colId = size[1];
  }

  getSnakeStatus() {
    return {
      location: this.snake.location.slice(),
      species: this.snake.species,
      previousTail: this.snake.previousTail.slice()
    };
  }

  getGhostSnakeStatus() {
    return {
      location: this.ghostSnake.location.slice(),
      species: this.ghostSnake.species,
      previousTail: this.ghostSnake.previousTail.slice()
    };
  }

  getFoodStatus() {
    return {
      location: this.food.position
    };
  }

  move() {
    this.snake.move();
    this.ghostSnake.move();
  }

  turnSnake(snake) {
    if (snake === "ghostSnake") {
      this.ghostSnake.turnLeft();
      return;
    }
    this.snake.turnLeft();
  }

  update() {
    if (isFoodEaten(this.snake.head, this.food.position)) {
      this.food = generateNewFood(this.rowId, this.colId);
      this.snake.grow();
    }
  }
}

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
  let [colId, rowId] = food.location;
  const cell = getCell(colId, rowId);
  cell.classList.remove("food");
};

const drawFood = function(food) {
  let [colId, rowId] = food.location;
  const cell = getCell(colId, rowId);
  cell.classList.add("food");
};

const drawGame = function(game) {
  const snake = game.getSnakeStatus();
  const food = game.getFoodStatus();
  const ghostSnake = game.getGhostSnakeStatus();
  drawSnake(snake);
  drawSnake(ghostSnake);
  drawFood(food);
};

const moveAndDrawSnake = function(game) {
  game.move();
  const snake = game.getSnakeStatus();
  const ghostSnake = game.getGhostSnakeStatus();
  eraseTail(snake);
  drawSnake(snake);
  eraseTail(ghostSnake);
  drawSnake(ghostSnake);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => game.turnSnake("snake");
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

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawGame(game);
};

const animateSnakes = game => {
  moveAndDrawSnake(game);
};

const randomlyTurnSnake = game => {
  let x = Math.random() * 100;
  if (x > 50) {
    game.turnSnake("ghostSnake");
  }
};

const gameLoop = function(game) {
  eraseFood(game.getFoodStatus());
  animateSnakes(game);
  randomlyTurnSnake(game);
  game.update();
  drawFood(game.getFoodStatus());
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5);
  const size = [100, 60];
  const game = new Game(snake, ghostSnake, food, size);
  setup(game);
  setInterval(gameLoop, 200, game);
};
