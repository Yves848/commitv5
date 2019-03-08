'use strict'

const genererCleLuhn10 = (value) => {
        if (/[^0-9-\s]+/.test(value)) return;

        var nCheck = 0, nDigit = 0, bEven = true;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
          var cDigit = value.charAt(n);
          nDigit = parseInt(cDigit, 10);

          if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
          }

          nCheck += nDigit;
          bEven = !bEven;
        }
        return (1000 - nCheck) % 10;
      }

const mult = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ],
    perm = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ],
    inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

const genererCleVerhoeff = code => {
    let i = code.length,
        j = 0,
        x = 0

    while (i--) {
        let d = +code[i]
        if (d != d) {
            return undefined
        }
        x = mult[x][perm[(++j % 8)][d]]
    }

    return inv[x]
}

/*
  genererMatriculeLux
    Génération de matricule VALIDE avec date de naissance fatice
*/
const genererMatriculeLux = () => {
    const aaaa = '' + (1900 + Math.floor(Math.random() * 100))
    const mm = '' + (1 + Math.floor(Math.random() * 11))
    const jj = '' + (1 + Math.floor(Math.random() * 30))
    const xxx = '' + Math.floor(Math.random() * 999)
    const mat = aaaa + mm.padStart(2, '0') + jj.padStart(2, '0') +  xxx.padStart(3, '0');

    return mat + genererCleLuhn10(mat) + genererCleVerhoeff(mat)
}

const verifierMatriculeLux = (code) => {
    return code === code.substr(0, 11) + genererCleLuhn10(code.substr(0, 11)) + genererCleVerhoeff(code.substr(0, 11))
}

/*
  genererGUID
*/
const genererGUID = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const convertirCamelCase = (snake_case) => {
    return snake_case.toLowerCase().replace(/_\w/g, (m) => m[1].toUpperCase() )
}

module.exports = {
    genererCleLuhn10,
    genererCleVerhoeff,
    verifierMatriculeLux,
    genererMatriculeLux,
    genererGUID,
    convertirCamelCase
}