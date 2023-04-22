var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = Schema({
    resourceName: String, // O recurso sobre o qual o post se relaciona
    username: String, // O username do user que fez o post
    title: String,
    description: String,
    likes: Number, // Número de likes
    date: String,
    visibility: String, // A mesma do recurso
    comments: [{
        username: String, // O username do user que fez o comentário
        title: String,
        description: String,
        date: String
    }]
})

module.exports = mongoose.model('post', postSchema, 'posts')