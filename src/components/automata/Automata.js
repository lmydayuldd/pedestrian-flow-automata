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
    this.pauseResume(true);
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
              <p>
                Human being itself is really smart, but when are enclosed on a crowded situations, its behavior might change, and some reason seems to be shaded by the 
                surrounding crowd<sup>[1]</sup>. The complete group of people then will distribute following a chaotic pattern, where smaller groups of persons will move pursuing 
                a specific objective. <br />
                Given the described scenario, is possible to model the situation using a cellular automata, which will try to represent closely the behaviour of the crowd. 
                The way to model this automata is using objective matrices. The group then, would be split into smaller groups represented by colors. Each group would have 
                it's own moving pattern specified by a layer which is a probability matrix. Every iteration of the automata will evaluate each cell, and will determinate 
                the objective matrix associated to the cell value, to calculate where the cell is going to be placed the next iteration.
                The purpose of this simulation is to demonstrate how the crowd would move given some specific situations.    
              </p>
              <p>
                Developed by: <a href="https://www.linkedin.com/in/yosel-del-valle/">Yosel Del Valle</a>
                <br />Directed by: <a href="https://www.linkedin.com/in/carlos-jaime-franco-45aa0b45/">Carlos Jaime Franco</a>   
              </p>
            </SideDialog>          
          </Button>
          <Button name='book' text='References'>
            <SideDialog title='References'>
              [1] D. Zhaoa, L. Yangb, J. Lib. Occupants behavior of going with the crowd based on cellular automata occupant evacuation model.< br/> 
              [2] L. Lu, C. Chan, J. Wang, W. Wang. A study of pedestrian group behaviors in crowd evacuation based on an extended floor field cellular automaton model <br />
              [3] C. Feliciani, K. Nishinari. An improved Cellular Automata model to simulate the behavior of high density crowd and validation by experimental data <br />
              [4] M. Khalid, U. Yusof, Dynamic crowd evacuation approach for the emergency route planning problem: Application to case studies <br />
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
