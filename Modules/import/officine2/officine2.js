'use strict';
console.log("officine2 **")
const util = global.require('util');
const promise = global.require('bluebird');
const oledb = global.require('node-adodb');
//const oledb = global.require('oledb-electron');
const path = require('path')

//promise.promisifyAll(oledb);

const importOfficine2 = require('./import_officine2');
const officine2 = require('./officine2.json');



const executer = async (options) => {
    console.log(options)
    try {
        // Connexion Officine2
        process.stdout.write(`${new Date().toISOString()} Connexion à la BD d'Officine2 en cours...`);
        console.log('options',options)
        const chaineConnexion = util.format('Provider=VFPOLEDB.1;Data Source=%s;Password="";Collating Sequence=MACHINE', path.resolve('c:/commitv5/officine2/'));        
        console.log('chaineConnexion',chaineConnexion)
        
        //promise.promisifyAll(off2);
        process.stdout.write("OK :)\n");
        const off2 = oledb.open(chaineConnexion)
        console.log('off2', off2)
        for (const d of officine2) {
            await importOfficine2.importer(off2, d, options);
        }
    } catch(e) {
        console.log(`Erreur lors de l'import, arrêt du processus : ${e.message}`);
        process.exit(1);
    }
}

module.exports = { executer };
