const fs = require('fs');
const path = require('path');
const dt = require('date-and-time');
const promise = require('bluebird');
const childProcess = require('child_process');
const firebird = require('node-firebird-dev');
import {asyncForEach} from './utils';

class baseLocale  {
    constructor(options) {
        this.options ={...options};
        this.db = this.creer();
    }

    async creerDB() {
        return new Promise((resolve, reject) => {
            firebird.create(this.options,(err,db) => {
                if (err) {
                    reject(err);
                };
                if (res) {
                    resolve(db);
                }
            });
        });
    }

    async creer() {
        this.db = await creerDB();

    }

    async fermer() {
        this.db.detach();
    }


}

export {baseLocale}