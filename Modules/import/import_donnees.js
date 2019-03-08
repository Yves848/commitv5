'use strict'

const colors = require('colors');

const baseLocale = require('../../base_locale');
const parseArgs = require('minimist');

const importerDonnees = async (donnees, pha, sqlInsert, logger) => {

    let nbDonneesLues = 0;
    let nbDonneesEnErreur = 0;

    let tr = await baseLocale.preparerPS(pha);
    for(const d of donnees)  {
        if (nbDonneesLues % 2500 === 0 && tr) {
            await tr.commitAsync();
            process.stdout.write(`${colors.red(nbDonneesEnErreur)}/${colors.green(nbDonneesLues - nbDonneesEnErreur)}/${nbDonneesLues}...`);
            tr = await baseLocale.preparerPS(pha);
        }

        nbDonneesLues++;
        try {
            await baseLocale.executerPS(tr, sqlInsert, d);
        } catch (e) {
            nbDonneesEnErreur++;
            logger.error(e.message, d);
        }
    }

    await tr.commitAsync();
    console.log(`${colors.red(nbDonneesEnErreur)}/${colors.green(nbDonneesLues - nbDonneesEnErreur)}/${nbDonneesLues}...\n${colors.red(nbDonneesEnErreur + ' erreurs')}`);
}

module.exports = {
    importerDonnees
};
