import React, { Component } from 'react';

import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';

import Cell from './Cell'

import './Automata.css';


class Automata extends Component {
  render() {
    return (
      <svg className="base-layer">This is an automata</svg>
    )
  }

  draw() {
    const data = Array.from({
      length: 100
    }, () => new Array(100).fill(0));
    const svg = select('svg');

    const row = svg.selectAll('.row')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "row");

    const cols = row.selectAll('.square')
      .data(d => d)
      .enter()
      .append('rect')
      .attr("class","square")
      .attr('x', (rect) => {
        return rect.x;
      })
      .attr('y', (rect) => {
        return rect.y;
      })
      .attr('width', (rect) => {
        return 10;
      })
      .attr('height', (rect) => {
        return 10;
      })
      .style("stroke", "white");
  }

  componentDidMount() {
    this.draw();
  }
}

export default Automata;
