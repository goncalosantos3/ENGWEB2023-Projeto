var Course = require('../models/course')

// Course list
module.exports.list = () => {
    return Course.find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getCourse = id => {
    return Course.findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateCourse = c => {
    return Course.updateOne({_id: c._id}, c)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getPosts = id => {
    return Course.findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}