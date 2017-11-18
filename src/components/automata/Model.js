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

const EXIT = 1000;
const ENTRANCE = 1001;
const OBSTACLE = -1;
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

  get width () {
    return this._width;
  }

  get height () {
    return this._height;
  }

  get layers () {
    return this._layers;
  }

  get layerCount() {
    return this._layers.length;
  }

  static emptyGrid(width, height) {
    let grid = [];
    for (let row = 0; row < height; row++) {
      grid[row] = [];
      for (let col = 0; col < width; col++) {
        grid[row][col] = 0;
      }
    }
    return grid;
  }

  static randomGrid(width, height, layers) {
    let state = Model.emptyGrid(width, height);
    //for (let row = 0; row < height; row++) {
      //for (let col = 0; col < width; col++) {
        //state[row][col] = new Cell(row, col, Math.floor(Math.random() * layers));
      //}
    //}
    for (let i = 0; i < 3; i++) {
      state[i][width - 1] = EXIT;
    }
    for (let i = 0; i < 6; i++) {
      state[i][0] = ENTRANCE;
    }
    return state;
  }

  value(row, col) { 
    return this._grid[row][col];
  }

  _calculateMove(row, col, direction) {
    const newRow = Math.max(row + VECINITY[direction].dy, 0);
    const newCol = Math.max(col + VECINITY[direction].dx, 0);
    return { row: newRow, col: newCol };
  }

  evolve () {
    let state = Object.assign(this._grid);
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const cell = state[row][col];
        if (cell === 0 || cell === EXIT || cell === OBSTACLE) {
          continue;
        }
        let layer = this._layers[cell - 1];
        if (!layer) {
          layer = this._layers[0];
        }
        const proof = Math.random();
        let moveDirection;
        for (let direction in layer) {
          if (layer[direction] > proof) {
            moveDirection = direction;
            break;
          }
        } 
        if (!moveDirection) { 
          continue;
        }
        const move = this._calculateMove(row, col, moveDirection);
        const rowNew = Math.min(move.row, this._height - 1);
        const colNew = Math.min(move.col, this._width - 1);
        
        if (row === rowNew && col === colNew) {
          continue;
        }
        
        const targetCell = state[rowNew][colNew];

        if (cell === ENTRANCE) {
          if (targetCell === 0 && proof > 0.3) {
            state[rowNew][colNew] = Math.floor(Math.random() * this.layerCount);
          }
          continue;
        }

        if (targetCell === 0) {          
          state[rowNew][colNew] = cell;
          state[row][col] = targetCell;
        } else if (targetCell === EXIT ) {
          state[rowNew][colNew] = targetCell;
          state[row][col] = 0;
        } else if (targetCell === OBSTACLE) {
          state[rowNew][colNew] = targetCell;
          state[row][col] = cell;
        } else {
          state[row][col] = cell;
          state[rowNew][colNew] = targetCell;
        }
      }
    }
    return new Model(this._width, this._height, this._layers, state);
  }

  addCell (row, col) { 
    const cellValue = Math.floor(Math.random() * this.layerCount);
    this._grid[row][col] = cellValue;
  }

  addDoor (row, col) {
    this._grid[row][col] = ENTRANCE;
  }

  addExit (row, col) { 
    this._grid[row][col] = EXIT;
  }

  addObstacle (row, col) {
    this._grid[row][col] = OBSTACLE;
  }

  removeCell (row, col) { 
    this._grid[row][col] = 0;
  }
}
