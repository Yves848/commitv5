const fs = require('fs');
const path = require('path');
const dt = require('date-and-time');
const promise = require('bluebird');
const childProcess = require('child_process');
const firebird = require('node-firebird-dev');
const { asyncForEach } = require('./utils');

const C_CHEMIN_BASE = path.resolve(path.resolve('./'));
const C_CHEMIN_BASE_SCRIPT_SQL = `${C_CHEMIN_BASE}\\sql`;

class baseLocale {
  constructor(options, updateStatus) {
    this.options = { ...options };
    this.updateStatus = updateStatus;
    this.db = null;
  }

  async createDatabase() {
    return new Promise((resolve, reject) => {
      console.log('createDatabase');
      firebird.create(this.options, (err, db) => {
        if (err) {
          reject(err);
        }
        if (db) {
          resolve(db);
        }
      });
    });
  }

  verifierRepExiste(r) {
    try {
      fs.statSync(r);
      return true;
    } catch (e) {
      console.log(new Date().toISOString(), `Le répertoire ${r} n'existe pas !`);
    }
  }

  async executerScript(utilisateur, motDePasse, sql, db) {
    return new Promise((resolve, reject) => {
      let p = ['-u', utilisateur, '-p', motDePasse];
      if (db) {
        p.push(db);
      }
      Array.prototype.push.apply(p, ['-i', sql]);

      this.updateStatus(sql);
      console.log('executerScript', sql);
      try {
        const stout = childProcess.execFileSync(`${C_CHEMIN_BASE}\\fb\\isql.exe`, p);
        resolve();
      } catch (error) {
        console.log(error);
        reject(error)
      }

      //console.log(stout)
    });
  }

  async executerScriptsRepertoire(db, utilisateur, motDePasse, repertoire) {
    return new Promise(async (resolve, reject) => {
      if (repertoire && this.verifierRepExiste(repertoire)) {
        const files = fs.readdirSync(repertoire);
        await asyncForEach(files, async (file, index) => {
          const sql = repertoire + '\\' + file;
          //console.log('file',sql)
          if (!fs.statSync(sql).isDirectory()) {
            await this.executerScript(utilisateur, motDePasse, sql, db);
          }
        });
        resolve();
      }
    });
  }

  async executerScripts() {
    return new Promise(async (resolve, reject) => {
      const { options, commit } = this;
      try {
        const cheminDb = options.database;
        console.log('executerScripts - options', options);
        console.log('executerScripts - cheminDb', cheminDb);
        console.log('executerScripts - C_CHEMIN_BASE_SCRIPT_SQL', C_CHEMIN_BASE_SCRIPT_SQL);
        await this.executerScriptsRepertoire(cheminDb, options.user, options.password, C_CHEMIN_BASE_SCRIPT_SQL);
        console.log('commit', commit);
        if (commit.pays)
          await this.executerScriptsRepertoire(
            cheminDb,
            options.user,
            options.password,
            `${C_CHEMIN_BASE_SCRIPT_SQL}\\${commit.pays}`
          );

        if (commit.import) {
          console.log('options.commit.import', options.commit.import);
          await this.executerScript(
            options.user,
            options.password,
            `${C_CHEMIN_BASE}\\modules\\import\\${commit.import.nom}\\${commit.import.nom}.sql`,
            cheminDb
          );
        }
        if (commit.transfert)
        try {
          await this.executerScript(
            options.user,
            options.password,
            `${C_CHEMIN_BASE}\\modules\\transfert\\${options.commit.transfert}\\${options.commit.transfert}.sql`,
            cheminDb
          );
        } catch (error) {
          
        }
          
        resolve();
      } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de l'exécution des scripts: ${e}`);
        reject(e);
      }
    });
  }

  async creerDB() {
    return new Promise(async (resolve, reject) => {
      try {
        this.db = await this.createDatabase();
        console.log('la db est créée');
        //await this.executerScripts();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async connectDB() {
    const { options } = this;
    console.log('connectDB', options);
    return new Promise((resolve, reject) => {
      firebird.attach(options, (err, db) => {
        if (err) reject(err);
        resolve(db);
      });
    });
  }

  async connecter() {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.connectDB();

        db.on('error', function(err) {
          console.error(new Date().toISOString(), 'Oh Oh Oh, erreur de base de données (PHA) non catchée ! ', err);
        });
        resolve(db);

        //return db;
      } catch (e) {
        console.log(new Date().toISOString(), `Erreur lors de la connexion à la base locale : ${e.message}`);
        reject(e);
      }
    });
  }

  async fermer() {
    this.db.detach();
  }

  async preparerPS() {
    const { db } = this;
    return new Promise((resolve, reject) => {
      db.transaction(firebird.ISOLATION_READ_COMMITED, (err, transaction) => {
        if (err) reject(err);
        resolve(transaction);
      });
    });
  }

  validerDate(date, format) {
    let result;
    try {
      result = dt.parse(date, format);
    } catch (error) {
      result = undefined;
    }
    return result;
  }

  async executeQuery(query, parametres) {
    return new Promise((resolve, reject) => {
      const { db } = this;
      console.log('query', query, parametres);
      db.query(query, parametres, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  async executerPS(procedure, parametres) {
    return new Promise(async (resolve, reject) => {
      const nombreParametres = parametres ? Object.keys(parametres).length : 0;

    // Préparation paramètres
    const tabParametres = new Array(nombreParametres || 0);
    if (nombreParametres > 0) {
      const attributs = Object.keys(parametres);
      for (var i = 0; i < nombreParametres; i++) {
        const d = this.validerDate(parametres[attributs[i]], 'DD/MM/YYYY HH:mm:ss');
        if (d) {
          tabParametres[i] = d;
        } else {
          tabParametres[i] = parametres[attributs[i]] !== '' ? parametres[attributs[i]] : null;
        }
      }
    }

    // Préparation requête
    const chaineParametres = nombreParametres > 0 ? '(' + new Array(nombreParametres).fill('?').join(', ') + ')' : '';
    try {
      await this.executeQuery(`execute procedure ${procedure}${chaineParametres}`, tabParametres);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }

    //await db.queryAsync(`execute procedure ${procedure}${chaineParametres}`, tabParametres);
    })
    
  }

  async deconnecter() {
    const { db } = this;
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

export { baseLocale };
