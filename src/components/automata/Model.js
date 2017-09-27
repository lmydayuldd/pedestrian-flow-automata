export default class Model {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._data = Array.from({
      length: height
    }, () => new Array(width).fill(0));
  }

  valueAt(row, col) {
    return this._data[row][col];
  }
}
