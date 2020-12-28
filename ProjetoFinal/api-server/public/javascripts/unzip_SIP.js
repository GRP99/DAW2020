var AdmZip = require('adm-zip');
const fs = require('fs');

module.exports.unzip = (file) => {
    var destination = file + 'dir'

    fs.mkdirSync(destination)

    var zip = new AdmZip(file)
    zip.extractAllTo(destination, false)

    fs.unlinkSync(file)
}

module.exports.zip = (path, nome) => {
    var zip = new AdmZip();

    fs.readdirSync(path).forEach((file) => {
        if (fs.lstatSync(path + file).isDirectory()) {
            zip.addLocalFolder(path + file)
        } else {
            zip.addLocalFile(path + file)
        }
    })

    zip.writeZip(path + nome)
}
