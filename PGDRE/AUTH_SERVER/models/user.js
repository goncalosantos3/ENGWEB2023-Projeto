const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    username: String, // Considerado o id (NÃO REPETÍVEL)
    password: String,
    role: String // Role: Consumer ou Producer ou Administrator
})

module.exports = mongoose.model('user', userSchema)