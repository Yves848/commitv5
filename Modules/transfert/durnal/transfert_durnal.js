'use strict'

// import modules
const fs = require('fs');
const path = require('path');
const async = require('async');
const axios = require('axios');
const colors = require('colors');
const optionsPha = require('../../../options_pha');
const baseLocale = require('../../../base_locale');
const log = require('../../../logger');
const utils = require('./utils');
const parseArgs = require('minimist');

const args = parseArgs(process.argv.slice(2));

const EMethodeDurnal = new Enum( [ 'GET', 'DELETE', 'POST', 'PUT' ] );

let queue;
let tabDonnees = [];
let reponsesServeur = [];

let nombreDonneesEnvoyees = 0;
let nombreErreurs = 0;

const creerErreur = (err, idDonnee) => {
    const e = { idOrigine : idDonnee, idDurnal : null }
    if (e.hasOwnProperty("response")) {
        e["codeErreur"] = err.response.status;
        e["messageErreur"] = err.response.statusText;
    } else {
        e["codeErreur"] = -1;
        e["messageErreur"] = err.message;
    }
    return e;
}

const gererErreur = (err, d) => {

    if (Array.isArray(d)) {
        // En cas de perte de connexion generer un bloc d erreur  pour le paquet
        let tabErreur = [];
        d.map(lig => {
            tabErreur.push(creerErreur(err, lig[Object.keys(lig)[0]]));
        });
        reponsesServeur = reponsesServeur.concat(tabErreur);
        nombreErreurs += tabErreur.length;
    } else {
        reponsesServeur.push(creerErreur(err, d[Object.keys(d)[0]]));
        nombreErreurs++;
    }
}

const appelerWS = async(url, methode, parametresURL, d) => {

    if (url && methode) {
        // Ajout des parametres de requetes
        // TODO Certains paramètres (=> PhamracyId) doivent être dans le projet
        if (parametresURL) {
            for (let p of parametresURL) {
                const cle = Object.keys(p)[0];
                url += "?" + cle + "=" + p[cle];
            }
        }

        // On envoie la purée
        const headers = {
                'content-type': 'application/json'
            };
        let res;

        if ([EMethodeDurnal.POST.key, EMethodeDurnal.PUT.key].includes(methode)) {
            res = await axios[methode.toLowerCase(methode)](url, JSON.stringify(d), { headers });
        } else if ([EMethodeDurnal.GET.key].includes(methode)) {
            res = await axios.get(url, { headers });
        }

        // TODO Améliorer la gestion des retours
        // TODO Standardiser les réponses retours ainsi que les codes d'erreurs
        if (res.status === 200 || res.status === 201) {
            if (methode === EMethodeDurnal.GET.key) {
                reponsesServeur = res.data;
            } else {
                if (Array.isArray(d) && Array.isArray(res.data)) {
                    reponsesServeur = reponsesServeur.concat(
                        res.data.map(reponse => {
                            return {
                                idOrigine : reponse.idOrigine,
                                idDurnal : reponse.idDurnal,
                                codeErreur : reponse.codeErreur,
                                messageErreur : reponse.messageErreur
                            }
                        })
                    );
                } else {
                    reponsesServeur = reponsesServeur.concat(
                        {
                            idOrigine : "",
                            idDurnal : "",
                            codeErreur : res.data,
                            messageErreur : ""
                        })
                }
            }
        } else {
            const err = new Error(`Erreur d'appel ${url}`);
            err.response = {
                status : res.status,
                statusText : res.statusText
            };
            throw err;
        }
    } else {
        // TODO Déclenchement d'une exception ?
        console.log(new Date().toISOString(), "URL et/ou méthode non-spécifié !");
    }
}

/*
  envoyerDonnees :
    Requête POST vers Durnal avec gestion de coupure réseau
*/
const envoyerDonnees = async(p) => {

    if (p.donnees !== null) {
        tabDonnees.push(p.donnees);
    }

    if (tabDonnees.length >= p.taillePaquet || !p.donnees) {
        // On relâche le tableau <tabDonnees> pour la suite
        const pqDonnees = tabDonnees;
        tabDonnees = [];

        try {
            nombreDonneesEnvoyees += pqDonnees.length;

            process.stdout.write(`${colors.blue(nombreDonneesEnvoyees)}/${colors.green(reponsesServeur.length)}/${colors.red(nombreErreurs)}...`);

            // L'URL contient t'elle des paramètres ??
            const regURL = /http[s]?:\/\/.*\/{.*}/g;
            const rootURL = p.url.match(regURL);
            if(rootURL) {
                // => Transfert des données de facon unique
                const regParametres = /{[^{]*}/;
                const parametres = p.url.match(regParametres);

                for (const d of pqDonnees) {
                    let url = p.url;

                    try {
                        // Remplacement des paramètres dans l'URL
                        if (parametres) {
                            for (let i=0; i<parametres.length;i++) {
                                const val = d[parametres[i].substring(1, parametres[i].length - 1)];
                                if (val) {
                                    url = url.replace(parametres[i], val);
                                } else {
                                    const err = new Error(`Erreur d'appel ${url} : valeur du ${parametres[i]} nulle`);
                                    throw err;
                                }
                            }

                            // Suppression des propriétés-paramètres des l'URL
                            for (const p of parametres) {
                                delete d[p.substring(1, p.length - 1)];
                            }
                        }

                        await appelerWS(url, p.methode, p.parametresURL, d);
                    } catch(e) {
                        gererErreur(e, d);
                    }
                }
            } else {
                // => Transfert des données par "paquet"
                await appelerWS(p.url, p.methode, p.parametresURL, pqDonnees);
            }
        } catch (e) {
            // En cas de perte de connexion generer un bloc d erreur  pour le paquet
            gererErreur(e, pqDonnees);
        }
    }
}

/*
  traiterFinQueue :
    Traitement de fin de Queue : envoi du dernier paquet de données
*/
const traiterFinQueue = (url, methode, parametresURL) => {
    return new Promise(async (resolve, reject) => {
        queue.drain = async () => {
            await envoyerDonnees({ url : url, methode : methode, parametresURL : parametresURL, taillePaquet : 0, donnees : null });
            resolve();
        };
    });
}

/*
  sauvegarderCorrespondances :
    Sauvegarde des réponses reçues de Durnal
*/
async function sauvegarderCorrespondances(pha, procedureCorrespondance, reponses) {

    const tr = await baseLocale.preparerPS(pha);
    try {
        for (const item of reponses ) {
            await baseLocale.executerPS(tr, procedureCorrespondance, item);
        }
    } catch(e) {
        console.log(new Date().toISOString(), `${colors.red(e.message)}`);
    } finally {
        await tr.commitAsync();
    }
}

/*
  transformer :
    Transformation de l'objet Firebird vers l'objet JSON qu'attend Durnal
*/
function transformer(o, template) {

    const tmpl = {...template};
    Object.keys(o).map(
        att => {
            const attCS = utils.convertirCamelCase(att);
            if (Array.isArray(tmpl[attCS]) || Buffer.isBuffer(o[att])) {
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
    return tmpl;
}

/*
  transferer :
    Boucle de traitement des données
*/
const transferer = async (item, options) => {

    if (item.traitements !== "" && fs.existsSync(`${path.resolve(__dirname)}/${item.traitements}`)) {
        let pha;
        try {
            pha = await baseLocale.connecter(optionsPha);

            // Suppression données correspondances
            if (item.procedureSuppression) {
                process.stdout.write(`${new Date().toISOString()} *** Suppression des ${item.libelleGroupe} ...`);
                //baseLocale.executerPS(pha, item.procedureSuppression);
                process.stdout.write(" OK ! ***\n");
            }

            // On transfère
            for (const t of require(`./${item.traitements}`)) {
                if (t.url) {
                    console.log(new Date().toISOString(), `*** Transfert ${t.libelle} ***`);

                    nombreDonneesEnvoyees = 0; nombreErreurs = 0;

                    // Méthodes de transformation
                    let mod;
                    let meth;
                    if (t.methodeTransformation) {
                        [ mod, meth ] = t.methodeTransformation.split('.');
                        mod = require(`./${mod}`);
                    }

                    // Création logger
                    const logger = log.creerLog(`${options.commit.repertoire}\\${t.libelle}.log`);

                    let urlComplete = options.commit.projet.transfert.url.replace("http://", "");
                    urlComplete = `${urlComplete}/${t.url}`.replace(/\/+/g, "/");
                    urlComplete = `http://${urlComplete}`;
                    if ([EMethodeDurnal.POST.key, EMethodeDurnal.PUT.key].includes(t.methode)) {
                        // Traitement POST => Envoie de données vers Durnal
                        if (t.procedureSelection) {
                            tabDonnees = [];
                            reponsesServeur = [];

                            queue = async.queue((o, cb) => {
                                setTimeout(async() => {
                                    await envoyerDonnees(o);
                                    cb();
                                }, 10);
                            }, t.tailleQueue);

                            await pha.sequentiallyAsync(`select * from ${t.procedureSelection}`,
                                async (o, index, next) => {
                                    o =  meth ? mod[meth](o, t.template) : transformer(o, t.template);
                                    queue.push({ url : urlComplete, methode : t.methode, parametresURL : t.parametresURL, taillePaquet : t.taillePaquet, donnees : o });
                                    next();
                                }
                            );

                            await traiterFinQueue(urlComplete, t.methode, t.parametresURL);

                            process.stdout.write(`${colors.blue(nombreDonneesEnvoyees)}/${colors.green(reponsesServeur.length)}/${colors.red(nombreErreurs)}\n`);
                        }
                    } else if([EMethodeDurnal.GET.key].includes(t.methode)) {
                            // Traitement .key => On importe des données (référence) de Durnal
                            await appelerWS(urlComplete, t.methode);
                            reponsesServeur = reponsesServeur.map(reponse => {
                                return mod[meth](reponse);
                            });
                    }

                    // Enregistrement des réponses de transfert
                    for (const item of reponsesServeur) {
                        logger.info(item);
                    }

                    if (t.procedureCorrespondance && reponsesServeur.length > 0) {
                        process.stdout.write(`${new Date().toISOString()} *** Sauvegardes  des ${t.libelle} ...`);
                        await sauvegarderCorrespondances(pha, t.procedureCorrespondance, reponsesServeur);
                        process.stdout.write(" OK ! ***\n");
                    }
                } else {
                    console.log(new Date().toISOString(), colors.red(`URL de transfert pour ${t.libelle} introuvable !`));
                }
            }
        } finally {
            await baseLocale.deconnecter(pha);
        }
    } else {
        console.log(new Date().toISOString(), colors.red(`Fichier de traitements ${item.libelleGroupe}.${item.traitements} introuvable !`));
    }
}

module.exports = { transferer }
