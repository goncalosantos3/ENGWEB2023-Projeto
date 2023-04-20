var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Cenas dos users e sessões, etc.
const {v4 : uuidv4} = require('uuid')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// Configuração com a BD
var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1/PGDRE'
mongoose.connect(mongoDB, {
  useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error...'))
db.on('open', function(){
  console.log("Conexão com MongoDB realizada com sucesso!")
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão...')
    console.log(req.sessionID)
    return uuidv4()},
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

var User = require('./controllers/user')

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'username'}, (username, password, done) => {
    console.log("A autenticar: " + username + ", " + password)
    User.getUser(username)
      .then(user =>{
        if(!user) {return done(null, false, {message: 'Não existe tal utilizador!\n'})}

        if(password != user.password) {return done(null, false, {message: 'Password Inválida\n'})}

        return done(null, user)
      })
      .catch(erro =>  done(erro))
  }
))

// Indica-se ao passport como serealizar o utilizador
// O username funciona como um userID
passport.serializeUser((user, done) => {
  console.log('Vou serealizar o user na sessão: ' + JSON.stringify(user))
  // Serealização do utilizador. O passport grava o utilizador na sessão aqui.
  done(null, user.username)
})

// Indica-se ao passport como desserializar o utilizador
// O username funciona como um userID
passport.deserializeUser((username, done) => {
  console.log('Vou dessealizar o user: ' + username)
  User.getUser(username)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
