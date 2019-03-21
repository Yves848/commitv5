import React, { Component } from 'react';
import classNames from 'classnames';
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

const styles = theme => ({
  content: {
    flexGrow: 1,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  button: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  grid: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  gridItem: {
    paddingRight: '3px',
  },
  colorSuccess: {
    backgroundColor: '#aeffae',
  },
  colorWarning: {
    backgroundColor: '#ffffb7',
  },
  colorError: {
    backgroundColor: '#ff8080',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignMiddle: {
    verticalAlign: 'middle',
  },
  roundedCorner: {
    borderRadius: '5px',
  },
  textBold: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  tableBorder: {
    borderColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 'thin',
  },
  tableBorderTop: {
    borderLeftColor: '#000000',
    borderLeftStyle: 'solid',
    borderLeftWidth: 'thin',
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    borderTopWidth: 'thin',
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    borderRightWidth: 'thin',
  },
  tableBorderDetail: {
    borderLeftColor: '#000000',
    borderLeftStyle: 'solid',
    borderLeftWidth: 'thin',
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    borderRightWidth: 'thin',
  },
  tableBorderBottom: {
    borderLeftColor: '#000000',
    borderLeftStyle: 'solid',
    borderLeftWidth: 'thin',
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    borderBottomWidth: 'thin',
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    borderRightWidth: 'thin',
  },
});

class ModGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleDetails: null,
      resultats: [],
    };
  }

  componentDidMount() {
    this.setState({
      moduleDetails: this.props.moduleDetails,
      resultats: this.props.resultats,
    });
  }

  componentDidUpdate(prevprops) {
    //console.log('didUpdate',this.props)
    if (prevprops.moduleDetails !== this.props.moduleDetails) {
      //console.log('didUpdate',this.props.resultats)
      this.setState({
        moduleDetails: this.props.moduleDetails,
        resultats: this.props.resultats,
      });
      return true;
    }
    return false;
  }

  add = (detail, result) => {
    //console.log(result.succes)
    result.succes++;
    const { resultats } = this.state;
    this.setState({
      resultats,
    });
  };

  render() {
    const { classes } = this.props;
    const { moduleDetails, resultats } = this.state;

    let tableBody = null;
    const getDetails = () => {
      return moduleDetails.map((detail, index) => {
        const resultat = resultats
          .filter(result => {
            return result[0] === detail.libelle;
          })
          .map(result => {
            return result[1];
          })[0];

        let border = classes.tableBorderDetail;
        if (index === 0) {
          border = classes.tableBorderTop;
        }
        if (index === moduleDetails.length - 1) {
          border = classes.tableBorderBottom;
        }

        return (
          <Grid
            className={classes.grid}
            container
            direction="row"
            key={index}
            justify="space-between"
            alignContent="flex-start"
            alignItems="stretch"
            className={border}
          >
            <Grid item xs={1} className={classNames(classes.gridItem, classes.button)}>
              <SyncIcon fontSize="small" onClick={() => this.add(detail, resultat)} className={classes.alignMiddle} />
            </Grid>
            <Grid item xs={6} className={classNames(classes.gridItem)}>
              <span className={classes.alignMiddle}>{detail.libelle}</span>
            </Grid>
            <Grid item xs={1} className={classNames(classes.gridItem, classes.colorSuccess, classes.alignRight)}>
              <span className={classes.alignMiddle}>{resultat.succes}</span>
            </Grid>
            <Grid item xs={1} className={classNames(classes.gridItem, classes.colorWarning, classes.alignRight)}>
              <span className={classes.alignMiddle}>{resultat.avertissements}</span>
            </Grid>
            <Grid item xs={1} className={classNames(classes.gridItem, classes.colorError, classes.alignRight)}>
              <div className={classNames(classes.colorError, classes.alignMiddle)}>{resultat.erreurs}</div>
            </Grid>
            <Grid item xs={1} className={classNames(classes.gridItem, classes.alignCenter)}>
            <span className={classes.alignMiddle}>{resultat.debut}</span>
            </Grid>
            <Grid item xs={1} className={classNames(classes.gridItem, classes.alignCenter)}>
            <span className={classes.alignMiddle}>{resultat.fin}</span>
            </Grid>
          </Grid>
        );
      });
    };

    if (moduleDetails) {
      tableBody = (
        <TableRow>
          <TableCell>
            <Paper className={classes.content}>
              <Grid container direction="column" alignItems="baseline">
                {getDetails()}
              </Grid>
            </Paper>
          </TableCell>
        </TableRow>
      );
    }

    return moduleDetails ? (
      <Paper className={classes.root}>
        <Table width="100%">
          <TableHead>
            <TableRow>
              <TableCell>
                <Grid container direction="row" alignContent="flex-start" alignItems="center">
                  <Grid item xs={1} className={classNames(classes.gridItem)} />
                  <Grid item xs={6} className={classNames(classes.gridItem)}>
                    Données
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={classNames(
                      classes.gridItem,
                      classes.colorSuccess,
                      classes.alignRight,
                      //classes.roundedCorner,
                      classes.textBold
                    )}
                  >
                    Succès
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={classNames(
                      classes.gridItem,
                      classes.colorWarning,
                      classes.alignRight,
                      //classes.roundedCorner,
                      classes.textBold
                    )}
                  >
                    Avert.
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={classNames(
                      classes.gridItem,
                      classes.colorError,
                      classes.alignRight,
                      //classes.roundedCorner,
                      classes.textBold
                    )}
                  >
                    Err.
                  </Grid>
                  <Grid item xs={1} className={classNames(classes.gridItem, classes.alignCenter, classes.textBold)}>
                    Début
                  </Grid>
                  <Grid item xs={1} className={classNames(classes.gridItem, classes.alignCenter, classes.textBold)}>
                    Fin
                  </Grid>
                </Grid>
              </TableCell>
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
