const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const GroupSchema = mongoose.Schema({

  name       : String,
  creator    : {type: ObjectId, ref: 'Admin'},
  create_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Group', GroupSchema);
