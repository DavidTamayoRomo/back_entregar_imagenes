const mongoose = require("mongoose");

const { Schema } = mongoose;


const fields = {
  imagen: {
    type: String
  },
  titulo: {
    type: String
  },
  descripcion: {
    type: String
  },
  path: {
    type: String
  },
  estado: {
    type: Boolean,
    require: true
  },
  usuario_creacion: {
    type: String
  },
  usuario_actualizacion: {
    type: String
  },
};

//timestamps es created at - updated at
const slogan = new Schema(fields, { timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_modificacion' } });

module.exports = mongoose.model('slogan', slogan);

