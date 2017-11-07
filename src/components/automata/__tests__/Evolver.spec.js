import { Cell, Model } from '../Evolver.js';
import DEFAULTS from '../../../automata.json';

it('should build the neighbours array with given value', () => {
  const aCell = new Cell(2, 1, 2);
  const neighbours = aCell.neighbours;
  expect(Object.keys(neighbours).length).toBe(8);
  expect(neighbours['N'].col).toBe(1);
  expect(neighbours['NE'].col).toBe(2);
  expect(neighbours['NW'].col).toBe(0);
  expect(neighbours['S'].col).toBe(1);
  expect(neighbours['SE'].col).toBe(2);
  expect(neighbours['SW'].col).toBe(0);
  expect(neighbours['E'].col).toBe(2);
  expect(neighbours['W'].col).toBe(0);
  expect(neighbours['N'].row).toBe(1);
  expect(neighbours['NE'].row).toBe(1);
  expect(neighbours['NW'].row).toBe(1);
  expect(neighbours['S'].row).toBe(3);
  expect(neighbours['SE'].row).toBe(3);
  expect(neighbours['SW'].row).toBe(3);
  expect(neighbours['E'].row).toBe(2);
  expect(neighbours['W'].row).toBe(2);
  expect(aCell._value).toBe(2);
});

it('should create a new evolver with default data ', () => {
  const model = new Model(100, 100, DEFAULTS.defaults.layers);
  const grid = model._grid;
  expect(grid).toBeDefined();
  for (let row = 0; row < 100; row++) {
    for (let col = 0; col < 100; col++) {
      expect(grid[row][col].value).toBe(0);
      expect(grid[row][col].row).toBe(row);
      expect(grid[row][col].col).toBe(col);
    }
  }
});
