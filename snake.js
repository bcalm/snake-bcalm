const updateSnakeHead = function(location, direction, position) {
  const [headX, headY] = location[location.length - 1];
  const [deltaX, deltaY] = direction;
  position.push([headX + deltaX, headY + deltaY]);
};

const arePointEqual = function(firstPoint, secondPoint) {
  return firstPoint[0] === secondPoint[0] && firstPoint[1] === secondPoint[1];
};

class Snake {
  #positions;
  #direction;
  #type;
  #previousTail;
  constructor(positions, direction, type) {
    this.#positions = positions.slice();
    this.#direction = direction;
    this.#type = type;
    this.#previousTail = [0, 0];
  }

  get location() {
    return this.#positions.slice();
  }

  get species() {
    return this.#type;
  }

  get head() {
    return this.#positions[this.#positions.length - 1];
  }
  turnSnake(pressedKey) {
    this.#direction.changeDirection(pressedKey);
  }

  isFoodEaten(foodPosition) {
    if (arePointEqual(this.head, foodPosition)) {
      updateSnakeHead(this.location, this.#direction.delta, this.#positions);
      return true;
    }
    return false;
  }

  state() {
    return {
      location: this.location.slice(),
      species: this.species,
      previousTail: this.#previousTail.slice()
    };
  }

  move() {
    updateSnakeHead(this.location, this.#direction.delta, this.#positions);
    this.#previousTail = this.#positions.shift();
  }

  onLine(boundary) {
    const isTopTouch = this.head[1] < 0;
    const isBottomTouch = this.head[0] === boundary[0];
    const isLeftWallTouch = this.head[0] < 0;
    const isRightWallTouch = this.head[1] === boundary[1];
    return isTopTouch || isLeftWallTouch || isBottomTouch || isRightWallTouch;
  }

  hasEatenItself() {
    const snakeBody = this.location.slice(0, -1);
    return snakeBody.some(part => part[0] === this.head[0] && this.head[1] === part[1]);
  }
}

class Food {
  #colId;
  #rowId;
  constructor(colId, rowId) {
    this.#colId = colId;
    this.#rowId = rowId;
  }

  get position() {
    return [this.#colId, this.#rowId];
  }
}
