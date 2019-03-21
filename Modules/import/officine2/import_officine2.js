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
        if (item.traitements != "" && fs.existsSync(`${path.resolve(__dirname)}/${item.traitements}`)) {
            let pha;
            try {
                pha = await baseLocale.connecter(optionsPha);
                // Suppression des clients
                process.stdout.write(`${new Date().toISOString()} *** Suppression des ${item.libelleGroupe} ...`);
                baseLocale.executerPS(pha, item.procedureSuppression);
                process.stdout.write(" OK ! ***\n");
                // TODO Ajouter Question Y/N importer/transfèrer
                for(const t of require(`./${item.traitements}`)) {
                    console.log(new Date().toISOString(), `*** Import ${t.libelle} ***`);
                    try {
                        const sql = `${path.resolve(__dirname)}/sql/${t.sqlSelect}`;
                        if (fs.existsSync(sql)) {
                            // Création du log
                            const r = /\.[^/.]+$/;
                            const nfs = t.sqlSelect.match(r);
                            const logger = log.creerLog(`${options.commit.repertoire}\\${nfs.length > 0 ? t.sqlSelect.replace(nfs[0], "") : t.sqlSelect}.log`);
                            const res = await off2.query(fs.readFileSync(`${path.resolve(__dirname)}/sql/${t.sqlSelect}`).toString());
                            await importDonnees.importerDonnees(res.result[0], pha, t.sqlInsert, logger);
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
