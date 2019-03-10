const fs = require('fs');
const path = require('path');
const moment = require('moment');
const versions = require('../../Modules/modules.json');
const aProjet = require('../../Modules/projet.pj5.json');
const optionsPha = require('../../options_pha.json');

class projet {
  constructor() {
    this.project = {
      ...aProjet,
      optionsPha: {
        ...optionsPha
      }
    };
  }

  set pays(value) {
    this.project.informations_generales.pays = value;
  }

  set moduleImport(value) {
    const modules = projetConstants.getImportModule(this.project.informations_generales.pays);
    this.project.modules["import"] = modules[value].nom;
  }

  set moduleTransfert(value) {
    const modules = projetConstants.getTransfertModule(this.project.informations_generales.pays);
    this.project.modules["transfert"] = modules[value].nom;
  }

}

class projetConstants {
  static pays = Object.entries(versions).map(entry => {
    return entry[0];
  });

  static getImportModule = (pays) => {
    const aPays = Object.entries(versions).filter(version => {
      return version[0] === pays;
    });
    const aModulesPays = aPays[0][1];
    return (aModulesPays.import)
  };

  static getTransfertModule = pays => {
    const aPays = Object.entries(versions).filter(version => {
      return version[0] === pays;
    });
    const aModulesPays = aPays[0][1];
    return (aModulesPays.transfert)
  };

}

export {
  projet,
  projetConstants
}
