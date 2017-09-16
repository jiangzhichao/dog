const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const FileSchema = mongoose.Schema({

  name       : String,
  path       : String,
  size       : Number,
  type       : String,
  creator    : {type: ObjectId, ref: 'Admin'},
  create_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('File', FileSchema);
