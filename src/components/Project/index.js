import React, { Component } from 'react';
import { projet } from '../../classes/project';
import ModGroups from './ModGroups';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Projet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleDetails: null,
    };
  }

  componentDidUpdate(prevprops) {
    if (this.props.aProjet && prevprops.aProjet !== this.props.aProjet) {
      const moduleDetails = this.props.aProjet.modulesDetails;
      this.setState({
        moduleDetails,
      });
      return true;
    }
  }
  render() {
    const { aProjet, classes } = this.props;
    const { moduleDetails } = this.state;

    return (
      moduleDetails &&
      <Paper className={classes.root}>
        <h1>Projet</h1>
        {aProjet && <h1>{aProjet.project.informations_generales.folder}</h1>}
        <ModGroups modulesDetails={moduleDetails} />
      </Paper>
    );
  }
}

export default withStyles(styles)(Projet);
