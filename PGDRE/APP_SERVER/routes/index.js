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

// Vai servir para gerar a página com o perfil do utilizador
// Tem que se verificar se o utilizador já está autenticado ou não
// router.get('/profile', function(req, res){  
//   var data = new Date().toISOString().substring(0,16)
//   res.render('profile', {d: data})
// })

router.get('/resources', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/list')
    .then(dados => {
      res.render('resources', {rs: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

router.get('/upload/resource', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  res.render('addResourceForm', {d: data})
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
  // axios.post('http://localhost:7778/users/login', req.body)
})

// Upload de um novo recurso educacional
// Tem que se realizar a verificação de que o zip está correto
router.post('/upload/resource', upload.single('resource'), function(req, res){
  var data = new Date().toISOString().substring(0,16)
  
})

module.exports = router;
