import React, { Component } from 'react';
import { projet } from '../../classes/project';
import ModGroups from './ModGroups';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Projet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleDetails: null,
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({
      value: index,
    });
  };

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
    const { aProjet, classes, theme } = this.props;
    const { moduleDetails } = this.state;
    let tabs;
    let tabDetails;
    //console.log(moduleDetails);
    if (moduleDetails) {
      tabs = Object.keys(moduleDetails).map((detail, index) => {
        return <Tab label={detail} key={index}/>;
      });
      tabDetails = Object.keys(moduleDetails).map((detail, index) => {
        return (
          <TabContainer dir={theme.direction} key={index}>
            <ModGroups moduleDetails={moduleDetails[detail]} />
          </TabContainer>
        );
      });
    }
    return (
      moduleDetails && (
        <div className={classes.content}>
          <AppBar position="sticky" color="default">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              {tabs}
            </Tabs>
          </AppBar>

          <SwipeableViews axis="x" index={this.state.value} onChangeIndex={this.handleChangeIndex}>
            {tabDetails}
          </SwipeableViews>
        </div>
      )
    );
  }
}

export default withStyles(styles, { withTheme: true })(Projet);
