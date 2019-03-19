const fs = require('fs');
const path = require('path');
const moment = require('moment');
const versions = require('../../Modules/modules.json');
const aProjet = require('../../Modules/projet.pj5.json');
const optionsPha = require('../../options_pha.json');
import { asyncForEach } from './utils';

const INITIAL_STATE = {
  ...aProjet,
  optionsPha: {
    ...optionsPha,
  },
};

class projet {
  constructor() {
    this.project = { ...INITIAL_STATE };
  }

  async saveProject(projet) {
    const { project } = this;
    const pays = projet.pays;
    const aImport = projetConstants.getImportModule(pays);
    const aTransfert = projetConstants.getTransfertModule(pays);
    project.informations_generales.date_creation = moment(new Date()).format();
    project.informations_generales.folder = projet.folder;
    project.informations_generales.pays = projet.pays;
    project.modules[0].import.nom = aImport[projet.aImport].nom;
    project.modules[1].transfert.nom = aTransfert[projet.aTransfert].nom;
    project.optionsPha.database = path.resolve(path.dirname(projet.name), 'PHA3.FDB');
    fs.writeFileSync(projet.name, JSON.stringify(project));
    this.modulesDetails = await this.getModulesDetails();
  }

  async loadProject(file) {
    console.log(file);

    this.project = JSON.parse(fs.readFileSync(file));

    this.modulesDetails = await this.getModulesDetails();
    
  }

  async getModulesDetails() {
    return new Promise(async (resolve, reject) => {
      const { project } = this;
      const moduleImport = project.modules[0].import.nom;
      const moduleDefFile = path.resolve(`./modules/import/${moduleImport}/${moduleImport}.json`);
      const moduleGroups = global.require(moduleDefFile);

      const modulesDetails = new Array();

      await asyncForEach(moduleGroups, (module, index) => {
        const traitements = global.require(path.resolve(`./modules/import/${moduleImport}/${module.traitements}`));
        //console.log('traitements', traitements);
        modulesDetails[module.libelleGroupe] = traitements;
      });
      resolve(modulesDetails);
    });
  }

  get projet() {
    return this.project;
  }

  set pays(value) {
    this.project.informations_generales.pays = value;
  }

  set moduleImport(value) {
    const modules = projetConstants.getImportModule(this.project.informations_generales.pays);
    console.log(modules);
    this.project.modules['import'] = modules[value].nom;
  }

  set moduleTransfert(value) {
    const modules = projetConstants.getTransfertModule(this.project.informations_generales.pays);
    this.project.modules['transfert'] = modules[value].nom;
  }
}

class projetConstants {
  static pays = Object.entries(versions).map(entry => {
    return entry[0];
  });

  static getImportModule = pays => {
    const aPays = Object.entries(versions).filter(version => {
      return version[0] === pays;
    });
    const aModulesPays = aPays[0][1];
    return aModulesPays.import;
  };

  static getTransfertModule = pays => {
    const aPays = Object.entries(versions).filter(version => {
      return version[0] === pays;
    });
    const aModulesPays = aPays[0][1];
    return aModulesPays.transfert;
  };
}

export { projet, projetConstants };
