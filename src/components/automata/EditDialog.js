import React, { Component } from 'react';
import './EditDialog.css';

export class EditDialog extends Component { 
    render() {
        const style = {
          top: this.props.y + 'px',
          left: this.props.x + 'px',
          borderRadius: this.props.size / 2 + 'px' 
        }; 
        return <div className='dialog' style={ style }></div>;
    }
}