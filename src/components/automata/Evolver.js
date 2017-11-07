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
  constructor(row, col, value) {
    this._col = col;
    this._row = row;
    this._value = value;
    this._neighbours = this._buildNeighbours(VECINITY);   
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  _buildNeighbours(cardinalPoints) {
    return Object.keys(cardinalPoints)
      .map((key) => {
        const col = this._col + cardinalPoints[key].dx;
        const row = this._row + cardinalPoints[key].dy;
        
        const neighbour = {
          col: col,
          row: row,
          key: key
        };
        return neighbour;
      })
      .reduce((result, value) => {
        result[value.key] = { row: value.row, col: value.col };
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
      this._grid = Model.emptyGrid(width, height);
    } else {
      this._grid = state;
    }
  }

  static emptyGrid(width, height) {
    let grid = [];
    for (let row = 0; row < height; row++) {
      grid[row] = [];
      for (let col = 0; col < width; col++) {
        grid[row][col] = new Cell(row, col, 0);
      }
    }
    return grid;
  }

  static randomGrid(width, height, layers) {
    let state = Model.emptyGrid(width, height);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        state[row][col] = new Cell(row, col, Math.floor(Math.random() * layers));
      }
    }
    return state;
  }

  evolve () {
    let state = Model.emptyGrid(this._width, this._height);
    for (let row = this._height - 1; row >= 0; row--) {
      for (let col = this._width - 1; col >= 0; col--) {
        const cell = this._grid[row][col];
        if (cell.value === 0 || cell.value > this._layers.length) {
          continue;
        }
        const layer = this._layers[cell.value];
        const proof = Math.random();
        let moveDirection;
        for (let direction in layer) {
          if (layer[direction] > proof) {
            break;
          }
          moveDirection = direction;
        }
        const move = cell.neighbours[moveDirection];
        const rowNew = Math.max(0, Math.min(move.row, this._height - 1));
        const colNew = Math.max(0, Math.min(move.col, this._width - 1));
        if (state[rowNew][colNew].value === 0) {
          state[rowNew][colNew] = new Cell(rowNew, colNew, cell.value);
        } else {
          state[cell.row][cell.col] = new Cell(cell.row, cell.col, cell.value);
        }
      }
    }
    return new Model(this._width, this._height, this._layers, state);
  }
}
