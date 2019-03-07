import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const { ipcRenderer } = require('electron');
const drawerWidth = 150;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    padding : theme.spacing.unit
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  drawerPaper: {
    width: drawerWidth,
  },
  button: {
    marginBottom: '5px',
    

  },

  toolbar: theme.mixins.toolbar,
});

class AppDrawer extends Component {
  constructor(props) {
    super(props);

    ipcRenderer.on('openProject-return', (event, args) => {
      console.log(args);
    });
  }

  openProject = () => {
    const response = ipcRenderer.send('openProject');
    if (response) {
      console.log(response);
    }
  };

  createProject = () => {
    const response = ipcRenderer.send('createProject');
    if (response) {
      console.log(response);
    }
  };

  render() {
    const { isOpen, classes } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.content}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              this.createProject();
            }}
            fullWidth
            disableRipple
            size='small'
          >
            Créer projet
          </Button>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              this.openProject();
            }}
            fullWidth
            disableRipple
            size='small'
          >
            Ouvrir projet
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(AppDrawer);
