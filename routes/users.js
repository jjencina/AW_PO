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
      req.session.currentUser =  correoUsuario;
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
  body('apellido1').notEmpty().withMessage('El primer apellido es obligatorio'),
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
            });
          }
          const nombreUsuario = req.body.nombre;
          const password = req.body.password[0];
          const apellido1 = req.body.apellido1;
          const apellido2 = req.body.apellido2;
          integracion.registrarUsuario(nombreUsuario, correoUsuario, apellido1, apellido2, password, function (err, resultados) {
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
      usuario
    });
  });
});

//Actualizar perfil
//TODO

//Llamar admin
router.get('/admin', (req, res) => {
  res.render('admin', { 
    errors: [], 
    isAuthenticated: res.locals.isAuthenticated,
    FormData: req.body,
  });
});

//Llamar a admin/usuarios
router.get('/admin/user', (req, res) => {
    usuarios = {};
    res.render('admin/users', { 
      errors: [], 
      isAuthenticated: res.locals.isAuthenticated,
      FormData: req.body,  
      usuarios    
    });
  
});

//Mediante Ajax devolver usuarios de la base de datos a la vista
router.get('/admin/users', (req, res) => {
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

module.exports = router;
