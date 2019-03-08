import React, { Component } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';

class CreationDb extends Component {
  render() {
    const {message, isOpen, handleClose} = this.props;
    return (
     <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent>
        {message}
      </DialogContent>
     </Dialog>
    )
  }
}

export default CreationDb;