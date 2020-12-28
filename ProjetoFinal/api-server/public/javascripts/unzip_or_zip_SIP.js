var AdmZip = require('adm-zip');
const fs = require('fs');

module.exports.unzip = (ficheiro) => {
    var destino = ficheiro + 'dir'

    fs.mkdirSync(destino)

    var descomprimir = new AdmZip(ficheiro)
    descomprimir.extractAllTo(destino, false)

    fs.unlinkSync(ficheiro)
}
