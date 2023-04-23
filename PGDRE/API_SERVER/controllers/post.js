var Post = require('../models/post')

// Post list of a resource
module.exports.rPosts = rname => {
    return Post
        .find({resourceName: rname})
        .sort({date: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Retorna um post em específico
module.exports.getPost = id => {
    return Post
        .findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Elimina um post em específico
module.exports.deletePost = id => {
    return Post 
        .deleteOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Elimina todos os posts de um certo recurso
module.exports.deletePostsR = rname => {
    return Post 
        .deleteMany({resourceName: rname})
        .then(resposta => { 
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
