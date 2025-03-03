const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/tasks/ POST - CREATE
 * /api/tasks/ GET - READ ALL
 * /api/tasks/:id GET - READ ONE
 * /api/tasks/:id PUT - UPDATE
 * /api/tasks/:id DELETE - DELETE 
 */
router
  .route('/token')
  .get(controller.token);

module.exports = router;


