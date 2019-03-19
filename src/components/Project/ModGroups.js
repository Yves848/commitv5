import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SyncIcon from '@material-ui/icons/Sync';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Buffer } from 'buffer';

const styles = theme => ({
  content: {
    flexGrow: 1,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  gridItem: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

class ModGroups extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevprops) {
    if (prevprops.modulesDetails !== this.props.modulesDetails) {
      return true;
    }
    return false;
  }

  render() {
    const { modulesDetails, classes } = this.props;

    let tableBody = null;
    const getDetails = detail => {
      const details = modulesDetails[detail];
      return details.map((detail, index) => {
        return (
          <Grid container direction="row" key={index} className={classes.content} justify='space-between' alignContent="flex-start" alignItems="flex-end">
            <Grid item xs={1}>
              <Button size="small" variant="contained">
                <SyncIcon />
              </Button>
            </Grid>
            <Grid item xs className={classes.gridItem} >
            
              {detail.libelle}
            
            </Grid>
            <Grid item xs={2} className={classes.gridItem}>
            
              <LinearProgress variant="determinate" value={0}/>
            </Grid>
          </Grid>
        );
      });
    };

    if (modulesDetails) {
      console.log('render', modulesDetails);
      tableBody = Object.keys(modulesDetails).map((detail, index) => {
        //console.log(modulesDetails[detail]);
        return (
          <TableRow key={index}>
            <TableCell>
              <Grid container>
                <Grid item>{detail}</Grid>
              </Grid>
            </TableCell>
            <TableCell>
              <Paper className={classes.content}>
                <Grid container direction="column" className={classes.content}>
                  {getDetails(detail)}
                </Grid>
              </Paper>
            </TableCell>
          </TableRow>
        );
      });
    }
    return modulesDetails ? (
      <Paper className={classes.root}>
        <Table width="100%">
          <TableHead>
            <TableRow>
              <TableCell width={15}>Groupes</TableCell>
              <TableCell width="100%">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableBody}</TableBody>
        </Table>
      </Paper>
    ) : (
      <div> Nope</div>
    );
  }
}

export default withStyles(styles)(ModGroups);
