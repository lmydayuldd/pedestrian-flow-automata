import React, { Component } from 'react';
import Automata from './components/automata'

import './App.css';

class App extends Component {
  render() {
    const cellSize = 14;
    const width = Math.round(window.innerWidth / cellSize);
    const height = Math.round(window.innerHeight / cellSize);
    return (
      <div className="App">
        <Automata width={ width } height={ height } cellSize={ cellSize } />
      </div>
    );
  }
}

export default App;
