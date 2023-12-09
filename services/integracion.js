const pool = require('../db');

const integracion = {
  // Devuelve todos los tipos de instalaciones de la bd
  leerTodosLosTiposIns: function(callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);} 
      else {
        conexion.query('SELECT * FROM ucm_aw_riu_ins_tipo', (err, results) => {
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
  // Insertar reserva en la bd
  registrarUsuario: function(nombre, correo, contrasena, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
        const values = [nombre, correo, contrasena];
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

  // Consulta Buscar usuario por nombre
  buscarUsuarioPorNombre: function(nombre, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
          conexion.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre], function (err, rows) {
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
  insertarReserva: function(id_destino, nombre_cliente, correo_cliente, fecha_reserva,clase_tp, num_entradas, tamano_maleta, precio_destino, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva, clase_tp, num_entradas, tamano_maleta, precio_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [id_destino, nombre_cliente, correo_cliente, fecha_reserva,clase_tp, num_entradas, tamano_maleta, precio_destino];
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

  // Consulta Buscar destino por nombre
  buscarDestinoPorNombre: function(nombre_destino, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM destinos WHERE nombre = ?', [nombre_destino], function (err, rows) {
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

  buscarImagenesPorDestino: function(nombre_destino, callback){
    pool.getConnection(function(err, conexion){
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM imagenes WHERE nombre_destino = ?', [nombre_destino], function (err, rows) {
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

  insertarComentario: function(destino_id, nombre_usuario, comentario, fecha, callback) {
    pool.getConnection((err, conexion) => {
      if (err) {callback(err);}
      else{
        const sql = 'INSERT INTO comentarios (destino_id, nombre_usuario, comentario, fecha_comentario) VALUES (?, ?, ?, ?)';
        const values = [destino_id, nombre_usuario, comentario, fecha];
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
  buscarComentarioPorDestino: function(destino_id, callback){
    pool.getConnection((err, conexion) => {
      if(err){callback(err);}
      else {
        conexion.query('SELECT * FROM comentarios WHERE destino_id = ?', [destino_id], function (err, rows) {
          conexion.release();
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        });
      }
    }
    );
  }
};
module.exports = integracion;
