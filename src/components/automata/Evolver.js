export default class Evolver {  
  evolve(data) {
    // Validate automata rules and mutate state;
    // This means create a new copy of the data, change state
    // based on the rules. 
    // It's important to think of immutability. This class 
    // should not keep any type of state and mutate over it, 
    // but instead it should create new states based on the previous rules.
    // Instead consider the rules of mutation and implement the state change. 
  }
}

const VECINITY = { 
  N: { dx: 0, dy: -1 }, 
  NE: { dx: 1, dy: -1 }, 
  NW: { dx: -1, dy: -1},
  S: { dx: 0, dy: 1 }, 
  SE: { dx: 1, dy: 1 }, 
  SW: { dx: -1, dy: 1 }, 
  E: { dx: 1, dy: 0 },
  W: { dx: -1, dy: 0 }
};

export class Cell {
  constructor(x, y, value) {
    this._x = x;
    this._y = y;
    this._value = value;
    this._neighbours = this._buildNeighbours(VECINITY);   
  }

  _buildNeighbours(cardinalPoints) {
    return Object.keys(cardinalPoints)
      .map((key) => {
        const neighbour = {
          x: this._x + VECINITY[key].dx,
          y: this._y + VECINITY[key].dy,
          key: key
        };
        return neighbour;
      })
      .reduce((result, value) => {
        result[value.key] = { x: value.x, y: value.y };
        return result;
      }, {});
  }

  get neighbours() {
    return this._neighbours;
  }
}

export class Layer {
  constructor() {
    this.probMatrix = Array.from({
      length: 3
    }, () => new Array(3).fill(0));
  }
}

/**
 * This class keeps the state of each iteration.
 * The constructor parameters indicate what's the size 
 * of the automata.
 **/
export class Model {
  constructor(width, height) {
    this.grid = Array.from({
      length: height
    }, () => new Array(width).fill(0));
 
  }
}
