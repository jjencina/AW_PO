const express = require('express');
const router = express.Router();

//Validacion
const { body, validationResult } = require('express-validator');

//Metodos de Integracion
const integracion = require('../services/integracion');

//Middleware para verificar la sesion
const verificarSesion = (req, res, next) => {
  if (req.session && req.session.currentUser) {
    // La sesión está establecida
    res.locals.isAuthenticated = true;
    next();
  } else {
    // La sesión no está establecida, puedes manejar la redirección o el error aquí
    res.locals.isAuthenticated = false; 
    next();}
};

router.use(verificarSesion);

//Guardar el usuario
// Middleware de sesión
router.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser || null;
  next();
});

//Carga la pagina principal
router.get('/', (req, res) => {
  integracion.leerTodosLosTiposIns((err, tipo_ins) => {
    if (err) {
      console.error('Error al obtener tipos de instalaciones:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.render('index', { tipo_ins, isAuthenticated: res.locals.isAuthenticated });
    }
  });
});


// Mandar al usuario a la página de reserva del destino seleccionado
router.get('/reserva/:tipo', (req, res) => {
  const tipo_ins = req.params.tipo;
  usuario = req.session.currentUser;
  var imagenes;
  integracion.buscarImagenesPorTipoIns(tipo_ins, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      imagenes = resultados;
    
    }
  });
  setTimeout(function(){
    res.render('reserva', { 
      imagenes, 
      tipo_ins,
      usuario , 
      errors: [] , 
      reservaExitosa: false, 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,  
    }); // Pasa un array vacío si no hay errores
  },100);
});

//Ruta para obtener las instalaciones de un tipo de cada facultad
router.post('/instalaciones', (req, res) => {
  const tipo_ins = req.body.tipo;
  const facultad = req.body.facultad;
  console.log(tipo_ins);
  console.log(facultad);
  integracion.buscarInstalacionesPorTipoFacultad(tipo_ins, facultad, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(resultados);
    }
  });
});
//Ruta para obtener las horas disponibles de una instalacion
router.post('/horas', (req, res) => { });
// Ruta para manejar la reserva
router.post('/reservar', [
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
  var usuario = req.session.currentUser;
  var imagenes;
  const nombre_destino = req.body.nombre;
  integracion.buscarImagenesPorDestino(nombre_destino, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      imagenes = resultados;
    }
  });
  
  if (!errors.isEmpty()) {
    // Si hay errores de validación, renderiza la vista de reserva con los errores    
   res.render('reserva', { 
        imagenes,
        usuario, 
        errors: errors.array(), 
        reservaExitosa: false, 
        isAuthenticated: res.locals.isAuthenticated,
        FormData: req.body,
      });
   
  } else {
    // Si no hay errores de validación, proceder con la inserción en la base de datos
    const nombre_cliente = req.body.nombre_cliente;
    const email = req.body.email;
    const fechaReserva = req.body.fechaReserva;
    const id_destino = req.body.id_destino;
    const clase_tp = req.body.clase_tp;
    const num_entradas = req.body.num_entradas;
    const tamano_maleta = req.body.tamano_maleta;
    const precio_destino = req.body.precio_destino;

    // Calcula el precio total
    var precio_total = num_entradas * precio_destino;

    // Inserta los datos en la base de datos
    integracion.insertarReserva(id_destino, nombre_cliente, email, fechaReserva, clase_tp, num_entradas, tamano_maleta, precio_total, (error, results) => {
      if (error) {
        console.error('Error al insertar reserva:', error);
        res.status(500).send('Error interno del servidor al insertar reserva');
      } else {
        const nombre_destino = req.body.nombre;
        integracion.buscarDestinoPorNombre(nombre_destino, function (err, resultados) {
          if (err) {
            console.error('Error al buscar el destino por nombre:', err);
            return res.status(500).send('Error interno del servidor');
          }

          const destino = resultados[0];
          res.render('reserva', { 
            imagenes,
            destino, 
            usuario,
            errors: errors.array(), 
            reservaExitosa: true, 
            isAuthenticated: res.locals.isAuthenticated,
            FormData: req.body, 
           });
          });
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

//Comentar
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
  });


  
module.exports = router;
   