const express = require('express');
const router = express.Router();

//Validacion
const { body, validationResult } = require('express-validator');

//Metodos de Integracion
const integracion = require('../services/integracion');



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


// Mandar al usuario a la página de reserva del destino seleccionado
router.get('/reserva/:tipo', (req, res) => {
  const tipo_ins = req.params.tipo;
  var usuario = req.session.currentUser;
  var imagenes = {};
  integracion.buscarImagenesPorTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
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
router.post('/instalaciones', (req, res) => {
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
  const tipo_ins = req.body.tipo_ins;
  const facultad = req.body.facultad;
  var hReservadas = [];
  var collectivo, aforo;;
  var hApertura,hCierre = '';
  //Buscamos el tipo de instalacion para obtener la informacion que necesitamos
  integracion.buscarTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      hApertura = parseInt(resultados[0].hora_de_apertura.split(":")[0]);
      hCierre = parseInt(resultados[0].hora_de_cierre.split(":")[0]);
      collectivo = 0;
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
  });
  var returnArray = [];
  setTimeout(function(){  
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
  res.json(returnArray);
  }, 100);
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
  console.log(errors);
  const tipo_ins = req.body.tipo_ins;
  var correo = req.session.currentUser;
  var imagenes = res.locals.imagenes; 
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
router.get('/admin/instalaciones', (req, res) => {
  integracion.leerTodosLosTiposIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.render('admin/instalaciones', { 
        tipo_ins,
        isAuthenticated: res.locals.isAuthenticated,
        isAdmin: res.locals.isAdmin,
       });
    }
  });
});

/*Comentar
  router.get('/comentar/:destino_id', (req,res)  => {
    const destino_id = req.params.destino_id;
    integracion.buscarComentarioPorDestino(destino_id, (error, results) => {
      if (error) {
        console.error('Error al buscar comentarios:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        //Bucle para formatear la fecha
        for(var i = 0; i < results.length; i++){
          results[i].fecha_comentario = new Date( results[i].fecha_comentario).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        res.json(results);
      }
    }
    );
  });
 
  //Comentar
  router.post('/comentar/:destino_id', (req,res)  => {
    const destino_id = req.params.destino_id;
    const nombre_usuario = req.session.currentUser;
    const comentario = req.body.comentario;
    const fecha = new Date();
    integracion.insertarComentario(destino_id, nombre_usuario, comentario, fecha, (error, results) => {
      if (error) {
        console.error('Error al insertar comentario:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json({success: true})
      }
    });
  });*/


  
module.exports = router;
   