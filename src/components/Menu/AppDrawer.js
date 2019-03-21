import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import yellow from '@material-ui/core/colors/yellow';

const { ipcRenderer } = require('electron');
const drawerWidth = 150;

const getButtonColor = (theme,aColor) => {
  const button = {
   
      color: theme.palette.getContrastText(aColor[900]),
      backgroundColor: aColor[900],
      borderColor: aColor[900],
      borderWidth: '2px',
      borderStyle: 'solid',
      '&:hover': {
        color: theme.palette.getContrastText(aColor[200]),
        backgroundColor: aColor[200],
        borderColor: '#000',
        borderWidth: '2px',
        borderStyle: 'solid',
      }
   
  };
  return button
};

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    padding: theme.spacing.unit,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit * 6,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  content2: {
    padding: '5px',
    marginTop: theme.spacing.unit * 2,
    backgroundColor: "#c6c6ff"
  },
  drawerPaper: {
    width: drawerWidth,
  },
  button: {
    marginBottom: '5px',
    marginTop: '5px'
  },

  toolbar: theme.mixins.toolbar,
  blueGreyButton: getButtonColor(theme,indigo),
  greenButton: getButtonColor(theme, green),
  purpleButton: getButtonColor(theme,purple),
  yellowButton: getButtonColor(theme,yellow),
});



class AppDrawer extends Component {
  constructor(props) {
    super(props);

    ipcRenderer.on('openProject-return', (event, args) => {
      //console.log(args);
    });
  }

  openProject = () => {
    const response = ipcRenderer.send('openProject');
    if (response) {
      //console.log(response);
    }
  };

  createProject = () => {
    const response = ipcRenderer.send('createProject');
    if (response) {
      //console.log(response);
    }
  };

  importData = () => {
    const response = ipcRenderer.send('importData');
    if (response) {
      console.log(response);
    }
  };

  render() {
    const { isOpen, classes, isProjectOpen } = this.props;

    let toolsButtons = null;

    return (
      <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
        <div className={classes.content}>
        <Paper className={classes.content2} elevation={5}>
          <Button
            className={classNames(classes.button, classes.blueGreyButton)}
            variant="contained"
            color="primary"
            onClick={() => {
              this.createProject();
            }}
            fullWidth
            disableRipple
            size="small"
          >
            Créer projet
          </Button>

          <Button
            className={classNames(classes.button, classes.blueGreyButton)}
            variant="contained"
            color="primary"
            onClick={() => {
              this.openProject();
            }}
            fullWidth
            disableRipple
            size="small"
          >
            Ouvrir projet
          </Button>
          </Paper>
          {isProjectOpen ? (
            <Paper className={classes.content2} elevation={5}>
              <Button
                className={classNames(classes.button, classes.greenButton)}
                variant="contained"
                color="primary"
                onClick={() => {
                  this.importData();
                }}
                fullWidth
                disableRipple
                size="small"
              >
                Import
              </Button>
              <Button
                className={classNames(classes.button, classes.purpleButton)}
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log('Transfert');
                }}
                fullWidth
                disableRipple
                size="small"
              >
                Transfert
              </Button>
              <Button
                className={classNames(classes.button, classes.yellowButton)}
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log('Reprise Données');
                }}
                fullWidth
                disableRipple
                size="small"
              >
                Reprise Données
              </Button>
            </Paper>
          ) : null}
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(AppDrawer);
