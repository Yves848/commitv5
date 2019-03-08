'use strict'

const path = require('path');
const colors = require('colors');

const transfertDurnal = require('./transfert_durnal');
const durnal = require('./durnal.json');

const executer = async (options) => {

    // TODO Ajouter lancement serveur Durnal Mock
    try {
        for (const d of durnal) {
            try {
                await transfertDurnal.transferer(d, options);
            } catch(e) {
                console.error(colors.red(`Erreur lors du traitement ${d.libelleGroupe} : ${e.message}`));
            }
        }
    } catch(e) {
        console.log(`Erreur lors du transfert, arrêt du processus : ${e.message}`);
        process.exit(1);
    }
}

module.exports = { executer };
