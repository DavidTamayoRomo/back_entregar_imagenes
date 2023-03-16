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

router
  .route('/finbyCargo/:path')
  .get(controller.findByPath)

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(auth.token, controller.update)
  .delete(controller.delete);

router
  .route('/devolverImagen/:path2')
  .get(controller.returnfileFuncionario);

router
  .route('/:id/:path')
  .get(controller.nombreAutoridad);





module.exports = router;
