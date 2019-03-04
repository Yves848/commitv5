import '../assets/css/App.css';
import React, { Component } from 'react';
import MainView from '../hoc/MainWindow';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

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
