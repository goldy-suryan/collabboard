const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middlewares/isAuthenticatedMiddleware');
const { isAuthorized } = require('../middlewares/rabcAuthorizationMiddleware');

//CRUD Routes
router.get(
  '/',
  isAuthenticated,
  isAuthorized('task:view'),
  taskController.getTasks
);
router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('task:view'),
  taskController.getTask
);
router.post(
  '/',
  isAuthenticated,
  isAuthorized('task:create'),
  taskController.createTask
);
router.put(
  '/:id',
  isAuthenticated,
  isAuthorized('task:udpate'),
  taskController.updateTask
);
router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('task:delete'),
  taskController.deleteTask
);

// Add RBAC in post and delete task

module.exports = router;
