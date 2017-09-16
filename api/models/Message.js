const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = mongoose.Schema({
  come       : {type: ObjectId, ref: 'Admin'},
  to         : {type: ObjectId, ref: 'Admin'},
  is_cancel  : {type: Boolean, default: false},
  content    : String,
  file       : {type: ObjectId, ref: 'File'},
  create_time: {type: Date, default: Date.now},
  is_offline : {type: Boolean, default: false},
  group      : {type: ObjectId, ref: 'Group'}
});

module.exports = mongoose.model('Message', MessageSchema);
