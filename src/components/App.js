import "../assets/css/App.css";
import React, { Component } from "react";
import MainView from "../hoc/MainWindow";


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      
      <MainView />
      
    );
     
  }
}

export default App;
