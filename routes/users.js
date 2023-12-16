const express = require('express');
const router = express.Router();

//Validacion
const { body, validationResult } = require('express-validator');

//Metodos de Integracion
const integracion = require('../services/integracion');
const path = require('path');

//Middleware para fotos
const multer = require('multer');
const { trim } = require('jquery');

//Middleware para buscar mensajes recibidos
const buscarMensajesRecibidos = (req, res, next) => {
  const correo = req.session.currentUser;
  integracion.buscarMensajesRecibidos(correo, (error, results) => {
    if (error) {
      console.error('Error al buscar mensajes:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.locals.recibidos = results;
    next();
  });
};
//Middleware para buscar mensajes enviados
const buscarMensajesEnviados = (req, res, next) => {
  const correo = req.session.currentUser;
  integracion.buscarMensajesEnviados(correo, (error, results) => {
    if (error) {
      console.error('Error al buscar mensajes:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.locals.enviados = results;
    next();
  });
};

//Middleware pare trimmear la fecha de los mensajes
const trimFecha = (req, res, next) => {
  const mensajes = res.locals.enviados.concat(res.locals.recibidos);
  mensajes.sort(descendente);
  for(var i = 0; i < mensajes.length; i++){
    hora = mensajes[i].hora.split(':');
    mensajes[i].hora = hora[0] + ':' + hora[1];
    fecha = mensajes[i].fecha;
    fecha = new Date(fecha);
    dia = fecha.getDate();
    mes = fecha.getMonth() + 1;
    anio = fecha.getFullYear();
    fecha = dia + '/' + mes + '/' + anio;
    mensajes[i].fecha = fecha;
  }
  res.locals.mensajes = mensajes;
  next();
};

//Gestion de Usuarios
//LLamar al formulario de login
router.get('/login', (req, res) => {
  console.log(req.session.currentUser);
  res.render('login', { 
    errors: [], 
    isAuthenticated: res.locals.isAuthenticated,
    FormData: req.body,
    isAdmin: res.locals.isAdmin,
  });
});

//Iniciar Sesion Usuario
router.post('/login',  [
  //Validar el formulario
  body('correo').notEmpty().withMessage('El correo es obligatorio'),
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
        isAdmin: res.locals.isAdmin,
      });
    } 

    const correoUsuario = req.body.correo;
    const contraseniaUsuario = req.body.password;

    //Consultar si el usuario existe en la db
    integracion.buscarUsuarioPorCorreo(correoUsuario, (error, results) => {
      if (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send('Error interno del servidor');
      }

      if (results.length === 0) {
        return res.render('login', { 
          errors: [{ msg: 'Usuario no encontrado' }],
          isAuthenticated: res.locals.isAuthenticated,
          FormData: req.body,
          isAdmin: res.locals.isAdmin,
        });
      }

      const usuarioBD = results[0];

      if (usuarioBD.contrasena !== contraseniaUsuario) {
        return res.render('login', { 
          errors: [{ msg: 'Credenciales incorrectas' }],
          isAuthenticated: res.locals.isAuthenticated,
          FormData: req.body,
          isAdmin: res.locals.isAdmin,
        });
      }

      if(usuarioBD.validado === 0){
        return res.render('login', { 
          errors: [{ msg: 'Usuario no validado' }],
          isAuthenticated: res.locals.isAuthenticated,
          FormData: req.body,
          isAdmin: res.locals.isAdmin,
        });
      }

      //Autenticación exitosa, almacenar usuario en la sesión
      req.session.currentUser =  correoUsuario;
      console.log(req.session.currentUser);
      
      //actulizar el estado de la sesion
      req.session.save((err) => {
        if (err) {        
          return res.status(500);
        }
      });
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
    isAdmin: res.locals.isAdmin,
   });
 });

 //Registrar Usuario
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido1').notEmpty().withMessage('El primer apellido es obligatorio'),
  body('correo').isEmail().withMessage('El correo electrónico no es válido'),
  body('facultad').notEmpty().withMessage('La facultad es obligatoria'),
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
      isAdmin: res.locals.isAdmin, 
    });
  } else {
      
      const correoUsuario = req.body.correo;
      // Consultar si el usuario ya existe en la base de datos
      integracion.buscarUsuarioPorCorreo(correoUsuario, (error, results) => {
        if (error) {
          console.error('Error al insertar reserva:', error);
          res.status(500).send('Error interno del servidor');
        } else {
          console.log(results.length);
          // Si ya existe un usuario con ese nombre, mostrar un error
          if (results.length > 0) {
            return res.render('register', { 
              errors: [{ msg: 'El correo ya está registrado' }], 
              exito: false, isAuthenticated: 
              res.locals.isAuthenticated,
              FormData: req.body, 
              isAdmin: res.locals.isAdmin,
            });
          }
          const nombreUsuario = req.body.nombre;
          const password = req.body.password[0];
          const apellido1 = req.body.apellido1;
          const apellido2 = req.body.apellido2;
          const facultad = req.body.facultad;
          integracion.registrarUsuario(nombreUsuario, correoUsuario, apellido1, apellido2, facultad, password, function (err, resultados) {
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

//Llamar a perfil
router.get('/profile', (req, res) => {
  //Leer usuario por correo
  const correoUsuario = req.session.currentUser;
  integracion.buscarUsuarioPorCorreo(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    const usuario = results[0];
    res.render('profile', { 
      errors: [], 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,
      correo: req.session.currentUser,
      usuario,
      isAdmin: res.locals.isAdmin,
    });
  });
});

//Get user-photo
router.post('/user-photo', (req, res) => {
  //Leer usuario por correo y devolver la foto
  const correoUsuario = req.session.currentUser;
  integracion.buscarUsuarioPorCorreo(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    const usuario = results[0];
    res.json(usuario);
  });
});
  
//Llamar admin
router.get('/stats', (req, res) => {
  res.render('stats', { 
    errors: [], 
    isAuthenticated: res.locals.isAuthenticated,
    FormData: req.body,
    isAdmin: res.locals.isAdmin,
  });
});

//Llamar a admin/usuarios
router.get('/user', (req, res) => {
    usuarios = {};
    res.render('users', { 
      errors: [] , 
      exito: false, 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,    
      isAdmin: res.locals.isAdmin,
    });
  
});

//Mediante Ajax devolver usuarios de la base de datos a la vista
router.get('/users', (req, res) => {
  //Leer usuarios de la base de datos
  integracion.leerTodosLosUsuarios((error, results) => {
    if (error) {
      console.error('Error al buscar usuarios:', error);
      return res.status(500).send('Error interno del servidor');
    }
    usuarios = results;
    res.json(usuarios);
  });
});

//post para borrar usuarios
router.post('/expel-users/:correo', (req, res) => {
  const correoUsuario = req.params.correo;
  integracion.expulsarUsuario(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al borrar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/users/admin/user');
  });
});

//Validar Usuario
router.post('/validate-users/:correo', (req, res) => {
  const correoUsuario = req.params.correo;
  integracion.validarUsuario(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al validar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    //TODO: Enviar correo de validacion
    res.redirect('/users/admin/user');
  });
});

//Invalidar Usuario
router.post('/invalidate-users/:correo', (req, res) => {
  const correoUsuario = req.params.correo;
  integracion.invalidarUsuario(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al invalidar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/users/admin/user');
  });
});

//Hacer admin
router.post('/make-admin/:correo', (req, res) => {
  const correoUsuario = req.params.correo;
  integracion.hacerAdmin(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al hacer admin:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/users/admin/user');
  });
});

//Quitar admin
router.post('/remove-admin/:correo', (req, res) => {
  const correoUsuario = req.params.correo;
  integracion.quitarAdmin(correoUsuario, (error, results) => {
    if (error) {
      console.error('Error al quitar admin:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/users/admin/user');
  });
});

// Configurar el almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/users');
  },
  filename: (req, file, cb) => {
    //funcion en integracion para buscar el id del usuario
    const correoUsuario = req.session.currentUser;   
    integracion.buscarUsuarioPorCorreo(correoUsuario, (error, results) => {
      userId = results[0].id;
      const fileName = `user${userId}${path.extname(file.originalname)}`;
      req.session.profileImage = fileName; // Guardar el nombre de la foto en la sesión
      cb(null, fileName);
    });
  }
});

// Crear el middleware de multer
const upload = multer({ storage });

// Ruta para subir la foto de perfil
router.post('/upload-profile-image', upload.single('profile-image'), (req, res, next) => {
  // La foto se ha subido correctamente
  res.status(200).send(req.session.profileImage); // Devolver el nombre de la foto nueva
});

//Cerrar sesion o logout
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
//Funcion para ordenar los mensajes
function descendente(a, b){
  if(a.fecha < b.fecha) { return 1; }
  else if(a.fecha > b.fecha) { return -1; }
  else { if(a.hora < b.hora) { return 1; }
     else if(a.hora > b.hora) { return -1; }
     else { return 0; }
   };
}
const listarUsuariosMensajes = (req, res, next) => {
  var mensajes = res.locals.mensajes;
 
  var usuario = req.session.currentUser;
 
  var listaUsuarios = [];
  for(var i = 0; i < mensajes.length; i++){
    if(usuario == mensajes[i].correoEmisor){
      if(!listaUsuarios.includes(mensajes[i].correoReceptor)){
        listaUsuarios.push(mensajes[i].correoReceptor);
      }
    }else{
      if(!listaUsuarios.includes(mensajes[i].correoEmisor)){
        listaUsuarios.push(mensajes[i].correoEmisor);
      }
    }
  }
  res.locals.listaUsuarios = listaUsuarios;
  res.locals.mensajes = mensajes.reverse();
  next();
}
//Cargar la pagina de mensajes
router.get('/mensajes', buscarMensajesEnviados, buscarMensajesRecibidos, trimFecha,listarUsuariosMensajes, (req, res) => {
  var usuario = req.session.currentUser;
  var mensajes = res.locals.mensajes;
  var mensajesFiltrados = [];
  var listaUsuarios = res.locals.listaUsuarios;
  var fotoUsuario = [];
  integracion.leerTodosLosUsuarios((error, results) => {
    if (error) {
      console.error('Error al buscar usuarios:', error);
      return res.status(500).send('Error interno del servidor');
    }
    for(var j = 0; j < listaUsuarios.length; j++){
      for(var i = 0; i < results.length; i++){
        if(listaUsuarios[j] == results[i].correo){
          fotoUsuario.push(results[i].foto);
        }
      } 
    }
    leerUsuFacultad(); 
  });
  var usuarioFacultad;
  function leerUsuFacultad(){
    integracion.buscarUsuarioPorCorreo(usuario, (error, results) => {
      if (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send('Error interno del servidor');
      }
      usuarioFacultad = results[0].facultad;
      listarUsuariosFacultad();
    }); 
  }
  var listaNuevosUsuarios = [];
  function listarUsuariosFacultad(){
    integracion.buscarUsuariosPorFacultad(usuarioFacultad, (error, results) => {
      if (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send('Error interno del servidor');
      }
      for(var i = 0; i < results.length; i++){
        if(!listaUsuarios.includes(results[i].correo)){
          listaNuevosUsuarios.push(results[i]);
        }
      }
     
      for(var i = 0; i < mensajes.length; i++){
        if(mensajes[i].correoEmisor == listaUsuarios[0] || mensajes[i].correoReceptor == listaUsuarios[0]){
          mensajesFiltrados.push(mensajes[i]);
        }
      }
      
      organizarYRenderizar();
    });
  }

  function organizarYRenderizar(){  
    res.render('mensajes', { 
      errors: [], 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,
      mensajes: mensajesFiltrados,
      listaUsuarios: listaUsuarios,
      fotoUsuario: fotoUsuario,
      listaNuevosUsuarios: listaNuevosUsuarios
    })
  }
});

//Cargar mensajes de un chat
router.post('/cargarMensajes',buscarMensajesEnviados, buscarMensajesRecibidos, trimFecha, (req, res) => {  
  res.json(res.locals.mensajes.reverse());
});

//Insertar mensajes en la BD
router.post('/enviarMensaje', (req, res) => {
  const correoEmisor = req.session.currentUser;
  const correoReceptor = req.body.correoReceptor;
  const mensaje = req.body.mensaje;
  var fechaActual = new Date();

  // Obtener los componentes de fecha y hora
  var anio = fechaActual.getFullYear();
  var mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, por lo que sumamos 1
  var dia = fechaActual.getDate();

  var horas = fechaActual.getHours();
  var minutos = fechaActual.getMinutes();
  var segundos = fechaActual.getSeconds();

  // Formatear la fecha y hora
  var fechaFormateada = anio + '-' + mes + '-' + dia;
  var horaFormateada = horas + ':' + minutos + ':' + segundos;
  
  integracion.enviarMensaje(correoEmisor, correoReceptor, fechaFormateada, horaFormateada, mensaje, (error, results) => {
    if (error) {
      console.error('Error al enviar mensaje:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.json(results);
  });  
});

router.post('/buscarMismaFacultad',buscarMensajesEnviados, buscarMensajesRecibidos, trimFecha, listarUsuariosMensajes, (req, res) => {
  const usuario = req.session.currentUser;
  var usuariosAntiguos = res.locals.listaUsuarios;
  var usuariosNuevos = [];
  var facultad;
  integracion.buscarUsuarioPorCorreo(usuario, (error, results) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
   facultad = results[0].facultad;
    buscarUsuariosFacultad();
  });
  function buscarUsuariosFacultad(){
    integracion.buscarUsuariosPorFacultad(facultad, (error, results) => {
      if (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send('Error interno del servidor');
      }
      for(var i = 0; i < results.length; i++){
        if(!usuariosAntiguos.includes(results[i].correo)){
          usuariosNuevos.push(results[i]);
        }
      }
      res.json(usuariosNuevos);
    });
  }
});

router.post('/buscarAdmin',buscarMensajesEnviados, buscarMensajesRecibidos,trimFecha, listarUsuariosMensajes, (req, res) => {
 
  var usuariosAntiguos = res.locals.listaUsuarios;
  var adminNuevos = [];
  integracion.buscarAdmins((error, results) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }
    for(var i = 0; i < results.length; i++){
      if(!usuariosAntiguos.includes(results[i].correo) && results[i].correo != req.session.currentUser){
        adminNuevos.push(results[i]);
      }
    }
    res.json(adminNuevos);
  });
});
module.exports = router;
