const axios = require('axios');

module.exports = {
  isAuthenticated: async (req, res, next) => {
    try {
      let token = req.headers['authorization'];
      if (token?.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      if (token) {
        let resp = await axios.post('http://localhost:4000/isAuthenticated', {
          token,
        });
        req.decoded = resp.data.data;
        next();
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (e) {
      console.log('what is the issue here', e);
      next(e);
    }
  },
};
