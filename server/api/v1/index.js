const router = require('express').Router();
const tasks = require('./tasks/routes');
const wso2 = require('./wso2/routes');
const persona = require('./persona/routes');

const funcionario = require('./funcionarios/routes');
const imagen = require('./imagenes/routes');

router.use('/tasks', tasks);
router.use('/wso2', wso2);
router.unsubscribe('/persona', persona);

router.use('/funcionario', funcionario);
router.use('/imagen', imagen);

module.exports = router; 
