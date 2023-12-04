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

// Mandar al usuario a la página de reserva del destino seleccionado
router.get('/reserva/:nombre', (req, res) => {
  const nombre_destino = req.params.nombre;
  usuario = req.session.currentUser;
  var imagenes,destino;
  integracion.buscarImagenesPorDestino(nombre_destino, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el imagen por destino:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      imagenes = resultados;
    
    }
  });
  integracion.buscarDestinoPorNombre(nombre_destino, function (err, resultados) {
    if (err) {
      console.error('Error al buscar el destino por nombre:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      destino = resultados[0];
      
    }
  });
  setTimeout(function(){
    console.log(imagenes);
    console.log(destino);
    res.render('reserva', { 
      imagenes, 
      destino, 
      usuario , 
      errors: [] , 
      reservaExitosa: false, 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,  
    }); // Pasa un array vacío si no hay errores
  },100);
});

// Ruta para manejar la reserva
router.post('/reservar', [
  // Validación de campos
  //body('nombre_cliente').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'), 
  body('clase_tp').notEmpty().withMessage('La clase de teletransporte es obligatoria'),
  body('num_entradas').isInt({ min: 1 }).withMessage('El número de entradas debe ser al menos 1'),
  body('tamano_maleta').notEmpty().withMessage('El tamaño de la maleta es obligatorio'),
  body('fechaReserva').custom((value) => {
    // Validar que la fecha de reserva sea menor que la fecha actual
    const today = new Date();
    const selectedDate = new Date(value);
    if (selectedDate < today || selectedDate.getTime() < 0) {
      throw new Error('La fecha de reserva debe ser mayor o igual a la fecha actual');
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
    integracion.buscarDestinoPorNombre(nombre_destino, function (err, resultados) {
      if (err) {
        console.error('Error al buscar el destino por nombre:', err);
        return res.status(500).send('Error interno del servidor');
      }

      const destino = resultados[0];
      return res.render('reserva', { 
        imagenes,
        destino,
        usuario, 
        errors: errors.array(), 
        reservaExitosa: false, 
        isAuthenticated: res.locals.isAuthenticated,
        FormData: req.body,
      });
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

// Ruta para la página de éxito
router.get('/exito', (req, res) => {
  res.render('exito', { isAuthenticated: res.locals.isAuthenticated });
});

//Carga la pagina principal
router.get('/', (req, res) => {
  integracion.leerTodosLosDestinos((err, destinos) => {
    if (err) {
      console.error('Error al obtener destinos:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.render('index', { destinos , isAuthenticated: res.locals.isAuthenticated });
    }
  });
});

//Gestion de Usuarios
//LLamar al formulario de login
router.get('/login', (req, res) => {
  console.log(req.session.currentUser);
  res.render('login', { 
    errors: [], 
    isAuthenticated: res.locals.isAuthenticated,
    FormData: req.body,
  });
});
 
//Iniciar Sesion Usuario
router.post('/login',  [
  //Validar el formulario
  body('usuario').notEmpty().withMessage('El nombre es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Hay errores
      return res.render('login', { 
        errors: errors.array(), 
        isAuthenticated: res.locals.isAuthenticated,
        FormData: req.body,
      });
    } 

    const nombreUsuario = req.body.usuario;
    const contraseniaUsuario = req.body.password;

    //Consultar si el usuario existe en la db
    integracion.buscarUsuarioPorNombre(nombreUsuario, (error, results) => {
      if (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send('Error interno del servidor');
      }

      if (results.length === 0) {
        return res.render('login', { 
          errors: [{ msg: 'Usuario no encontrado' }],
          isAuthenticated: res.locals.isAuthenticated,
          FormData: req.body,
        });
      }

      const usuarioBD = results[0];

      if (usuarioBD.contrasena !== contraseniaUsuario) {
        return res.render('login', { 
          errors: [{ msg: 'Credenciales incorrectas' }],
          isAuthenticated: res.locals.isAuthenticated,
          FormData: req.body,
        });
      }

      //Autenticación exitosa, almacenar usuario en la sesión
      req.session.currentUser =  nombreUsuario;
      console.log(req.session.currentUser);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error en la ruta de login:', error);
    res.status(500).send('Error interno del servidor');
  }
});
 
//Llamar a register
 router.get('/register', (req, res) => {
  res.render('register', { 
    errors: [] , 
    exito: false, 
    isAuthenticated: res.locals.isAuthenticated,
    FormData: req.body, 
   });
 });
 
//Registrar Usuario
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  body('confirmPassword').custom((value, { req }) => {
    const contrasenias = req.body.password;
    const c1 = contrasenias[0];
    const c2 = contrasenias[1];
    if (c1 !== c2) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  })

], (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    // Hay errores, se vuelve a llamar a registro.ejs con los errores
    res.render('register', { 
      errors: errors.array(), 
      exito: false, isAuthenticated: 
      res.locals.isAuthenticated,
      FormData: req.body, 
    });
  } else {
      const nombreUsuario = req.body.nombre;
      // Consultar si el usuario ya existe en la base de datos
      integracion.buscarUsuarioPorNombre(nombreUsuario, (error, results) => {
        if (error) {
          console.error('Error al insertar reserva:', error);
          res.status(500).send('Error interno del servidor');
        } else {
          console.log(results.length);
          // Si ya existe un usuario con ese nombre, mostrar un error
          if (results.length > 0) {
            return res.render('register', { 
              errors: [{ msg: 'El nombre de usuario ya está registrado' }], 
              exito: false, isAuthenticated: 
              res.locals.isAuthenticated,
              FormData: req.body, 
            });
          }
          const correo = req.body.correo;
          const password = req.body.password[0];
          integracion.registrarUsuario(nombreUsuario, correo, password, function (err, resultados) {
            if (err) {
              console.error('Error al registrar usuario:', err);
              return res.status(500).send('Error interno del servidor');
            }
            res.redirect('/');
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
   