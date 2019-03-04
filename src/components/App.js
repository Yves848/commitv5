import '../assets/css/App.css';
import React, { Component } from 'react';
import MainView from '../hoc/MainWindow';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import { amber } from '@material-ui/core/colors';
import { lightGreen } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: red,
  },
  status: {
    danger: 'orange',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <MainView />
      </MuiThemeProvider>
    );
  }
}

export default App;
