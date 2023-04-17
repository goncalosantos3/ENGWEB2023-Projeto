var express = require('express');
var router = express.Router();
var Course = require('../controllers/course')
var jsonfile = require('jsonfile')
var fs = require('fs') // file system

var multer = require('multer');
const { trusted } = require('mongoose');
var upload = multer({dest: 'uploads'}) // Guarda tudo numa pasta "uploads"

/*                                         GET                                             */
/* GET home page. */
router.get('/', function(req, res) {
  var data = new Date().toISOString().substring(0, 10)
  Course.list()
    .then(cs => {
      console.log(cs)
      res.render('index', {courses: cs, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista dos cursos"})
    })
});

/* GET 1 course */
router.get('/:idC', function(req, res) {
  var data = new Date().toISOString().substring(0, 10)
  Course.getCourse(req.params.idC)
    .then(c => {
      console.log(c)
      res.render('courseDetails', {course: c, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo do curso"})
    })
});

/* GET the content of one course */
router.get('/:idC/content', function(req, res) {
  var data = new Date().toISOString().substring(0, 10)
  jsonfile.readFile(__dirname + "/../data/files.json", (erro, registos) => {
    if(erro){
      res.render('error', {error: erro})
    }else{
      // Get the files related to this course
      var filtered_files = registos.filter( function(f) { //callback function
        if(f.courses.includes(req.params.idC)) { //filtering criteria
          return f;
        }
      })
      res.render('courseContent', {files: filtered_files, d: data, idC: req.params.idC})
    }
  })
});

/* GET the posts about a resource */
router.get('/:idC/content/:fname/posts', function(req, res) {
  var data = new Date().toISOString().substring(0, 10)
  
});

/* Pedido de download de um ficheiro */
router.get('/:idC/content/download/:fname', function(req, res) {
  let path = __dirname + '/../public/fileStore/' + req.params.fname
  res.download(path)
});

/* Pedido de upload de um ficheiro */
router.get('/:idC/content/upload', function(req, res) {
  // Redireciona para a página com o formulário de upload de um ficheiro
  res.render('uploadFile', {idC: req.params.idC}) 
})

// Pediu para eliminar ficheiro
router.get('/:idC/content/delete/:fname', function(req, res){
  jsonfile.readFile(__dirname + "/../data/files.json", (erro, registos) => {
    if(erro){
      res.render('error', {error: erro})
    }else{
      var file
      for(let i=0; i<registos.length; i++){
        if(registos[i].name == req.params.fname){
          file = registos[i]
        }
      }
      res.render('deleteFile', {f: file, idC: req.params.idC})
    }
  })
})

// Confirmou que quer eliminar
router.get('/:idC/content/delete/:fname/confirm', function(req, res){
  // Remover o ficheiro
  var files = jsonfile.readFileSync(__dirname + '/../data/files.json')
  for(let i=0; i<files; i++){
    if(files[i].name == req.params.fname){
      var courses = files[i].courses.filter(function (c) {
        if(c != req.params.idC){
          return c;
        }
      });
      files[i].courses = courses
    }
  }
  jsonfile.writeFileSync(__dirname + '/../data/files.json', files)

  // Remover a notícia relacionada ao ficheiro que foi removido
  Course.getCourse(req.params.idC)
    .then(c => {
      var filtered_news = c.news.filter( function(n) { //callback function
        if(n.related != req.params.fname) { //filtering criteria
          return f;
        }
      })
      c.news = filtered_news

      Course.updateCourse(c)
        .then(c => {
          res.redirect('/' + req.params.idC + '/content')
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na alteração do registo do curso"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo do curso"})
    })
})

/*                                          POST                                          */
// Upload de um ficheiro
// Quando se fizer um upload a ideia é cria um novo anúncio
router.post('/:idC/content/upload', upload.single('myFile'), (req, res) =>{
  console.log('cdir: ' + __dirname)
  let oldPath = __dirname + '/../' + req.file.path
  console.log('old: ' + oldPath)
  let newPath = __dirname + '/../public/fileStore/' + req.file.originalname
  console.log('new: ' + newPath)

  // Muda o local do ficheiro
  fs.rename(oldPath, newPath, erro => {
    if(erro) console.log(erro)
  })

  // Inserir o novo ficheiro no jsonfile dos ficheiros associado ao curso em questão
  var data = new Date().toISOString().substring(0,19);
  var mudado = false  
  var files = jsonfile.readFileSync(__dirname + '/../data/files.json')
  for(let i=0; i<files.length; i++){
    if(files[i].name == req.file.originalname){
      files[i].courses.push(req.params.idC)
      mudado = true
    }
  }

  // Se ainda não existia o ficheiro
  if(mudado == false){
    files.push({
      date: data,
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      desc: req.body.desc,
      ano: req.body.ano,
      tema: req.body.tema,
      courses: [req.params.idC]
    })
  }

  // Insere o novo ficheiro no jsonfile
  jsonfile.writeFileSync(__dirname + '/../data/files.json', files)
  
  // Criar um novo anúncio associado ao curso em questão
  Course.getCourse(req.params.idC)
    .then(c => {
      c.news[c.news.length] = {
        title: req.body.news_title,
        description: req.body.news_desc,
        related: req.file.originalname
      }

      Course.updateCourse(c)
        .then(c => {
          res.redirect('/' + req.params.idC + '/content')
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na alteração do registo do curso"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo do curso"})
    })
})

module.exports = router;
