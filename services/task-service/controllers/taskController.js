const Task = require('../models/task');
const { getIO } = require('../socket');
const { producer } = require('../config/k');

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
    const { title, description, status, priority, due_date, at_level } = req.body;
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      due_date,
      at_level
    });
    res.status(201).json({ data: newTask, message: 'Created Successfully' });
    const io = getIO();
    io.emit('task:created', newTask);
    producer.send({
      topic: 'task:created',
      message: [{ value: newTask }]
    })
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
      res
        .status(200)
        .json({ data: updatedTask, message: 'Updated Successfully' });
      const io = getIO();
      io.emit('task:updated', updatedTask);
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
      res.status(202).json({ data: null, message: 'Deleted Successfully' });
      const io = getIO();
      io.emit('task:deleted', deletedTask);
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
