import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './Sidebar.css';

export class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { content: false };
  }

  toggleContent () {
    this.setState({ content: !this.state.content });
  }
    
  render() {
    return(
      <div onClick={ () => { 
        if  (typeof this.props.click === 'function') {
          this.props.click();
        } 
        this.toggleContent(); 
        }} className='button'>
        <FontAwesome
          name={ this.props.name }
          size='2x'
        />
        <div className='label'>
          { this.props.text }
          { this.state.content ? this.props.children : null }
        </div>
      </div>
    );
  }
    
}

export class SideDialog extends Component {
  render () {
    return (
      <div className="side-dialog">
        <div className="title">{ this.props.title }</div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }  
}

export class Sidebar extends Component {
  render () {
    return (
      <div className='sidebar'>
        { this.props.children }
      </div>
    );
  }
}
