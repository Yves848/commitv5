const fs = require('fs');
const path = require('path');
const moment = require('moment');
const versions = require('../../Modules/modules.json');

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
  console.log('saveProject',projet)
  const newProject = {
    "informations_generales": {
      "pays": "BE",
      "date_creation": moment(new Date()).format(),
      "module_en_cours": "0",
      "page_en_cours": "0",
      "date_conversion": ""
    },
    "modules": [{
      "import": {
        "nom": "Officinnall",
        "date": "",
        "version": "",
        "mode": "0",
        "resultats":[
          
        ]
      }
    }]
  }
  console.log(newProject)
}

export {saveProject, aPays, getImportModule}