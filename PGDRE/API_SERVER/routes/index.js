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

router.post('/resource/search', function(req, res){
  // Pesquisar por título
  if(req.body.filtro == 'title'){
    Resource.getRTitle(req.body.search)
      .then(recursos => {
        res.status(200).jsonp(recursos)
      })
      .catch(erro => {
        res.status(219).jsonp({message: "Erro na pesquisa por título: " + erro})
      })
  }else if(req.body.filtro == 'type'){
    Resource.listType(req.body.search)
      .then(recursos => {
        res.status(200).jsonp(recursos)
      })
      .catch(erro => {
        res.status(220).jsonp({message: "Erro na pesquisa por tipo: " + erro})
      })
  }else if(req.body.filtro == 'author'){
    Resource.getRAutor(req.body.search)
      .then(recursos => {
        res.status(200).jsonp(recursos)
      })
      .catch(erro => {
        res.status(221).jsonp({message: "Erro na pesquisa por autor: " + erro})
      })
  }
})

// Adicionar um recurso
router.post('/resource/add', function(req, res){
  console.dir(req.body)
  Resource.addR(req.body)
    .then(recurso => {
      console.dir(recurso)
      res.status(200).jsonp(recurso)
    })
    .catch(erro => {
      res.status(518).jsonp({message: "Erro na adição do recurso: " + erro})
    })
})

// Editar um recurso
router.post('/resource/:rname/edit', function(req, res){
  Resource.updateR(req.body)
    .then(recurso => {
      console.dir(recurso)
      res.status(200).jsonp(recurso)
    })
    .catch(erro => {
      res.status(518).jsonp({message: "Erro na edição do recurso " + req.params.rname + ": " + erro})
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
      res.status(505).jsonp({message: "Erro na obtenção dos posts do recurso " + req.params.rname + ": " + erro})
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
      res.status(506).jsonp({message: "Erro na obtenção do post" + req.params.id + "do recurso " + req.params.rname + ": " + erro})
    })
})

// Adicionar um like a um post
router.get('/resource/:rname/posts/:id/like', function(req, res){
  Post.getPost(req.params.id)
    .then(post => {
      post.likes += 1
      Post.updatePost(post)
        .then(dados => {
          res.status(200).jsonp(dados)
        })
        .catch(erro => {
          res.status(516).jsonp({message: "Erro na edição do post " + req.params.id + "do recurso " + req.params.rname + ": " + erro})
        })
    })
    .catch(erro => {
      res.status(517).jsonp({message: "Erro na obtenção do post" + req.params.id + "do recurso " + req.params.rname + ": " + erro})
    })
})

// Adicionar um post a um recurso
router.post('/resource/:rname/posts/add', function(req, res){
  Post.addPost(req.body)
    .then(post => {
      res.status(200).jsonp(post)
    })
    .catch(erro => {
      res.status(512).jsonp({message: "Erro na adição do post no recurso " + req.params.rname + ": " + erro})
    })
})

// Editar um post
router.post('/resource/:rname/posts/:id/edit', function(req, res){
  console.dir(req.body)
  Post.updatePost(req.body)
    .then(post => {
      res.status(200).jsonp(post)
    })
    .catch(erro => {
      res.status(515).jsonp({message: "Erro na edição do post no recurso " + req.params.rname + ": " + erro})
    })
})

// Adicionar um comentário a um post
router.post('/resource/:rname/posts/:id/comments/add', function(req, res){
  Post.getPost(req.params.id)
    .then(post => {
      post.comments.push(req.body) // Adiciona o comentário

      Post.updatePost(post)
        .then(post => {
          res.status(200).jsonp(post)
        })
        .catch(erro => {
          res.status(513).jsonp({message: "Erro na adição do comentário ao post no recurso " + req.params.rname + ": " + erro})
        })
    })
    .catch(erro => {
      res.status(514).jsonp({message: "Erro na busca do post do recurso " + req.params.rname + ": " + erro})
    })
})

// Eliminação de um post
router.delete('/posts/:id', function(req, res){
  Post.deletePost(req.params.id)
    .then(resposta1 => {
      res.status(200).jsonp({message: "Apagado"})
    })
    .catch(erro => {
      res.status(511).jsonp({message: "Erro na eliminação do post" + req.params.id + "do recurso " + req.params.rname + ": " + erro})
    })
})

// Lista de todas as notícias
router.get('/news/list', function(req, res){
  News.newsList()
    .then(news => {
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(507).jsonp({message: "Erro na obtenção da lista das notícias: " + erro})
    })
})

// Uma notícia em específico
router.get('/news/:id', function(req, res){
  News.news(req.params.id)
    .then(news => {
      console.dir(news)
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(522).jsonp({message: "Erro na obtenção da notícia: " + erro})
    })
})

// Adicionar uma notícia
router.post('/news/add', function(req, res){
  News.addNews(req.body)
    .then(news => {
      console.dir(news)
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(519).jsonp({message: "Erro na adição da notícia: " + erro})
    })
})

// Editar uma notícia 
router.post('/news/edit/:id', function(req, res){
  News.updateNews(req.body)
    .then(news => {
      console.dir(news)
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(524).jsonp({message: "Erro na edição da notícia: " + erro})
    })
})

// Eliminar uma notícia
router.delete('/news/:id', function(req, res){
  News.deleteNews(req.params.id)
    .then(news => {
      console.dir(news)
      res.status(200).jsonp(news)
    })
    .catch(erro => {
      res.status(523).jsonp({message: "Erro na eliminação da notícia: " + erro})
    })
})

module.exports = router;
