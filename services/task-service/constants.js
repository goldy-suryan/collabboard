module.exports = {
  roles: {
    admin: ['task:view', 'task:create', 'task:update', 'task:delete'],
    manager: ['task:view', 'task:create', 'task:update'],
    user: ['task:view'],
  },
};
