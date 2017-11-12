import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './Sidebar.css';

export class Button extends Component {
    
    render() {
        return(
            <div onClick={ this.props.click } className='button'>
                <FontAwesome
                    name={this.props.name}
                    size='2x'
                />
                <div className='label'>
                    {this.props.text}
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