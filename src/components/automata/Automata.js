import React, { Component } from 'react';

import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';

import './Automata.css';


class Automata extends Component {
  render() {
    return (
      <svg className="base-layer">This is an automata</svg>
    )
  }

  draw() {
    var svg = select('svg');

    var row = svg.selectAll('.row')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "row");

    var cols = row.selectAll('.square')
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
