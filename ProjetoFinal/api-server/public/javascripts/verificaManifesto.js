var fs = require('fs')

module.exports.verifica = (path) => {
    var manifesto = path + '/manifesto.json'

    if (fs.existsSync(manifesto)) {
        try{  
            var ficheiro = require(manifesto)
        }
        catch{
            console.log("O manifesto nao tem formato JSON pretendido ... ")
            return false 
        }

        if (verificaDir(path + '/data/', ficheiro)) {
            return true
        }
    }
    return false ;
}

verificaDir = (atual_dir, pasta) => {
    var flag = true;

    pasta.ficheiros.forEach((ficheiro) => {
        if (!(verificaFic(atual_dir, ficheiro))) {
            flag = false
        }
    })

    if (flag) {
        pasta.conteudo.forEach((p) => {
            if (!(fs.existsSync(atual_dir + p.titulo))) {
                flag = false
            }
            else {
                if (!(verificaDir(atual_dir + p.titulo + '/', p.pasta))){
                    flag = false
                } 
            }
        })
    }
    return flag;
}

verificaFic = (atual_path, ficheiro) => {
    try {
        if (fs.existsSync(atual_path + ficheiro.titulo)) {
            return true
        }
        else{
            return false
        } 
    } catch (err) {
        console.error(err)
    }
    return false;
}