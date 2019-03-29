const { app, BrowserWindow, ipcMain } = require('electron');
const { projet } = require('./project');
class databaseListener {
  constructor(options, updateStatus) {
    this.options = { ...options };
    this.projet = {};
    this.updateStatus = updateStatus;
    ipcMain.on('database-create', (event, args) => {
      this.projet = new projet(this.updateStatus);
      
    });
  }
}

module.exports(databaseListener);
