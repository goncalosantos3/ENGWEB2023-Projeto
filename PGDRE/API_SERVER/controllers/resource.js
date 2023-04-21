var Resource = require('../models/resource')

// Resource list
module.exports.list = () => {
    return Resource
        .find()
        .sort({resourceName: 1}) // Ordem alfabética do nome do zip
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// List all resources of a certain type
module.exports.listType = t => {
    return Resource
        .find({type: t})
        .sort({resourceName: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Vai buscar um recurso com base no nome do zip
module.exports.getResource = rname => {
    return Resource
        .find({resourceName: rname})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Vai buscar todos os recursos públicos de um certo autor
module.exports.getRAutor = a => {
    return Resource
        .find({author: a})
        .sort({resourceName: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}