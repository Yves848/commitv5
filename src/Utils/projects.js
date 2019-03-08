const fs = require('fs');
const path = require('path');
const moment = require('moment');
const versions = require('../../Modules/modules.json');
const aProject = require('../../Modules/projet.pj5.json');
const optionsPha = require('../../options_pha.json');

const aPays = Object.entries(versions).map(entry => {
  return entry[0];
});

const getImportModule = pays => {
  const aPays = Object.entries(versions).filter(version => {
    return version[0] === pays;
  });
  const aModulesPays = aPays[0][1];
  //console.log('getImportModule', aModulesPays.import)
  return (aModulesPays.import)
};

const getTransfertModule = pays => {
  const aPays = Object.entries(versions).filter(version => {
    return version[0] === pays;
  });
  const aModulesPays = aPays[0][1];
  //console.log('getTransfertModule', aModulesPays.transfert)
  return (aModulesPays.transfert)
};

const saveProject = (projet) => {
  //console.log('saveProject - projet',projet);
  const newProject = {...aProject, optionsPha: {...optionsPha}};
  const pays = projet.pays;
  const aImport = getImportModule(pays);
  const aTransfert = getTransfertModule(pays);
  //console.log('saveProject - newProject',newProject);
  //console.log('import ',aImport[projet.aImport])
  //console.log('aTransfert')
  newProject.informations_generales.date_creation = moment(new Date()).format();
  newProject.informations_generales.folder = projet.folder;
  newProject.informations_generales.pays = projet.pays;
  newProject.modules[0].import.nom = aImport[projet.aImport].nom;
  newProject.modules[1].transfert.nom = aTransfert[projet.aTransfert].nom;
  newProject.optionsPha.database = path.resolve(path.dirname(projet.name), 'PHA3.FDB');
  fs.writeFileSync(projet.name,JSON.stringify(newProject));
  return newProject
}

export {saveProject, aPays, getImportModule,getTransfertModule}