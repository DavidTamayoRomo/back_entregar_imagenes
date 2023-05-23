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


/**
 * @swagger
 * /imagen:
 * /imagen/devolverImagen/secretaria/{id}:
 *   get:
 *     tags:
 *     - "imagen"
 *     summary: Recupera una imagen al enviar un ID.
 *     description: Muestra una imagen de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la imagen.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 */
router
  .route('/')
  .post(auth.token, controller.create)
  .get(controller.all);



router.param('id', controller.id);

router
  .route('/:id')
  .get(auth.token, controller.read)
  .put(auth.token, controller.update)
  .delete(auth.token, controller.delete);

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
