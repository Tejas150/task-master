const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    file: { type: String },
    attachedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);