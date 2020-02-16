module.exports = (req, res, next) => {
  // eslint-disable-next-line no-console
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};
