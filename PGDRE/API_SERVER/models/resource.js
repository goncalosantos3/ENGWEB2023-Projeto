var mongoose = require('mongoose')
var Schema = mongoose.Schema

/*
* O resource é considerado o zip ao qual se faz upload para a plataforma
*/

var resourceSchema = Schema({
    resourceName: String, // Nome do zip
    title: String, 
    subtitle: String,
    type: String,
    dateCreation: String,
    dateSubmission: String,
    visibility: String, // public ou private
    author: String
})

module.exports = mongoose.model('resource', resourceSchema, 'resources')