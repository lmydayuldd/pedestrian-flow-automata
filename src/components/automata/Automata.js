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
const CELL_SIZE = 10;

export class Automata extends Component {
  constructor(props) {
    super(props);
    this.state = { model: new Model(300, 100, CONFIG.defaults.layers, Model.randomGrid(300, 100, CONFIG.defaults.layers.length)) }
  }

  render() {
    return (
      <svg className="base-layer">This is an automata</svg>
    )
  }

  drawAutomata() {
    const svg = select('svg').html("");

    const row = svg.selectAll('.row')
      .data(this.state.model._grid)
      .enter()
      .append("g")
      .attr("class", "row");

    row.selectAll('.square')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('fill', (rect) => {
        return rect.value === 0 ? '#fff' : COLORS(rect.value)
      })
      .attr('x', (rect) => {
        return rect.col * CELL_SIZE;
      })
      .attr('y', (rect) => {
        return rect.row * CELL_SIZE;
      })
      .attr('width', (rect) => {
        return CELL_SIZE;
      })
      .attr('height', (rect) => {
        return CELL_SIZE;
      })
      .style("stroke", "#EEE");
  }

  componentDidMount() {
    this.drawAutomata();
    setInterval(() => {
      const nextState = this.state.model.evolve();
      this.setState({ model: nextState });
      this.drawAutomata();
    }, 1000);
  }
}
