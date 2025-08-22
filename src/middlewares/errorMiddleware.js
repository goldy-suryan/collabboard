module.exports = {
  notFound: (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next();
  },

  unknownError: (err, req, res) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Something went wrong',
      },
    });
  },
};
