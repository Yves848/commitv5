'use strict'

const fs = require('fs');
const path = require('path');
const dt = require('date-and-time');
const promise = require('bluebird');
const childProcess = require('child_process');
const firebird = require('node-firebird-dev');

promise.promisifyAll(firebird);

const C_CHEMIN_BASE = path.resolve(__dirname);
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

const executerScript = (utilisateur, motDePasse, sql, db) => {
    let p = ['-u', utilisateur, '-p', motDePasse];
    if (db) {
        p.push(db);
    }
    Array.prototype.push.apply(p, ['-i', sql]);
    const stout = childProcess.execFileSync(`${C_CHEMIN_BASE}\\fb3\\isql.exe`, p);
    console.log(new Date().toISOString(), `Execution du script ${sql} : ${stout.stderr == undefined ? 'Ok :)' : stout.stderr}`);
}

const executerScriptsRepertoire = (db, utilisateur, motDePasse, repertoire) => {
    if (repertoire && verifierRepExiste(repertoire)) {
        fs.readdirSync(repertoire).forEach(file => {
            const sql = repertoire + "\\" + file;
            if (!fs.statSync(sql).isDirectory()) {
                executerScript(utilisateur, motDePasse, sql, db);
            }
        })
    }
}

const executerScripts = options => {
    try {
        const cheminDb = options.database;
        executerScriptsRepertoire(cheminDb, options.user, options.password, C_CHEMIN_BASE_SCRIPT_SQL);
        if (options.commit.pays) executerScriptsRepertoire(cheminDb, options.user, options.password, `${C_CHEMIN_BASE_SCRIPT_SQL}\\${options.commit.pays}`);
        if (options.commit.import) executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\import\\${options.commit.import}\\${options.commit.import}.sql`, cheminDb);
        if (options.commit.transfert) executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\transfert\\${options.commit.transfert}\\${options.commit.transfert}.sql`, cheminDb);
    } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de l'exécution des scripts: ${e}`)
    }
}

const creer = async options => {
    try {
        // Création de la base locale
        process.stdout.write('Création de la base locale en cours...');
        const db = await firebird.createAsync(options);
        process.stdout.write('OK :)\n');
        db.detach();
        
        // Exécution des scripts        
        executerScripts(options);
    } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de la création de la base locale  : ${e.message}`);
        process.exit(1);
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