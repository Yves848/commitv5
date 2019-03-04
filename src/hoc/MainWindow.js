import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuAppBar from '../components/Menu/AppBar';
import AppDrawer from '../components/Menu/AppDrawer';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { CssBaseline } from '@material-ui/core';
import {classNames} from 'classnames'
import NewProject from '../components/Modals/NewProject';
const { dialog } = require('electron').remote;
const { ipcMain } = require('electron').remote;
const { saveProject } = require('../Utils/projects');

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 8,
  },
  toolbar: theme.mixins.toolbar,
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
});

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      isNewProjectOpen: false,
      snack: {
        Open: false,
        Message: '',
        Variant: 'success',
      },
    };

    ipcMain.on('openProject', async (event, arg) => {
      const reponse = await this.openProject();
      event.sender.send('openProject-return', reponse);
    });

    ipcMain.on('createProject', async (event, arg) => {
      //console.log('createProjet');
      this.setState({
        isNewProjectOpen: true,
      });
    });

    ipcMain.on('snack', async (event, args) => {
      //console.log(args)
    });
  }

  openProject = async () => {
    return await dialog.showOpenDialog({
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
  };

  handleDrawerOpen = () => {
    const { isDrawerOpen } = this.state;
    this.setState({
      isDrawerOpen: !isDrawerOpen,
    });
  };

  handleClose = () => {
    this.setState({
      isNewProjectOpen: false,
    });
  };

  saveProject = projet => {
    //console.log('saveProject', projet);
    this.handleClose();
    saveProject(projet);
    this.setState({
      snack:{
        open: true,
        variant: 'success',
        message: `projet ${projet.name} créé...`
      }
    })
  };

  handleSnackClose = () => {
    this.setState({
      snack: {
        open: false,
        variant: 'success',
        message: ''
      }
    })
  }

  render() {
    const { classes } = this.props;
    const { snack } = this.state;
    return (
      <div className={classes.root}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={snack.open}
          autoHideDuration={6000}
          onClose={this.handleSnackClose}
        >
          <SnackbarContent
            onClose={this.handleSnackClose}
            className={classes[snack.variant]}
            message={snack.message}
          />
        </Snackbar>
        <CssBaseline />
        <MenuAppBar />

        <AppDrawer
          isOpen={this.state.isDrawerOpen}
          handleDrawer={this.handleDrawerOpen}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
        </main>
        <NewProject
          isOpen={this.state.isNewProjectOpen}
          handleClose={() => this.handleClose()}
          saveProject={this.saveProject}
        />
      </div>
    );
  }
}

export default withStyles(styles)(MainView);
