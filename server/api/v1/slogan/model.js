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
};

//timestamps es created at - updated at
const slogan = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('slogan', slogan);

