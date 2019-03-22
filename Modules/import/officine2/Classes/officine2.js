const oledb = global.require('node-adodb');
const path = global.require('path');
const util = global.require('util');
const fs = global.require('fs');
const {asyncForEach} = require(path.resolve('./src/Classes/utils'));

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
    this.chaineConnexion = util.format(
      'Provider=VFPOLEDB.1;Data Source=%s;Password="";Collating Sequence=MACHINE',
      this.repertoire
    );

    this.off2 = oledb.open(this.chaineConnexion);
    console.log('[officine2 - constructor]', this.off2);
  }

  async importAll() {
    const {moduleDetails} = this;
    const modules = Object.keys(moduleDetails);
    await asyncForEach(modules,async (module,index) => {
      await this.importUnit(moduleDetails[module]);
    })
  }

  async getDataIn(sql) {
    return new Promise((resolve, reject) => {
      const {moduleFolder} = this;
      const script = fs.readFileSync(path.resolve(moduleFolder,sql)).toString();
      const {off2} = this;
      off2.query(script)
      .then(schema => {
        //console.log(JSON.stringify(schema));
        resolve(schema);
      })
    })
  }

  async importUnit(details) {
      const {globals} = this;
      const {baseLocale} = this;
      await this.baseLocale.executerPS(globals[0].procedureSuppression);
      
      const dataIn = await this.getDataIn(details[0].sqlSelect);
      const ps = details[0].sqlInsert;
      await baseLocale.executerPS(ps,dataIn[0]);

      /* await asyncForEach(dataIn,async (data,index) => {
        await baseLocale.executerPS(ps,data);
      }) */
  }

}

module.exports = { importModule };
