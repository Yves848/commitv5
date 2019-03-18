require('enum').register();

const fs = require('fs');
const parseArgs = require('minimist');
const colors = require('colors');

const optionsPha = require('./options_pha');
const baseLocale = require('./base_locale');

const ETypeModule = new Enum({'IMPORT':'import', 'TRANSFERT':'transfert'});

const C_LOG_SEPARATION = "********************************************";

class commit {

}

export {commit};