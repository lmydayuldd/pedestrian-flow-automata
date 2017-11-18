import React, { Component } from 'react';
import { EditDialog } from './EditDialog';
import { Button, Sidebar, SideDialog } from '../navigation';

import * as d3 from 'd3';
import { event as currentEvent } from 'd3';
import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';
import { scaleLinear } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import './Automata.css';
import * as data from './automata.json'

import { Model } from './Model';

import * as utils from '../utils';

const colors = interpolateSpectral;

export class Automata extends Component {
  constructor(props) {
    super(props);
    const sim = utils.parameterByName('sim');
    let savedModel = data.default;
    if (sim) {
      savedModel = data[sim];
    }
    const model = Object.assign(new Model(), savedModel);
    const cellSize = Math.round(window.innerHeight / model.height); 
    this.state = { model: model, cellSize: cellSize };
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
            this.setState(Object.assign(this.state, { model: new Model(this.state.model.width, this.state.model.height, this.state.model.layers, Model.emptyGrid(this.state.model.width, this.state.model.height)) }));
            this.pauseResume(true);
            this.draw();
          }} />
          <Button name='question' text='About'>
            <SideDialog title='Automata Based Crowd Simulation'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at ultrices odio. Donec et turpis convallis, vehicula eros nec, fringilla erat. Cras tempus ex eu euismod rhoncus. Quisque a iaculis lorem, vestibulum ullamcorper mi. Donec finibus ipsum vitae diam venenatis hendrerit. Vestibulum a lacus tempor, placerat nunc sit amet, commodo dui. Nulla venenatis condimentum massa, ac maximus ligula tincidunt sed. Integer rhoncus viverra lorem a elementum. Curabitur enim eros, blandit at vehicula eu, rhoncus ac justo. Nullam dignissim felis non elementum efficitur. Vestibulum sodales ligula turpis, et sollicitudin justo gravida ut.

Fusce pellentesque sed magna vitae posuere. Nunc nec lectus velit. Aliquam a fringilla mi. Duis id eros eget risus aliquam rutrum. Nunc odio tortor, gravida vitae augue non, efficitur auctor purus. Phasellus aliquet nisl vel ligula dignissim, id ultrices massa iaculis. Pellentesque congue mauris enim, vitae lobortis dui dignissim a. Quisque cursus odio eget urna viverra pretium. Cras bibendum felis eget purus suscipit tincidunt. Sed ullamcorper augue leo, vitae volutpat est sagittis ut.
            </SideDialog>          
          </Button>
          <Button name='book' text='References'>
            <SideDialog title='References'>
              some other random content must go here
            </SideDialog>
          </Button>
        </Sidebar>
        <div className="base-layer">
          { this.state.editing ? <EditDialog parent={ this } model={ this.state.model } size={ this.state.cellSize } col={ this.state.col } row={ this.state.row } posX={ this.state.posX } posY={ this.state.posY } /> : null }
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
    const cellSize = this.state.cellSize;
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
    const cellSize = this.state.cellSize;
    const col = Math.floor(pageX / cellSize);
    const row = Math.floor(pageY / cellSize);
    this.setState(Object.assign(this.state, { editing: true, col: col, row: row, posX: cellSize * (col + 0.5), posY: cellSize * (row + 0.5) }));
  }

  draw () {
    const scale = scaleLinear()
      .domain([1, this.state.model.layerCount + 1])
      .range([0, 1]);

    const cellSize = this.state.cellSize;
    let context = this.state.context; 
    if (!context) {
      const base = select('.base-layer');
      const view = base.append('canvas')
        .attr('width', this.state.model.width * this.state.cellSize)
        .attr('height', this.state.model.height * this.state.cellSize);
      if (!view.node()) {
        return;
      }
      context = view.node().getContext('2d');
      this.setState({ model: this.state.model, context: context });
    }
    for (let row = 0; row < this.state.model.height; row++) {
      for (let col = 0; col < this.state.model.width; col++) {
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
