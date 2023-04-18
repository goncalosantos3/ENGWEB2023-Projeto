var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  res.render('index', {d: data});
});

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('registerForm', {d: data})
})

router.get('/login', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('loginForm', {d: data})
})

module.exports = router;
