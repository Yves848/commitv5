const oledb = global.require('node-adodb');
const path = global.require('path');
const util = global.require('util');
const fs = global.require('fs');
const { asyncForEach } = require(path.resolve('./src/Classes/utils'));

class importModule {
  constructor(baseLocale, moduleDetails) {
    this.Name = 'officine2';
    this.baseLocale = baseLocale;
    this.moduleDetails = moduleDetails;
    this.repertoire = path.resolve(path.dirname(this.baseLocale.options.database), 'database');
    this.globals = global.require(path.resolve(`./modules/import/${this.Name}/officine2.json`));
    this.moduleFolder = path.resolve(`./modules/import/${this.Name}/sql/`);
    console.log('[officine2 - constructor]', this.baseLocale, this.moduleDetails);
    console.log('[officine2 - constructor]', this.repertoire);
    console.log('globals', this.globals);
    this.chaineConnexion = util.format(
      'Provider=VFPOLEDB.1;Data Source=%s;Password="";Collating Sequence=MACHINE',
      this.repertoire
    );

    this.off2 = oledb.open(this.chaineConnexion);
    console.log('[officine2 - constructor]', this.off2);
  }

  async importAll() {
    return new Promise(async (resolve, reject) => {
      const { moduleDetails } = this;
      const { globals } = this;
      const modules = Object.keys(moduleDetails);
      try {
        //await this.importUnit(moduleDetails[modules[0]]);
        console.log('importAll',moduleDetails)
        console.log('importAll',modules)
        await asyncForEach(modules, async (module, index) => {
          const details = moduleDetails[module];
          console.log('asyncForEach',details)
          await this.baseLocale.executerPS(globals[index].procedureSuppression);
          await asyncForEach(details, async (key) => {
            console.log('asyncForEach2', key);
            await this.importUnit(key,index);
          })
          
          
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getDataIn(sql) {
    return new Promise(async (resolve, reject) => {
      const { moduleFolder } = this;
      const script = fs.readFileSync(path.resolve(moduleFolder, sql)).toString();
      const { off2 } = this;
      console.log('getDataIn',script);
      off2.query(script).then(schema => {
        resolve(schema);
      }).catch(error => {
        reject(error);
      });
    });
  }

  async importUnit(details, index) {
    return new Promise(async (resolve, reject) => {
      
      const { baseLocale } = this;
      console.log('importUnit', details);
      
      try {
        const dataIn = await this.getDataIn(details.sqlSelect);
        console.log('dataIn', dataIn)
        const ps = details.sqlInsert;
        //await baseLocale.executerPS(ps, dataIn[0]);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = { importModule };
