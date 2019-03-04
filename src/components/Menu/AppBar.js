import React, { Component } from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";


const styles = theme =>( {
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10
  }
});

class MenuAppBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      isDrawerOpen: false
    }
  }



  render() {
    const { classes } = this.props;
    return (

        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.props.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Commit V5
            </Typography>
          </Toolbar>
        </AppBar>


    );
  }
}

export default withStyles(styles)(MenuAppBar);
