

const Model = require('./model');
const { paginar } = require('../../../utils');

const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const { writeFileSync } = require("fs");

const consumoFileServer = require('../../../utils/fileServer');
const wso2 = require('../../../utils/wso2');

const { fields } = require('./model');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;
      next({
        message,
        statusCode: 404,
        level: 'warn',
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
}

exports.create = async (req, res, next) => {
  const { body = {}, decoded = {} } = req;
  const document = new Model(body);
  //console.log('Entre');
  try {

    //console.log('nombre:', body.nombreImagen);
    //console.log('imagen:', body.fileBase64);
    const consumo = await consumoFileServer.consumoWSO2FileServer(body.nombreImagen, decoded, body.fileBase64);
    const consumo1 = await consumoFileServer.consumoWSO2FileServer(body.nombreImagen2, decoded, body.fileBase64_1);
    Object.assign(document, { imagen: consumo, imagenReducida: consumo1 });

    const doc = await document.save();
    res.status(201);
    res.json({
      success: true,
      data: doc
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.all = async (req, res, next) => {

  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);
  const { activo, inactivo } = query;
  console.log('query', query);
  try {

    if (activo == 'true' && inactivo == 'true') {
      console.log('Entre uno');
      let contador = await Model.countDocuments({}).exec();
      let docs = await Model.find({})
        .sort({ path: 1 })
        .limit(10)
        .skip(skip)
        .exec();
      res.json({
        success: true,
        data: docs,
        totalImagenes: contador
      });
    } else if (activo == 'true') {
      console.log('Entre dos');
      let contador = await Model.countDocuments({}).exec();
      let docs = await Model.find({ estado: true })
        .sort({ path: 1 })
        .limit(10)
        .skip(skip)
        .exec();
      res.json({
        success: true,
        data: docs,
        totalImagenes: contador
      });
    } else if (inactivo == 'true') {
      console.log('Entre tres');
      let contador = await Model.countDocuments({}).exec();
      let docs = await Model.find({ estado: false })
        .sort({ path: 1 })
        .limit(10)
        .skip(skip)
        .exec();
      res.json({
        success: true,
        data: docs,
        totalImagenes: contador
      });
    }



  } catch (err) {
    next(new Error(err));
  }

};

exports.obtenerImagenByPath = async (req, res, next) => {
  const { params = {}, decoded } = req;
  const { pathImagen } = params;
  try {
    const docs = await Model.find({ path: pathImagen }).exec();
    if (docs) {
      res.json({
        success: true,
        data: docs,
      });
    } else {
      res.json({
        success: false,
        data: 'No existe la imagen con el path especificado',
      });
    }

  } catch (error) {

  }
}

exports.wsoFileServerGetImgen = async (req, res, next) => {

  const { params = {}, decoded } = req;
  //console.log('params', params);
  const getImagen = await consumoFileServer.consumoWSO2FileServerGetImagen(decoded, params.imagen);

  try {
    const docs = getImagen;
    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.read = async (req, res, next) => {
  const { doc = {} } = req;
  res.json({
    success: true,
    data: doc
  });
};

exports.update = async (req, res, next) => {
  const { doc = {}, body = {}, decoded } = req;
  Object.assign(doc, body);
  if (body.fileBase64_1) {
    const consumo2 = await consumoFileServer.consumoWSO2FileServer(body.nombreImagen2, decoded, body.fileBase64_1);
    Object.assign(doc, { imagenReducida: consumo2 });
  }
  if (body.fileBase64) {
    const consumo = await consumoFileServer.consumoWSO2FileServer(body.nombreImagen, decoded, body.fileBase64);
    Object.assign(doc, { imagen: consumo });
  } /* else {
    const consumo = doc.imagen;
    Object.assign(doc, body, { imagen: consumo });
  } */

  try {

    const imagenes = await Model.find({}).exec();
    const imagenesFiltrados = await imagenes.filter((imagen) => {
      if (imagen.path === body.path) {
        return imagen;
      }
    });
    console.log('imagenesFiltrados', imagenesFiltrados);

    if (body.estado === true) {
      //debo desactivar el resto de las imagenes
      let imagenesDesactivar = await imagenesFiltrados.filter((imagen) => {
        if (imagen.estado === true && imagen.id !== body._id) {
          imagen.estado = false;
          let imagenActualizada = imagen.save();
          return imagenActualizada;
        }
      });
      //console.log('imagenesDesactivar', imagenesDesactivar);
    }

    const update = await doc.save();
    res.json({
      success: true,
      data: update
    });
  } catch (error) {
    next(new Error(error));
  }
};



exports.delete = async (req, res, next) => {
  const { doc = {}, decoded } = req;
  try {
    const inactivar1 = await consumoFileServer.consumoWSO2FileServerEliminar(decoded, doc.imagen);
    const inactivar2 = await consumoFileServer.consumoWSO2FileServerEliminar(decoded, doc.imagenReducida);
    const removed = await doc.remove();
    res.json({
      success: true,
      data: removed,
      fileServer1: inactivar1,
      fileServer2: inactivar2
    });
  } catch (error) {
    next(new Error(error));
  }
};

/**
 * ======================================
 * Retornar imagen
 * ======================================
 */

exports.returnfileUpload = async (req, res) => {
  //console.log('entre');
  const { params = {}, decoded } = req;
  const wso = await wso2.getAccessToken();

  const getImagen = await consumoFileServer.consumoWSO2FileServerGetImagen(wso.access_token, params.idimagen);
  const pathArchivo = await path.join(__dirname, `../../../uploads/imagenes/${params.idimagen}.png`);
  const base64 = getImagen.Contenido;
  const image = Buffer.from(base64, "base64");
  try {
    writeFileSync(pathArchivo, image);
    res.sendFile(pathArchivo);
  } catch (error) {
    next(new Error(error));
  }


}

exports.returnfile = async (req, res) => {
  const { params = {}, decoded } = req;
  const { pathImagen, secretaria } = params;

  const imagen = await Model.findOne({ $and: [{ path: pathImagen }, { estado: true }] }).exec();
  console.log('imagen', imagen);
  if (imagen) {
    //Imagen existente en la base de datos local

    let pathArchivo1 = path.join(__dirname, `../../../uploads/imagenes/${imagen.imagen}.png`);
    if (fs.existsSync(pathArchivo1)) {
      //Existe imagen almacenada
      res.sendFile(pathArchivo1);
    } else {
      //No existe imagen almacenada
      const wso = await wso2.getAccessToken();
      const getImagen = await consumoFileServer.consumoWSO2FileServerGetImagen(wso.access_token, imagen.imagen);
      const pathArchivo = path.join(__dirname, `../../../uploads/imagenes/${imagen.imagen}.png`);
      const base64 = getImagen.Contenido;
      const imageBuffer = Buffer.from(base64, "base64");
      try {
        writeFileSync(pathArchivo, imageBuffer);
        res.sendFile(pathArchivo);
      } catch (error) {
        next(new Error(error));
      }
    }

  } else {
    const imagen1 = await Model.findOne({ $and: [{ path: 'default' }, { estado: true }] }).exec();
    if (imagen1) {
      let pathArchivo2 = path.join(__dirname, `../../../uploads/imagenes/${imagen1.imagen}.png`);
      if (fs.existsSync(pathArchivo2)) {
        //Existe imagen almacenada
        res.sendFile(pathArchivo2);
      } else {
        //No existe imagen almacenada
        const wso = await wso2.getAccessToken();
        const getImagen = await consumoFileServer.consumoWSO2FileServerGetImagen(wso.access_token, imagen1.imagen);
        const pathArchivo = path.join(__dirname, `../../../uploads/imagenes/${imagen1.imagen}.png`);
        const base64 = getImagen.Contenido;
        const imageBuffer = Buffer.from(base64, "base64");
        try {
          writeFileSync(pathArchivo, imageBuffer);
          res.sendFile(pathArchivo);
        } catch (error) {
          next(new Error(error));
        }
      }
    } else {
      let pathArchivo3 = path.join(__dirname, `../../../uploads/imagenes/default.jpg`);
      res.sendFile(pathArchivo3);
    }

  }

}


