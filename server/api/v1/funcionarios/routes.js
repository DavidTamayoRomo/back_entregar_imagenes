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
  .route('/finbyCargo/:cargo')
  .get(controller.findByCargo)

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(auth.token, controller.update)
  .delete(controller.delete);

router
  .route('/devolverImagen/:cargo')
  .get(controller.returnfileFuncionario);

router
  .route('/:id/:cargo')
  .get(controller.nombreAutoridad);





module.exports = router;
