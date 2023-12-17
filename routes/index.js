const express = require('express');
const router = express.Router();

//Validacion
const { body, validationResult } = require('express-validator');

//Metodos de Integracion
const integracion = require('../services/integracion');
const multer = require('multer');
const path = require('path');



//Middleware para comprobar que el usuario está logueado
const comprobarLogin = (req, res, next) => {
  var correo = req.session.currentUser;
  integracion.buscarUsuarioPorCorreo(correo, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el usuario por correo:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      //Si no está logueado, redirigir a la página de login
      if(resultados.length == 0){
        res.render('login', {errors: [{msg : 'Debe iniciar sesión para poder reservar una instalación'}],
        isAuthenticated: res.locals.isAuthenticated,
        FormData: req.body,
        isAdmin: res.locals.isAdmin,
      });
      }
      else{
        //Guardamos el nombre del usuario en la variable local
        res.locals.nombre_usu = resultados[0].nombre;
        next();
      }      
    }
  });
}
//Middleware para cargar la imagen de la pagina de reserva
const cargarImagen = (req, res, next) => {
  const tipo_ins = req.body.tipo_ins;
  integracion.buscarImagenesPorTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.locals.imagenes = resultados;
      next();
    }
  });
}

//Carga la pagina principal
router.get('/', (req, res) => {
  integracion.leerTodosLosTiposIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.render('index', { 
        tipo_ins,
        isAuthenticated: res.locals.isAuthenticated,
        isAdmin: res.locals.isAdmin,
       });
    }
  });
});

//Obtener todos los tipos de instalaciones
router.get('/obtener_tipos_instalacion', (req, res) => {
  integracion.leerTodosLosTiposIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(tipo_ins);
    }
  });
});

//Obtiene todos las instalaciones
router.get('/obtener_instalaciones', (req, res) => {
  integracion.leerTodasLasInstalaciones((err, instalaciones) => {
    if (err) {
      console.error('Error al obtener instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(instalaciones);
    }
  });
});

//crear una instalacion
router.post('/crear_instalacion', (req, res) => {
  const nombre_ins = req.body.nombre;
  const tipo_ins = req.body.tipo;
  const facultad = req.body.facultad;

  if (!nombre_ins || !tipo_ins || !facultad) {
    return res.status(400).send('Faltan campos obligatorios en el formulario.');
  }
r
  integracion.insertarInstalacion(nombre_ins, tipo_ins, facultad, (err, results) => {
    if (err) {
      console.error('Error al insertar instalación:');
      console.error('Error al insertar instalación:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log('Instalación creada correctamente');
      res.json({ success: true});
    }
  });
});

//Middleware para buscar el tipo de instalacion
const buscarTipoIns = (req, res, next) => {
  const tipo_ins = req.params.tipo;
  integracion.buscarTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el tipo de instalacion:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      var hora = resultados[0].hora_de_apertura.split(':');
      resultados[0].hora_de_apertura = hora[0] + ':' + hora[1];
      hora = resultados[0].hora_de_cierre.split(':');
      resultados[0].hora_de_cierre = hora[0] + ':' + hora[1];
      res.locals.tipo_ins = resultados[0];
      next();
    }
  });
}

// Mandar al usuario a la página de reserva del destino seleccionado
router.get('/reserva/:tipo', buscarTipoIns, (req, res) => {
  const tipo_ins = res.locals.tipo_ins;
  var usuario = req.session.currentUser;
  var imagenes = {};
  integracion.buscarImagenesPorTipoIns(tipo_ins.tipo, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log(resultados)
      imagenes = resultados;
    }
    render();
  });
  function render(){
    res.render('reserva', { 
      imagenes, 
      tipo_ins,
      usuario , 
      errors: [] , 
      reservaExitosa: false, 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body, 
      isAdmin: res.locals.isAdmin, 
    });
  } // Pasa un array vacío si no hay errores
});

//Ruta para obtener las instalaciones de un tipo de cada facultad
router.post('/lista-instalaciones', (req, res) => {
  const tipo_ins = req.body.tipo;
  const facultad = req.body.facultad;
  integracion.buscarInstalacionesPorTipoFacultad(tipo_ins, facultad, function (err, resultados) {
    if (err) {
      console.error('Error al buscar instalaciones por tipo y facultad:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(resultados);
    }
  });
});
//Ruta para obtener las horas disponibles de una instalacion
router.post('/horasDisponibles', (req, res) => { 
  const nombre_ins= req.body.instalacion;
  const fecha = req.body.fecha;
  var compFecha = new Date(fecha);
  const tipo_ins = req.body.tipo_ins;
  const facultad = req.body.facultad;
  var hReservadas = [];
  var collectivo, aforo;
  var hApertura,hCierre = '';

  //Comprobamos que no es fin de semana ni una fecha pasada
  
  //Buscamos el tipo de instalacion para obtener la informacion que necesitamos
  integracion.buscarTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      hApertura = parseInt(resultados[0].hora_de_apertura.split(":")[0]);
      hCierre = parseInt(resultados[0].hora_de_cierre.split(":")[0]);
      collectivo = resultados[0].colectivo;
      aforo = resultados[0].aforo;
    }
  });
  var comprobar = Array.from({ length: 24 }).fill(0);
  //Obtenemos las horas reservadas de esa instalacion
  integracion.buscarHorasReservadas(nombre_ins, fecha, facultad, function (err, resultados) {
    if (err) {
      console.error('Error al buscar las horas reservadas de una fecha:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      for(var i = 0; i < resultados.length; i++){
        var elemento = parseInt(resultados[i].hora_res.split(":")[0])
        if(collectivo == 0){
          //Por cada reserva en esa hora sumamos 1
          comprobar[elemento]++;
        }
        hReservadas.push(elemento);
      }      
    }
    resultado();
  });
  
  function resultado(){  
    var returnArray = [];
    if(!(compFecha.getDay() == 0 || compFecha.getDay() == 6 || compFecha.getTime() < 0 || compFecha < new Date())){
      //Si es individual, comprobamos que no está lleno los puestos de cada hora
      if(collectivo == 0){
        for(var i = hApertura; i < hCierre; i+=2){
          if(comprobar[i] < aforo){
            var elemento = i.toString() + ":00";
            returnArray.push(elemento);
          }
        }
      }
      //Si es colectivo, comprobamos que no está reservada la hora
      else{
        for(var i = hApertura; i < hCierre; i+=2){
          if(!hReservadas.includes(i)){
            var elemento = i.toString() + ":00";
            returnArray.push(elemento);
          }
        }
    }
  }
  res.json(returnArray);
}
});


// Ruta para manejar la reserva
router.post('/reservar', comprobarLogin, cargarImagen, [
  // Validación de campos
  body('fecha').custom((value) => {
    // Validar que la fecha de reserva sea menor que la fecha actual
    const today = new Date();
    const selectedDate = new Date(value);
    if (selectedDate < today || selectedDate.getTime() < 0) {
      throw new Error('La fecha de reserva debe ser mayor o igual a la fecha actual');
    }
    //Comprobar que no es fin de semana
    else if(selectedDate.getDay() == 0 || selectedDate.getDay() == 6){
      throw new Error('No se puede reservar en fin de semana');
    }
    return true;
  }),
], (req, res) => {  
  // Manejar errores de validación
  const errors = validationResult(req);
  var tipo_ins = req.body.tipo_ins;
  var correo = req.session.currentUser;
  var imagenes = res.locals.imagenes; 
  integracion.buscarTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      tipo_ins = resultados[0];
    }
    continuar();
  });
  function continuar(){
    if (!errors.isEmpty()) {
          // Si hay errores de validación, renderiza la vista de reserva con los errores    
        res.render('reserva', { 
              imagenes,
              tipo_ins,
              correo, 
              errors: errors.array(), 
              reservaExitosa: false, 
              isAuthenticated: res.locals.isAuthenticated,
              FormData: req.body,
              isAdmin: res.locals.isAdmin,
            });
    } else {
        // Si no hay errores de validación, proceder con la inserción en la base de datos
        var nombre_ins = req.body.instalacion;
        var fecha = req.body.fecha;
        var hora = req.body.hora;
        var facultad = req.body.facultad;
        var nombre_usu = res.locals.nombre_usu;
        
        integracion.insertarReserva(nombre_ins,facultad, nombre_usu, correo, fecha, hora, function (err, resultados) {
          if (err) {
            console.error('Error al insertar la reserva:', err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.render('reserva', { 
              imagenes, 
              tipo_ins,
              correo , 
              errors: [] , 
              reservaExitosa: true, 
              isAuthenticated: res.locals.isAuthenticated,
              FormData: req.body,  
              isAdmin: res.locals.isAdmin,
            }); // Pasa un array vacío si no hay errores
          }
        });
      }
    }
  });
  //Cerrar sesion o logout
  // Cerrar sesión
  router.get('/logout', (req, res) => {
    try {
      // Destruir la sesión
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.status(500).send('Error interno del servidor');
        }
        res.redirect('/');

      });
    } catch (error) {
      console.error('Error en la ruta de logout:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

 
//get pagina de de admin/instalaciones
router.get('/instalaciones', (req, res) => {
  res.render('instalaciones', { 
    isAuthenticated: res.locals.isAuthenticated,
    isAdmin: res.locals.isAdmin,
    });
});

//get  instalaciones instalaciones
router.get('/leer-instalaciones', (req, res) => {
  integracion.buscarTipoIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      instalaciones = results;
      res.json(instalaciones);
    }
  });
});

 //Buscar tipos
 router.post('/buscarTipos', (req, res) => {
  integracion.leerTodosLosTiposIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(tipo_ins);
    }
  });
 }); 

 //Editar tipo de instalacion
  router.post('/editar_tipo_instalacion', (req, res) => {
    const tipo_ins = req.body.tipo;
    const descripcion = req.body.descripcion;
    const hora_de_apertura = req.body.horaApertura;
    const hora_de_cierre = req.body.horaCierre;
    const colectivo = req.body.colectivo;
    const aforo = req.body.aforo;
    console.log(req.body);
    integracion.editarTipoIns(tipo_ins, hora_de_apertura, hora_de_cierre, colectivo, aforo, descripcion, (err, results) => {
      if (err) {
        console.error('Error al editar tipo de instalacion:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        console.log('Tipo de instalacion editada correctamente');
        res.json({ success: true});
      }
    });
  });

 //Historial de reservas
  router.post('/historial', (req, res) => {
    nombre = req.body.nombre;
    console.log(nombre);
    if(nombre.indexOf('@') !== -1){
      integracion.buscarReservasPorCorreo(nombre, function (err, resultados) {
        if (err) {
          console.error('Error al buscar el usuario por correo:', err);
          res.status(500).send('Error interno del servidor');
        } else {
          for(var i = 0; i < resultados.length; i++){
            fecha = resultados[i].fecha_res;
            fecha = new Date(fecha);
            dia = fecha.getDate();
            mes = fecha.getMonth() + 1;
            anio = fecha.getFullYear();
            fecha = dia + '/' + mes + '/' + anio;
            resultados[i].fecha_res = fecha;
          }
          res.json(resultados);
        }
      });
    }
    else{
      integracion.buscarReservasPorInstalacion(nombre, function (err, resultados) {
        if (err) {
          console.error('Error al buscar el usuario por correo:', err);
          res.status(500).send('Error interno del servidor');
        } else {
          for(var i = 0; i < resultados.length; i++){
            fecha = resultados[i].fecha_res;
            fecha = new Date(fecha);
            dia = fecha.getDate();
            mes = fecha.getMonth() + 1;
            anio = fecha.getFullYear();
            fecha = dia + '/' + mes + '/' + anio;
            resultados[i].fecha_res = fecha;
          }
          res.json(resultados);
        }
      });
    }
  });

  //Get titulo ucm de la bd
  router.get('/nombre-org', (req, res) => {
    integracion.leerNombreOrganizacion((err, facultad) => {
      var titulo = facultad[0].titulo;
      if (err) {
        console.error('Error al obtener nombre de la organizacion:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json(titulo);
      }
    });
  });

// Configurar multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, 'logoUCM.png');
  }
});

                                   

const upload = multer({ storage: storage });

// Ruta para configurar el sistema y cambiar la foto del logo
router.post('/configurar-sistema', upload.single('file'), (req, res) => {
  //Cambiar el nombre de la organizacion
  console.log(req.body.nombre_facultad);
  const titulo = req.body.nombre_facultad;
  integracion.cambiarTituloUCM(titulo, (err, results) => {
    if (err) {
      console.error('Error al cambiar el titulo de la organizacion:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log('Titulo cambiado correctamente');
      res.json({ success: true });
    }
  }); 
});

module.exports = router;
   