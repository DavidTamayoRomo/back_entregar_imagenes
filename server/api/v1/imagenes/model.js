const mongoose = require("mongoose");

const { Schema } = mongoose;


const fields = {
  tipo: {
    type: String,
    require: true
  },
  descripcion: {
    type: String,
    require: true,
  },
  estado: {
    type: Boolean,
    require: true
  },
  imagen: {
    type: String,
    require: true
  },
  path: {
    type: String
  },
  fechasActualizacion: [{
    type: Date
  }]
};

//timestamps es created at - updated at
const imagen = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('imagen', imagen);

