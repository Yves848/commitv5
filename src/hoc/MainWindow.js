import React, { Component } from 'react';
import { compose } from 'recompose';
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
import Project from '../components/Project';
import ControlPanel from '../components/Menu/ControlPanel'
import { withProject } from '../Classes/ProjectContext';
import { projet } from '../Classes/project';
const { dialog } = require('electron').remote;
const { ipcMain } = require('electron').remote;
import { baseLocale } from '../Classes/baseLocale';
import backgroundImg from '../../docs/images/writer-background-6.jpg';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit,
  },
  project: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
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
      db: null,
      project: null,
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

    ipcMain.on('importData', async (event, arg) => {
      console.log('import Data', this.state.project);
      try {
        await this.state.project.importModule.importAll();  
      } catch (error) {
        console.log('importData', error)
      }
      
      
    })

    ipcMain.on('snack', async (event, args) => {
      //console.log(args)
    });
  }

  openProject = async () => {
    const file = await dialog.showOpenDialog({
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
    
    if (file && file.length > 0) {
      const project = new projet(this.updateStatus);
      await project.loadProject(file[0]);
      
      this.setState({
        project
      })
    }
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

  

  saveProject = async aProjet => {
    this.handleClose();
    const { creationDb } = this.state;
    creationDb.isOpen = true;
    this.setState({
      creationDb,
    });
    const newProject = new projet(this.updateStatus);

    await newProject.saveProject(aProjet);

    this.setState({
      snack: {
        projet: newProject,
        open: true,
        variant: 'success',
        message: `projet ${projet.name} créé...`,
      },
      project: newProject,
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
    const { snack, creationDb, project } = this.state;
    const isProjectOpen = project ? true : false;
    
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

        <AppDrawer isOpen={this.state.isDrawerOpen} handleDrawer={this.handleDrawerOpen} className={classes.appDrawer} isProjectOpen={isProjectOpen} aProjet={project}/>
        <main className={classes.content}>
          <div className={classes.project}>
            <Project aProjet={project} />
            <ControlPanel aProjet={project}></ControlPanel>
          </div>
        </main>

        <NewProject isOpen={this.state.isNewProjectOpen} handleClose={() => this.handleClose()} saveProject={this.saveProject} />
      </div>
    );
  }
}

//export default withStyles(styles)(MainView);
export default compose(withStyles(styles))(MainView);
