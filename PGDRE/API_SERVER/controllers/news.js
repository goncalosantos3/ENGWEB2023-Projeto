var News = require('../models/news')

// List of all the news
module.exports.newsList = () => {
    return News
        .find()
        .sort({date: 1})
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
        .find({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}