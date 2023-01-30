const router = require('express').Router();
const controller = require('./controller');
const auth = require('../auth');

/**
 * /api/tasks/ POST - CREATE
 * /api/tasks/ GET - READ ALL
 * /api/tasks/:id GET - READ ONE
 * /api/tasks/:id PUT - UPDATE
 * /api/tasks/:id DELETE - DELETE 
 */
router
  .route('/')
  .post(auth.token, controller.create)
  .get(controller.all);



router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(auth.token, controller.update)
  .delete(controller.delete);

router
  .route('/getImgen/:imagen')
  .get(auth.token, controller.wsoFileServerGetImgen);

router
  .route('/devolverImagen/:idimagen')
  .get(controller.returnfileUpload);

router
  .route('/devolverImagen/:secretaria/:pathImagen')
  .get(controller.returnfile);



router
  .route('/datos/:pathImagen')
  .get(controller.obtenerImagenByPath);

module.exports = router;
