var express = require('express');
var router = express.Router();
var Resource = require('../controllers/resource')

// Lista todos os recursos 
router.get('/resource/list', function(req, res) {
  Resource.list()
    .then(recursos => {
      console.dir(recursos)
      res.status(200).jsonp(recursos)
    })
    .catch(erro => {
      res.status(501).jsonp({message: "Erro na obtenção dos recursos: " + erro})
    })
});

// Todos os recursos de um certo tipo
router.get('/resource/list/:type', function(req, res) {
  Resource.listType(req.params.type)
    .then(recursos => {
      console.dir(recursos)
      res.status(200).jsonp(recursos)
    })
    .catch(erro => {
      res.status(502).jsonp({message: "Erro na obtenção dos recursos do tipo" + req.params.type + ": " + erro})
    })
});

// Todos os recursos de um autor
router.get('resource/list/:author', function(req, res){
  Resource.getRAutor(req.params.author)
    .then(recursos => {
      console.dir(recursos)
      res.status(200).jsonp(recursos)
    })
    .catch(erro => {
      res.status(503).jsonp({message: "Erro na obtenção dos recursos do autor " + req.params.author + ": " + erro})
    })
})

// Vai buscar um recurso em específico
router.get('/resource/:rname', function(req, res){
  Resource.getResource(req.params.rname)
    .then(recurso => {
      console.dir(recurso)
      res.status(200).jsonp(recurso)
    })
    .catch(erro => {
      res.status(504).jsonp({message: "Erro na obtenção do recurso " + req.params.rname + ": " + erro})
    })
})

module.exports = router;
