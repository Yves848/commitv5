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
  content: {
    marginTop: theme.spacing.unit *2
  }
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
    console.log(aProjet)
    return (
      moduleDetails && (
        <div className={classes.content}>
          <Paper className={classes.root}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <h1>Projet : {aProjet.project.informations_generales.folder}</h1>
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.root} elevation={5}>
            <ModGroups modulesDetails={moduleDetails} />
          </Paper>
        </div>
      )
    );
  }
}

export default withStyles(styles)(Projet);
