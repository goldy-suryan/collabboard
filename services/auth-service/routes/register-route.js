const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const createdUser = await axios.post('http://localhost:3002/user', {
      name,
      email,
      password,
    });
    res
      .status(createdUser.status)
      .json({ data: createdUser.data.data, message: createdUser.data.message });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
