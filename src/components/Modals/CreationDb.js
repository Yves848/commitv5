import React, { Component } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import {Paper} from '@material-ui/core'
import {white} from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  aImport: {
    width: 400,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: white,
    backgroundColor: white
  },
});
class CreationDb extends Component {
  render() {
    const {message, isOpen, handleClose, classes} = this.props;
    return (
     <Dialog open={isOpen} onClose={handleClose} fullWidth>
     <DialogTitle>Création de la Db ..... </DialogTitle>
      <DialogContent>
        <div className={classes.paper}>
        <h1>{message}</h1>
        <CircularProgress></CircularProgress>
        </div>
        
      </DialogContent>
     </Dialog>
    )
  }
}

export default  withStyles(styles)(CreationDb);