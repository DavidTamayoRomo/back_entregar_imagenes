const fetch = require('node-fetch');

exports.consumoWSO2FileServer = async (nombreImagen, token, fileBase64) => {
  //TODO: Cambiar la url del fileserver
  const response = await fetch('http://sso-poc.quito.gob.ec:8280/fileserver/1.0/Archivo/Guardar/8', {
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
        "Usuario": "ftamayor",
        "DireccionIP": "172.16.20.29"
      }
    }),

  }).then((response) => {
    return response.json();
  });
  return response;
};

exports.consumoWSO2FileServerGetImagen = async (token, imagen) => {
  //TODO: Cambiar la url del fileserver
  const response = await fetch(`http://sso-poc.quito.gob.ec:8280/fileserver/1.0/Archivo/Recuperar/${imagen}`, {
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

