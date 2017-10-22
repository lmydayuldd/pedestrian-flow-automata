import { Cell } from '../Evolver.js';

it('build the neighbours array with given value', () => {
  const aCell = new Cell(1, 2, 2);
  const neighbours = aCell.neighbours;
  expect(Object.keys(neighbours).length).toBe(8);
  expect(neighbours['N'].x).toBe(1);
  expect(neighbours['NE'].x).toBe(2);
  expect(neighbours['NW'].x).toBe(0);
  expect(neighbours['S'].x).toBe(1);
  expect(neighbours['SE'].x).toBe(2);
  expect(neighbours['SW'].x).toBe(0);
  expect(neighbours['E'].x).toBe(2);
  expect(neighbours['W'].x).toBe(0);
  expect(neighbours['N'].y).toBe(1);
  expect(neighbours['NE'].y).toBe(1);
  expect(neighbours['NW'].y).toBe(1);
  expect(neighbours['S'].y).toBe(3);
  expect(neighbours['SE'].y).toBe(3);
  expect(neighbours['SW'].y).toBe(3);
  expect(neighbours['E'].y).toBe(2);
  expect(neighbours['W'].y).toBe(2);
  expect(aCell._value).toBe(2);
});
