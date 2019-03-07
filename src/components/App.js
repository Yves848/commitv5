import '../assets/css/App.css';
import React, { Component } from 'react';
import MainView from '../hoc/MainWindow';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors'
import { amber } from '@material-ui/core/colors';
import { deepPurple } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: indigo,
    secondary: amber,
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
