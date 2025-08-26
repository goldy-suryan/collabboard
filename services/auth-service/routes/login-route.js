const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await axios.post(
      'http://user-service:3002/user/userByEmail',
      { email, password }
    );
    if (foundUser.status == 200) {
      const token = jwt.sign(
        { user: foundUser.data.data },
        process.env.jwtSecretKey,
        {
          expiresIn: '2h',
        }
      );
      return res.status(200).json({
        data: foundUser.data.data,
        token,
        message: foundUser.data.message,
      });
    }
    res
      .status(foundUser.status)
      .json({ data: foundUser.data.data, message: foundUser.data.message });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
