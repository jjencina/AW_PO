"use strict";
const path = require("path");
const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();

//Middleware para gestionar cookies y logs
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Middleware para parsear datos en las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
const indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Metodos de Integracion
const integracion = require('./services/integracion');

//Sesiones
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "ucm_riu",
});

const middlewareSession = session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
});

app.use(middlewareSession);

/*-----Cosas Añadidas------*/
const port = 3000;

// Middleware para recibir formularios
app.use(express.urlencoded({ extended: true }));

//Guardar el usuario
// Middleware de sesión
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser || null;
  next();
});

//Middleware para verificar la sesion
const verificarSesion = (req, res, next) => {
  if (req.session && req.session.currentUser) {
    // La sesión está establecida
    res.locals.isAuthenticated = true;
    next();
  } else {
    // La sesión no está establecida
    res.locals.isAuthenticated = false; 
    next();}
};
app.use(verificarSesion);

//Middleware para comprobar que el usuario es admin y gaurdarlo en una variable que pasar a los ejs
const comprobarAdmin = (req, res, next) => {
  var correo = req.session.currentUser;
  integracion.buscarUsuarioPorCorreo(correo, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el usuario por correo:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      if(resultados.length == 0){
        next();
      }
      else{        
        const usuario = resultados[0];
        if(usuario.admin == 1){
          res.locals.isAdmin = true;
        }
        else{
          res.locals.isAdmin = false;
        }
        next();
      }
    }
  });
}
app.use(comprobarAdmin);

//Ruta en indexRouter
app.use('/', indexRouter);
app.use('/', usersRouter)

//Abre el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

/*-------------------------*/

// Configuración de la vista del motor EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de otros middleware y recursos estáticos
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configura las rutas en indexRouter y usersRouter
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
