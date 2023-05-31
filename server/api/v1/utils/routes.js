const router = require('express').Router();

const controller = require('./controller');




router
  .route('/busquedaespecifica/:tabla/:busqueda')
  .get(controller.busquedaEspecifica);


module.exports = router;
