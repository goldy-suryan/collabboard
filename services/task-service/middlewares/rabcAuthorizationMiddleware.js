const { roles } = require('../constants');

module.exports = {
  isAuthorized: (permission) => {
    return (req, res, next) => {
      const user = req.decoded.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const permissions = roles[user.role] || [];
      if (!permissions.includes(permission)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  },
};
