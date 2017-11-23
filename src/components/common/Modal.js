import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './Modal.css';

export class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <div>
      {this.state.shown && 
        <div className='modal'>
          <div className='overlay'></div>
          <div className='content'>
            <div className='title'>
              {this.props.title}
            </div>
            <div className='close' onClick={ () => this.hide() }>
              <FontAwesome
                name='times'
              />
            </div>
            <div>
              {this.props.children}
            </div>
          </div>
        </div>
      }
      </div>
    );
  }

  show () {
    this.setState((prevState, props) => ({
      shown: true
    }));
  }

  hide () {
    this.setState((prevState, props) => ({
      shown: false
    }));
  }
}