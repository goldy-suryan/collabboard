const Task = require('../models/task');
const { producer } = require('../config/kafka');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ data: tasks, message: 'Success' });
  } catch (e) {
    next(e);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const id = req.params['id'];
    if (id) {
      const task = await Task.findById(id);
      if (task) {
        res.status(200).json({ data: task, message: 'Success' });
      } else {
        res.status(200).json({
          data: null,
          message: 'Unable to find the record with provided Id',
        });
      }
    }
  } catch (e) {
    next(e);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date, at_level, userId } =
      req.body;
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      due_date,
      at_level,
      userId,
    });
    if (userId) {
      await producer.send({
        topic: 'task_assigned',
        messages: [{ value: JSON.stringify({ task: newTask, userId }) }],
      });
    }
    await producer.send({
      topic: 'task_created',
      messages: [{ value: JSON.stringify(newTask) }],
    });
    res.status(201).json({ data: newTask, message: 'Created Successfully' });
  } catch (e) {
    next(e);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const id = req.params['id'];
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedTask) {
      await producer.send({
        topic: 'task_updated',
        messages: [{ value: JSON.stringify(updatedTask) }],
      });
      res
        .status(200)
        .json({ data: updatedTask, message: 'Updated Successfully' });
    } else {
      res.status(404).json({
        data: null,
        message: 'Unable to find the record with provided Id',
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const id = req.params['id'];
    let deletedTask = await Task.findByIdAndDelete(id);
    if (deletedTask) {
      await producer.send({
        topic: 'task_deleted',
        messages: [{ value: 'task deleted successfully' }],
      });
      res.status(202).json({ data: null, message: 'Deleted Successfully' });
    } else {
      res.status(404).json({
        data: null,
        message: 'Unable to find the record with provided Id',
      });
    }
  } catch (e) {
    next(e);
  }
};
