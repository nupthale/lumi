const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  platform: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// 主键： platform+account
userSchema.index({ platform: 1, account: 1 }, { unique: true });

userSchema.plugin(paginate);

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };