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

export default class Cell {
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
