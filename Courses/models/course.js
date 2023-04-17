const mongoose = require('mongoose')

var newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    related: String // Isto vai ter o nome do ficheiro associado a esta notícia
})

var courseSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    enq: String,
    duration: String,
    desc: String,
    news: [newsSchema]
})

module.exports = mongoose.model('course', courseSchema)