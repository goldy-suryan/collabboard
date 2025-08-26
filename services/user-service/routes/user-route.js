const router = require('express').Router();
const userController = require('../controllers/user-controller');
const { isAuthenticated } = require('../middlewares/isAuthenticatedMiddleware');

router.get('/', isAuthenticated, userController.getUsers);
router.get('/:id', isAuthenticated, userController.getUser);
router.post('/userByEmail', userController.getUserByEmail);
router.post('/', userController.createUser);
router.put('/:id', isAuthenticated, userController.udpateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;
