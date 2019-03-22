'use strict';
console.log("officine2 **")
const util = global.require('util');
const promise = global.require('bluebird');
const oledb = global.require('node-adodb');
const path = require('path')

//promise.promisifyAll(oledb);

const importOfficine2 = require('./import_officine2');
const officine2 = require('./officine2.json');

const chaineConnexion = 'Provider=VFPOLEDB.1;Data Source=%s;Password="";Collating Sequence=MACHINE';
console.log('ici', chaineConnexion)
const executer = async (options) => {
    console.log(options)
    try {
        // Connexion Officine2
        process.stdout.write(`${new Date().toISOString()} Connexion à la BD d'Officine2 en cours...`);

        const off2 = oledb.open(util.format(chaineConnexion, options.commit.repertoire));
        promise.promisifyAll(off2);
        process.stdout.write("OK :)\n");
        
        for (const d of officine2) {
            await importOfficine2.importer(off2, d, options);
        }
    } catch(e) {
        console.log(`Erreur lors de l'import, arrêt du processus : ${e.message}`);
        process.exit(1);
    }
}

module.exports = { executer };
