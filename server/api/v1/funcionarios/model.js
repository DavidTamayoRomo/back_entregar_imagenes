const mongoose = require("mongoose");

const { Schema } = mongoose;


const fields = {
  cargo: {
    type: String,
    require: true
  },
  nombres: {
    type: String,
    require: true,
  },
  apellidos: {
    type: String,
    require: true
  },
  imagen: {
    type: String
  },
  titulo: {
    type: String
  },
  descripcion: {
    type: String
  },
  fechaNacimiento: {
    type: Date
  },
  redesSociales: [{
    nombre: {
      type: String
    },
    url: {
      type: String
    }
  }],
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
const funcionario = new Schema(fields, { timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_modificacion' } });

module.exports = mongoose.model('funcionario', funcionario);

