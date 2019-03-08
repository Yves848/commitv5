'use strict'

const util = require('util');
const promise = require('bluebird');

const executer = async (pha, cheminProjet) => {
    try {
    
    } catch(e) {
        console.log("Erreur lors de l'import, arrêt du processus : ", e.message);
        process.exit(1);
    }
}

module.exports = { executer };
