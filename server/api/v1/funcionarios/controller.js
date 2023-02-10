

const Model = require('./model');
const { paginar } = require('../../../utils');
const consumoFileServer = require('../../../utils/fileServer');

const path = require('path');
const fs = require('fs');
const { writeFileSync } = require("fs");

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
  try {
    const consumo = await consumoFileServer.consumoWSO2FileServer(body.nombreImagen, decoded, body.fileBase64);
    //console.log('consumo:', consumo);
    Object.assign(document, { imagen: consumo });
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
  /*
  const { query = {} } = req;
  const {limit , page, skip }=paginar(query);
  const {sortBy, direction}=sortParseParams(query,fields);
  
  const all =  Model.find({})
    .sort(sortCompactToStr(sortBy,direction))
    .skip(skip)
    .limit(limit);
  const count = Model.countDocuments();

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total]= data;
    const pages = Math.ceil(total / limit);
    res.json({
      success:true,
      data:docs,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction
      }
    });
  } catch (err) {
    next(new Error(err));
  }
  */

  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({}).skip(skip).limit(limit).exec();
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

exports.nombreAutoridad = async (req, res, next) => {
  const { doc = {} } = req;
  res.json({
    success: true,
    data: doc
  });
};

exports.findByCargo = async (req, res, next) => {
  const { doc = {} } = req;
  const { params = {} } = req;
  //console.log('params:', params);
  try {
    const docs = await Model.findOne({
      $and: [
        { cargo: params.cargo },
        { estado: true }
      ]
    }).exec();

    res.json({
      success: true,
      data: docs
    });
  } catch (error) {
    next(new Error(error));
  }

};

exports.update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;
  Object.assign(doc, body);

  try {
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
  const { doc = {} } = req;
  try {
    const removed = await doc.remove();
    res.json({
      success: true,
      data: removed
    });
  } catch (error) {
    next(new Error(error));
  }
};


exports.returnfileFuncionario = async (req, res) => {
  const { params = {} } = req;
  const { cargo } = params;
  //console.log('cargo:', cargo);
  const imagen = await Model.findOne({ $and: [{ cargo: cargo }, { estado: true }] }).exec();
  //console.log('imagen:', imagen);
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
    res.json({
      success: false,
      data: 'No se encontro la imagen'
    });
  }

}
