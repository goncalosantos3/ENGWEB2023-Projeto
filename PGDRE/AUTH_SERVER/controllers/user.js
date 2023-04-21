var User = require('../models/user')

// User list
module.exports.list = () => {
    return User.find()
               .sort({nome: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Serve para buscar um utilzador e para verificar se ele existe
module.exports.getUser = username => {
    return User.findOne({username: username})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// u tem que ser o objeto do user
module.exports.insertUser = u => {
    return User.create(u)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// O _id do newUser tem que ser o mesmo do user antigo
// Evitar mudar o username (pode causar problemas porque é considerado um id)
module.exports.updateUser = newUser => {
    return User.updateOne({_id: newUser._id}, newUser)  
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Faz a desativação (e não e eliminação) de um utilizador
module.exports.deactivateUser = username => {
    // return User.deleteOne({username: username})
    //     .then(resposta => {
    //         return resposta
    //     })
    //     .catch(erro => {
    //         return erro
    //     })
}