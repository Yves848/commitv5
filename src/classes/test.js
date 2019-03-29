const firebird = require('node-firebird');
const path = require('path');
const moment = require('moment');

class TestDB {
  constructor(folder) {
    this.options = {
      host: 'localhost',
      database: path.resolve(folder),
      user: 'SYSDBA',
      password: 'masterkey',
      port: 3050,
      lowercase_keys: false,
      role: null,
      pageSize: 4096,
    };
  }

  async getGlients() {
    return new Promise((resolve, reject) => {
      this.db.query('select * from t_client', (err, res) => {
        resolve(res);
      });
    });
  }

  async connectDb() {
    return new Promise((resolve, reject) => {
      firebird.attach(this.options, (err, db) => {
        resolve(db);
      });
    });
  }

  async insertData() {
    return new Promise((resolve, reject) => {
      this.db.execute(
        `insert into t_client 
        (
          matricule,
          nom,
          prenom,
          nom_jeune_fille,
          date_naissance,
          rang_gemellaire,
          langue,
          sexe,
          maison,
          etage,
          chambre,
          lit,
          commentaire_individuel,
          commentaire_global,
          t_profil_remise_id,
          t_personne_referente_id,
          facturation
          ) values (
            
            '000233532',
            'NAME',
            'NAME2',
            'NAME3',
            '19700504',
            1,
            'FR',
            'M',
            '',
            '',
            '',
            '',
            '',
            '',
            1,
            1,
            '1'  
          )`,
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  }

  async launchTest() {
    return new Promise(async (resolve, reject) => {
      try {
        this.db = await this.connectDb();
        console.log(this.db);
        let rows = await this.getGlients();
        console.log(rows);
  
        //const res = await this.insertData();
        //console.log(res);
        resolve (rows)
      } catch (error) {
        reject(error);
      }

    })
    
  }
}

module.exports = TestDB;
