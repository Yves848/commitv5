// serveur local bidon qui genere une fausse reponse durnal pour palier les serveurs durnal offline
// lancez via >node server.js
const express = require('express');
const serveIndex = require('serve-index');

let checkMatricule = require('./utils').checkMatricule
let guid = require('./utils').guid


let i = 1;
let total = 0;

const app = express();
app.use(express.json()); // decode le body de la requete hmtl

app.use((req, res, next) => {
    console.log(req.url, 'appel no #', i, ' avec ', req.body.length, 'enregistrements');
    total += req.body.length;
    console.log(' pour un total de :', total)
    i++;
    next();
});

app.post('/patients', (req, res, next) => {
    res.status('200').json(req.body.map(traiterReponse)

    );
});

app.use(express.static('.'));
app.use(serveIndex('.', {
    icons: true
}));


app.listen(8000, () => {
    console.log('******    server started on port 8000    ******')
});




let traiterReponse = (obj) => {
    let rObj = {};
    // etoffer cette partie avec quelques autres cas

    rObj["idOrigin"] = obj.idClient;

    if (checkMatricule(obj.matricule)) {
        rObj["idDurnal"] = guid();
        rObj["codeErreur"] = ''
        rObj["messageErreur"] = '';
    } else {
        rObj["idDurnal"] = null;
        rObj["codeErreur"] = 'PATIENT.PATIENT_DETAILS.ERROR_MESSAGES.PATIENT_IDENTIFIER_BAD_FORMAT';
        rObj["messageErreur"] =  obj.matricule;
    }

    return rObj;
}
