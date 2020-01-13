const generateNewFood = function(width, height) {
  const rowId = Math.floor(Math.random() * width);
  const colId = Math.floor(Math.random() * height);
  return new Food(rowId, colId);
};

class Game {
  constructor(snake, ghostSnake, food, size) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.rowId = size[0];
    this.colId = size[1];
    this.score = 0;
    this.previousFood = [0, 0];
  }

  state() {
    return {
      snake: this.snake.state(),
      ghostSnake: this.ghostSnake.state(),
      score: this.score,
      food: this.food.position,
      previousFood: this.previousFood
    };
  }

  move() {
    this.snake.move();
    this.ghostSnake.move();
  }

  turnGhostSnake() {
    this.ghostSnake.turnLeft();
  }

  turnSnake(directionLookup) {
    const snakeDirection = this.snake.direction.heading;

    if (directionLookup[event.key] === (snakeDirection + 1) % 4) {
      this.snake.turnLeft();
    }

    if (directionLookup[event.key] === (snakeDirection + 3) % 4) {
      this.snake.turnRight();
    }
  }

  update() {
    if (this.snake.isFoodEaten(this.food.position)) {
      this.previousFood = this.food.position;
      this.food = generateNewFood(this.rowId, this.colId);
      this.score += 5;
    }
  }

  hasGameOver() {
    const isSnakeEatenItself = this.snake.isEatenItself();
    const line = [this.rowId, this.colId];
    const isTouchBoundary = this.snake.onLine(line);

    return isSnakeEatenItself || isTouchBoundary;
  }
}
