var express = require('express');
var router = express.Router();
var axios = require('axios'); // serve para fazer pedidos para os outros servidores

var fs = require('fs') // file system
var multer = require('multer');
var upload = multer({dest: 'uploads'}) // Guarda tudo numa pasta "uploads"

/*                                GETS                                   */
/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  res.render('index', {d: data});
});

// register
router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('registerForm', {d: data})
})

// login
router.get('/login', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('loginForm', {d: data})
})

// logout
router.get('/logout', function(req, res){
  // Inserir código necessário aqui para terminar a sessão do utilizador
  res.redirect('/')
})

router.get('/home', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/news/list')
    .then(dados => {
      res.render('home', {news: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Vai servir para gerar a página com o perfil do utilizador
// Tem que se verificar se o utilizador já está autenticado ou não
router.get('/profile', function(req, res){  
  var data = new Date().toISOString().substring(0,16)
  res.render('profile', {d: data})
})

// Lista de todos os recursos
router.get('/resources', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/list')
    .then(dados => {
      res.render('resources', {rs: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Adicionar um novo recurso
router.get('/resources/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  res.render('addResourceForm', {d: data})
})

// Vai buscar um recurso em específico
router.get('/resources/:rname', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(recurso => {
      axios.get('http://localhost:7779/resource/' + req.params.rname + "/posts")
        .then(posts => {
          console.dir(posts.data)
          res.render('resourceDetails', {r: recurso.data[0], ps: posts.data, d: data})
        })
        .catch(erro => {
          erro => res.render('error', {error: erro})
        })
    })
    .catch(erro => res.render('error', {error: erro}))
})

router.get('/resources/edit/:rname', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      var files = ""
      for(let i=0; i<dados.data[0].files.length; i++)
        files += dados.data[0].files[i] + ", "
      res.render('editResourceForm', {r: dados.data[0], files: files, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

router.get('/resources/delete/:rname', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      res.render('confirmDeleteResource', {r: dados.data[0], d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

router.get('/resources/delete/:rname/confirm', function(req, res){
  // Falta implementar aqui o código para realmente remover o recurso
  res.redirect('/resources')
})

router.get('/resources/download/:rname', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      console.dir(dados.data)
      let path = __dirname + '/../uploads/' + dados.data[0].type + "/" + req.params.rname
      res.download(path)
    })
    .catch(erro => res.render('error', {error: erro}))
})

router.get('/upload/resource', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  res.render('addResourceForm', {d: data})
})

// Adicionar um post
router.get('/resources/:rname/posts/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      console.dir(dados.data)
      res.render('addPostForm', {r: dados.data[0], d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Vai buscar a informação de um post em específico
router.get('/resources/:rname/posts/:id', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname + '/posts/' + req.params.id)
    .then(dados => {
      console.dir(dados.data)
      res.render('postDetails', {p: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Edição de um post
router.get('/resources/:rname/posts/:id/edit', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname + '/posts/' + req.params.id)
    .then(dados => {
      console.dir(dados.data)
      res.render('editPostForm', {p: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Pedido para eliminar um post
router.get('/resources/:rname/posts/:id/delete', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname + "/posts/" + req.params.id)
    .then(dados => {
      console.dir(dados.data)
      res.render('confirmDeletePost', {p: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Confirmação da eliminação de um post
router.get('/resources/:rname/posts/:id/delete/confirm', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.delete('http://localhost:7779/posts/' + req.params.id)
    .then(dados => {
      console.dir(dados.data)
      res.render('confirmDeletePost', {p: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Adicionar um like a um post
router.get('/resources/:rname/posts/:id/like', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.params.rname + '/posts/' + req.params.id + '/like')
    .then(dados => {
      res.redirect('/resources/' + req.params.rname + '/posts/' + req.params.id)
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Pedido para adicionar um comentário a um post
router.get('/resources/:rname/posts/:id/comments/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname + "/posts/" + req.params.id)
    .then(dados => {
      console.dir(dados.data)
      res.render('addCommentForm', {p: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

/*                                POSTS                                 */
// Criar um novo registo de utilizador (verificar se não existe um utilizador com as mesmas credenciais)
router.post('/register', function(req,res){
  if(req.body.role == undefined){
    // Faltou completar o papel do utilizador
    res.render('registerForm', {erroRole: true}) 
  }
})

// Verificar se o utilizador já existe na base de dados
router.post('/login', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  // Falta meter o código da autenticação do utilizador
  // axios.post('http://localhost:7778/users/login', req.body)
  res.redirect('home')
})  

// Upload de um novo recurso educacional
// Tem que se realizar a verificação de que o zip está correto
router.post('/upload/resource', upload.single('resource'), function(req, res){
  var data = new Date().toISOString().substring(0,16)
  
})

// Editar um recurso
router.post('/resources/:rname/edit', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      var r = {
        resourceName: req.body.resourceName,
        files: dados.data[0].files,
        title: req.body.title,
        subtitle: req.body.subtitle,
        type: req.body.type,
        dateCreation: dados.data[0].dateCreation,
        dateSubmission: dados.data[0].dateSubmission,
        visibility: req.body.visibility,
        author: req.body.author
      }

      axios.post('http://localhost:7779/resource/' + req.params.rname + "/edit", r)
      .then(dados => {
        res.redirect('/resources')
      })
      .catch(erro => {res.render('error', {error: erro})})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Adicionar um post
router.post('/resources/:rname/posts/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)

  var p = {
    resourceName: req.body.resourceName,
    username: req.body.username,
    title: req.body.title,
    description: req.body.description,
    liked_by: [], 
    date: data,
    visibility: req.body.visibility,
    comments: []
  }
  axios.post('http://localhost:7779/resource/' + req.params.rname + "/posts/add", p)
    .then(dados => {
      console.dir(dados.data)
      res.redirect('/resources/' + req.params.rname)
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Editar um post
router.post('/resources/:rname/posts/:id/edit', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.params.rname + '/posts/' + req.params.id)
    .then(dados => {
      var p = {
        _id: dados.data._id,
        resourceName: req.body.resourceName,
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        liked_by: req.body.liked_by,
        date: req.body.date,
        visibility: req.body.visibility,
        comments: dados.data.comments
      }
      axios.post('http://localhost:7779/resource/' + req.params.rname + "/posts/" + req.params.id + "/edit", p)
      .then(dados => {
        console.dir(dados.data)
        res.redirect('/resources/' + req.params.rname)
      })
      .catch(erro => {res.render('error', {error: erro})})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Adicionar um comentário a um post
router.post('/resources/:rname/posts/:id/comments/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)

  var c = {
    usename: req.body.username,
    title: req.body.title,
    description: req.body.description,
    date: data
  }
  axios.post('http://localhost:7779/resource/' + req.params.rname + "/posts/" + req.params.id + "/comments/add", c)
    .then(dados => {
      console.dir(dados.data)
      res.redirect('/resources/' + req.params.rname + "/posts/" + req.params.id)
    })
    .catch(erro => {res.render('error', {error: erro})})
})

module.exports = router;
