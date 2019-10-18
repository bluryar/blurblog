const mongoose = require('mongoose')

const options = {
  // 严格模式
  strict: true,
  strictQuery: true,
  useNestedStrict: true,
  // 时间戳
  timestamp: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
const UserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isViolated: { // 是否违规用户
    type: Boolean,
    default: false
  },
  // id, mongodb自动创建并设置索引
  nickname: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  deleted_at: {
    type: Date
  }
}, options)

module.exports = mongoose.model('Users', UserSchema)
