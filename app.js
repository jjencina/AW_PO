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

//Sesiones
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "aw"
});

const middlewareSession = session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
});

app.use(middlewareSession);

/*-----Cosas Añadidas------*/
const port = 5500;

// Middleware para recibir formularios
app.use(express.urlencoded({ extended: true }));

//Ruta en indexRouter
app.use('/', indexRouter);

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
