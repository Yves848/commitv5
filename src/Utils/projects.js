const fs = require('fs');
const path = require('path');
const moment = require('moment');
const versions = require('../../Modules/modules.json');
const aProject = require('../../Modules/projet.pj5.json');

const aPays = Object.entries(versions).map(entry => {
  return entry[0];
});

const getImportModule = pays => {
  const aPays = Object.entries(versions).filter(version => {
    return version[0] === pays;
  });
  return aPays[0][1];
};

const saveProject = (projet) => {
  const newProject = {...aProject};

  newProject.informations_generales.date_creation = moment(new Date()).format();

  fs.writeFileSync(projet.name,JSON.stringify(newProject));
  
}

export {saveProject, aPays, getImportModule}