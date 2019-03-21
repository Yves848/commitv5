const fs = require('fs');
const path = require('path');
const dt = require('date-and-time');
const promise = require('bluebird');
const childProcess = require('child_process');
const firebird = require('node-firebird-dev');
const {asyncForEach} = require('./utils');

const C_CHEMIN_BASE = path.resolve(path.resolve('./'));
const C_CHEMIN_BASE_SCRIPT_SQL = `${C_CHEMIN_BASE}\\sql`;

class baseLocale  {
    constructor(options, updateStatus) {
        this.options ={...options};
        this.updateStatus = updateStatus;
        this.db = null;
    }

    async createDatabase() {
        return new Promise((resolve,reject) => {
            firebird.create(this.options,(err,db) => {
                if (err) {
                    reject(err);
                };
                if (db) {
                    resolve(db);
                }
            });
        });
    }

    verifierRepExiste(r){
        try {
            fs.statSync(r);
            return true;
        } catch (e) {
            console.log(new Date().toISOString(), `Le répertoire ${r} n'existe pas !`);
        }
    }

    async executerScript(utilisateur, motDePasse, sql, db) {
        let p = ['-u', utilisateur, '-p', motDePasse];
        if (db) {
            p.push(db);
        }
        Array.prototype.push.apply(p, ['-i', sql]);
        this.updateStatus(sql)
        const stout = childProcess.execFileSync(`${C_CHEMIN_BASE}\\fb\\isql.exe`, p);
    }

    async executerScriptsRepertoire(db, utilisateur, motDePasse, repertoire) {
        return new Promise(async (resolve, reject) => {
            if (repertoire && this.verifierRepExiste(repertoire)) {
                const files = fs.readdirSync(repertoire);
                await asyncForEach(files, async (file, index) => {
                    const sql = repertoire + "\\" + file;
                    if (!fs.statSync(sql).isDirectory()) {
                        await this.executerScript(utilisateur, motDePasse, sql, db);
                    }
                })
                resolve();
            }
        })
        
    }

    async executerScripts() {
        return new Promise(async (resolve, reject) => {
            const {options} = this;
            try {
                const cheminDb = options.database;
                console.log('executerScripts - options',options)
                console.log('executerScripts - cheminDb',cheminDb)
                console.log('executerScripts - C_CHEMIN_BASE_SCRIPT_SQL',C_CHEMIN_BASE_SCRIPT_SQL)
                await this.executerScriptsRepertoire(cheminDb, options.user, options.password, C_CHEMIN_BASE_SCRIPT_SQL);
                if (options.commit.pays) this.executerScriptsRepertoire(cheminDb, options.user, options.password, `${C_CHEMIN_BASE_SCRIPT_SQL}\\${options.commit.pays}`);
                if (options.commit.import) this.executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\import\\${options.commit.import}\\${options.commit.import}.sql`, cheminDb);
                if (options.commit.transfert) this.executerScript(options.user, options.password, `${C_CHEMIN_BASE}\\modules\\transfert\\${options.commit.transfert}\\${options.commit.transfert}.sql`, cheminDb);
                resolve();
            } catch (e) {
                console.log(new Date().toISOString(), `Erreur lors de l'exécution des scripts: ${e}`)
                reject(e);
            }
        })
        
    }

    async creerDB() {
        return new Promise(async (resolve, reject) => {
            this.db = await this.createDatabase();
            await this.executerScripts();
            resolve();
        });
    }

    async fermer() {
        this.db.detach();
    }

    async preparerPS() {
        const {db} = this;
        try {
            const tr = await db.transactionAsync(firebird.ISOLATION_READ_COMMITED);
            promise.promisifyAll(tr);
            return tr;
        } catch (e) {
            console.log(new Date().toISOString(), e.message);
        }
    }

    validerDate(date, format) {
        let result;
        try {
            result = dt.parse(date, format);
        } catch(error) {
            result = undefined;
        }
        return result;
    }

    async executerPS(db, procedure, parametres) {

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

    async connecter() {
        const {options, db} = this;
        try {
            process.stdout.write(`${new Date().toISOString()} Connexion à la base locale en cours...`);
            db = await firebird.attachAsync(options);
            promise.promisifyAll(db);
    
            db.onAsync('error', function(err) {
                console.error(new Date().toISOString(), 'Oh Oh Oh, erreur de base de données (PHA) non catchée ! ', err)
            });
    
            process.stdout.write('OK :)\n');
    
            //return db;
        } catch (e) {
            console.log(new Date().toISOString(), `Erreur lors de la connexion à la base locale : ${e.message}`);
            process.exit(1);
        }
    }

    async deconnecter() {
        const {db} = this;
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
}

export {baseLocale}