import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
const { dialog } = require('electron').remote;
const { aPays, getImportModule } = require('../../Utils/projects')
const path = require('path');

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
    color: theme.palette.text.secondary,
  },
});

class NewProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projet: {
        pays: 'be',
        aImport: 0,
        importName: '',
        aTransfert: 0,
        transfertName: '',
        name: '',
        folder: ''
      },
    };
  }

  

  handlePaysChange = event => {
    const pays = event.target.value;
    const { projet } = this.state;
    projet.pays = pays;
    projet.aImport = 0;
    projet.name = '';
    this.setState({
      projet,
    });
  };

  handleImportChange = event => {
    const aImport = event.target.value;
    const { projet } = this.state;
    projet.aImport = aImport;
    this.setState({ projet });
  };

  handleNameChange = event => {
    const name = event.target.value;
    const { projet } = this.state;
    projet.name = name;
    this.setState({ projet });
  };

  chooseProject = () => {
    const file = dialog.showOpenDialog({
      properties: ['openFile', 'promptToCreate'],
      filters: [
        {
          name: 'Projets',
          extensions: ['pj5'],
        },
        {
          name: 'Tous les fichiers',
          extensions: ['*'],
        },
      ],
    });
    if (file) {
      const { projet } = this.state;
      projet.name = file[0];
      projet.folder = path.dirname(projet.name);
      this.setState({
        projet,
      });
    }
  };

  render() {
    const { isOpen } = this.props;
    const { classes } = this.props;
    const { projet } = this.state;

    const aModules = getImportModule(projet.pays).map((module, index) => {
      return module.nom;
    });

    const pays = aPays.map((p, index) => {
      <option value={index}>{p}</option>;
    });

    return (
      <Dialog open={isOpen} onClose={this.props.handleClose} fullWidth>
        <DialogTitle>Nouveau Projet...</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <TextField
              id="select-pays"
              select
              label="Pays"
              className={classes.textField}
              value={projet.pays}
              onChange={event => this.handlePaysChange(event)}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
              variant="outlined"
              fullWidth
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
              className={classes.textField}
              value={projet.aImport}
              onChange={event => this.handleImportChange(event)}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
              variant="outlined"
              fullWidth
            >
              {aModules.map((option, index) => (
                <MenuItem key={index} value={index}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-name"
              label="Projet"
              className={classes.textField}
              value={projet.name}
              onChange={event => this.handleNameChange(event)}
              margin="normal"
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => this.chooseProject(projet)}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.saveProject(projet)}
          >
            Sauver
          </Button>
          <Button variant="contained" color="secondary" onClick={this.props.handleClose}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewProject);
