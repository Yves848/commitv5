const path = require('path');
const { promisify } = require('util');
const Mp3File = require('./src/Classes/mp3filetest');

var fs = require("fs");

const pathmp3 = path.resolve('./mp3');

console.clear();
console.log(pathmp3);

async function getFiles() {
    return new Promise((resolve) => {
        fs.readdir(pathmp3, (err,files) => {
            resolve(files);
        })
    })
    
}



console.error('DEJA FINI')



process.stdout.write('\n');
//console.log(getTags(files[2]));
//let tag = getTags(files[2]);
//console.log(tag);
