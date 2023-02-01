const Imagen = require('../imagenes/model');
const Funcionario = require('../funcionarios/model');

exports.busquedaEspecifica = async (req, res = response) => {

  const tabla = req.params.tabla;
  let busqueda = req.params.busqueda;
  if (busqueda.includes('+')) {
    //quitar el +
    busqueda = busqueda.replace('+', '');
  }

  const regex = new RegExp(busqueda, 'i');
  switch (tabla) {

    case 'imagen':
      try {
        data = await Imagen.find({
          $or: [{ tipo: regex }, { descripcion: regex }, { path: regex }]
        });
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'funcionario':
      try {
        data = await Funcionario.find({
          $or: [{ cargo: regex }, { nombres: regex }, { apellidos: regex }]
        });
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    default:
      return res.status(400).json({
        success: false,
        data: 'No se encontraron coincidencias con las tablas existentes'
      });
  }
  res.json({
    success: true,
    data
  })
}
