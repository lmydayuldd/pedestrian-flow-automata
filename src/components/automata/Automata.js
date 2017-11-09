import React, { Component } from 'react';

import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';
import { scaleOrdinal,schemeCategory10 } from 'd3-scale';

import './Automata.css';
import { Model } from './Evolver.js';
import CONFIG from '../../automata.json';

const COLORS = scaleOrdinal(schemeCategory10); 
const CELL_SIZE = 7;

export class Automata extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      model: new Model(300, 100, CONFIG.defaults.layers, Model.randomGrid(300, 100, CONFIG.defaults.layers.length)), 
    }
  }

  render() {
    return (
      <div className="base-layer"></div>
    )
  }

  draw() {
    let context = this.state.context; 
    if (!context) {
      const base = select('.base-layer');
      const view = base.append('canvas')
        .attr('width', 500)
        .attr('height', 500);

      context = view.node().getContext('2d');
      this.setState({ model: this.state.model, context: context });
    }
    this.state.model._grid.forEach((cells, row) => {
      cells.forEach((cell, col) => {
        context.beginPath();
        context.rect(cell.col * CELL_SIZE, cell.row * CELL_SIZE,  CELL_SIZE, CELL_SIZE);
        context.fillStyle = cell.value === 0 ? '#fff' : COLORS(cell.value)
        context.fill();
        context.closePath();
      });
    });
  }

  componentDidMount() {
    this.draw();
    setInterval(() => {
      const nextState = this.state.model.evolve();
      this.setState({ model: nextState, canvas: this.state.canvas });
      this.draw();
    }, 50);
  }
}
