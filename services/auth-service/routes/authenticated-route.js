const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.jwtSecretKey);
    res.status(200).json({ data: decoded });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
