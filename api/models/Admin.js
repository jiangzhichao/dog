const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;

const AdminSchema = mongoose.Schema({

  name            : {type: String, required: true},
  nick_name       : String,
  password        : {type: String, required: true},
  avatar          : {type: ObjectId, ref: 'File'},
  create_time     : {type: Date, default: Date.now},
  update_time     : Date,
  role            : {type: String, default: 'admin'},
  birthday        : Date,
  id_card         : String,
  qq              : String,
  wechat          : String,
  phone           : String,
  is_married      : {type: Boolean, default: false},
  friends         : [{type: ObjectId, ref: 'Admin'}],
  groups          : [{type:ObjectId, ref: 'Group'}]
});

AdminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

AdminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
