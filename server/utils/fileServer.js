const fetch = require('node-fetch');
require('dotenv').config();
exports.consumoWSO2FileServer = async (nombreImagen, token, fileBase64) => {

  const response = await fetch(`${process.env.FILE_SERVER}/fileserver/1.0/Archivo/Guardar/${process.env.SISTEMAIDFILESERVER}`, {
    method: 'post',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "Nombre": nombreImagen,
      "Contenido": fileBase64,
      "Observacion": "Imagen",
      "DatosAuditoria": {
        "Usuario": "user",
        "DireccionIP": "172.16.20.29"
      }
    }),

  }).then((response) => {
    return response.json();
  });
  return response;
};

exports.consumoWSO2FileServerGetImagen = async (token, imagen) => {

  const response = await fetch(`${process.env.FILE_SERVER}/fileserver/1.0/Archivo/Recuperar/${imagen}`, {
    method: 'get',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  }).then((response) => {
    return response.json();
  });
  return response;
};


exports.consumoWSO2FileServerEliminar = async (token, imagen) => {

  const response = await fetch(`${process.env.FILE_SERVER}/fileserver/1.0/Archivo/Eliminar/${imagen}`, {
    method: 'delete',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "Usuario": "update",
      "DireccionIP": "172.22.4.189"
    }),


  }).then((response) => {
    return response.json();
  });
  return response;
};

