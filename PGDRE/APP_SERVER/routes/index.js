var express = require('express');
var router = express.Router();
var axios = require('axios'); // serve para fazer pedidos para os outros servidores

var fs = require('fs') // file system
var multer = require('multer');
var upload = multer({dest: 'uploads'}) // Guarda tudo numa pasta "uploads"

const StreamZip = require('node-stream-zip');
const JSZip = require('jszip'); // Verificar se preciso disto!!!

// Esta função verifica primeiro se existe um token no pedido
// Depois verifica se o token é válido ou não
function verificaToken(req, res, next){
  if(req.cookies && req.cookies.token){
    jwt.verify(req.cookies.token, "PGDRE", function(e, payload){
      if(e){// Erro na validação do token
        res.render('error', {error: "O token do pedido falhou na validação..."})
      }
      else{ // Só avança se existir um token e se este for verificado com sucesso
        next()
      }
    })
  }else{ // Não existe token
    res.render('error', {error: "O pedido não tem um token..."})
  }
}

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
  res.cookie('token', "token.destruido")
  res.redirect('/')
})

// Página inicial 
router.get('/home', verificaToken, function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/news/list')
    .then(dados => {
      res.render('home', {news: dados.data, d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Vai servir para gerar a página com o perfil do utilizador
// Tem que se verificar se o utilizador já está autenticado ou não
router.get('/profile', verificaToken, function(req, res){  
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

// Pedido de eliminação de um recurso
router.get('/resources/delete/:rname', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      res.render('confirmDeleteResource', {r: dados.data[0], d: data})
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Eliminar um recurso
router.get('/resources/delete/:rname/confirm', function(req, res){
  axios.delete('http://localhost:7779/resource/' + req.params.rname + "/delete")
    .then(dados => {
      res.redirect('/resources')
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Download de um recurso
router.get('/resources/download/:rname', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.params.rname)
    .then(dados => {
      console.dir(dados.data)
      let path = __dirname + '/../uploads/' + dados.data[0].type + "/" + req.params.rname
      res.download(path)
    })
    .catch(erro => res.render('error', {error: erro}))
})

// Pedido para adicionar um recurso
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

// Pedido para adicionar uma notícia
router.get('/news/add', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  res.render('addNewsForm', {d: data})
})

// Pedido para editar uma notícia
router.get('/news/edit/:id', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/news/' + req.params.id)
    .then(dados => {
      console.dir(dados)
      res.render('editNewsForm', {n: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Pedido para remover uma notícia
router.get('/news/delete/:id', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/news/' + req.params.id)
    .then(dados => {
      console.dir(dados)
      res.render('deleteNewsConfirm', {n: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Remover um notícia
router.get('/news/delete/:id/confirm', function(req, res){
  axios.delete('http://localhost:7779/news/' + req.params.id)
    .then(dados => {
      res.redirect('/home')
    })
    .catch(erro => {res.render('error', {error: erro})})
})

/*                                POSTS                                 */
// Criar um novo registo de utilizador
// O utilizador não fica autenticado, apenas é inserido um novo utilizador na BD
// Tem que se verificar se já existe algum user com o mesmo username
router.post('/register', verificaToken, function(req,res){
  if(req.body.role == undefined){
    // Faltou completar o papel do utilizador
    res.render('registerForm', {erroRole: true}) 
  }

  axios.post("http://localhost:7778/register?token=" + req.cookies.token, req.body)
    .then(dados => {
      // Falta fazer a template de confirmação de registo
      res.redirect('/')
    })
    .catch(erro => {
      res.render('error', {error: erro})
    })
})

router.post('/login', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.post("http://localhost:7778/login", req.body)
    // A resposta, em caso de sucesso, é associado o jwt ao user
    .then(dados => {
      res.cookie('token', dados.data.token)
      res.redirect('/')
    })
    .catch(erro => {res.render('error', {error: erro})})
})  

// Função que verifica se o rname do novo recurso já existia ou não
// Se já existir, o recurso tem que ser rejeitado
function verificaRName(req, res, next){
  var data = new Date().toISOString().substring(0,16)
  axios.get('http://localhost:7779/resource/' + req.file.originalname)
    .then(dados => {
      if(dados.data.length != 0){ // Já existe um recurso com este nome
        let path = __dirname + '/../' + req.file.path
        try{
          fs.unlinkSync(path)
        }catch(e){
          console.log(e)
        }
        res.render('addResourceForm', {erros: ["O nome do recurso já existe. Por favor altere-o!"], d:data})
      }else{
        next() // Continua com o upload do recurso
      }
    })
    .catch(erro => {res.render('error', {error: erro})})
}

// Upload de um novo recurso educacional
// Tem que se realizar a verificação de que o zip está correto
// Os recursos não podem ter nomes repetidos (resourceName é considerado um id)
router.post('/upload/resource', upload.single('resource'), verificaRName, function(req, res){
  var data = new Date().toISOString().substring(0,16)
  var metadata
  erros = []
  recurso = {
    conteudo: [],
    todos: [],
    manifesto: {
      existe: true,
      valido: true
    },
    metadados: {
      existe: true,
      valido: true
    }
  }
  // 1. Verificar se o manifesto bate certo com o conteúdo do zip
  // 2. Verificar se o ficheiro SIP json está correto
  if(req.file.mimetype == 'application/zip' || req.file.mimetype == "application/x-zip-compressed"){
    var zip = new StreamZip({
      file: req.file.path,
      storeEntries: true
    })

    zip.on("error", (err) => {
      console.log("xD")
      res.render("error", {error: err})
    });
    zip.on('ready', () => {
      for (const entry of Object.values(zip.entries())){
        recurso.todos.push(entry.name)
        if(entry.name != "manifest.txt" && entry.name != "PGDRE-SIP.json"){
          recurso.conteudo.push(entry.name)
        }
      }

      if(recurso.conteudo.length == 0){
        erros.push("O recurso não contém conteúdo.")
      }

      if(recurso.todos.includes("manifest.txt")){
        manifest = zip.entryDataSync("manifest.txt").toString('utf8')
        manifest = manifest.replace('\n', '')
        files = manifest.split('|')
        for(file of recurso.conteudo){
          if(!files.includes(file)){
            recurso.manifesto.valido = false
          }
        }

        if(recurso.manifesto.valido == false){
          erros.push("O recurso não contém um ficheiro manifesto válido")
        }
      }else{
        recurso.manifesto.existe = false
        erros.push("O recurso não contém um ficheiro manifesto")
      }

      if(recurso.todos.includes("PGDRE-SIP.json")){
        jsonfile = zip.entryDataSync("PGDRE-SIP.json").toString('utf8')
        metadata = JSON.parse(jsonfile)
        req.body.metadados = metadata

        if(!(metadata.hasOwnProperty('title')
        && metadata.hasOwnProperty('type') && metadata.hasOwnProperty('dateCreation')
        && metadata.hasOwnProperty('visibility') && metadata.hasOwnProperty('author'))){
          recurso.metadados.valid = false
        }
  
        if(metadata.type != 'Ficha' && metadata.type != 'Teste' && metadata.type != 'Slides' && metadata.type != 'Tese'){
          recurso.metadados.valid = false
        }

        if(metadata.visibility != 'Public' && metadata.visibility != 'Private'){
          recurso.metadados.valid = false
        }

        if(recurso.metadados.valid == false){
          erros.push("O recurso contém um ficheiro de metadados inválido")
        }      
      }else{
        recurso.metadados.existe = false
        erros.push("O recurso não tem um ficheiro de metadados")
      }
      
      // Se houve algum erro o recurso não é validado
      if(erros.length != 0){
        let path = __dirname + '/../' + req.file.path
        try{
          fs.unlinkSync(path) // Remove o recurso inválido
        }catch(e){
          console.log(e)
        }
        res.render('addResourceForm', {erros: erros, d: data})
      }else{// Recurso validado com sucesso
        dados = zip.entryDataSync("PGDRE-SIP.json").toString('utf8')
        metadadosObj = JSON.parse(dados)

        var r = {
          resourceName: req.file.originalname,
          files: recurso.conteudo,
          title: metadadosObj.title,
          subtitle: metadadosObj.subtitle,
          type: metadadosObj.type,
          dateCreation: metadadosObj.dateCreation,
          dateSubmission: new Date().toISOString().slice(0, 19).split('T').join(' '),
          visibility: metadadosObj.visibility,
          author: metadadosObj.author
        } 
        let oldPath =  __dirname + '/../' + req.file.path
        let newPath = __dirname + '/../uploads/' + metadadosObj.type + '/' + req.file.originalname

        fs.rename(oldPath,newPath, erro =>{
          if(erro) res.render('error',{error:erro})
          else{
            axios.post('http://localhost:7779/resource/add', r)
              .then(dados => {
                var n = {
                  username: "A implementar!",
                  resourceName: req.file.originalname,
                  event: "O utilizador (a implementar) adicionou um novo recurso: " + req.file.originalname,
                  date: new Date().toISOString().slice(0, 19).split('T').join(' '),
                  visibility: r.visibility
                }

                axios.post('http://localhost:7779/news/add', n)
                  .then(dados => {
                   res.redirect('/resources')
                  })
                  .catch(e => res.render('error', {error: e})) 
              })
              .catch(error => res.render('error', {error: error}))
          }
        })
      }
    })
  }else{
    erros.push("O recurso não é um zip!")
    res.render('addResourceForm', {erros: erros})
  }
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
    username: req.body.username,
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

// Pesquisa nos recursos
router.post('/resources/search', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  axios.post('http://localhost:7779/resource/search', req.body)
    .then(dados => {
      res.render('resources', {rs: dados.data, d: data})
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Adicionar uma notícia
// Tenho que verificar se o nome do recurso inserido é válido ou não
router.post('/news/add', function(req, res){
  axios.get('http://localhost:7779/resource/' + req.body.resourceName)
    .then(dados => {
      console.dir(dados.data)
      if(dados.data.length == 0){ // Não existe nenhum recurso com esse nome
        res.render('addNewsForm', {erro: "O nome do Recurso é inválido!"})
      }else{ // Existe um recurso com este nome
        var n = {
          username: req.body.username,
          resourceName: req.body.resourceName,
          event: req.body.event,
          date: new Date().toISOString().slice(0, 19).split('T').join(' '),
          visibility: dados.data[0].visibility
        }
        axios.post('http://localhost:7779/news/add', n)
          .then(dados => {
            res.redirect('/home')
          })
          .catch(erro => {res.render('error', {error: erro})})
      }
    })
    .catch(erro => {res.render('error', {error: erro})})
})

// Editar uma notícia
router.post('/news/edit/:id', function(req, res){
  var n = {
    _id: req.params.id,
    username: req.body.username,
    resourceName: req.body.resourceName,
    event: req.body.event,
    date: req.body.date,
    visibility: req.body.visibility,
  }

  axios.post('http://localhost:7779/news/edit/' + req.params.id, n)
    .then(dados => {
      res.redirect('/home')
    })
    .catch(erro => {res.render('error', {error: erro})})
})
module.exports = router;
