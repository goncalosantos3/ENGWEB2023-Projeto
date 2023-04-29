var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

// Lista de todos os utilizadores
router.get('/get', auth.verificaAcesso, function(req, res){
  User.list()
    .then(users => {
      res.status(200).jsonp(users)
    })
    .catch(erro => res.status(502).jsonp({error: "Erro na obtenção da lista de users: " + erro}))
})

// Vai buscar um utilizador em específico
router.get('/get/:username', auth.verificaAcesso, function(req, res){
  User.getUser(req.params.username)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(501).jsonp({error: "Erro na obtenção do user: " + erro}))
})

// Edição de um utilizador
router.put('/edit/:username', auth.verificaAcesso, function(req, res){
  User.updateUser(req.body)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(503).jsonp({error: "Erro na edição do user: " + error}))
})

// Desativar um utilizador
router.put('/:username/deactivate', auth.verificaAcesso, function(req, res){
  User.deactivateUser(req.params.username)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(504).jsonp({error: "Erro na desativação do utilizador: " + erro}))
})

// Ativar um utilizador
router.put('/:username/activate', auth.verificaAcesso, function(req, res){
  User.activateUser(req.params.username)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(505).jsonp({error: "Erro na ativação do utilizador: " + erro}))
})

// A rota do register tem que estar protegida
router.post('/register', auth.verificaAcesso, function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  userModel.register(new userModel({ email: req.body.email, name: req.body.name,
                                     username: req.body.username, level: req.body.level,
                                     dateCreated: d, active: true }), 
                req.body.password, 
                function(err, user) {
                  if (err) 
                    res.jsonp({error: err, message: "Register error: " + err})
                  else{
                    res.status(200).jsonp({message: "User criado com sucesso!"})
                    // passport.authenticate("local")(req,res,function(){
                    //   jwt.sign({ username: req.user.username, level: req.user.level, 
                    //     sub: 'aula de EngWeb2023'}, 
                    //     "EngWeb2023",
                    //     {expiresIn: 3600},
                    //     function(e, token) {
                    //       if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                    //       else res.status(201).jsonp({token: token})
                    //     });
                    // })
                  }     
  })
})

// A rota do login é a única que não está protegida
router.post('/login', passport.authenticate('local'), function(req, res){
  console.log("xD")
  var d = new Date().toISOString().substring(0,19)
  User.loginUser(req.user.username, d)
    .then(user => {
      jwt.sign({ username: req.user.username, level: req.user.level, 
        active: req.user.active}, 
        "PGDRE2023",
        {expiresIn: 3600},
        function(e, token) {
          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
          else res.status(201).jsonp({token: token})
        });
    })
    .catch(erro => {res.status(506).jsonp({error: "Erro na atualização do user: " + erro})})
})

module.exports = router;