const generateNewFood = function(width, height) {
  const foods = ["normalFood", "specialFood"];
  const foodType = foods[Math.floor(Math.random() * 2)];
  const rowId = Math.floor(Math.random() * width);
  const colId = Math.floor(Math.random() * height);
  return new Food(rowId, colId, foodType);
};

class Game {
  #snake;
  #ghostSnake;
  #food;
  #rowId;
  #colId;
  #score;
  constructor(snake, ghostSnake, food, size) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#rowId = size[0];
    this.#colId = size[1];
    this.#score = 0;
  }

  getStatus() {
    return {
      snake: this.#snake.getStatus(),
      ghostSnake: this.#ghostSnake.getStatus(),
      score: this.#score,
      food: this.#food.getStatus()
    };
  }

  move() {
    this.#snake.move();
    this.#ghostSnake.move();
  }

  hasSnakeOnBoundary() {
    const verticalLine = [0, this.#rowId];
    const horizontalLine = [0, this.#colId];
    return this.#ghostSnake.isOnLine(verticalLine, horizontalLine);
  }

  turnGhostSnake() {
    const keys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    const direction = Math.floor(Math.random() * 4);
    this.#ghostSnake.turnSnake(keys[direction]);
  }

  turnSnake(pressedKey) {
    this.#snake.turnSnake(pressedKey);
  }

  hasGhostEatenFood(food) {
    if (this.#ghostSnake.hasFoodEaten(food.position, this.#food.growSize)) {
      this.#food = generateNewFood(this.#rowId, this.#colId);
    }
  }

  update() {
    if (this.hasSnakeOnBoundary()) {
      this.#ghostSnake.changePosition();
    }
    const food = this.#food.getStatus();
    this.hasGhostEatenFood(food);
    if (this.#snake.hasFoodEaten(food.position, this.#food.growSize)) {
      this.#food = generateNewFood(this.#rowId, this.#colId);
      this.#score += 5;
    }
  }

  hasGameOver() {
    const verticalLine = [0, this.#rowId];
    const horizontalLine = [0, this.#colId];
    const isSnakeEatenItself = this.#snake.hasEatenItself();
    const isTouchBoundary = this.#snake.isOnLine(verticalLine, horizontalLine);

    return isSnakeEatenItself || isTouchBoundary;
  }
}
