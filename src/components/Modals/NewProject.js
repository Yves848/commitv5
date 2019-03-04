import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';

const versions = require('../../../Modules/modules.json');
const aPays = Object.entries(versions).map(entry => {
  return entry[0];
});

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
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
    width: 300
  }
});

class NewProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pays: 'be',
      aImport: 0
    };
  }

  getImportModule = pays => {
    const aPays = Object.entries(versions).filter(version => {
      return version[0] === pays;
    });
    return aPays[0][1];
  };

  handlePaysChange = event => {
    const pays = event.target.value;
    this.setState({
      pays,
      aImport: 0
    });
    console.log(pays);
  };

  handleImportChange = event => {
    const aImport = event.target.value;
    this.setState({
      aImport
    })
    console.log(aImport);
  };

  render() {
    const { isOpen } = this.props;
    const { classes } = this.props;

    const aModules = this.getImportModule(this.state.pays).map((module, index) => {
      console.log(module);
      return(
      
        module.nom
      )
    });

    const pays = aPays.map((p, index) => {
      <option value={index}>{p}</option>;
    });

    return (
      <Dialog open={isOpen} onClose={this.props.handleClose} fullWidth>
        <DialogTitle>Nouveau Projet...</DialogTitle>
        <DialogContent>
          <TextField
            id="select-pays"
            select
            label="Pays"
            className={classes.textField}
            value={this.state.pays}
            onChange={event => this.handlePaysChange(event)}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Choisissez un pays..."
            margin="normal"
            variant="outlined"
            
          >
            {aPays.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="select-import"
            select
            label="Import"
            className={classes.textField, classes.aImport}
            value={this.state.aImport}
            onChange={event => this.handleImportChange(event)}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Type d'import..."
            margin="normal"
            variant="outlined"
            
          >
            {aModules.map((option, index) => (
              <MenuItem key={index} value={index}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color='primary'>Sauver</Button>
          <Button variant="contained" color='secondary'>Annuler</Button>
        </DialogActions>
      </Dialog>
      
    );
  }
}

export default withStyles(styles)(NewProject);
