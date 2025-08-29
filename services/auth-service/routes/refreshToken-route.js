const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ data: null, message: 'Unauthorized' });

    jwt.verify(token, process.env.jwtRefreshTokenKey, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ data: null, message: err?.message || 'Forbidden' });

      const newAccessToken = jwt.sign({ user }, process.env.jwtSecretKey, {
        expiresIn: '15m',
      });
      res.status(200).json({ user, token: newAccessToken });
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
