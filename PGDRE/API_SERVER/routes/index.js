var express = require('express');
var router = express.Router();
var Resource = require('../controllers/resource')
var Post = require('../controllers/post')
var News = require('../controllers/news')

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

// Eliminar um recurso 
router.delete('/resource/:rname/delete', function(req, res){
  Resource.deleteR(req.params.rname)
    .then(resposta1 => {
      News.deleteNewsR(req.params.rname)
        .then(resposta2 => {
          Post.deletePostsR(req.params.rname)
            .then(resposta3 => {  
              res.status(200).jsonp({message: "Apagado"})
            })
            .catch(erro => {
              res.status(510).jsonp({message: "Erro na eliminação dos posts do recurso" + req.params.rname + ": " + erro})
            })
        })
        .catch(erro => {
          res.status(509).jsonp({message: "Erro na eliminação das notícias do recurso " + req.params.rname + ": " + erro})
        })
    })
    .catch(erro => {
      res.status(508).jsonp({message: "Erro na eliminação do recurso " + req.params.rname + ": " + erro})
    })
})

// Posts associados a um recurso
router.get('/resource/:rname/posts', function(req, res){
  Post.rPosts(req.params.rname)
    .then(posts => {
      console.dir(posts)
      res.status(200).jsonp(posts)
    })
    .catch(erro => {
      res.status(505).jsonp({message: "Erro na obtenção dos posts do recurso: " + req.params.rname})
    })
})

// Um post em específico
router.get('/resource/:rname/posts/:id', function(req, res){
  Post.getPost(req.params.id)
    .then(post => {
      console.dir(post)
      res.status(200).jsonp(post)
    })
    .catch(erro => {
      res.status(506).jsonp({message: "Erro na obtenção do post" + req.params.id + "do recurso: " + req.params.rname})
    })
})

// Lista de todas as notícias
router.get('/news/list', function(req, res){
  News.newsList()
    .then(news => {
      console.dir(news)
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(507).jsonp({message: "Erro na obtenção da lista das notícias"})
    })
})

module.exports = router;
