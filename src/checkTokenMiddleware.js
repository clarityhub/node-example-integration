/**
 * This middleware checks to make sure that the incoming request contains
 * the token that was generated on the Developers dashboard. This is so that
 * unknown parties will not be granted access to your endpoint.
 */
module.exports = (req, res, next) => {
  const { token } = req.body;
  if (token !== process.env.TOKEN) {
    res.status(403).send({
      reason: 'Invalid token',
    });
  }

  next();
};
