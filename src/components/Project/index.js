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
     if (this.props.projet && prevprops.projet !== this.props.projet) {
      console.log('prevprops',prevprops)
      console.log('this.props.projet',this.props.projet)

      return true;
     }
     
  }
  render() {
   const {projet, classes} = this.props;
   if (projet && projet.project) {
      //console.log(projet.project)
      console.log(projet.getModuleGroups());
   }
   

    return (
      <Paper className={classes.root}>
        <h1>Projet</h1>
        {projet && <h1>{projet.project.informations_generales.folder}</h1>}
      </Paper>
    );
  }
}

export default withStyles(styles)(Projet);
