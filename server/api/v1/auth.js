/**
 * Guardar token
 *  */
const token = (req, res, next) => {

  let token = req.headers.authorization || req.query.token || '';
  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }
  if (!token) {
    const message = 'Unauthorized';
    next({
      success: false,
      message,
      statusCode: 401,
      level: 'info'
    });
  } else {
    req.decoded = token;
    next();
  }
};

module.exports = {
  token
};
