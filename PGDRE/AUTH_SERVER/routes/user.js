var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

// Lista de todos os utilizadores
router.get('/users/list', auth.verificaAcesso, function(req, res, next) {
  User.list()
    .then(users => {res.status(200).jsonp(users)})
    .catch(erro => {res.status(500).jsonp({error: "Erro na obtenção dos users: " + erro})})
});

// Vai buscar um utilizador em específico
router.get('/users/:username', auth.verificaAcesso, function(req, res){
  User.getUser(req.params.username)
    .then(user => {res.status(200).jsonp(user)})
    .catch(erro => {res.status(501).jsonp({error: "Erro na obtenção do utilizador: " + erro})})
})

// Editar utilizador
router.put('/users/:username', auth.verificaAcesso, function(req, res){
  User.updateUser(req.body)
    .then(user => {res.status(200).jsonp(user)})
    .catch(erro => {res.status(505).jsonp({error: "Erro na alteração do utilizador: " + erro})})
})

// Register tem que ser protegida
router.post('/register', auth.verificaAcesso, function(req, res){
  var d = new Date().toISOString().substring(0,19)
  User.getUser(req.body.username)
    .then(user => {
      if(user == null){ // Não existe nenhum user com esse username
        userModel.register(new userModel({email:req.body.email, name: req.body.name, 
          username: req.body.username, password: req.body.password, 
          level: req.body.level, dateCreated: d,
          lastAccess: d, active: req.body.active}),
          req.body.password, 
          function(erro, user){
             if (erro) 
               res.status(502).jsonp({error: erro, message: "Erro no registo: " + erro})
             else{
               res.status(200).jsonp({message: "User inserido com sucesso!", user: user})
               // passport.authenticate("local")(req,res,function(){
               //   jwt.sign({ username: req.user.username, level: req.user.level, 
               //   active: req.user.active}, 
               //   "PGDRE",
               //   {expiresIn: 3600},
               //   function(e, token) {
               //     if(e) res.status(503).jsonp({error: "Erro na geração do token: " + e}) 
               //     else res.status(201).jsonp({token: token})
               //   });
               // })
             }  
          })
      }else{ // Já existe pelo menos um user com esse username
        res.status(507).jsonp({message: "Já existe um user com esse username!"})
      }
    })
    .catch(erro => {res.status(506).jsonp({error: "Erro na obtenção do utilizador: " + erro})})
})


function printa(req, res, next){
  console.log("xD")
  next()
}

// O login é a única rota que está desprotegida
router.post('/login', printa, passport.authenticate('local'), function(req, res, next){
  // Atribuir um token para o utilizador
  jwt.sign({username: req.user.username, level: req.user.level, active: req.user.active},
    "PGDRE",
    {expiresIn: 3600},
    function(e, token){
      if(e) res.status(504).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
    })
})

module.exports = router;
