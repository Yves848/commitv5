'use strict'

const utils = require('./utils');

const renvoyerTabParametres = (...params) => {
    return params
}

/*
  transformerPatient :
    Transformation de l'objet Firebird/Patient en Durnal/Patient avec génération de matricule & date de naissance valide
*/
function transformerPatient(o, clientTemplate) {
    try {
        const tmpl = {...clientTemplate}; //clonage de l objet
        Object.keys(o).map(
            att => {
                const attCS = utils.convertirCamelCase(att);
                if (Array.isArray(tmpl[attCS])) {
                    if (o[att]) {
                        tmpl[attCS] = eval(o[att].toString().replace("\\", "-"));
                    } else {
                        tmpl[attCS] = [];
                    }
                } else {
                    tmpl[attCS] = o[att];
                }
            }
        )

        // TODO Flag à positionner pour lancer (ou pas) ces traitemens
        // specif pour le test
        //tmpl.matricule = utils.genererMatriculeLux()
        //tmpl.dateNaissance = new Date(tmpl.matricule.substr(0, 4) + '-' + tmpl.matricule.substr(4, 2) + '-' + tmpl.matricule.substr(6, 2))
        return tmpl;
        } catch (e) {
            log.message(e.message);
        }
}

/*
  transformerFournisseur :
    On ne prend que le matricule/idDurnal
*/
const transformerFournisseur = (o) => {
    return renvoyerTabParametres(o.supplierId, o.cefipId);
}

/*
  transformerPraticien :
    On ne prend que le matricule/idDurnal
*/
const transformerPraticien = (o) => {
    return o.identifiers.map( m => renvoyerTabParametres(o.id, m.value) )[0];
}

module.exports = {
    transformerPraticien,
    transformerPatient,
    transformerFournisseur }
