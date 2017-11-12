import Cell from './Cell';

const EXIT = 1000;
const ENTRANCE = 1001;
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

  get layerCount() {
    return this._layers.length;
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
    for (let i = 0; i < 6; i++) {
      state[(height / 2) + i][width - 1] = new Cell((height / 2) + i, width - 1, EXIT);
    }
    for (let i = 0; i < 6; i++) {
      state[(height / 2) + i][0] = new Cell((height / 2) + i, 0, ENTRANCE);
    }
    return state;
  }

  evolve () {
    let state = Object.assign(this._grid);
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const cell = state[row][col];
        if (cell.value === 0 || cell.value === EXIT) {
          continue;
        }
        let layer = this._layers[cell.value];
        if (!layer) {
          layer = this._layers[0];
        }
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
        const targetCell = state[rowNew][colNew];

        if (cell.value === ENTRANCE) {
          if (targetCell.value === 0 && proof > 1) {
            state[targetCell.row][targetCell.col] = new Cell(targetCell.row, targetCell.col, Math.floor(Math.random() * this.layerCount));
          }
          continue;
        }

        if (targetCell.value === 0){
          if (cell.row === targetCell.row && cell.col === targetCell.col) {
            continue;
          }
          state[targetCell.row][targetCell.col] = new Cell(targetCell.row, targetCell.col, cell.value);
          state[cell.row][cell.col] = new Cell(cell.row, cell.col, targetCell.value);
        } else if (targetCell.value === EXIT ) {
          state[targetCell.row][targetCell.col] = new Cell(targetCell.row, targetCell.col, targetCell.value);
          state[cell.row][cell.col] = new Cell(cell.row, cell.col, 0);
        } else {
          state[cell.row][cell.col] = new Cell(cell.row, cell.col, cell.value);
          state[targetCell.row][targetCell.col] = new Cell(targetCell.row, targetCell.col, targetCell.value);
        }
      }
    }
    return new Model(this._width, this._height, this._layers, state);
  }
}
