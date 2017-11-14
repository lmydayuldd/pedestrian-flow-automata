import React, { Component } from 'react';
import { Button } from '../navigation';

import './EditDialog.css';

export class EditDialog extends Component {
    render() {
      const row = this.props.row;
      const col = this.props.col;
      let posX = this.props.posX;
      if (window.innerWidth - this.props.posX < 200) {
        posX = this.props.posX - 400;
      }
      const style = {
        top: this.props.posY + 'px',
        left: posX + 'px',
        borderRadius: this.props.size / 2 + 'px',
      };
      return (
        <div className='dialog' style={style}>
          <Button name='user-plus' click={ () => {
            this.props.model.addCell(row, col);
            this.props.parent.hideEditDialog();
          }} text='Add Cell' />
          <Button name='sign-in' click={ () => {
            this.props.model.addDoor(row, col);
            this.props.parent.hideEditDialog();
          }} text='Add Entrance' />
          <Button name='sign-out' click={ () => {
            this.props.model.addExit(row, col);
            this.props.parent.hideEditDialog();
          }} text='Add Exit' />
          <Button name='ban' click={ () => {
            this.props.model.addObstacle(row, col);
            this.props.parent.hideEditDialog();
          }} text='Add Obstacle' />
          <Button name='times' click={ () => {
            this.props.model.removeCell(row, col);
            this.props.parent.hideEditDialog();
          }} text='Empty' />
        </div>
      );
    }
}
