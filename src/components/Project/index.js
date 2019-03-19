import React, { Component } from 'react';
import { projet } from '../../classes/project';
import { withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
   root: {
      flexGrow: 1
   }
})

class Projet extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevprops) {
     if (this.props.aProjet && prevprops.aProjet !== this.props.aProjet) {
      console.log('prevprops',prevprops)
      console.log('this.props.projet',this.props.aProjet)

      return true;
     }
     
  }
  render() {
   const {aProjet, classes} = this.props;
   if (aProjet && aProjet.project) {
      console.log(aProjet)
      //console.log(projet.project.getModuleGroups());
   }
   

    return (
      <Paper className={classes.root}>
        <h1>Projet</h1>
        {aProjet && <h1>{aProjet.project.informations_generales.folder}</h1>}
      </Paper>
    );
  }
}

export default withStyles(styles)(Projet);
