'use strict'

require('enum').register();

const fs = require('fs');
const parseArgs = require('minimist');
const colors = require('colors');

const optionsPha = require('./options_pha');
const baseLocale = require('./base_locale');

const ETypeModule = new Enum({'IMPORT':'import', 'TRANSFERT':'transfert'});

const C_LOG_SEPARATION = "********************************************";

const chargerModule = async (typeModule, module) => {
    if (typeModule && module && module.length !== 0) {
        try {
            return require(`./modules/${typeModule.value}/${module}/${module}`);
        } catch (e) {
            console.log(new Date().toISOString(), `Erreur lors du chargement du module: ${e.message}`);
            console.log(new Date().toISOString(), e.stack);
        }
    } else {
        console.log(new Date().toISOString(), colors.red("Type de module non-spécifié ou module non-spécifié !"));
    }
}

const creerProjet = async(repertoire, pays, mdoule_import, module_transfert, chaine_connexion) => {

    const prj =
        {
            "pays" : pays,
            "import" :
            {
                "module" : mdoule_import
            },
            "transfert" : {
                "module" : module_transfert,
                "url" : chaine_connexion
            }
        };

    fs.writeFileSync(`${repertoire}\\commit.prj`, JSON.stringify(prj));
}

const executer = async () => {

    optionsPha.commit = parseArgs(process.argv.slice(2));

    if (process.argv.length === 2 || optionsPha.commit.usage) {
        console.log(fs.readFileSync("./README.md", 'UTF8'));
    } else {
        // Création/Connexion base locale
        const cheminBaseLocale = optionsPha.commit["repertoire"];

        if (baseLocale.verifierFirebird()) {
            if (cheminBaseLocale && baseLocale.verifierRepExiste(cheminBaseLocale)) {

                optionsPha.database = cheminBaseLocale + '\\' + optionsPha.database;

                if (optionsPha.commit["creation"]) {
                    console.log(colors.yellow(`${C_LOG_SEPARATION}\n***         CREATION BASE LOCALE         ***\n${C_LOG_SEPARATION}`));

                    await baseLocale.creer(optionsPha);
                    creerProjet(
                        optionsPha.commit["repertoire"],
                        optionsPha.commit["pays"],
                        optionsPha.commit["import"],
                        optionsPha.commit["transfert"],
                        optionsPha.commit["chaine_connexion"]);
                } else {
                    optionsPha.commit.projet = JSON.parse(fs.readFileSync(`${optionsPha.commit.repertoire}\\commit.prj`));

                    // Import des données
                    if (optionsPha.commit["import"] || (!optionsPha.commit.hasOwnProperty("import") && !optionsPha.commit.hasOwnProperty("transfert"))) {
                        console.log(colors.yellow(`${C_LOG_SEPARATION}\n***         IMPORT DES DONNEES           ***\n${C_LOG_SEPARATION}`));

                        const moduleImport = await chargerModule(ETypeModule.IMPORT, optionsPha.commit.projet.import.module);
                        if (moduleImport) {
                            await moduleImport.executer(optionsPha);
                        }
                    }

                    // Transfert des données
                    if (optionsPha.commit["transfert"] || (!optionsPha.commit.hasOwnProperty("import") && !optionsPha.commit.hasOwnProperty("transfert"))) {
                        console.log(colors.yellow(`${C_LOG_SEPARATION}\n***        TRANSFERT DES DONNEES         ***\n${C_LOG_SEPARATION}`));

                        const moduleTransfert = await chargerModule(ETypeModule.TRANSFERT, optionsPha.commit.projet.transfert.module);
                        if (moduleTransfert) {
                            await moduleTransfert.executer(optionsPha);
                        }
                    }

                    console.log(colors.yellow(`${C_LOG_SEPARATION}\n***               FIN :)                 ***\n${C_LOG_SEPARATION}`));
                }
            } else {
                console.error(new Date().toISOString(), "Chemin inexistant ! Impossible de créer/connecter une base locale à cet emplacement :(");
            }
        } else {
            console.log(new Date().toISOString(), "Aucun serveur Firebird n'est démarré. Assurez-vous qu'un serveur Firebird 3/32 bits est en cours d'éxécution.");
        }
    }
}

(async () => {
    executer();
})();
