var mongoose = require('mongoose')
var Schema = mongoose.Schema

var newsSchema = Schema({
    username: String,
    resourceName: String,
    type: String, // Like, post, insert, delete...
    date: String,
    visibility: String // A mesma do recurso
})

module.exports = mongoose.model('news', newsSchema, 'news')