const generateNewFood = function(width, height) {
  const rowId = Math.floor(Math.random() * width);
  const colId = Math.floor(Math.random() * height);
  return new Food(rowId, colId);
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

  turnGhostSnake() {
    const keys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    const direction = Math.floor(Math.random() * 4);
    this.#ghostSnake.turnSnake(keys[direction]);
  }

  turnSnake(pressedKey) {
    this.#snake.turnSnake(pressedKey);
  }

  isFoodEaten() {
    return this.#snake.isFoodEaten(this.#food.position);
  }

  update() {
    if (this.isFoodEaten()) {
      this.#previousFood = this.#food.position;
      this.#food = generateNewFood(this.#rowId, this.#colId);
      this.#score += 5;
    }
  }

  hasGameOver() {
    const isSnakeEatenItself = this.#snake.hasEatenItself();
    const line = [this.#rowId, this.#colId];
    const isTouchBoundary = this.#snake.onLine(line);

    return isSnakeEatenItself || isTouchBoundary;
  }
}
