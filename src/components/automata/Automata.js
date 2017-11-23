import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import { Button, Sidebar, SideDialog } from '../navigation';
import Modal from '../common';

import { event as currentEvent } from 'd3';
import { select } from 'd3-selection'
import 'd3-selection-multi'
import 'd3-shape';
import 'd3-path';
import { scaleLinear } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import 'rc-slider/assets/index.css';
import './Automata.css';
import * as data from './automata.json';

import { Model } from './Model';

import * as utils from '../utils';

const ADD_CELL = 1;
const ADD_ENTRANCE = 2;
const ADD_EXIT = 3;
const ADD_OBSTACLE = 4;
const REMOVE_CELL = 5;

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
    this.state = { model: model, cellSize: cellSize, value: 60 };
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
        <Modal title='Edit Probability Matrices' ref={(modal) => { this.modal = modal }}>
          <p>Change the values of the probability matrix of each layer</p>
          <div className='matrices'>
            {this.state.model.layers.map((data, i) => {
              return (
                <table key={i}>
                  <tbody>
                    <tr>
                      <td><input type='text' 
                            value={this.state.model.layers[i].NW} 
                            onChange={this.handleChange.bind(this, i, 'NW')} />
                      </td>
                      <td><input type='text' 
                            value={this.state.model.layers[i].N} 
                            onChange={this.handleChange.bind(this, i, 'N')} />
                      </td>
                      <td><input type='text' 
                            value={this.state.model.layers[i].NE} 
                            onChange={this.handleChange.bind(this, i, 'NE')} />
                      </td>
                    </tr>
                    <tr>
                      <td><input type='text' 
                            value={this.state.model.layers[i].W} 
                            onChange={this.handleChange.bind(this, i, 'W')} />
                      </td>
                      <td></td>
                      <td><input type='text' 
                            value={this.state.model.layers[i].E} 
                            onChange={this.handleChange.bind(this, i, 'E')} />
                      </td>
                    </tr>
                    <tr>
                      <td><input type='text' 
                            value={this.state.model.layers[i].SW} 
                            onChange={this.handleChange.bind(this, i, 'SW')} />
                      </td>
                      <td><input type='text' 
                            value={this.state.model.layers[i].S} 
                            onChange={this.handleChange.bind(this, i, 'S')} />
                      </td>
                      <td><input type='text' 
                            value={this.state.model.layers[i].SE} 
                            onChange={this.handleChange.bind(this, i, 'SE')} />
                      </td>
                    </tr>
                  </tbody>
                </table>);
            })}
          </div>
        </Modal>
        <Sidebar>
          <Button name={ name } click={ () => { this.pauseResume(); } } text={ text } />
          <Button name='pencil-square-o' active={this.state.editAction} text='Edit'>
            <SideDialog title='Edit Controls' >
              <div className='controls'>
                <Button name='user-plus' active={this.state.editAction === ADD_CELL} click={ () => {
                  this.setState((prevState, props) => ({
                    editAction: ADD_CELL
                  }));
                  this.edit();
                }} text='Add Cell' />
                <Button name='sign-in' active={this.state.editAction === ADD_ENTRANCE} click={ () => {
                  this.setState((prevState, props) => ({
                    editAction: ADD_ENTRANCE
                  }));
                  this.edit();
                }} text='Add Entrance' />
                <Button name='sign-out' active={this.state.editAction === ADD_EXIT} click={ () => {
                  this.setState((prevState, props) => ({
                    editAction: ADD_EXIT
                  }));
                  this.edit();
                }} text='Add Exit' />
                <Button name='ban' active={this.state.editAction === ADD_OBSTACLE} click={ () => {
                  this.setState((prevState, props) => ({
                    editAction: ADD_OBSTACLE
                  }));
                  this.edit();
                }} text='Add Obstacle' />
                <Button name='times' active={this.state.editAction === REMOVE_CELL} click={ () => {
                  this.setState((prevState, props) => ({
                    editAction: REMOVE_CELL
                  }));
                  this.edit();
                }} text='Empty' />
                <Button name='table' click={ () => {
                  this.modal.show();
                }} text='Layer Values' />
                {this.state.editAction &&
                  <Button name='hand-paper-o' click={ () => {
                    this.stopEditing();
                  }} text='Stop Editing' />
                }
              </div>
              <div className='speedControl'>
                Time Between Iterations (ms): <br /><br />
                <Slider value={this.state.speed} min={60} max={1000} onChange={this.handleSpeedChange.bind(this)} />
              </div>
            </SideDialog>
          </Button>
          <Button name='times' text='Clear' click={ () => {
            this.setState((prevState, props) => ({ 
              model: new Model(prevState.model.width, prevState.model.height, prevState.model.layers, Model.emptyGrid(prevState.model.width, prevState.model.height)) 
            }));
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
          <Button name='share' text='Initial Data' click={ () => {
            window.location.href = '/';
          }} />
          <Button name='share' text='Lane Data' click={ () => {
            window.location.href = '/?sim=lanes';
          }} />
          <Button name='share' text='Random Data' click={ () => {
            window.location.href = '/?sim=random';
          }} />
        </Sidebar>
        <div className="base-layer">
        </div>
      </div>
    );
  }

  handleSpeedChange (value) {
    this.setState((prevState, props) => ({
      speed: value
    }));
    this.createInterval();
  }

  handleChange (index, direction, element) {
    const newLayers = Object.assign(this.state.model.layers)
    newLayers[index][direction] = element.target.value;
    this.setState((prevState, props) => {
      const newModel = new Model(prevState.model.width, prevState.model.height, newLayers, prevState.model.state);
      return { model: newModel };
    });
  }

  stopEditing () {
    this.setState((prevState, props) => ({
      editAction: undefined 
    }));
  }

  pauseResume (state) {
    this.stopEditing();
    if (typeof state !== 'undefined') {
      this.setState((prevState, props) => ({ 
        paused: state 
      }));
      return;
    }
    this.setState((prevState, props) => ({ 
      editing: false, paused: !prevState.paused 
    }));
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
      const col = Math.floor(currentEvent.pageX / cellSize);
      const row = Math.floor(currentEvent.pageY / cellSize);
      switch (this.state.editAction) {
        case ADD_CELL:
          this.state.model.addCell(row, col);
          break;
        case ADD_ENTRANCE:
          this.state.model.addDoor(row, col);
          break;
        case ADD_EXIT:
          this.state.model.addExit(row, col);
          break;
        case ADD_OBSTACLE:
          this.state.model.addObstacle(row, col);
          break;
        case REMOVE_CELL:
          this.state.model.removeCell(row, col);
          break;
      }
    });
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
      this.setState((prevState, props) => ({
        model: prevState.model, context: context
      }));
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
    this.pauseResume(true);
    this.draw();
    this.createInterval();    
  }

  createInterval () {
    clearInterval(this.state.interval);
    const interval = setInterval(() => {
      if (this.state.paused) { 
        return;
      }
      const nextState = this.state.model.evolve();
      this.setState((prevState, props) => ({
        model: nextState 
      }));
      this.draw();
    }, this.state.speed);
    this.setState((prevState, props) => ({
      interval: interval
    }));
  }
}
