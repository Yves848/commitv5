'use strict'
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const optionsPha = require('../../../options_pha')
const baseLocale = require('../../../base_locale');
const log = require('../../../logger');
const importDonnees = require('../import_donnees');


const importer = async (off2, item, options) => {
    if (off2) {
        const fileName = path.resolve(__dirname,item.traitements);
        //console.log('fileName',fileName)
        if (item.traitements != "" && fs.existsSync(fileName)) {
            let pha;
            try {
                pha = await baseLocale.connecter(optionsPha);
                // Suppression des clients
                //console.log('pha',pha)
                process.stdout.write(`${new Date().toISOString()} *** Suppression des ${item.libelleGroupe} ...`);
                console.log(`${new Date().toISOString()} *** Suppression des ${item.libelleGroupe} ...`);
                baseLocale.executerPS(pha, item.procedureSuppression);
                process.stdout.write(" OK ! ***\n");
                // TODO Ajouter Question Y/N importer/transfèrer
                for(const t of require(`./${item.traitements}`)) {
                    console.log(new Date().toISOString(), `*** Import ${t.libelle} ***`);
                    try {
                        const sql = `${path.resolve(__dirname)}/sql/${t.sqlSelect}`;
                        console.log('sql',sql)
                        if (fs.existsSync(sql)) {
                            console.log('sql',sql)
                            // Création du log
                            const r = /\.[^/.]+$/;
                            //console.log('r',r)
                            const nfs = t.sqlSelect.match(r);
                            //console.log('nfs',nfs)
                            const logger = log.creerLog(`${options.commit.repertoire}\\${nfs.length > 0 ? t.sqlSelect.replace(nfs[0], "") : t.sqlSelect}.log`);
                            //const res = await off2.query(fs.readFileSync(`${path.resolve(__dirname)}/sql/${t.sqlSelect}`).toString());
                            //console.log('logger',logger)
                            const sqlScript = fs.readFileSync(`${path.resolve(__dirname)}/sql/${t.sqlSelect}`).toString();
                            //console.log('sqlScript',sqlScript);
                            let res;
                            try {
                                res = await off2.query(sqlScript);    
                                //console.log('res',res)
                            } catch (error) {
                                console.log('error',error)
                                res = null
                            }
                            
                            console.log('res',res)
                            await importDonnees.importerDonnees(res, pha, t.sqlInsert, logger);
                        } else {
                            console.log(new Date().toISOString(), colors.red(`Le fichier ${sql} n'existe pas !`));
                        }
                    } catch (e) {
                        console.log(new Date().toISOString(), colors.red(e.message));
                    }
                }
            } finally {
                await baseLocale.deconnecter(pha);
            }
        } else {
            console.log(new Date().toISOString(), colors.red(`${item.libelleGroupe} : pas de traitement défini ou fichier de traitement introuvable !`));
        }
    } else {
        console.log(new Date().toISOString(), 'Import des données officine2 impossible, pas de connexion à la base locale et/ou Officine2 !');
    }
}

module.exports = { importer }
