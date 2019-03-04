import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MenuAppBar from "../components/Menu/AppBar";
import AppDrawer from "../components/Menu/AppDrawer";
import { CssBaseline } from "@material-ui/core";
const { dialog } = require("electron").remote;

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 8,
  },
  toolbar: theme.mixins.toolbar
});

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false
    };
  }

  handleDrawerOpen = () => {
    const { isDrawerOpen } = this.state;
    console.log("ManWindow - handleDrawerOpen => isDrawerOpen ", isDrawerOpen);
    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <MenuAppBar handleDrawerOpen={this.handleDrawerOpen} />

        <AppDrawer
          isOpen={this.state.isDrawerOpen}
          handleDrawer={this.handleDrawerOpen}
        />
        <main className={classes.content}>
          <div className={classes.toolbar}>

          </div>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(MainView);
