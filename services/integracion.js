const pool = require('../db');

const integracion = {
  // Devuelve todos los tipos de instalaciones de la bd
  leerTodosLosTiposIns: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_ins_tipo', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Devuelve todas las instalaciones
  leerTodasLasInstalaciones: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_ins_instalaciones', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Crear instalacion
  insertarInstalacion: function(nombre, tipo, facultad, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO ucm_aw_riu_ins_instalaciones (nombre, tipo, facultad) VALUES (?, ?, ?)';
        const values = [nombre, tipo, facultad];
        conexion.query(sql, values, (error, results) => {
          conexion.release();
          if (error) {
            callback(error);
          } else {
            callback(null, results.insertId);
          }
        });
      }
    });
  },


  //Devuelve el tipo de instalacion
  buscarTipoIns: function(tipo_ins, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_ins_tipo WHERE tipo = ?', [tipo_ins], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },
  
   // Devuelve todas las instalaciones de la bd
   leerInstalacionesPorTipo: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_ins_instalaciones', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Devuelve todas las instalaciones de un tipo de una facultad
  buscarInstalacionesPorTipoFacultad: function(tipo_ins, facultad, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_ins_instalaciones WHERE tipo = ? AND facultad = ?', [tipo_ins, facultad], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },
  //Buscar reservas por correo
  buscarReservasPorCorreo: function(correo, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_res_reservas WHERE correo_usu = ?', [correo], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },
  //Buscar reservas por instalacion
  buscarReservasPorInstalacion: function(instalacion, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_res_reservas WHERE nombre_ins = ?', [instalacion], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },

  //Devuelve las horas que están reservadas ese día en esa instalación
  buscarHorasReservadas: function(instalacion, fecha, facultad, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_res_reservas WHERE nombre_ins = ? AND fecha_res = ? AND facultad = ?', [instalacion, fecha, facultad], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },
  // Insertar reserva en la bd
  registrarUsuario: function(nombre, correo,apellido1, apellido2, facultad, contrasena, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO ucm_aw_riu_usu_usuarios (nombre, apellido1, apellido2, correo, contrasena, admin, validado, facultad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nombre,apellido1,apellido2, correo, contrasena, 0, 0, facultad];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results.insertId);
          }
        });
      }
    });
  },

  // Consulta Buscar usuario por correo
  buscarUsuarioPorCorreo: function(correo, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
          conexion.query('SELECT * FROM ucm_aw_riu_usu_usuarios WHERE correo = ?', [correo], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {   
            callback(null, rows);           
          }
        });
      }
    });
  },
  // Trae todas las reservas
  leerTodasLasReservas: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_res_reservas', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },
  // Insertar reserva en la bd
  insertarReserva: function(nombre_ins, facultad, nombre_usu, correo_usu, fecha_res, hora_res, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO ucm_aw_riu_res_reservas (nombre_ins, facultad, nombre_usu, correo_usu, fecha_res, hora_res) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [nombre_ins, facultad, nombre_usu, correo_usu, fecha_res, hora_res];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results.insertId);
          }
        });
      }
    });
  },

  //LeerTodosLosUsuarios
  leerTodosLosUsuarios: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_usu_usuarios', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Leer usuarios por su facultad
  buscarUsuariosPorFacultad: function(facultad, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_usu_usuarios WHERE facultad = ? AND admin = 0', [facultad], (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },
  //Buscar los usuarios admin
  buscarAdmins: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM  ucm_aw_riu_usu_usuarios WHERE admin = 1', (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },
//Expulsar usuario
  expulsarUsuario: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'DELETE FROM ucm_aw_riu_usu_usuarios WHERE correo = ?';
        const values = [correo];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Buscar instalacion por tipo
  buscarImagenesPorTipoIns: function(tipo_ins, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_img_imagenes WHERE nombre_ins = ?', [tipo_ins], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    });
  },


//Editar tipo instalacion
editarTipoIns: function(tipo_ins, hora_de_apertura, hora_de_cierre, colectivo, aforo, descripcion, callback) {
  pool.getConnection((err, conexion) => {
    if (err) {callback(err);} 
    else {
      if(colectivo == 'Si'){colectivo = 1;}
      else{colectivo = 0;}
      console.log(colectivo);
      console.log(tipo_ins);
      console.log(hora_de_apertura);
      console.log(hora_de_cierre);
      console.log(aforo);
      console.log(descripcion);
      const sql = 'UPDATE ucm_aw_riu_ins_tipo SET hora_de_apertura = ?, hora_de_cierre = ?, colectivo = ?, aforo = ?, descripcion = ? WHERE tipo = ?';
      const values = [hora_de_apertura, hora_de_cierre, colectivo, aforo, descripcion, tipo_ins];
      conexion.query(sql, values, (error, results) => {
        conexion.release(); 
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
},


//Validar usuario
  validarUsuario: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'UPDATE ucm_aw_riu_usu_usuarios SET validado = 1 WHERE correo = ?';
        const values = [correo];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

//Invalidar usuario
  invalidarUsuario: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'UPDATE ucm_aw_riu_usu_usuarios SET validado = 0 WHERE correo = ?';
        const values = [correo];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },
  
//Hacer admin
  hacerAdmin: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'UPDATE ucm_aw_riu_usu_usuarios SET admin = 1 WHERE correo = ?';
        const values = [correo];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Quitar admin
  quitarAdmin: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'UPDATE ucm_aw_riu_usu_usuarios SET admin = 0 WHERE correo = ?';
        const values = [correo];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },
  //Buscar mensajes por correo receptor
  buscarMensajesRecibidos: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        conexion.query('SELECT * FROM ucm_aw_riu_msg_mensajes WHERE correoReceptor = ?', [correo], (err, results) => {
          conexion.release(); 
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Buscar mensajes por correo emisor
  buscarMensajesEnviados: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        conexion.query('SELECT * FROM ucm_aw_riu_msg_mensajes WHERE correoEmisor = ?', [correo], (err, results) => {
          conexion.release(); 
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Insertar mensaje en la bd
  enviarMensaje: function(correoEmisor, correoReceptor,fecha, hora, mensaje, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO ucm_aw_riu_msg_mensajes (correoEmisor, correoReceptor, fecha, hora, mensaje) VALUES (?, ?, ?, ?, ?)';
        const values = [correoEmisor, correoReceptor, fecha, hora,  mensaje];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results.insertId);
          }
        });
      }
    });
  },

  //Leer facultad
  leerNombreOrganizacion: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        const sql = 'SELECT * FROM  ucm_aw_riu_facultades WHERE nombre = ?';
        const values = ['ucm'];
        conexion.query(sql, values, (err, results) => {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Cambiar titulo ucm
  cambiarTituloUCM: function(titulo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'UPDATE ucm_aw_riu_facultades SET titulo = ? WHERE nombre = ?';
        const values = [titulo, 'ucm'];
        conexion.query(sql, values, (error, results) => {
          conexion.release(); 
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    });
  },

  //Buscar id usuario por correo
  buscarUsuarioPorCorreo: function(correo, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        conexion.query('SELECT * FROM ucm_aw_riu_usu_usuarios WHERE correo = ?', [correo], (err, results) => {
          conexion.release(); 
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        });
      }
    });
  }

};
module.exports = integracion;
