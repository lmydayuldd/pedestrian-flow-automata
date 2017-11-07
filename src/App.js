import React, { Component } from 'react';
import Automata from './components/automata'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Crowd Flow Simulation</h2>
        </div>
        <Automata />
      </div>
    );
  }
}

export default App;
