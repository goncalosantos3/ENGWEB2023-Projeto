const mongoose = require('mongoose')

var newsSchema = new mongoose.Schema({
    title: String,
    description: String
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