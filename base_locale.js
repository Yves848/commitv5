'use strict'

const fs = require('fs');
const path = require('path');
const dt = require('date-and-time');
const promise = require('bluebird');
const childProcess = require('child_process');
const firebird = require('node-firebird-dev');
const {asyncForEach} = require('./src/Classes/utils')
promise.promisifyAll(firebird);

const C_CHEMIN_BASE = path.resolve(path.resolve('./'));
const C_CHEMIN_BASE_SCRIPT_SQL = `${C_CHEMIN_BASE}\\sql`;

const verifierFirebird = async () => {
    return true;
}

const verifierRepExiste = r => {
    try {
        fs.statSync(r);
        return true;
    } catch (e) {
        console.log(new Date().toISOString(), `Le répertoire ${r} n'existe pas !`);
    }
}

const executerScript = async (utilisateur, motDePasse, sql, db, updateStatus) => {
    let p = ['-u', utilisateur, '-p', motDePasse];
    if (db) {
        p.push(db);
    }
    Array.prototype.push.apply(p, ['-i', sql]);
    //console.log(sql)
    updateStatus(sql)
    const stout = childProcess.execFileSync(`${C_CHEMIN_BASE}\\fb\\isql.exe`, p);
//    console.log(new Date().toISOString(), `Execution du script ${sql} : ${stout.stderr == undefined ? 'Ok :)' : stout.stderr}`);
}

const executerScriptsRepertoire = async (db, utilisateur, motDePasse, repertoire, updateStatus) => {
    return new Promise(async (resolve, reject) => {
        if (repertoire && verifierRepExiste(repertoire)) {
            //console.log('executerScriptsRepertoire - repertoire', repertoire)
            const files = fs.readdirSync(repertoire);
            await asyncForEach(files, async (file, index) => {
                const sql = repertoire + "\\" + file;
                //console.log('executerScriptsRepertoire - sql', sql)
                if (!fs.statSync(sql).isDirectory()) {
                    await executerScript(utilisateur, motDePasse, sql, db, updateStatus);
                }
            })
            resolve();
        }
    })
    
}

const executerScripts = async (options, updateStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cheminDb = options.database;
            console.log('executerScripts - options',options)
            console.log('executerScripts - cheminDb',cheminDb)
            console.log('executerScripts - C_CHEMIN_BASE_SCRIPT_SQL',C_CHEMIN_BASE_SCRIPT_SQL)
            await executerScriptsRepertoire(cheminDb, options.user, options.password, C_CHEMIN_BASE_SCRIPT_SQL, updateStatus);
            if (options.commit.pays) executerScriptsRepertoire(cheminDb, options.user, options.password, `${C_CHEMIN_BASE_SCRIPT_SQL}\\${options.commit.pays}`);
            if (options.commit.import) executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\import\\${options.commit.import}\\${options.commit.import}.sql`, cheminDb);
            if (options.commit.transfert) executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\transfert\\${options.commit.transfert}\\${options.commit.transfert}.sql`, cheminDb);
            resolve();
        } catch (e) {
            console.log(new Date().toISOString(), `Erreur lors de l'exécution des scripts: ${e}`)
            reject(e);
        }
    })
    
}

const creer = async (options, updateStatus) => {
    try {
        // Création de la base locale
        await updateStatus('Création de la base locale en cours...');
        const db = await firebird.createAsync(options);
        await updateStatus('Ok ! ;)');
        db.detach();
        
        // Exécution des scripts        
        await executerScripts(options, updateStatus);
    } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de la création de la base locale  : ${e.message}`);
        //process.exit(1);
    }
}

const preparerPS = async db => {

    try {
        const tr = await db.transactionAsync(firebird.ISOLATION_READ_COMMITED);
        promise.promisifyAll(tr);
        return tr;
    } catch (e) {
        console.log(new Date().toISOString(), e.message);
    }
}

const validerDate = (date, format) => {

    try {
        return dt.parse(date, format);
    } catch {
        return undefined;
    }
}

const executerPS = async (db, procedure, parametres) => {

    const nombreParametres = parametres ? Object.keys(parametres).length : 0;

    // Préparation paramètres
    const tabParametres = new Array(nombreParametres || 0);
    if (nombreParametres > 0) {
        const attributs = Object.keys(parametres);
        for (var i = 0; i < nombreParametres; i++) {
            const d = validerDate(parametres[attributs[i]], "DD/MM/YYYY HH:mm:ss");
            if (d) {
                tabParametres[i] = d;
            } else {
                tabParametres[i] = parametres[attributs[i]] !== "" ? parametres[attributs[i]] : null;
            }
        }
    }
    
    // Préparation requête
    const chaineParametres = nombreParametres > 0 ? "(" + new Array(nombreParametres).fill('?').join(', ') + ")" : "";

    // C'est parti !
    await db.queryAsync(`execute procedure ${procedure}${chaineParametres}`, tabParametres);        
}

const connecter = async options => {
    try {
        process.stdout.write(`${new Date().toISOString()} Connexion à la base locale en cours...`);
        const db = await firebird.attachAsync(options);
        promise.promisifyAll(db);

        db.onAsync('error', function(err) {
            console.error(new Date().toISOString(), 'Oh Oh Oh, erreur de base de données (PHA) non catchée ! ', err)
        });

        process.stdout.write('OK :)\n');

        return db;
    } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de la connexion à la base locale : ${e.message}`);
        process.exit(1);
    }
}

const deconnecter = async db => {

    if (db) {
        try {
            process.stdout.write(`${new Date().toISOString()} Déconnexion de la base locale en cours...`);
            await db.detachAsync();
            process.stdout.write('OK :)\n');
        } catch (e) {
            console.log(new Date().toISOString(), `Erreur lors de la déconnexion de la base locale : ${e.message}`);
            process.exit(1);
        }
    }
}

module.exports = {
    verifierFirebird,
    verifierRepExiste,
    creer,
    connecter,
    deconnecter,
    preparerPS,
    executerPS
};