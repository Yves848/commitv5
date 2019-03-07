'use strict'

const fs = require('fs');
const winston = require('winston');
const parseArgs = require('minimist');

const args = parseArgs(process.argv.slice(2));

const creerLog = (nf) => {
    if (fs.existsSync(nf)) {
        fs.unlinkSync(nf);
    }

    return winston.createLogger(
        {
            format : winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports : 
                [ 
                    new winston.transports.File(
                        {
                            filename : nf
                        }
                    ) 
                ]
        }
    )
}

module.exports = { creerLog }