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
import * as data from '../../automata.json'

import { Model } from './Model';

const colors = interpolateSpectral;

export class Automata extends Component {
  constructor(props) {
    super(props);
    //let model = new Model(this.props.width, this.props.height, data.default._layers, Model.randomGrid(this.props.width, this.props.height, data.default._layers));
    const sim = this.getParameterByName('sim');
    let model = Object.assign(new Model(), data.default);
    if (sim) {
      model = Object.assign(new Model(), data[sim]); 
    }
    this.state = { model: model };
  }

  // move me to a better location
  getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
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
          <Button name='pencil-square-o' click={ () => { this.edit(); }} text='Edit' />
          <Button name='times' text='Clear' click={ () => {
            this.setState(Object.assign(this.state, { model: new Model(this.props.width, this.props.height, this.state.model.layers, Model.emptyGrid(this.props.width, this.props.height)) }));
            this.pauseResume(true);
            this.draw();
          }} />
          <Button name='question' text='About' />
          <Button name='book' text='References' />
          <Button name='share' text='Output Data' click={ () => {
            console.log(JSON.stringify(this.state.model));
          }} />
        </Sidebar>
        <div className="base-layer">
          { this.state.editing ? <EditDialog parent={ this } model={ this.state.model } size={ this.props.cellSize } col={ this.state.col } row={ this.state.row } posX={ this.state.posX } posY={ this.state.posY } /> : null }
        </div>
      </div>
    );
  }

  pauseResume (state) {
    if (typeof state !== 'undefined') {
      this.setState(Object.assign(this.state, { paused: state }));
      return;
    }
    this.setState(Object.assign(this.state, { editing: false, paused: !this.state.paused }));
    select('canvas').on('mousemove', null);
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
      this._showEditDialog(currentEvent.pageX, currentEvent.pageY);
      view.on('click', null);
    });
  }

  hideEditDialog() {
    this.setState(Object.assign(this.state, { editing: false, col: null, row: null, posX: null, posY: null }));
    this.edit();
    this.draw();
  }

  _showEditDialog (pageX, pageY) {
    const cellSize = this.props.cellSize;
    const col = Math.floor(pageX / cellSize);
    const row = Math.floor(pageY / cellSize);
    this.setState(Object.assign(this.state, { editing: true, col: col, row: row, posX: cellSize * (col + 0.5), posY: cellSize * (row + 0.5) }));
  }

  draw () {
    const scale = scaleLinear()
      .domain([1, this.state.model.layerCount + 1])
      .range([0, 1]);

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
    for (let row = 0; row < this.props.height; row++) {
      for (let col = 0; col < this.props.width; col++) {
        const value = this.state.model.value(row, col);
        context.beginPath();
        context.arc(cellSize * (col + 0.5), cellSize * (row + 0.5), cellSize / 2, 0, 2 * Math.PI);
        let color;
        if (value > this.state.model.layerCount) {
          color = '#c00';
        } else if (value === 0) {
          color = '#141219'
        } else if (value < 0) {
          color = '#29272D'
        } else { 
          color = colors(scale(value + 1));
        }
        context.fillStyle = color;
        context.strokeStyle = '#29272D';
        context.lineWidth = 1;
        context.fill();
        context.stroke();
        context.closePath();
      }
    }
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
