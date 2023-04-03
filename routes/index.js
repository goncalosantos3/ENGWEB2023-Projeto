var express = require('express');
var router = express.Router();
var Course = require('../controllers/course')
var jsonfile = require('jsonfile')
var fs = require('fs') // file system

var multer = require('multer')
var upload = multer({dest: 'uploads'}) // Guarda tudo numa pasta "uploads"

/*                                         GET                                             */
/* GET home page. */
router.get('/', function(req, res, next) {
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
router.get('/:idC', function(req, res, next) {
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
router.get('/:idC/content', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 10)
  jsonfile.readFile(__dirname + "/../data/Files" + req.params.idC + ".json", (erro, registos) => {
    if(erro){
      res.render('error', {error: erro})
    }else{
      console.dir(registos)
      res.render('courseContent', {files: registos, d: data, idC: req.params.idC})
    }
  })
});

/* Pedido de download de um ficheiro */
router.get('/:idC/content/download/:fname', function(req, res) {
  let path = __dirname + '/../public/fileStore/' + req.params.fname
  res.download(path)
});


/*                                          POST                                          */
// Rever isto
router.post('/:idC/content', upload.single('myFile'), (req, res) =>{
  console.log('cdir: ' + __dirname)
  let oldPath = __dirname + '/../' + req.file.path
  console.log('old: ' + oldPath)
  let newPath = __dirname + '/../public/fileStore/' + req.file.originalname
  console.log('new: ' + newPath)

  // Muda o local do ficheiro
  fs.rename(oldPath, newPath, erro => {
    if(erro) console.log(erro)
  })

  var data = new Date().toISOString().substring(0,19);
  var files = jsonfile.readFileSync(__dirname + '/../data/' + req.params.idC + '.json') // Isto não está bem
  files.push({
    date: data,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    desc: req.body.desc
  })

  jsonfile.writeFileSync(__dirname + '/../data/' + req.params.idC + '.json', files)
  
  // Faz um GET para o servidor na /
  res.redirect('/')
})

module.exports = router;