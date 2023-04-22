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

module.exports.post = id => {
    return Post
        .findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
