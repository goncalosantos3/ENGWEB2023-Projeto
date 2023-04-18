var express = require('express');
var router = express.Router();

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

})

module.exports = router;
