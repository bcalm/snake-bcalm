const updateSnakeHead = function(location, direction, position, growSize) {};

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

  grow(growSize) {
    for (let size = 1; size <= growSize; size++) {
      this.#positions.unshift(this.#previousTail);
    }
  }

  isFoodEaten(foodPosition, growSize) {
    if (arePointEqual(this.head, foodPosition)) {
      this.grow(growSize);
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
    const [headX, headY] = this.#positions[this.#positions.length - 1];
    this.#previousTail = this.#positions.shift();
    const [deltaX, deltaY] = this.#direction.delta;
    this.#positions.push([headX + deltaX, headY + deltaY]);
  }

  isOnLine(verticalLine, horizontalLine) {
    const isLeftWallTouch = this.head[0] < verticalLine[0];
    const isRightWallTouch = this.head[1] >= verticalLine[1];
    const isTopTouch = this.head[0] < horizontalLine[0];
    const isBottomTouch = this.head[1] >= horizontalLine[1];
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
  #type;
  constructor(colId, rowId, type) {
    this.#colId = colId;
    this.#rowId = rowId;
    this.#type = type;
  }

  get position() {
    return [this.#colId, this.#rowId];
  }

  get growSize() {
    const sizeLookup = { normal: 5, special: 0 };
    const type = this.#type;
    return sizeLookup[type];
  }
}
