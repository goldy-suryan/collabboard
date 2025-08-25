const { required } = require('joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    due_date: { type: Date, default: Date.now() },
    at_level: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
