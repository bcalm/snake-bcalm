const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  #heading;
  #deltas;
  constructor(initialHeading) {
    this.#heading = initialHeading;
    this.#deltas = {};
    this.#deltas[EAST] = [1, 0];
    this.#deltas[WEST] = [-1, 0];
    this.#deltas[NORTH] = [0, -1];
    this.#deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.#deltas[this.#heading];
  }

  changeDirection(pressedKey) {
    const snakeDirection = this.#heading;
    const directionLookup = {
      ArrowUp: 1,
      ArrowLeft: 2,
      ArrowRight: 0,
      ArrowDown: 3
    };
    if (directionLookup[pressedKey] === (snakeDirection + 1) % 4) {
      this.#heading = (this.#heading + 1) % 4;
    }
    if (directionLookup[pressedKey] === (snakeDirection + 3) % 4) {
      this.#heading = (this.#heading + 3) % 4;
    }
  }
}
