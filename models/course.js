const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    enq: String,
    duration: String,
    desc: String
})

module.exports = mongoose.model('course', courseSchema)