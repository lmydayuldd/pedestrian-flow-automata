import React, { Component } from 'react';
import { EditDialog } from './EditDialog';
import { Button, Sidebar } from '../navigation';

import * as d3 from 'd3';
import { event as currentEvent } from 'd3';
import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';
import { scaleLinear } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import './Automata.css';

import { Model } from './Model';
import CONFIG from '../../automata.json';

const colors = interpolateSpectral;
const scale = scaleLinear()
                .domain([0, 5])
                .range([0, 1]);

export class Automata extends Component {
  constructor(props) {
    super(props);
    const model = new Model(this.props.width, this.props.height, CONFIG.defaults.layers, Model.randomGrid(this.props.width, this.props.height, CONFIG.defaults.layers.length)); 
    this.state = { model: model };
  }

  render () {
    let name, text;
    if (this.state.paused) {
      name = 'play-circle-o';
      text = 'Resume';
    } else {
      name = 'pause-circle-o';
      text = 'Pause';
    }
    return (
      <div>
        <Sidebar>
          <Button name={ name } click={ () => { this.pauseResume(); } } text={ text } />
          <Button name='pencil-square-o' click={ () => { this.edit() }} text='Edit' />
          <Button name='question' text='About' />
          <Button name='book' text='References' />
        </Sidebar>
        <div className="base-layer">
          { this.state.editing ? <EditDialog size={ this.props.cellSize } x={ this.state.x } y={ this.state.y } /> : null }
        </div>
      </div>
    );
  }

  pauseResume (state) {
    if (typeof state !== 'undefined') {
      this.setState(Object.assign(this.state, { paused: state }));
      return;
    }
    this.setState(Object.assign(this.state, { paused: !this.state.paused }));
  }

  edit () {
    this.pauseResume(true);
    const cellSize = this.props.cellSize;
    const view = select('canvas');
    const context = view.node().getContext('2d');
    view.on('mousemove', () => {
      this.draw();
      const col = Math.floor(currentEvent.pageX / cellSize);
      const row = Math.floor(currentEvent.pageY / cellSize);
      context.beginPath();
      context.arc(cellSize * (col + 0.5), cellSize * (row + 0.5), cellSize / 2, 0, 2 * Math.PI);
      context.fillStyle = '#fff';
      context.fill();
      context.closePath();
    });
    view.on('click', (e) => {
      view.on('mousemove', null);
      this.showEditDialog(currentEvent.pageX, currentEvent.pageY);
    });
  }

  showEditDialog (pageX, pageY) {
    const cellSize = this.props.cellSize;
    const col = Math.floor(pageX / cellSize);
    const row = Math.floor(pageY / cellSize);
    this.setState(Object.assign(this.state, { editing: true, x: cellSize * (col + 0.5), y: cellSize * (row + 0.5) }));
    console.log(this.state);
  }

  draw () {
    const cellSize = this.props.cellSize;
    let context = this.state.context; 
    if (!context) {
      const base = select('.base-layer');
      const view = base.append('canvas')
        .attr('width', this.props.width * this.props.cellSize)
        .attr('height', this.props.height * this.props.cellSize);
      if (!view.node()) {
        return;
      }
      context = view.node().getContext('2d');
      this.setState({ model: this.state.model, context: context });
    }
    this.state.model._grid.forEach((cells, row) => {
      cells.forEach((cell, col) => {
        context.beginPath();
        context.arc(cellSize * (cell.col + 0.5), cellSize * (cell.row + 0.5), cellSize / 2, 0, 2 * Math.PI);
        let color;
        if (cell.value > this.state.model.layerCount) {
          color = '#c00';
        } else if (cell.value === 0) {
          color = '#141219'
        } else if (cell.value < 0) {
          color = '#fff'
        } else { 
          color = colors(scale(cell.value));
        }
        context.fillStyle = color;
        context.strokeStyle = '#29272D';
        context.lineWidth = 1;
        context.fill();
        context.stroke();
        context.closePath();
      });
    });
  }

  componentDidMount () {
    this.draw();
    setInterval(() => {
      if (this.state.paused) { 
        return;
      }
      const nextState = this.state.model.evolve();
      this.setState({ model: nextState, canvas: this.state.canvas });
      this.draw();
    }, 60);
  }
}
