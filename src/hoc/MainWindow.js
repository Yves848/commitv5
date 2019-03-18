import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuAppBar from '../components/Menu/AppBar';
import AppDrawer from '../components/Menu/AppDrawer';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import { CssBaseline } from '@material-ui/core';
import NewProject from '../components/Modals/NewProject';
import CreationDb from '../components/Modals/CreationDb';
const { dialog } = require('electron').remote;
const { ipcMain } = require('electron').remote;
const { saveProject } = require('../Utils/projects');
import {baseLocale} from '../Classes/baseLocale'
import backgroundImg from '../../docs/images/writer-background-6.jpg';

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
  appDrawer: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  toolbar: theme.mixins.toolbar,
  success: {
    backgroundColor: blue[500],
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
      creationDb: {
        message: '',
        isOpen: false,
      },
      snack: {
        Open: false,
        Message: '',
        Variant: 'success',
      },
      db: null
    };

    ipcMain.on('openProject', async (event, arg) => {
      const reponse = await this.openProject();
      event.sender.send('openProject-return', reponse);
    });

    ipcMain.on('createProject', async (event, arg) => {
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

  updateStatus = message => {
    
      const { creationDb } = this.state;
      creationDb.message = message;
      this.setState({
        creationDb,
      });
    
  };

  saveProject = async projet => {
    this.handleClose();
    const { creationDb } = this.state;
    creationDb.isOpen = true;
    this.setState({
      creationDb,
    });
    const newProject = saveProject(projet);
    
    //console.log(newProject.optionsPha)
    const { optionsPha } = newProject;
    //await baseLocale.creer(optionsPha, this.updateStatus);
    const db = new baseLocale(optionsPha, this.updateStatus);
    await db.creerDB();
    this.setState({
      snack: {
        projet: newProject,
        open: true,
        variant: 'success',
        message: `projet ${projet.name} créé...`,
      },
    });
    creationDb.isOpen = false;
    this.setState({
      creationDb,
    });
  };

  handleSnackClose = () => {
    this.setState({
      snack: {
        open: false,
        variant: 'success',
        message: '',
      },
    });
  };

  handleCreateDbClose = () => {
    this.setState({
      isCreationDbOpen: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { snack, creationDb } = this.state;
    return (
      <div
        className={classes.root}
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'stretch',
          height: '100vh',
        }}
      >
        <CreationDb isOpen={creationDb.isOpen} message={creationDb.message} />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snack.open}
          autoHideDuration={2500}
          onClose={this.handleSnackClose}
        >
          <SnackbarContent className={classes[snack.variant]} message={snack.message} />
        </Snackbar>
        <CssBaseline />
        <MenuAppBar />

        <AppDrawer isOpen={this.state.isDrawerOpen} handleDrawer={this.handleDrawerOpen} className={classes.appDrawer} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
        </main>
        <NewProject isOpen={this.state.isNewProjectOpen} handleClose={() => this.handleClose()} saveProject={this.saveProject} />
      </div>
    );
  }
}

export default withStyles(styles)(MainView);
