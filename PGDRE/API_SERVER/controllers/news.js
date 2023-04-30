var News = require('../models/news')

// List of all the news
module.exports.newsList = () => {
    return News
        .find()
        .sort({date: -1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// List of all the news related to a resource
module.exports.rNews = rname => {
    return News
        .find({resourceName: rname})
        .sort({date: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Get one news in particular
module.exports.news = id => {
    return News
        .findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Lista das notícias de um utilizador
module.exports.getnewsU = username => {
    return News 
        .find({username: username})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// n: objeto news
module.exports.addNews = n => {
    return News.create(n)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateNews = n => {
    return News
        .updateOne({_id: n._id}, n)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Elimina uma notícia em específico
module.exports.deleteNews = id => {
    return News
        .deleteOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

// Elimina todas as notícias de um certo recurso
module.exports.deleteNewsR = rname => {
    return News
        .deleteMany({resourceName: rname})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}