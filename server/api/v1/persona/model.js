const mongoose = require("mongoose");

const { Schema } = mongoose;


const fields = {
  nombre: {
    type: String,
    require: true,
    maxlength: 128
  },
  email: {
    type: String,
    unique: true,
    lowecase: true
  },
  usuario_creacion: {
    type: String
  },
  usuario_actualizacion: {
    type: String
  },
};

//timestamps es created at - updated at
const persona = new Schema(fields, { timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_modificacion' } });

module.exports = mongoose.model('persona', persona);

