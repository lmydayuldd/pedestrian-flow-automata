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
        const x = this._x + cardinalPoints[key].dx;
        const y = this._y + cardinalPoints[key].dy;
        
        const neighbour = {
          x: Math.max(0, Math.min(x, this._width - 1)),
          y: Math.max(0, Math.min(y, this._height - 1));,
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

  get value() {
    return this._value;
  }
}

export class Layer {
  constructor() {
  }
}

/**
 * This class keeps the state of each iteration.
 * The constructor parameters indicate what's the size 
 * of the automata.
 **/
export class Model {
  constructor(width, height, layers, state) {
    this._width = width;
    this._height = height;
    this._layers = layers;
    if (!state) {
      this._grid = this._createEmptyGrid(widht, height);
    } else {
      this._grid = state;
    }
  }

  _createEmptyGrid(width, height) {
    let grid = [];
    for (let row = 0; row < height; row++) {
      let cols = [];
      for (let col = 0; col < width; col++) {
        cols.push(new Cell(col, row, 0));
      }
      grid.push(cols);
    }
    return grid;
  }

  evolve () {
    let state = this._createEmptyGrid(this._width, this._height);
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const value = this._grid[row][col];
        if (value === 0) {
          continue;
        }
        const layer = this._layers[value].sort();
        const proof = Math.random();
        let moveDirection;
        for (let direction in layer) {
          if (layer[direction] > proof) {
            break;
          }
          moveDirection = direction;
        }
        const move = value.neighbours[moveDirection];
        state[move.x][move.y] = new Cell(move.x, move.y, value.value);
      }
    }
    return new Model(this._width, this._height, this._layers, state);
  }
}
