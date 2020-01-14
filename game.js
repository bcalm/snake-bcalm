const generateNewFood = function(width, height) {
  const foods = ["normal", "special"];
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
  #previousFood;
  constructor(snake, ghostSnake, food, size) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#rowId = size[0];
    this.#colId = size[1];
    this.#score = 0;
    this.#previousFood = [0, 0];
  }

  state() {
    return {
      snake: this.#snake.state(),
      ghostSnake: this.#ghostSnake.state(),
      score: this.#score,
      food: this.#food.position,
      previousFood: this.#previousFood
    };
  }

  move() {
    this.#snake.move();
    this.#ghostSnake.move();
  }

  hasSnakeOnBoundary() {
    const verticalLine = [4, this.#rowId - 4];
    const horizontalLine = [4, this.#colId - 4];
    return this.#ghostSnake.isOnLine(verticalLine, horizontalLine);
  }

  turnGhostSnake() {
    const keys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    const direction = Math.floor(Math.random() * 4);
    if (this.hasSnakeOnBoundary()) {
      this.#ghostSnake.turnSnake(keys[direction]);
    }
    this.#ghostSnake.turnSnake(keys[direction]);
  }

  turnSnake(pressedKey) {
    this.#snake.turnSnake(pressedKey);
  }

  isFoodEaten() {
    return this.#snake.isFoodEaten(this.#food.position, this.#food.growSize);
  }

  update() {
    if (this.isFoodEaten()) {
      this.#previousFood = this.#food.position;
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
