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

export default class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

